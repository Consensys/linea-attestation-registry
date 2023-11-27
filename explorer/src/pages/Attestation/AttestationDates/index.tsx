import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';

import { displayAmountWithComma } from '@/utils/amountUtils';

import { createDateListItem } from './utils';
import { Hex, hexToNumber } from 'viem';

export const AttestationDates: React.FC<Attestation> = ({ ...attestation }) => {
  const { attestedDate, expirationDate, revocationDate, id, revoked } = attestation;
  const list = [
    createDateListItem('ATTESTED', attestedDate),
    createDateListItem('EXPIRATION DATE', expirationDate),
    {
      title: 'REVOKED',
      value: revoked ? 'YES' : 'NO',
    },
    createDateListItem('REVOCATION DATE', revocationDate),
  ];

  return (
    <div className="flex items-center justify-between p-6 special-border-3">
      <div className="text-3xl w-fit font-semibold text-[#161517]">
        #{displayAmountWithComma(hexToNumber(id as Hex))}
      </div>
      <div className="gap-10 inline-flex items-start">
        {list.map((item) => (
          <div key={item.title} className="inline-flex flex-col items-start gap-2">
            <div className="w-fit font-normal text-[#606476] text-xs">{item.title.toUpperCase()}</div>
            <div className="w-fit font-semibold text-[#161517] text-base">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
