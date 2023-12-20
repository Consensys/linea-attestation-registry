import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";

import { infoData } from "./data";

export const Info: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[2.0625rem]">
      {infoData.map((info) => (
        <div
          key={info.title}
          className={`flex flex-col items-center justify-center gap-6 px-10 h-[18.75rem] lg:h-[23.375rem] rounded-3xl text-center ${info.additionalClass}`}
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
