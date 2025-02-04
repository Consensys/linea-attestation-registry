import { PublicClient, WalletClient } from "viem";
import { Conf, SDKMode, VeraxSdk } from "../VeraxSdk";
import { subgraphCall } from "../utils/graphClientHelper";
import SchemaDataMapper from "./SchemaDataMapper";
import { lineaSepolia } from "viem/chains";

jest.mock("../utils/graphClientHelper", () => ({
  subgraphCall: jest.fn(),
}));

describe("SchemaDataMapper", () => {
  let schemaDataMapper: SchemaDataMapper;
  const mockConf: Conf = {
    subgraphUrl: "http://mock-subgraph.com",
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    schemaRegistryAddress: "0x1",
    moduleRegistryAddress: "0x2",
    portalRegistryAddress: "0x3",
    attestationRegistryAddress: "0x4",
  };
  const mockWeb3Client = {} as PublicClient;
  const mockVeraxSdk = {} as VeraxSdk;
  const mockWalletClient = {} as WalletClient;

  beforeEach(() => {
    schemaDataMapper = new SchemaDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("findOneById should return a schema if found", async () => {
    const mockData = {
      data: {
        schema: {
          id: "1",
          schemaAddress: "0x123",
          name: "Schema 1",
          description: "Test schema",
        },
      },
    };

    // Mocking subgraphCall to return mocked data
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await schemaDataMapper.findOneById("1");

    expect(subgraphCall).toHaveBeenCalledWith(
      `query get_schema { schema(id: "1") {
        id
        name
        description
        context
        schema
        attestationCounter
  } }`,
      "http://mock-subgraph.com",
    );
    expect(result).toEqual(mockData.data.schema);
  });

  test("findOneById should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(schemaDataMapper.findOneById("1")).rejects.toThrowError("Error(s) while fetching schema");
  });

  test("findBy should return schemas if found", async () => {
    const mockData = {
      data: {
        schemas: [
          { id: "1", schemaAddress: "0x123", name: "Schema 1", description: "Test schema 1" },
          { id: "2", schemaAddress: "0x456", name: "Schema 2", description: "Test schema 2" },
        ],
      },
    };

    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await schemaDataMapper.findBy();

    expect(subgraphCall).toHaveBeenCalledWith(
      `
        query get_schemas{
          schemas(
            first: 100
            skip: 0
            where: null
            orderBy: null
            orderDirection: null
          )
          {
        id
        name
        description
        context
        schema
        attestationCounter
  }
        }
    `,
      mockConf.subgraphUrl,
    );
    expect(result).toEqual(mockData.data.schemas);
  });

  test("findBy should return an empty array if no schemas found", async () => {
    const mockData = { data: { schemas: [] } };
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await schemaDataMapper.findBy();

    expect(result).toEqual([]);
  });

  test("findBy should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(schemaDataMapper.findBy()).rejects.toThrowError("Error(s) while fetching schemas");
  });
});
