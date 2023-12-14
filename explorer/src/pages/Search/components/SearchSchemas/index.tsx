import { t } from "i18next";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/schema";
import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { loadSchemaList } from "./loadSchemaList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

export const SearchSchemas: React.FC<SearchComponentProps> = ({ getSearchData, parsedString }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);

  const {
    sdk: { schema },
    network: { chain },
  } = useNetworkContext();

  const { data } = useSWR(
    `${SWRKeys.GET_SCHEMAS_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadSchemaList(schema, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={t("schema.title")} items={data.length}>
      <DataTable columns={columns()} data={data} />
    </SearchWrapper>
  );
};
