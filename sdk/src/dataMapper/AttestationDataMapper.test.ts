import AttestationDataMapper from "./AttestationDataMapper";
import { Constants, SDKMode } from "../utils/constants";
import { decodeWithRetry } from "../utils/abiCoder";
import { getIPFSContent } from "../utils/ipfsClient";
import { Attestation, Conf } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { lineaSepolia } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import { VeraxSdk } from "../VeraxSdk";

jest.mock("./BaseDataMapper");
jest.mock("../utils/abiCoder");
jest.mock("../utils/ipfsClient");

describe("AttestationDataMapper", () => {
  let attestationDataMapper: AttestationDataMapper;
  const mockConf: Conf = {
    subgraphUrl: "http://mock-subgraph.com",
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    portalRegistryAddress: "0x1",
    moduleRegistryAddress: "0x2",
    schemaRegistryAddress: "0x3",
    attestationRegistryAddress: "0x4",
  };

  const mockAttestation: Attestation = {
    id: "1",
    attestationId: "1",
    replacedBy: null,
    attester: "0xAttester",
    attestedDate: 1634515200,
    expirationDate: 1734515200,
    revocationDate: 1634615200,
    version: 1,
    revoked: false,
    subject: "0xSubject",
    encodedSubject: "0xEncodedSubject",
    attestationData: "0xAttestationData",
    decodedData: [],
    decodedPayload: {},
    schema: {
      id: Constants.OFFCHAIN_DATA_SCHEMA_ID,
      name: "Test Schema",
      description: "A test schema",
      context: "http://schema.org",
      schema: "schema",
      attestationCounter: 1,
    },
    portal: {
      id: "0xPortal",
      ownerAddress: "0xOwner",
      modules: ["0xModule"],
      isRevocable: false,
      name: "Test Portal",
      description: "A test portal",
      ownerName: "Owner",
      attestationCounter: 1,
    },
    offchainData: undefined,
  };

  const createMockAttestation = (overrides: Partial<Attestation> = {}): Attestation => ({
    ...mockAttestation,
    schema: {
      ...mockAttestation.schema,
    },
    portal: {
      ...mockAttestation.portal,
    },
    offchainData: undefined,
    ...overrides,
  });

  const mockWeb3Client = {} as PublicClient;
  const mockWalletClient = {} as WalletClient;
  const mockVeraxSdk = {
    schema: {
      findOneById: jest.fn(),
    },
  } as unknown as VeraxSdk;

  beforeEach(() => {
    attestationDataMapper = new AttestationDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
    (attestationDataMapper as unknown as { veraxSdk: VeraxSdk }).veraxSdk = mockVeraxSdk;
    jest.clearAllMocks();
  });

  describe("findOneById", () => {
    it("should find attestation by id and enrich it", async () => {
      const attestation = createMockAttestation();
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);
      (getIPFSContent as jest.Mock).mockResolvedValue("data");

      const result = await attestationDataMapper.findOneById("1");

      expect(BaseDataMapper.prototype.findOneById).toHaveBeenCalledWith("1");
      expect(decodeWithRetry).toHaveBeenCalledWith(attestation.schema.schema, attestation.attestationData);
      expect(result).toEqual(attestation);
    });

    it("should return undefined if no attestation is found", async () => {
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(undefined);

      const result = await attestationDataMapper.findOneById("1");

      expect(BaseDataMapper.prototype.findOneById).toHaveBeenCalledWith("1");
      expect(result).toBeUndefined();
    });
  });

  describe("findBy", () => {
    it("should find attestations and enrich each of them", async () => {
      const attestations = [createMockAttestation()];
      (BaseDataMapper.prototype.findBy as jest.Mock).mockResolvedValue(attestations);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);
      (getIPFSContent as jest.Mock).mockResolvedValue("data");

      const result = await attestationDataMapper.findBy(10, 0, {}, "attestedDate", "desc");

      expect(BaseDataMapper.prototype.findBy).toHaveBeenCalledWith(10, 0, {}, "attestedDate", "desc");
      expect(decodeWithRetry).toHaveBeenCalledTimes(1);
      expect(result).toEqual(attestations);
    });
  });

  describe("enrichAttestation", () => {
    it("should enrich attestation with decoded payload for off-chain data schema", async () => {
      const attestation = createMockAttestation();
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);
      (getIPFSContent as jest.Mock).mockResolvedValue("data");

      const result = await attestationDataMapper.findOneById("1");

      expect(result?.decodedPayload).toEqual("data");
      expect(result?.offchainData).toEqual({
        schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID,
        uri: "ipfs://QmHash",
      });
    });

    it("should set offchainData.error if IPFS request fails", async () => {
      const attestation = createMockAttestation();
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);
      (getIPFSContent as jest.Mock).mockRejectedValue(new Error("IPFS Error"));

      // Call findOneById, which will trigger enrichAttestation
      const result = await attestationDataMapper.findOneById("1");

      expect(result?.offchainData?.error).toBe("IPFS Error");
    });

    it.each([
      { name: "empty decoded payload", decodedPayload: [] },
      { name: "non-object pointer", decodedPayload: ["invalid"] },
      { name: "non-string URI", decodedPayload: [{ schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: 42 }] },
    ])("should set structured offchainData.error for malformed pointer: $name", async ({ decodedPayload }) => {
      const attestation = createMockAttestation();
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock).mockReturnValue(decodedPayload);

      const result = await attestationDataMapper.findOneById("1");

      expect(result?.decodedPayload).toEqual({});
      expect(result?.offchainData).toEqual({
        schemaId: "",
        uri: "",
        error: {
          code: "MALFORMED_POINTER",
          message: "Malformed off-chain pointer: expected decoded payload with string schemaId and uri.",
        },
      });
      expect(getIPFSContent).not.toHaveBeenCalled();
    });

    it("should decode fetched IPFS hex content with the referenced schema", async () => {
      const attestation = createMockAttestation();
      const referencedSchema = {
        id: "0xReferencedSchema",
        name: "Referenced Schema",
        description: "Referenced schema",
        context: "http://schema.org",
        schema: "bool isBuidler",
        attestationCounter: 1,
      };
      const decodedFetchedPayload = [{ isBuidler: true }];
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock)
        .mockReturnValueOnce([{ schemaId: referencedSchema.id, uri: "ipfs://QmHash" }])
        .mockReturnValueOnce(decodedFetchedPayload);
      (getIPFSContent as jest.Mock).mockResolvedValue("0x01");
      (mockVeraxSdk.schema.findOneById as jest.Mock).mockResolvedValue(referencedSchema);

      const result = await attestationDataMapper.findOneById("1");

      expect(mockVeraxSdk.schema.findOneById).toHaveBeenCalledWith(referencedSchema.id);
      expect(decodeWithRetry).toHaveBeenNthCalledWith(2, referencedSchema.schema, "0x01");
      expect(result?.decodedPayload).toEqual(decodedFetchedPayload);
      expect(result?.offchainData).toEqual({
        schemaId: referencedSchema.id,
        uri: "ipfs://QmHash",
      });
    });

    it("should set structured offchainData.error if fetched IPFS hex content cannot be decoded", async () => {
      const attestation = createMockAttestation();
      const referencedSchema = {
        id: "0xReferencedSchema",
        name: "Referenced Schema",
        description: "Referenced schema",
        context: "http://schema.org",
        schema: "bool isBuidler",
        attestationCounter: 1,
      };
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(attestation);
      (decodeWithRetry as jest.Mock)
        .mockReturnValueOnce([{ schemaId: referencedSchema.id, uri: "ipfs://QmHash" }])
        .mockReturnValueOnce([]);
      (getIPFSContent as jest.Mock).mockResolvedValue("0x01");
      (mockVeraxSdk.schema.findOneById as jest.Mock).mockResolvedValue(referencedSchema);

      const result = await attestationDataMapper.findOneById("1");

      expect(result?.decodedPayload).toEqual({});
      expect(result?.offchainData).toEqual({
        schemaId: referencedSchema.id,
        uri: "ipfs://QmHash",
        error: {
          code: "MALFORMED_FETCHED_CONTENT",
          message: "Malformed fetched off-chain content: could not decode IPFS response with referenced schema.",
        },
      });
    });

    it("should not enrich if schema ID is not offchain data", async () => {
      const nonOffchainAttestation = {
        ...createMockAttestation(),
        schema: { ...mockAttestation.schema, id: "0x123" },
        offchainData: undefined,
      };
      (decodeWithRetry as jest.Mock).mockReturnValue([{}]);
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(nonOffchainAttestation);

      // Call findOneById, which will trigger enrichAttestation
      const result = await attestationDataMapper.findOneById("1");

      expect(result?.decodedPayload).toStrictEqual([{}]);
      expect(result?.offchainData).toBeUndefined();
    });
  });
});
