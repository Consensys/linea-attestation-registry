import { create } from "ipfs-http-client";
import retry from "async-retry";
import { JSONSchema7 } from "json-schema";

export type UploadOptions = {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  ipfsUrl?: string;
};

const DEFAULT_OPTIONS: UploadOptions = {
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  ipfsUrl: "https://ipfs.infura.io:5001/api/v0",
};

export interface SchemaDefinition {
  title?: string;
  description?: string;
  properties: Record<string, unknown>;
  required?: string[];
  type: "object";
}

export class OffchainDataMapper {
  private readonly options: UploadOptions;

  constructor(options: Partial<UploadOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async uploadToIpfs(data: string | object): Promise<string> {
    const client = create({ url: this.options.ipfsUrl });

    return retry(
      async (bail: (error: Error) => void) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => {
            controller.abort();
          }, this.options.timeout);

          try {
            const content = typeof data === "string" ? data : JSON.stringify(data);
            const result = await client.add(content, {
              signal: controller.signal,
            });
            return `ipfs://${result.path}`;
          } finally {
            clearTimeout(timeout);
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new Error("IPFS upload timeout");
          }
          if (error instanceof Error && error.message.includes("Invalid credentials")) {
            bail(error as Error);
            return "";
          }
          throw error;
        }
      },
      {
        retries: this.options.maxRetries,
        minTimeout: this.options.retryDelay,
      },
    );
  }

  validateOffchainSchema(schemaId: string, schema: JSONSchema7): boolean {
    if (!schemaId || !schema) {
      throw new Error("Schema ID and schema are required");
    }
    return true;
  }

  validateOffchainPayload(payload: unknown): boolean {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      Object.keys(payload as object).length === 0
    ) {
      throw new Error("Payload is required and must be a non-empty object");
    }
    return true;
  }
}
