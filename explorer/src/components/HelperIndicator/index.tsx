import { Page } from "@/interfaces/components";

export const HelperIndicator: React.FC<{ type: Page }> = ({ type }) => {
  return <div className={`w-[3.33px] h-[13.33px] bg-page-${type} rounded-full`} />;
};
