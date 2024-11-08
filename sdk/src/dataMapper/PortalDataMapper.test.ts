import { PublicClient, WalletClient } from "viem";
import { Conf, SDKMode, VeraxSdk } from "../VeraxSdk";
import { subgraphCall } from "../utils/graphClientHelper";
import PortalDataMapper from "./PortalDataMapper";
import { lineaSepolia } from "viem/chains";

jest.mock("../utils/graphClientHelper", () => ({
  subgraphCall: jest.fn(),
}));

describe("PortalDataMapper", () => {
  let portalDataMapper: PortalDataMapper;
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
  const mockWalletClient = {} as WalletClient;
  const mockVeraxSdk = {
    schema: {
      findOneById: jest.fn(),
    },
  } as unknown as VeraxSdk;

  beforeEach(() => {
    portalDataMapper = new PortalDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);

    // Setup a default mock return value for findOneById
    (mockVeraxSdk.schema.findOneById as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Sample Schema",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("findOneById should return a portal if found", async () => {
    const mockData = {
      data: {
        portal: {
          id: "1",
          portalAddress: "0x123",
          name: "Portal 1",
          description: "Test portal",
        },
      },
    };

    // Mocking subgraphCall to return mocked data
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await portalDataMapper.findOneById("1");

    expect(subgraphCall).toHaveBeenCalledWith(
      `query get_portal { portal(id: "1") {
        id
        ownerAddress
        modules
        isRevocable
        name
        description
        ownerName
        attestationCounter
  } }`,
      "http://mock-subgraph.com",
    );
    expect(result).toEqual(mockData.data.portal);
  });

  test("findOneById should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(portalDataMapper.findOneById("1")).rejects.toThrowError("Error(s) while fetching portal");
  });

  test("findBy should return portals if found", async () => {
    const mockData = {
      data: {
        portals: [
          { id: "1", portalAddress: "0x123", name: "Portal 1", description: "Test portal 1" },
          { id: "2", portalAddress: "0x456", name: "Portal 2", description: "Test portal 2" },
        ],
      },
    };

    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await portalDataMapper.findBy();

    expect(subgraphCall).toHaveBeenCalledWith(
      `
        query get_portals{
          portals(
            first: 100
            skip: 0
            where: null
            orderBy: null
            orderDirection: null
          )
          {
        id
        ownerAddress
        modules
        isRevocable
        name
        description
        ownerName
        attestationCounter
  }
        }
    `,
      mockConf.subgraphUrl,
    );
    expect(result).toEqual(mockData.data.portals);
  });

  test("findBy should return an empty array if no portals found", async () => {
    const mockData = { data: { portals: [] } };
    (subgraphCall as jest.Mock).mockResolvedValue({ data: mockData, status: 200 });

    const result = await portalDataMapper.findBy();

    expect(result).toEqual([]);
  });

  test("findBy should throw an error if the response status is not 200", async () => {
    (subgraphCall as jest.Mock).mockResolvedValue({ status: 500 });

    await expect(portalDataMapper.findBy()).rejects.toThrowError("Error(s) while fetching portals");
  });
});
