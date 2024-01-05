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
          className={`flex flex-col items-center justify-center gap-6 px-10 h-[16.625rem] lg:h-[14.8125rem] rounded-3xl text-center dark:text-whiteDefault ${info.additionalClass}`}
        >
          {info.icon}
          <div className="text-xl md:text-2xl font-semibold dark:text-whiteDefault">{info.title}</div>
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
