import GitbookIcon from "@/assets/icons/gitbook.svg?react";
import VeraxIcon from "@/assets/logo/verax-icon.svg?react";
import GithubIcon from "@/assets/socials/github.svg?react";
import { Info } from "@/components/NavigationList/components/Info";
import { NavigationProps } from "@/interfaces/components";
import { APP_ROUTES } from "@/routes/constants";

export const DEFAULT_ROUTES: Array<NavigationProps> = [
  {
    name: "Issuers",
    route: APP_ROUTES.ISSUERS,
  },
  {
    name: "Attestations",
    route: APP_ROUTES.ATTESTATIONS,
  },
  {
    name: "Schemas",
    route: APP_ROUTES.SCHEMAS,
  },
  {
    name: "Modules",
    route: APP_ROUTES.MODULES,
  },
  {
    name: "Info",
    submenu: <Info />,
  },
];

export const INFO_LIST = [
  {
    title: "About",
    logo: <VeraxIcon className="!w-4 !h-4" />,
    url: "https://ver.ax/",
  },
  {
    title: "Github",
    logo: <GithubIcon className="!w-4 !h-4" />,
    url: "https://github.com/Consensys/linea-attestation-registry/tree/dev",
  },
  {
    title: "Documentation",
    logo: <GitbookIcon className="!w-4 !h-4" />,
    url: "https://docs.ver.ax/verax-documentation/",
  },
];
