import { Attestation } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";

interface AttestationDataProps {
  attestation: Attestation
}

export const AttestationData: React.FC<AttestationDataProps> = () => {
  return (
    <div className="flex flex-col w-[773px] h-[256px] items-start gap-[24px] p-[24px] relative bg-[#f4f4f8] rounded-[12px]">
      <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
          Attestation Data
        </div>
      </div>
      <div className="flex flex-col w-[725px] items-start gap-[16px] p-[16px] relative flex-1 grow bg-[#fafafc] rounded-[8px] overflow-hidden border border-solid border-[#c0cddd]">
      </div>
    </div>
  );
};
