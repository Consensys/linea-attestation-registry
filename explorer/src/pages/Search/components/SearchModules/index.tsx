import { t } from "i18next";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/module";
import { EQueryParams } from "@/enums/queryParams";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { loadModuleList } from "./loadModuleList";
import { SearchWrapper } from "../SearchWrapper";

export const SearchModules: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);

  const {
    sdk: { module },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: moduleList } = useSWR(
    `${SWRKeys.GET_MODULE_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadModuleList(module, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!moduleList || !moduleList.length) return null;
  return (
    <SearchWrapper title={t("module.title")} items={moduleList.length}>
      <DataTable columns={columns()} data={moduleList} />
    </SearchWrapper>
  );
};
