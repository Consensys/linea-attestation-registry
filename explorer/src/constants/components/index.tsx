import gitbook from "@/assets/icons/gitbook.svg";
import veraxIcon from "@/assets/logo/verax-icon.svg";
import github from "@/assets/socials/github.svg";
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
    logo: veraxIcon,
    url: "https://ver.ax/",
  },
  {
    title: "Github",
    logo: github,
    url: "https://github.com/Consensys/linea-attestation-registry/tree/dev",
  },
  {
    title: "Documentation",
    logo: gitbook,
    url: "https://docs.ver.ax/verax-documentation/",
  },
];
