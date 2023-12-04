type HelperIndicatorType = "schema" | "portal" | "attestation";

const getIndicatorColorClass = (type: HelperIndicatorType): string => {
  switch (type) {
    case "schema":
      return "bg-indicator-magenta";
    case "attestation":
      return "bg-indicator-blue";
    case "portal":
      return "bg-indicator-green";
    default:
      return "bg-transparent";
  }
};

export const HelperIndicator: React.FC<{ type: HelperIndicatorType }> = ({ type }) => {
  const indicatorColorClass = getIndicatorColorClass(type);
  return <div className={`w-[3.33px] h-[13.33px] ${indicatorColorClass} rounded-full`} />;
};
