import { create, IPFSHTTPClient } from "ipfs-http-client";
import { IPFSConfig } from "../types";

export class IPFSService {
  private client: IPFSHTTPClient;
  private maxRetries: number;
  private timeout: number;

  constructor(config: IPFSConfig) {
    if (!config?.projectId || !config?.projectSecret) {
      throw new Error("IPFS configuration missing projectId or projectSecret");
    }

    const auth = "Basic " + Buffer.from(config.projectId + ":" + config.projectSecret).toString("base64");
    const host = config.host || "ipfs.infura.io";
    const port = config.port || 5001;
    const protocol = config.protocol || "https";

    this.client = create({
      host,
      port,
      protocol,
      headers: {
        authorization: auth,
      },
    });

    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;
  }

  async uploadToIPFS(data: unknown): Promise<string> {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const uploadPromise = this.client.add(JSON.stringify(data));
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("IPFS upload timeout")), this.timeout),
        );

        const result = (await Promise.race([uploadPromise, timeoutPromise])) as { path: string };
        const { path } = result;
        return `ipfs://${path}`;
      } catch (error) {
        attempts++;
        if (attempts === this.maxRetries) {
          throw error;
        }
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
    throw new Error("Failed to upload to IPFS after maximum retries");
  }
}
