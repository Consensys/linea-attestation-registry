import { Page } from "@/interfaces/components";

import { IHelperIndicatorProps } from "./interface";

const getIndicatorColorClass = (page: Page): string => {
  switch (page) {
    case "schema":
      return "bg-page-schema dark:bg-page-schemaDark";
    case "attestation":
      return "bg-page-attestation dark:bg-page-attestationDark";
    case "portal":
      return "bg-page-portal dark:bg-page-portalDark";
    case "module":
      return "bg-page-module dark:bg-page-moduleDark";
    default:
      return "bg-transparent";
  }
};

export const HelperIndicator: React.FC<IHelperIndicatorProps> = ({ type, sizeClass = "w-[3.33px] h-[13.33px]" }) => {
  const indicatorColor = getIndicatorColorClass(type);

  return <div className={`${sizeClass} ${indicatorColor} rounded-full`} />;
};
