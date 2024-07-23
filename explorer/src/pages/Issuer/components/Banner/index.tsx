import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";

import { IBannerProps } from "./interface";

export const Banner: React.FC<IBannerProps> = ({ name, CTALink, CTATitle, logo }) => {
  const IssuerLogo = logo;
  return (
    <div className="flex flex-col lg:flex-row justify-end lg:justify-between items-start lg:items-end relative overflow-hidden">
      <div className="flex flex-row items-center gap-[20px]">
        <div className="w-[87px] h-[87px] relative">
          <div className="absolute w-[87px] h-[87px] bg-[#D9D9D9]"></div>
          <IssuerLogo className="absolute w-[25px] h-[15px] left-[31px] top-[36px] font-normal text-[12px] leading-[15px] text-black" />
        </div>
        <div className="text-[32px] font-normal leading-[39px] text-white">{name}</div>
      </div>
      {CTALink && (
        <Button
          name={CTATitle}
          handler={() => window.open(CTALink, "_blank")}
          buttonType={EButtonType.PRIMARY_WHITE}
          iconRight={<ArrowUpRight />}
          className="mb-5"
        />
      )}
    </div>
  );
};
