import { OnTransactionHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';
import { formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns';
import { Attestation, Portal, Schema } from './types';

const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const getNetworkName = (chainId: string) => {
  if (chainId === 'eip155:59140') {
    return '.goerli';
  } else if (chainId === 'eip155:59144') {
    return '';
  }
  throw new Error('Network not supported');
};

const getPortal = async (chainId: string, portalId: string): Promise<Portal> => {
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

  const rawResponse = await postData(
    `https://graph-query${getNetworkName(chainId)}.linea.build/subgraphs/name/Consensys/linea-attestation-registry`,
    data,
  );

  return rawResponse ? rawResponse.data.portal : {};
};

const shortenHexString = (longString: string) => {
  return `${longString.slice(0, 5)}...${longString.slice(longString.length - 4, longString.length)}`;
};

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

const dateFromTimestamp = (timestampString: string) => {
  return new Date(parseInt(timestampString, 10) * 1000);
};

const formatAgo = (timestampString: string) => {
  return formatDistanceToNowStrict(dateFromTimestamp(timestampString), {
    addSuffix: true,
  });
};

const formatIn = (timestampString: string) => {
  return formatDistanceStrict(new Date(), dateFromTimestamp(timestampString));
};

const formatDate = (timestampString: string) => {
  const date = dateFromTimestamp(timestampString);

  return `${[padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(':')} on ${[
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('/')}`;
};

const getSchema = async (chainId: string, portalId: string): Promise<Schema> => {
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

  const rawResponse = await postData(
    `https://graph-query${getNetworkName(chainId)}.linea.build/subgraphs/name/Consensys/linea-attestation-registry`,
    data,
  );

  return rawResponse ? rawResponse.data.schema : {};
};

const renderAttestations = async (attestations: Attestation[], chainId: string) => {
  return await Promise.all(
    attestations.map(async (attestation: Attestation, index: number) => {
      const isRevoked = attestation.revoked;
      const canExpire = parseInt(attestation.expirationDate, 10) > 0;
      const isExpired = canExpire && parseInt(attestation.expirationDate, 10) < Math.floor(Date.now() / 1000);
      const isActive = !isRevoked && !isExpired;
      const activeLogo = isActive ? '✅' : '❌';
      const portalOwner = (await getPortal(chainId, attestation.portal)).ownerName;
      const schemaName = (await getSchema(chainId, attestation.schemaId)).name;

      const content = [];
      let value = `${activeLogo} **${portalOwner}** attested "**${schemaName}**" at ${formatDate(
        attestation.attestedDate,
      )}`;

      if (canExpire) {
        if (isExpired) {
          value = value.concat(` (expired ${formatAgo(attestation.expirationDate)})`);
        } else {
          value = value.concat(` (expires in ${formatIn(attestation.expirationDate)})`);
        }
      }

      if (isRevoked) {
        value = value.concat(` (expired ${formatAgo(attestation.revocationDate)})`);
      }

      content.push(
        text({
          value,
          markdown: true,
        }),
      );

      if (index !== attestations.length - 1) {
        content.push(divider());
      }

      return content;
    }),
  );
};

const getAttestations = async (chainId: string, address?: string): Promise<Attestation[]> => {
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

  const rawResponse = await postData(
    `https://graph-query${getNetworkName(chainId)}.linea.build/subgraphs/name/Consensys/linea-attestation-registry`,
    data,
  );

  return rawResponse ? rawResponse.data.attestations : [];
};

export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  const destinationAddress = transaction.to?.toString();

  if (!destinationAddress) {
    throw new Error('Something wrong occurred');
  }

  const attestations = await getAttestations(chainId, destinationAddress);
  const contentToRender = [];

  if (attestations.length) {
    contentToRender.push(heading(`${shortenHexString(destinationAddress)} has ${attestations.length} attestations`));
    contentToRender.push(divider());
    const renderedAttestations = await renderAttestations(attestations, chainId);
    contentToRender.push(...renderedAttestations.flat(2));
  } else {
    contentToRender.push(heading(`${shortenHexString(destinationAddress)} doesn't hold any attestation`));
  }

  return {
    content: panel(contentToRender),
  };
};
