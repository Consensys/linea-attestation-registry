import { t } from "i18next";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/portal";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { loadPortalList } from "./loadPortalList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

export const SearchPortals: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search }) => {
  const {
    sdk: { portal },
    network: { chain },
  } = useNetworkContext();

  const { data } = useSWR(
    `${SWRKeys.GET_PORTAL_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadPortalList(portal, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={t("portal.title")} items={data.length}>
      <DataTable columns={columns({ chainId: chain.id })} data={data} link={APP_ROUTES.PORTAL_BY_ID} />
    </SearchWrapper>
  );
};
