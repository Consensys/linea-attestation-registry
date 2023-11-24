import { Attestation } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { bigintToNumber } from "@/utils/decodeUtils";

import { createDateListItem } from "./utils";

export const AttestationDates: React.FC<Attestation> = ({ ...attestation }) => {
  const list = [
    createDateListItem("ATTESTED", attestation.attestedDate),
    createDateListItem("EXPIRATION DATE", attestation.expirationDate),
    {
      title: "REVOKED",
      value: attestation.revoked ? "YES" : "NO",
    },
    createDateListItem("REVOCATION DATE", attestation.revocationDate),
  ];

  return (
    <div className="flex items-center justify-between p-[24px] bg-[#f4f4f8] rounded-[12px]">
      <div className="mt-[-1.00px] text-[32px] relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] tracking-[0] leading-[normal]">#{bigintToNumber(attestation.id)}</div>
      <div className='gap-[40px] inline-flex items-start flex-[0_0_auto]'>
        {list.map((item) => (
          <div key={item.title} className="inline-flex flex-col items-start gap-[8px] flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[12px] tracking-[0] leading-[normal]"
            >
              {item.title.toUpperCase()}
            </div>
            <div className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[16px] tracking-[0] leading-[normal] whitespace-nowrap"
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
