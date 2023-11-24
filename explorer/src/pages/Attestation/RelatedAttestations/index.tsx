import { Attestation } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";

interface RelatedAttestationsProps {
  attestation: Attestation
}

export const RelatedAttestations: React.FC<RelatedAttestationsProps> = () => {
  return (
    <div className="flex flex-col w-[773px] items-start gap-[20px] p-[24px] relative bg-[#f4f4f8] rounded-[12px]">
      <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
        Related Attestations
      </div>
      <div className="flex w-[720px] items-start gap-[16px] relative flex-[0_0_auto]">
        <div className="flex flex-col h-[105px] items-start gap-[6px] p-[12px] relative flex-1 grow rounded-[4px] border border-solid border-[#c7cad9]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
            94,567
          </div>
          <div className="relative w-[87px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[14px] tracking-[0] leading-[normal]">
            Attestation Verification
          </div>
        </div>
        <div className="flex flex-col h-[105px] items-start gap-[6px] p-[12px] relative flex-1 grow rounded-[4px] border border-solid border-[#c7cad9]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
            21,253
          </div>
          <div className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[14px] tracking-[0] leading-[normal]">
            Aspecta Professional Profile
          </div>
        </div>
        <div className="flex flex-col h-[105px] items-start gap-[6px] p-[12px] relative flex-1 grow rounded-[4px] border border-solid border-[#c7cad9]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
            109,236
          </div>
          <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[14px] tracking-[0] leading-[normal]">
            Web3 Profile
          </div>
        </div>
        <div className="flex flex-col h-[105px] items-start gap-[6px] p-[12px] relative flex-1 grow rounded-[4px] border border-solid border-[#c7cad9]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
            45,783
          </div>
          <div className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[14px] tracking-[0] leading-[normal]">
            Proof of Personhood
          </div>
        </div>
        <div className="flex flex-col h-[105px] items-start gap-[6px] p-[12px] relative flex-1 grow rounded-[4px] border border-solid border-[#c7cad9]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#161517] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
            82,122
          </div>
          <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#606476] text-[14px] tracking-[0] leading-[normal]">
            Reviewer
          </div>
        </div>
      </div>
    </div>
  );
};
