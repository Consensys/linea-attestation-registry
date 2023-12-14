import { t } from "i18next";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/schema";
import { EQueryParams } from "@/enums/queryParams";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { loadSchemaList } from "./loadSchemaList";
import { SearchWrapper } from "../SearchWrapper";

export const SearchSchemas: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);

  const {
    sdk: { schema },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: schemaList } = useSWR(
    `${SWRKeys.GET_SCHEMAS_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadSchemaList(schema, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!schemaList || !schemaList.length) return null;
  return (
    <SearchWrapper title={t("schema.title")} items={schemaList.length}>
      <DataTable columns={columns()} data={schemaList} />
    </SearchWrapper>
  );
};
