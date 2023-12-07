import { Page } from "@/interfaces/components";

const getIndicatorColorClass = (type: Page): string => {
  switch (type) {
    case "schema":
      return "bg-indicator-magenta";
    case "attestation":
      return "bg-indicator-blue";
    case "portal":
      return "bg-indicator-green";
    case "module":
      return "bg-indicator-orange";
    default:
      return "bg-transparent";
  }
};

export const HelperIndicator: React.FC<{ type: Page }> = ({ type }) => {
  const indicatorColorClass = getIndicatorColorClass(type);
  return <div className={`w-[3.33px] h-[13.33px] ${indicatorColorClass} rounded-full`} />;
};
