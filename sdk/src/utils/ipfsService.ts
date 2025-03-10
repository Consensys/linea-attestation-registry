import { create, IPFSHTTPClient } from "ipfs-http-client";
import { IPFSConfig, SchemaDefinition } from "../types";
import Ajv, { ErrorObject } from "ajv";

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

  /**
   * Validates that a schema follows the required format for attestation schemas.
   * Attestation schemas must be valid JSON Schema and follow specific rules:
   * - Must be an object type
   * - Must have a title and description
   * - Must define properties
   * - Properties must be valid JSON Schema types
   */
  validateOffchainSchema(schemaId: string, schema: SchemaDefinition): boolean {
    if (!schemaId?.trim()) {
      throw new Error("Schema ID is required and must not be empty");
    }

    if (!schema || typeof schema !== "object") {
      throw new Error("Schema must be a valid JSON Schema object");
    }

    // Validate basic schema structure
    if (schema.type !== "object") {
      throw new Error("Schema root must be of type 'object'");
    }

    if (!schema.title?.trim() || typeof schema.title !== "string") {
      throw new Error("Schema must have a non-empty title string");
    }

    if (!schema.description?.trim() || typeof schema.description !== "string") {
      throw new Error("Schema must have a non-empty description string");
    }

    if (!schema.properties || typeof schema.properties !== "object" || Array.isArray(schema.properties)) {
      throw new Error("Schema must define properties as an object");
    }

    // Validate that properties are properly defined
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (!propSchema || typeof propSchema !== "object") {
        throw new Error(`Property '${propName}' must have a valid schema definition`);
      }

      const { type } = propSchema as { type?: string };
      if (!type || typeof type !== "string") {
        throw new Error(`Property '${propName}' must specify a valid type`);
      }

      // Validate that property types are supported
      const validTypes = ["string", "number", "integer", "boolean", "array", "object"];
      if (!validTypes.includes(type)) {
        throw new Error(
          `Property '${propName}' has unsupported type '${type}'. Must be one of: ${validTypes.join(", ")}`,
        );
      }
    }

    // Validate that the schema is compilable
    const ajv = new Ajv();
    try {
      ajv.compile(schema);
    } catch (error) {
      throw new Error(`Invalid JSON Schema: ${(error as Error).message}`);
    }

    return true;
  }

  /**
   * Validates that a payload matches the required format for attestation data.
   * If a schema is provided, also validates that the payload conforms to it.
   */
  validateOffchainPayload(payload: unknown, schema?: SchemaDefinition): boolean {
    // Basic payload validation
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Payload must be a non-array object");
    }

    const payloadObj = payload as Record<string, unknown>;
    if (Object.keys(payloadObj).length === 0) {
      throw new Error("Payload must contain at least one property");
    }

    // Schema validation if provided
    if (schema) {
      // First validate the schema itself
      this.validateOffchainSchema("runtime-schema", schema);

      // Then validate the payload against the schema
      const ajv = new Ajv();
      const validate = ajv.compile(schema);
      const valid = validate(payload);

      if (!valid) {
        const errors =
          validate.errors?.map((err: ErrorObject) => `${err.instancePath || "root"} ${err.message}`).join(", ") ||
          "Unknown validation error";
        throw new Error(`Payload validation failed: ${errors}`);
      }
    }

    return true;
  }
}
