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

  const mockWeb3Client = {} as PublicClient;
  const mockWalletClient = {} as WalletClient;
  const mockVeraxSdk = {} as VeraxSdk;

  beforeEach(() => {
    attestationDataMapper = new AttestationDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
    jest.clearAllMocks();
  });

  describe("findOneById", () => {
    it("should find attestation by id and enrich it", async () => {
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(mockAttestation);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);

      const result = await attestationDataMapper.findOneById("1");

      expect(BaseDataMapper.prototype.findOneById).toHaveBeenCalledWith("1");
      expect(decodeWithRetry).toHaveBeenCalledWith(mockAttestation.schema.schema, mockAttestation.attestationData);
      expect(result).toEqual(mockAttestation);
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
      const attestations = [mockAttestation];
      (BaseDataMapper.prototype.findBy as jest.Mock).mockResolvedValue(attestations);
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);

      const result = await attestationDataMapper.findBy(10, 0, {}, "attestedDate", "desc");

      expect(BaseDataMapper.prototype.findBy).toHaveBeenCalledWith(10, 0, {}, "attestedDate", "desc");
      expect(decodeWithRetry).toHaveBeenCalledTimes(1);
      expect(result).toEqual(attestations);
    });
  });

  describe("enrichAttestation", () => {
    it("should enrich attestation with decoded payload for off-chain data schema", async () => {
      (BaseDataMapper.prototype.findOneById as jest.Mock).mockResolvedValue(mockAttestation);
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
      (decodeWithRetry as jest.Mock).mockReturnValue([
        { schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID, uri: "ipfs://QmHash" },
      ]);
      (getIPFSContent as jest.Mock).mockRejectedValue(new Error("IPFS Error"));

      // Call findOneById, which will trigger enrichAttestation
      const result = await attestationDataMapper.findOneById("1");

      expect(result?.offchainData?.error).toBe("IPFS Error");
    });

    it("should not enrich if schema ID is not offchain data", async () => {
      const nonOffchainAttestation = {
        ...mockAttestation,
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
