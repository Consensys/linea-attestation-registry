import axios, { AxiosInstance } from "axios";
import { OffChainAttestationConfig } from "../types";

export class IPFSService {
  private client: AxiosInstance;
  private readonly maxRetries: number;

  constructor(config: OffChainAttestationConfig) {
    const auth = "Basic " + Buffer.from(`${config.projectId}:${config.projectSecret}`).toString("base64");
    const host = config.host || "ipfs.infura.io";
    const port = config.port || 5001;
    const protocol = config.protocol || "https";

    this.client = axios.create({
      baseURL: `${protocol}://${host}:${port}/api/v0`,
      headers: {
        Authorization: auth,
      },
    });

    this.maxRetries = config.maxRetries || 3;
  }

  async uploadToIPFS(data: unknown): Promise<string> {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value))], {
        type: "application/json",
      }),
    );

    function hasGetHeaders(f: FormData): f is FormData & { getHeaders: () => Record<string, string> } {
      return typeof (f as unknown as { getHeaders?: unknown }).getHeaders === "function";
    }

    const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

    const extraHeaders = isNode && hasGetHeaders(formData) ? formData.getHeaders() : {};

    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const response = await this.client.post("/add", formData, {
          headers: {
            ...extraHeaders,
          },
        });

        if (!response?.data?.Hash) {
          throw new Error("IPFS upload failed: missing Hash");
        }

        const { Hash } = response.data;

        return `ipfs://${Hash}`;
      } catch (error) {
        attempts++;
        if (attempts === this.maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

    throw new Error("Failed to upload to IPFS after maximum retries");
  }
}
