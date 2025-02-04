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
    case '0xe705': // Linea Sepolia
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-linea-sepolia/v0.0.12';
    case '0x66eee': // Arbitrum Sepolia
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-arbitrum-sepolia/v0.0.2';
    case '0xa4b1': // Arbitrum Mainnet
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-arbitrum/v0.0.1';
    case '0x14a34': // Base Sepolia
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-base-sepolia/v0.0.2';
    case '0x2105': // Base Mainnet
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-base/v0.0.2';
    case '0x61': // BSC Testnet
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-bsc-testnet/v0.0.1';
    case '0x38': // BSC Mainnet
      return 'https://api.studio.thegraph.com/query/67521/verax-v1-bsc/v0.0.1';
    default: // Linea Mainnet
      return 'https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry/graphql';
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
