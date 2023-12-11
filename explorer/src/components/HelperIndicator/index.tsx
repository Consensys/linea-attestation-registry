import { Page } from "@/interfaces/components";

const getIndicatorColorClass = (page: Page): string => {
  switch (page) {
    case "schema":
      return "bg-page-schema";
    case "attestation":
      return "bg-page-attestation";
    case "portal":
      return "bg-page-portal";
    case "module":
      return "bg-page-module";
    default:
      return "bg-transparent";
  }
};

export const HelperIndicator: React.FC<{ type: Page }> = ({ type }) => {
  const indicatorColor = getIndicatorColorClass(type);
  return <div className={`w-[3.33px] h-[13.33px] ${indicatorColor} rounded-full`} />;
};
