import BaseDataMapper from "./BaseDataMapper";
import { PublicClient, WalletClient } from "viem";
import { lineaSepolia } from "viem/chains";

import { Conf } from "../types";
import { SDKMode, VeraxSdk } from "../VeraxSdk";
import { subgraphCall, stringifyWhereClause } from "../utils/graphClientHelper";

jest.mock("../utils/graphClientHelper");

type TestType = {
  id: string;
  name: string;
};

type TestFilter = {
  name: string;
};

class MockDataMapper extends BaseDataMapper<TestType, TestFilter, unknown> {
  protected typeName = "TestType";
  protected gqlInterface = "{ id, name }";
}

describe("BaseDataMapper", () => {
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
  const mockVeraxSdk = {} as VeraxSdk;

  let mockDataMapper: MockDataMapper;

  beforeEach(() => {
    mockDataMapper = new MockDataMapper(mockConf, mockWeb3Client, mockVeraxSdk, mockWalletClient);
    jest.clearAllMocks();
  });

  describe("findOneById", () => {
    it("should call subgraphCall with the correct query and return the result", async () => {
      const mockResponse = { data: { data: { TestType: { id: "1", name: "Test" } } }, status: 200 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await mockDataMapper.findOneById("1");

      expect(subgraphCall).toHaveBeenCalledWith(
        `query get_TestType { TestType(id: "1") { id, name } }`,
        mockConf.subgraphUrl,
      );
      expect(result).toEqual({ id: "1", name: "Test" });
    });

    it("should throw an error if the status is not 200", async () => {
      const mockResponse = { status: 500 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(mockDataMapper.findOneById("1")).rejects.toThrow("Error(s) while fetching TestType");
    });

    it("should return undefined if no data is found", async () => {
      const mockResponse = { data: null, status: 200 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await mockDataMapper.findOneById("1");

      expect(result).toBeUndefined();
    });
  });

  describe("findBy", () => {
    it("should call subgraphCall with the correct query and return the results", async () => {
      const mockResponse = {
        data: {
          data: {
            TestTypes: [
              { id: "1", name: "Test1" },
              { id: "2", name: "Test2" },
            ],
          },
        },
        status: 200,
      };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      const filter: TestFilter | undefined = { name: "Test" };
      (stringifyWhereClause as jest.Mock).mockReturnValueOnce('{name:"Test"}');

      const result = await mockDataMapper.findBy(10, 0, filter, "name", "asc");

      expect(subgraphCall).toHaveBeenCalledWith(
        `
        query get_TestTypes{
          TestTypes(
            first: 10
            skip: 0
            where: {name:"Test"}
            orderBy: name
            orderDirection: asc
          )
          { id, name }
        }
    `,
        mockConf.subgraphUrl,
      );
      expect(result).toEqual([
        { id: "1", name: "Test1" },
        { id: "2", name: "Test2" },
      ]);
    });

    it("should return an empty array if data test type is empty", async () => {
      const mockResponse = { data: { data: { TestTypes: [] } }, status: 200 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await mockDataMapper.findBy();

      expect(result).toEqual([]);
    });

    it("should return an empty array if no data is found", async () => {
      const mockResponse = { data: {}, status: 200 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await mockDataMapper.findBy();

      expect(result).toEqual([]);
    });

    it("should throw an error if the status is not 200", async () => {
      const mockResponse = { status: 500 };
      (subgraphCall as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(mockDataMapper.findBy()).rejects.toThrow("Error(s) while fetching TestTypes");
    });
  });
});
