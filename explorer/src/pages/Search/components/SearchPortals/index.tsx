import { t } from "i18next";
import useSWR from "swr";

import { loadPortalList } from "./loadPortalList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/portal";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const SearchPortals: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search, isDarkMode }) => {
  const {
    sdk: { portal },
  } = useNetworkContext();

  const { networkType } = useNetwork();

  const { data } = useSWR(
    `${SWRKeys.GET_PORTAL_LIST}/${SWRKeys.SEARCH}/${search}`,
    async () => loadPortalList(portal, parsedString, networkType),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;

  return (
    <SearchWrapper title={`${t("portal.title")}${data.length > 1 ? "s" : ""}`} items={data.length}>
      <DataTable columns={columns({ isDarkMode })} data={data} link={APP_ROUTES.PORTAL_BY_ID} />
    </SearchWrapper>
  );
};
