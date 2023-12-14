import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";

import { infoData } from "./data";

export const Info: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[2.0625rem] mb-14 md:mb-[4.5rem]">
      {infoData.map((info) => (
        <div
          key={info.title}
          className={`flex flex-col items-center justify-center gap-6 px-10 h-[23.4375rem] lg:h-[29.5625rem] rounded-3xl ${info.additionalClass}`}
        >
          {info.icon}
          <div className="text-xl md:text-2xl font-semibold">{info.title}</div>
          <Button
            name={info.button.name}
            handler={() => window.open(info.button.url, "_blank")}
            buttonType={EButtonType.PRIMARY_LIME}
            iconRight={<ArrowUpRight />}
          />
        </div>
      ))}
    </div>
  );
};
