import UtilsDataMapper from "./UtilsDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { encode, decode } from "../utils/abiCoder";
import { PublicClient, WalletClient } from "viem";
import { lineaSepolia } from "viem/chains";
import { Conf } from "../types";
import { SDKMode, VeraxSdk } from "../VeraxSdk";

jest.mock("../utils/abiCoder", () => ({
  encode: jest.fn(),
  decode: jest.fn(),
}));

describe("UtilsDataMapper", () => {
  let utilsDataMapper: UtilsDataMapper;
  const mockConf: Conf = {
    subgraphUrl: "http://mock-subgraph.com",
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    portalRegistryAddress: "0x1",
    moduleRegistryAddress: "0x2",
    schemaRegistryAddress: "0x3",
    attestationRegistryAddress: "0x4",
  };
  const mockWeb3Client = { readContract: jest.fn() } as unknown as PublicClient;
  const mockWalletClient = {} as WalletClient;
  const mockVeraxSdk = {} as VeraxSdk;

  beforeEach(() => {
    utilsDataMapper = new UtilsDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
  });

  describe("getVersionNumber", () => {
    it("should call web3Client to get the version number", async () => {
      const mockVersion = "1.0.0";
      (mockWeb3Client.readContract as jest.Mock).mockResolvedValue(mockVersion);

      const result = await utilsDataMapper.getVersionNumber();
      expect(result).toBe(mockVersion);
      expect(mockWeb3Client.readContract).toHaveBeenCalledWith({
        abi: abiAttestationRegistry,
        address: mockConf.attestationRegistryAddress,
        functionName: "getVersionNumber",
      });
    });
  });

  describe("encode", () => {
    it("should call encode with correct arguments", () => {
      const schema = "schema";
      const values = ["value1", "value2"];
      const mockEncoded = "0xencoded";

      (encode as jest.Mock).mockReturnValue(mockEncoded);

      const result = utilsDataMapper.encode(schema, values);
      expect(result).toBe(mockEncoded);
      expect(encode).toHaveBeenCalledWith(schema, values);
    });
  });

  describe("decode", () => {
    it("should call decode with correct arguments", () => {
      const schema = "schema";
      const attestationData = "0xdata";
      const mockDecoded = ["value1", "value2"];

      (decode as jest.Mock).mockReturnValue(mockDecoded);

      const result = utilsDataMapper.decode(schema, attestationData);
      expect(result).toEqual(mockDecoded);
      expect(decode).toHaveBeenCalledWith(schema, attestationData);
    });
  });
});
