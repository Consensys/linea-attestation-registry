import type { Portal, RawAttestation, Schema } from './types';

const postData = async (url: string, data: { query: string }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const getSubgraphUrl = (chainId: string) => {
  switch (chainId) {
    case '0xe704': // Linea Testnet
      return 'https://api.goldsky.com/api/public/project_clqghnrbp9nx201wtgylv8748/subgraphs/verax/subgraph-testnet/gn';
    case '0x66eed': // Arbitrum Goerli
      return 'https://api.thegraph.com/subgraphs/name/cliqueofficial/verax-arbitrum-goerli';
    case '0xa4b1': // Arbitrum Mainnet
      return 'https://api.thegraph.com/subgraphs/name/cliqueofficial/verax-arbitrum';
    default: // Linea Mainnet
      return 'https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry';
  }
};

export const getPortal = async (
  chainId: string,
  portalId: string,
): Promise<Portal> => {
  const data = {
    query: `query { portal(id: "${portalId}") {
                  description
                  id
                  isRevocable
                  modules
                  name
                  ownerAddress
                  ownerName
                }
            }`,
  };

  const rawResponse = await postData(getSubgraphUrl(chainId), data);

  return rawResponse ? rawResponse.data.portal : {};
};

export const getSchema = async (
  chainId: string,
  portalId: string,
): Promise<Schema> => {
  const data = {
    query: `query { schema(id: "${portalId}") {
                  id
                  name
                  description
                  context
                  schema
                }
            }`,
  };

  const rawResponse = await postData(getSubgraphUrl(chainId), data);

  return rawResponse ? rawResponse.data.schema : {};
};

export const fetchAttestations = async (
  chainId: string,
  address: string,
): Promise<RawAttestation[]> => {
  const data = {
    query: `query { attestations(where: { subject: "${address}" }) {
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
          }`,
  };

  const rawResponse = await postData(getSubgraphUrl(chainId), data);

  return rawResponse ? rawResponse.data.attestations : [];
};
