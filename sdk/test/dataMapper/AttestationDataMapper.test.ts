import AttestationDataMapper from "../../src/dataMapper/AttestationDataMapper";
import VeraxSdk from "../../src/VeraxSdk";
import { createPublicClient, createWalletClient, http, PublicClient, WalletClient } from "viem";
import { ApolloClient, ApolloQueryResult, gql, InMemoryCache } from "@apollo/client/core";
import { Constants } from "../../src/utils/constants";

describe("AttestationDataMapper", () => {
  let mockApolloClient: ApolloClient<object>;
  let web3Client: PublicClient;
  let walletClient: WalletClient;
  let attestationDataMapper: AttestationDataMapper;
  const typeName: string = "attestation";
  const gqlInterface: string = `{
            id
            schemaId
            replacedBy
            attester
            portal
            attestedDate
            expirationDate
            revocationDate
            version
            revoked
            subject
            attestationData
            schemaString
            decodedData
  }`;

  beforeAll(() => {
    // Create web3Client
    web3Client = createPublicClient({
      chain: VeraxSdk.DEFAULT_LINEA_TESTNET.chain,
      transport: http(),
    });

    // Create walletClient
    walletClient = createWalletClient({
      chain: VeraxSdk.DEFAULT_LINEA_TESTNET.chain,
      transport: http(),
    });

    // Create a mock Apollo Client with an in-memory cache
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    attestationDataMapper = new AttestationDataMapper(
      VeraxSdk.DEFAULT_LINEA_TESTNET,
      web3Client,
      walletClient,
      mockApolloClient,
      new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET),
    );
  });

  afterEach(() => {
    // Clear the mock function's call history after each test
    jest.clearAllMocks();
  });

  describe("findOneById", () => {
    it("should return the expected attestation", async () => {
      const attestationId = "attestationId1";
      // Mock the behavior of the query method
      const queryMock = jest.spyOn(mockApolloClient, "query");
      queryMock.mockResolvedValueOnce({
        data: {
          attestation: { result: "success" },
        },
      } as ApolloQueryResult<unknown>);

      const result = await attestationDataMapper.findOneById(attestationId);

      // Assert
      expect(result).toMatchObject({ result: "success" });
      expect(mockApolloClient.query).toHaveBeenCalledWith({
        query: gql(`query GetOne($id: ID!) { ${typeName}(id: $id) ${gqlInterface} }`),
        variables: { id: attestationId },
      });
    });
  });

  describe("getRelatedAttestations", () => {
    it("should return the expected attestations", async () => {
      const attestationId = "0x0000000000000000000000000000000000000000000000000000000000000001";
      // Mock the behavior of the query method
      const queryMock = jest.spyOn(mockApolloClient, "query");
      queryMock.mockResolvedValueOnce({
        data: {
          attestations: { result: "success" },
        },
      } as ApolloQueryResult<unknown>);

      const result = await attestationDataMapper.getRelatedAttestations(attestationId);

      // Assert
      expect(result).toMatchObject({ result: "success" });
      expect(mockApolloClient.query).toHaveBeenCalledWith({
        query: gql(
          `query GetBy { ${typeName}s(where: {attestationData_contains:"${attestationId}",schemaId_in:["${Constants.RELATIONSHIP_SCHEMA_ID}","${Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID}"]}) ${gqlInterface} }`,
        ),
      });
    });
  });
});
