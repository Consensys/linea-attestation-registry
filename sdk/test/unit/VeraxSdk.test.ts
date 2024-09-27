import { createPublicClient, createWalletClient, http } from "viem";
import { Conf, VeraxSdk } from "../../src/VeraxSdk";

jest.mock("viem", () => ({
  createPublicClient: jest.fn(),
  createWalletClient: jest.fn(),
  http: jest.fn(),
  custom: jest.fn(),
}));

const mockConf: Conf = VeraxSdk.DEFAULT_LINEA_SEPOLIA;

describe("VeraxSdk", () => {
  let veraxSdk: VeraxSdk;

  beforeEach(() => {
    (createPublicClient as jest.Mock).mockReturnValue({});
    (createWalletClient as jest.Mock).mockReturnValue({});
    veraxSdk = new VeraxSdk(mockConf, undefined, "0x0000000000000000000000000000000000000000000000000000000000000001");
  });

  it("should create a VeraxSdk instance", () => {
    expect(veraxSdk).toBeDefined();
    expect(veraxSdk).toBeInstanceOf(VeraxSdk);
  });

  it("should instantiate all the data mappers", () => {
    expect(veraxSdk.attestation).toBeDefined();
    expect(veraxSdk.module).toBeDefined();
    expect(veraxSdk.portal).toBeDefined();
    expect(veraxSdk.schema).toBeDefined();
    expect(veraxSdk.utils).toBeDefined();
  });

  it("should create a public client", () => {
    expect(createPublicClient).toHaveBeenCalledWith({
      chain: mockConf.chain,
      transport: http(),
    });
  });

  it("should create a wallet client in BACKEND mode", () => {
    expect(createWalletClient).toHaveBeenCalledWith({
      chain: mockConf.chain,
      account: expect.anything(),
      transport: http(),
    });
  });

  it("should call findOneById on schema data mapper", async () => {
    const findOneByIdSpy = jest.spyOn(veraxSdk.schema, "findOneById");
    await veraxSdk.schema.findOneById("some-id");
    expect(findOneByIdSpy).toHaveBeenCalledWith("some-id");
  });

  it("should have default backend configurations", () => {
    expect(VeraxSdk.DEFAULT_LINEA_MAINNET).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM_NOVA).toBeDefined();
    expect(VeraxSdk.DEFAULT_LINEA_SEPOLIA).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM).toBeDefined();
    expect(VeraxSdk.DEFAULT_BASE_SEPOLIA).toBeDefined();
    expect(VeraxSdk.DEFAULT_BASE).toBeDefined();
    expect(VeraxSdk.DEFAULT_BSC_TESTNET).toBeDefined();
    expect(VeraxSdk.DEFAULT_BSC).toBeDefined();
  });

  it("should have default frontend configurations", () => {
    expect(VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM_NOVA_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_ARBITRUM_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_BASE_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_BSC_TESTNET_FRONTEND).toBeDefined();
    expect(VeraxSdk.DEFAULT_BSC_FRONTEND).toBeDefined();
  });
});
