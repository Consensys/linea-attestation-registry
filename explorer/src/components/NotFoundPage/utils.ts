import { t } from "i18next";
import { Hex, hexToNumber } from "viem";

import { BILLION, EMPTY_STRING } from "@/constants";
import { Page } from "@/interfaces/components";
import { APP_ROUTES } from "@/routes/constants";
import { removeCommas } from "@/utils/stringUtils";

export const getNotFoundPageData = <PageType extends Page>(
  page: PageType,
  data?: string,
): { id: string | number; showId: boolean; title: string; to: string } => {
  const props = { showId: Boolean(data), id: data || EMPTY_STRING };
  switch (page) {
    case "attestation": {
      if (!data)
        return {
          ...props,
          title: t("attestation.title"),
          to: APP_ROUTES.ATTESTATIONS,
        };
      const decodedId = hexToNumber(data as Hex);
      const showId =
        !isNaN(decodedId) &&
        removeCommas(BILLION.toLocaleString()).length > removeCommas(decodedId.toLocaleString()).length;
      return {
        title: showId ? t("attestation.list.columns.id") : t("attestation.title"),
        id: decodedId,
        showId: showId,
        to: APP_ROUTES.ATTESTATIONS,
      };
    }
    case "schema": {
      return {
        ...props,
        title: t("schema.title"),
        to: APP_ROUTES.SCHEMAS,
      };
    }
    case "portal": {
      return {
        ...props,
        title: "Portal",
        to: APP_ROUTES.MODULES,
      };
    }
    default:
      return {
        ...props,
        title: "Page",
        to: APP_ROUTES.HOME,
      };
  }
};
