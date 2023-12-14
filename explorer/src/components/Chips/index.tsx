import { EMPTY_STRING } from "@/constants";

import { IChipsProps } from "./interface";

export const Chips: React.FC<IChipsProps> = ({ name, additionalClass = EMPTY_STRING }) => {
  return (
    <div
      className={`flex items-center h-7 px-2.5 bg-surface-secondary text-[0.625rem] font-normal uppercase rounded-full ${additionalClass}`}
    >
      {name}
    </div>
  );
};
