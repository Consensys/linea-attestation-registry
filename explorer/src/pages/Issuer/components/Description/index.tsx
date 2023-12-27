import { Chips } from "@/components/Chips";

import { IDescriptionProps } from "./interface";

export const Description: React.FC<IDescriptionProps> = ({ description, keywords }) => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 md:w-[31.6875rem] lg:w-[40.3125rem] max-w-full m-auto">
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Chips name={keyword} key={keyword} />
        ))}
      </div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-4 lg:mb-4">
          <div className="flex flex-col gap-1 p-4 rounded-lg border border-border-card min-w-[124px]">
            <div className="text-2xl md:text-[2rem] font-semibold">24k</div>
            <div className="text-base font-normal text-text-darkGrey">Attestations</div>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-lg border border-border-card min-w-[124px]">
            <div className="text-2xl md:text-[2rem] font-semibold">13</div>
            <div className="text-base font-normal text-text-darkGrey">Schemas</div>
          </div>
        </div> */}
      <div className="text-base font-normal text-text-darkGrey dark:text-tertiary">{description}</div>
    </div>
  );
};
