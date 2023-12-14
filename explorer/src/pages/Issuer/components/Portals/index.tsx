import { t } from "i18next";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { HelperIndicator } from "@/components/HelperIndicator";

// TODO: add dynamic data via props
export const Portals: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex items-center text-2xl md:text-[2rem] font-semibold gap-2">
        <HelperIndicator type="portal" sizeClass="w-1 h-4 md:w-[0.375rem] h-6" /> Portals
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 rounded-xl border border-border-card items-start"
            key={index}
          >
            <div className="text-xl md:text-2xl font-semibold">Portal</div>
            <div className="text-sm font-normal text-text-darkGrey">
              Lorem ipsum dolor sit amet consectetur. Neque aliquam porttitor convallis viverra.
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="text-xs font-normal uppercase text-text-quaternary">ID</div>
              <div className="text-sm font-medium text-darkBlue">0x50bd377eb8d4236bb587ab3fb1eeafd888aeec58</div>
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="text-xs font-normal uppercase text-text-quaternary">Owner address</div>
              <div className="text-sm font-medium text-darkBlue">0x85f0d59445839de2f89ebed35d28ae81d5507f94</div>
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="text-xs font-normal uppercase text-text-quaternary">Revokable</div>
              <div className="text-sm font-medium text-darkBlue">No</div>
            </div>
            <Button
              name={t("common.actions.more")}
              handler={() => console.log("Open Portal")}
              buttonType={EButtonType.TRANSPARENT}
              iconRight={<ArrowRight />}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
