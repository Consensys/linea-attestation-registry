import { PublicClient, WalletClient } from "viem";
import { Conf, SDKMode, VeraxSdk } from "../VeraxSdk";
import { subgraphCall } from "../utils/graphClientHelper";
import ModuleDataMapper from "./ModuleDataMapper";
import { lineaSepolia } from "viem/chains";

jest.mock("../utils/graphClientHelper", () => ({
  subgraphCall: jest.fn(),
}));

describe("ModuleDataMapper", () => {
  let moduleDataMapper: ModuleDataMapper;
  const mockConf: Conf = {
    subgraphUrl: "http://mock-subgraph.com",
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    portalRegistryAddress: "0x1",
    moduleRegistryAddress: "0x2",
    schemaRegistryAddress: "0x3",
    attestationRegistryAddress: "0x4",
  };
  const mockWeb3Client = {} as PublicClient;
  const mockVeraxSdk = {} as VeraxSdk;
  const mockWalletClient = {} as WalletClient;

  beforeEach(() => {
    moduleDataMapper = new ModuleDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("findOneById should return a module if found", async () => {
    const mockData = {
      data: {
        module: {
          id: "1",
          moduleAddress: "0x123",
          name: "Module 1",
          description: "Test module",
        },
      },
    };

    // Mocking subgraphCall to return mocked data
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await moduleDataMapper.findOneById("1");

    expect(subgraphCall).toHaveBeenCalledWith(
      `query get_module { module(id: "1") {
        id
        moduleAddress
        name
        description
  } }`,
      "http://mock-subgraph.com",
    );
    expect(result).toEqual(mockData.data.module);
  });

  test("findOneById should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(moduleDataMapper.findOneById("1")).rejects.toThrowError("Error(s) while fetching module");
  });

  test("findBy should return modules if found", async () => {
    const mockData = {
      data: {
        modules: [
          { id: "1", moduleAddress: "0x123", name: "Module 1", description: "Test module 1" },
          { id: "2", moduleAddress: "0x456", name: "Module 2", description: "Test module 2" },
        ],
      },
    };

    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await moduleDataMapper.findBy();

    expect(subgraphCall).toHaveBeenCalledWith(
      `
        query get_modules{
          modules(
            first: 100
            skip: 0
            where: null
            orderBy: null
            orderDirection: null
          )
          {
        id
        moduleAddress
        name
        description
  }
        }
    `,
      mockConf.subgraphUrl,
    );
    expect(result).toEqual(mockData.data.modules);
  });

  test("findBy should return an empty array if no modules found", async () => {
    const mockData = { data: { modules: [] } };
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await moduleDataMapper.findBy();

    expect(result).toEqual([]);
  });

  test("findBy should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(moduleDataMapper.findBy()).rejects.toThrowError("Error(s) while fetching modules");
  });
});
