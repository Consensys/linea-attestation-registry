import { createPublicClient, http } from "viem";
import { lineaTestnet } from "viem/chains";
import { attestationRegistry } from "./abi/AttestationRegistry";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client/core";

const web3Client = createPublicClient({
  chain: lineaTestnet,
  transport: http(),
});

const apolloClient = new ApolloClient({
  uri: "https://graph-query.goerli.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
  cache: new InMemoryCache(),
});

export const getVersionNumber = async () => {
  return await web3Client.readContract({
    ...attestationRegistry,
    functionName: "getVersionNumber",
  });
};

export const getAttestationIdCounter = async () => {
  return await web3Client.readContract({
    ...attestationRegistry,
    functionName: "getAttestationIdCounter",
  });
};

export const findOneById = async (id: string) => {
  const queryResult = await apolloClient.query({
    query: gql`
      query GetAttestation($id: ID!) {
        attestation(id: $id) {
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
        }
      }
    `,
    variables: { id },
  });

  return JSON.stringify(queryResult.data.attestation);
};
export const findBy = async () => {
  const queryResult = await apolloClient.query({
    query: gql`
      query GetAttestations {
        attestations {
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
        }
      }
    `,
  });

  return JSON.stringify(queryResult.data.attestations);
};

export default [
  `AttestationRegistry address: ${attestationRegistry.address}`,
  `Version: ${await getVersionNumber()}`,
  `Attestations counter: ${await getAttestationIdCounter()}`,
  `Find one by ID: ${await findOneById("0x00000000000000000000000000000000000000000000000000000000000007b5")}`,
  `Find by: ${await findBy()}`,
];
