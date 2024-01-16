import { t } from "i18next";

import GitbookIcon from "@/assets/icons/gitbook.svg?react";
import VeraxIcon from "@/assets/logo/verax-icon.svg?react";
import GithubIcon from "@/assets/socials/github.svg?react";
import LensIcon from "@/assets/socials/lens.svg?react";
import TwitterXIcon from "@/assets/socials/twitter-x.svg?react";
import { Info } from "@/components/NavigationList/components/Info";
import { IInfoListItem, NavigationProps, SearchElementProps } from "@/interfaces/components";
import { APP_ROUTES } from "@/routes/constants";

export const DEFAULT_ROUTES: Array<NavigationProps> = [
  {
    name: t("common.routes.attestations"),
    route: APP_ROUTES.ATTESTATIONS,
  },
  {
    name: t("common.routes.schemas"),
    route: APP_ROUTES.SCHEMAS,
  },
  {
    name: t("common.routes.modules"),
    route: APP_ROUTES.MODULES,
  },
  {
    name: t("common.routes.info.title"),
    submenu: <Info />,
  },
];

export const INFO_LIST: IInfoListItem[] = [
  {
    title: t("common.routes.info.about"),
    logo: VeraxIcon,
    url: "https://ver.ax/",
  },
  {
    title: t("common.routes.info.twitter"),
    logo: TwitterXIcon,
    url: "https://twitter.com/VeraxRegistry",
  },
  {
    title: t("common.routes.info.lens"),
    logo: LensIcon,
    url: "https://share.lens.xyz/u/lens/verax.lens",
  },
  {
    title: t("common.routes.info.github"),
    logo: GithubIcon,
    url: "https://github.com/Consensys/linea-attestation-registry/tree/dev",
  },
  {
    title: t("common.routes.info.documentation"),
    logo: GitbookIcon,
    url: "https://docs.ver.ax/verax-documentation/",
  },
];

export const DEFAULT_SEARCH_ELEMENTS: SearchElementProps = {
  attestation: { count: 0, loaded: false },
  schema: { count: 0, loaded: false },
  module: { count: 0, loaded: false },
  //todo add SearchPortal
  portal: { count: 0, loaded: true },
};
