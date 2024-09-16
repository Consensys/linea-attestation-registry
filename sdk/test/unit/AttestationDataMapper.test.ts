import { PublicClient, WalletClient } from "viem";
import { Attestation, Conf } from "../../src/types";
import AttestationDataMapper from "../../src/dataMapper/AttestationDataMapper";
import { VeraxSdk } from "../../src/VeraxSdk";
import { decodeWithRetry } from "../../src/utils/abiCoder";
import { getIPFSContent } from "../../src/utils/ipfsClient";

jest.mock("../../src/utils/ipfsClient");
jest.mock("../../src/utils/abiCoder");

const mockConf: Conf = VeraxSdk.DEFAULT_LINEA_SEPOLIA;

const mockWeb3Client = {} as PublicClient;
const mockWalletClient = {} as WalletClient;

describe("AttestationDataMapper", () => {
  let attestationDataMapper: AttestationDataMapper;
  const mockOffChainAttestation: Attestation = {
    id: "0x00000000000000000000000000000000000000000000000000000000000003e9",
    decodedPayload: {},
    offchainData: undefined,
    attestationData:
      "0x0000000000000000000000000000000000000000000000000000000000000020e05ce58123ada948cd0218d42fb20ab57be6db7fe6aec4a2fac6190ca9fa997800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d534779447334586d79345757486d6376374c6b674447436950736962716d70473937453964393759464842520000000000000000000000",
    attestedDate: 1710252010,
    attester: "0xa9f843ab89cca5109546d30ddb6f93d4bcb76aa1",
    decodedData: [
      "0xe05ce58123ada948cd0218d42fb20ab57be6db7fe6aec4a2fac6190ca9fa9978",
      "ipfs://QmSGyDs4Xmy4WWHmcv7LkgDGCiPsibqmpG97E9d97YFHBR",
    ],
    encodedSubject: "0xa9f843ab89cca5109546d30ddb6f93d4bcb76aa1",
    expirationDate: 0,
    attestationId: "0x0000000000000000000000000000000000000000000000000000000000293707",
    portal: {
      attestationCounter: 195075,
      description: "A portal used by clique to issue attestations",
      id: "0x065e959ffd4c76ae2e0d31cfcf91c0c9834472ec",
      isRevocable: true,
      modules: [
        "0x94609d3b8baba3f4a2206be5195c3f0ec6e85890",
        "0xd34a8775d06d41b36054d59ef2d09a79b7aa1fa2",
        "0x3803856585a7fbc6a3bca94a0b9c49a48af90dd3",
      ],
      name: "CliquePortal",
      ownerAddress: "0x4401a1667dafb63cff06218a69ce11537de9a101",
      ownerName: "Clique",
    },
    replacedBy: "0x0000000000000000000000000000000000000000000000000000000000000000",
    revocationDate: 0,
    revoked: false,
    schema: {
      attestationCounter: 592,
      context: "https://schema.org/Property",
      description: "Represents a link to an offchain payload",
      id: "0xa288e257097a4bed4166c002cb6911713edacc88e30b6cb2b0104df9c365327d",
      name: "Offchain",
      schema: "(bytes32 schemaId, string uri)",
    },
    subject: "0xa9f843ab89cca5109546d30ddb6f93d4bcb76aa1",
    version: 7,
  };

  const offChainPayload = {
    avgMonthlySpendingSteam: { sgxAttestationFileId: "cd8b2dd98dc944c889eea5a52cb0a9e3" },
    sumHoursPlayedInTop10GameSteam: {
      valueType: "decimal",
      value: 0,
      sgxAttestationFileId: "8e1e02a2867a40fcb0c83c45d1462228",
    },
    sumHoursPlayedInIGDBCategoryPieChartSteam: { sgxAttestationFileId: "8e1e02a2867a40fcb0c83c45d1462228" },
    sumHoursPlayedInTopIGDBCategorySteam: {
      value: 0,
      valueType: "decimal",
      sgxAttestationFileId: "8e1e02a2867a40fcb0c83c45d1462228",
    },
  };

  const ipfsHash = "QmSGyDs4Xmy4WWHmcv7LkgDGCiPsibqmpG97E9d97YFHBR";

  const decodedPayload = [
    {
      schemaId: "0xe05ce58123ada948cd0218d42fb20ab57be6db7fe6aec4a2fac6190ca9fa9978",
      uri: `ipfs://${ipfsHash}`,
    },
  ];

  beforeEach(() => {
    attestationDataMapper = new AttestationDataMapper(mockConf, mockWeb3Client, mockWalletClient, jest.fn());
  });

  it("should create an instance of AttestationDataMapper", () => {
    expect(attestationDataMapper).toBeDefined();
    expect(attestationDataMapper).toBeInstanceOf(AttestationDataMapper);
  });

  it("should enrich attestation with decoded payload", async () => {
    const mockAttestation: Attestation = {
      id: "0x00000000000000000000000000000000000000000000000000000000000003e9",
      decodedPayload: {},
      offchainData: undefined,
      attestationData:
        "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000042e000000000000000000000000000000000000000000000000000000000000000a323031302d30362d323300000000000000000000000000000000000000000000",
      attestedDate: 1695855078,
      attester: "0x6d81fbdba7cc3afb7926f80c734965746b297668",
      decodedData: ["2010-06-23", "0x42e"],
      encodedSubject: "0x6d81fbdba7cc3afb7926f80c734965746b297668",
      expirationDate: 0,
      attestationId: "0x00000000000000000000000000000000000000000000000000000000000003e9",
      portal: {
        attestationCounter: 195075,
        description: "A portal used by clique to issue attestations",
        id: "0x065e959ffd4c76ae2e0d31cfcf91c0c9834472ec",
        isRevocable: true,
        modules: [
          "0x94609d3b8baba3f4a2206be5195c3f0ec6e85890",
          "0xd34a8775d06d41b36054d59ef2d09a79b7aa1fa2",
          "0x3803856585a7fbc6a3bca94a0b9c49a48af90dd3",
        ],
        name: "CliquePortal",
        ownerAddress: "0x4401a1667dafb63cff06218a69ce11537de9a101",
        ownerName: "Clique",
      },
      replacedBy: "0x0000000000000000000000000000000000000000000000000000000000000000",
      revocationDate: 0,
      revoked: false,
      schema: {
        attestationCounter: 121785,
        context: "Clique",
        description: "Linea Attestations (Verax) - Twitter",
        id: "0x6b215eaacc6184476dc304bd905c3bed3490bea8e7e00c7b55fde2f8e074b571",
        name: "Linea Attestations",
        schema: "string timeCreatedTwitter,uint256 numFollowersTwitter",
      },
      subject: "0x6d81fbdba7cc3afb7926f80c734965746b297668",
      version: 3,
    };

    const decodedPayload = {
      numFollowersTwitter: "1070",
      timeCreatedTwitter: "2010-06-23",
    };

    (decodeWithRetry as jest.Mock).mockReturnValueOnce(decodedPayload);

    await attestationDataMapper["enrichAttestation"](mockAttestation);

    expect(decodeWithRetry).toHaveBeenCalledWith(mockAttestation.schema.schema, mockAttestation.attestationData);
    expect(mockAttestation.decodedPayload).toBeDefined();
    expect(mockAttestation.decodedPayload).toBe(decodedPayload);
  });

  it("should handle off-chain data", async () => {
    (decodeWithRetry as jest.Mock).mockReturnValueOnce(decodedPayload);
    (getIPFSContent as jest.Mock).mockResolvedValueOnce(JSON.stringify(offChainPayload));

    await attestationDataMapper["enrichAttestation"](mockOffChainAttestation);

    expect(getIPFSContent).toHaveBeenCalledWith(ipfsHash);
    expect(mockOffChainAttestation.decodedPayload).toBeDefined();
    expect(mockOffChainAttestation.offchainData).toBeDefined();
  });

  it("should throw an error if IPFS content retrieval fails", async () => {
    const decodedPayload = [
      {
        schemaId: "0xe05ce58123ada948cd0218d42fb20ab57be6db7fe6aec4a2fac6190ca9fa9978",
        uri: `ipfs://${ipfsHash}`,
      },
    ];

    (decodeWithRetry as jest.Mock).mockReturnValueOnce(decodedPayload);
    (getIPFSContent as jest.Mock).mockRejectedValueOnce(new Error("IPFS error"));

    await attestationDataMapper["enrichAttestation"](mockOffChainAttestation);

    expect(mockOffChainAttestation.offchainData?.error).toBe("IPFS error");
  });
});
