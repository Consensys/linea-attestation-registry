import { Hex, hexToNumber } from "viem";

import { BILLION, EMPTY_STRING } from "@/constants";
import { Page } from "@/interfaces/components";
import { removeCommas } from "@/utils/stringUtils";

export const getNotFoundPageData = <PageType extends Page>(
  page: PageType,
  data?: string,
): { id: string | number; showId: boolean; title: string } => {
  const props = { showId: Boolean(data), id: data || EMPTY_STRING };
  switch (page) {
    case "attestation": {
      if (!data)
        return {
          ...props,
          title: "Attestation",
        };
      const decodedId = hexToNumber(data as Hex);
      const showId =
        !isNaN(decodedId) &&
        removeCommas(BILLION.toLocaleString()).length > removeCommas(decodedId.toLocaleString()).length;
      return {
        title: showId ? "Attestation ID" : "Attestation",
        id: decodedId,
        showId: showId,
      };
    }
    case "schema": {
      return {
        ...props,
        title: "Schema",
      };
    }
    case "portal": {
      return {
        ...props,
        title: "Portal",
      };
    }
    default:
      return {
        ...props,
        title: "Page",
      };
  }
};
