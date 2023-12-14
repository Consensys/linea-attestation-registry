import { ArrowUpRight } from "lucide-react";

import issuerBG from "@/assets/backgrounds/issuer-bg.jpeg";
import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";

import { IBannerProps } from "./interface";

export const Banner: React.FC<IBannerProps> = ({ name, CTALink, CTATitle, logo }) => {
  const IssuerLogo = logo;

  return (
    <div className="bg-gray-900 bg-opacity-50 h-[24.125rem] p-4 md:h-[20.4375rem] md:p-8 rounded-[1.375rem] md:rounded-[2.25rem] flex flex-col lg:flex-row justify-end lg:justify-between items-start lg:items-end relative overflow-hidden">
      <img src={issuerBG} alt="issuer background" className="absolute -z-[1] top-0 left-0 h-full w-full object-cover" />
      <div className="mb-6 lg:mb-0 md:flex md:items-center md:gap-6">
        <IssuerLogo className="mb-4 md:mb-0 w-[2.875rem] md:w-16 h-auto" />
        <div className="text-[2rem] font-medium md:text-[2.5rem] lg:text-[2.75rem] md:font-semibold text-whiteDefault">
          {name}
        </div>
      </div>
      {CTALink && (
        <Button
          name={CTATitle}
          handler={() => window.open(CTALink, "_blank")}
          buttonType={EButtonType.PRIMARY_WHITE}
          iconRight={<ArrowUpRight />}
        />
      )}
    </div>
  );
};
