import useSWR, { KeyedMutator } from 'swr';
import { Link } from 'react-router-dom';
import { EyeOffIcon } from 'lucide-react';
import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';

import { SWRKeys } from '@/interfaces/swr/enum';
import { useNetworkContext } from '@/providers/network-provider';
import { toAttestationById } from '@/routes/constants';
import { displayAmountWithComma } from '@/utils/amountUtils';
import { Hex, hexToNumber } from 'viem';

export const RelatedAttestations: React.FC<{ id: string; mutate: KeyedMutator<Attestation> }> = ({ id, mutate }) => {
  const { sdk } = useNetworkContext();

  const { data: relatedAttestations } = useSWR(
    SWRKeys.GET_RELATED_ATTESTATION,
    () => sdk.attestation.getRelatedAttestations(id) as Promise<Attestation[]>
  );
  console.log('relatedAttestations', relatedAttestations);

  const list = [
    {
      id: '0x0000000000000000000000000000000000000000000000000000000000000001',
      title: 'Attestation Verification',
    },
    {
      id: '0x0000000000000000000000000000000000000000000000000000000000000002',
      title: 'Aspect Professional Profile',
    },
    {
      id: '0x0000000000000000000000000000000000000000000000000000000000000003',
      title: 'Web3 Profile',
    },
    {
      id: '0x0000000000000000000000000000000000000000000000000000000000000004',
      title: 'Proof of Personator',
    },
    {
      id: '0x0000000000000000000000000000000000000000000000000000000000000005',
      title: 'Reviewer',
    },
  ];
  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="text-zinc-950 text-base font-semibold">Related Attestations</div>
      {/* TODO: remove list and uncommented next line */}
      {/* {!relatedAttestations || !relatedAttestations.length ? ( */}
      {!list.length ? (
        <div className="flex gap-2 text-base text-[#6d6f73] w-full justify-center mt-2">
          <EyeOffIcon />
          Not Found
        </div>
      ) : (
        <div className="self-stretch flex flex-col justify-start items-start gap-4 pb-1 lg:flex-row lg:flex-wrap">
          {list.map(({ id, title }) => (
            <Link
              key={id}
              to={toAttestationById(id)}
              onClick={() => mutate(sdk.attestation.findOneById(id))}
              className="py-2 justify-start items-center gap-2 inline-flex flex-shrink-0 lg:flex-col lg:items-start lg:w-[115px]"
            >
              <div className="text-gray-700 text-lg font-semibold">
                {displayAmountWithComma(hexToNumber(id as Hex))}
              </div>
              <div className="text-slate-500 text-sm font-normal">{title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
