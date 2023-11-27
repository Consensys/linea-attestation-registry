import useSWR from 'swr';
import { Link } from 'react-router-dom';
import { EyeOffIcon } from 'lucide-react';
import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';

import { SWRKeys } from '@/interfaces/swr/enum';
import { useNetworkContext } from '@/providers/network-provider';
import { toAttestationById } from '@/routes/constants';
import { bigintToNumber } from '@/utils/decodeUtils';
import { displayAmountWithComma } from '@/utils/amountUtils';

export const RelatedAttestations: React.FC<{ id: string }> = ({ id }) => {
  const { sdk } = useNetworkContext();

  const { data: relatedAttestations } = useSWR(
    SWRKeys.GET_RELATED_ATTESTATION,
    () => sdk.attestation.getRelatedAttestations(id) as Promise<Attestation[]>
  );

  return (
    <div className="flex flex-col w-[773px] items-start gap-5 p-6 bg-[#f4f4f8] rounded-xl overflow-hidden">
      <div className="w-fit font-semibold text-[#161517] text-xl whitespace-nowrap">Related Attestations</div>
      <div className="flex items-start gap-4 overflow-auto w-full scrollbar">
        {!relatedAttestations || !relatedAttestations.length ? (
          <div className="flex gap-2 text-base text-[#6d6f73] w-full justify-center mt-2">
            <EyeOffIcon />
            Not Found
          </div>
        ) : (
          relatedAttestations.map((attestation) => (
            <Link
              key={attestation.id}
              to={toAttestationById(attestation.id)}
              className="flex flex-col shrink-0 w-[131px] min-h-[105px] items-start overflow-hidden gap-1.5 p-3 rounded border border-solid border-[#c7cad9]"
            >
              <div className="w-full font-semibold text-[#161517] text-xl self-stretch whitespace-nowrap overflow-hidden text-ellipsis">
                {displayAmountWithComma(bigintToNumber(attestation.id))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
