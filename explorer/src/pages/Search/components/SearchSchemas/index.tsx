import { t } from "i18next";
import useSWR from "swr";

import { loadSchemaList } from "./loadSchemaList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/schema";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const SearchSchemas: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search, isDarkMode }) => {
  const {
    sdk: { schema },
  } = useNetworkContext();

  const { networkType } = useNetwork();

  const { data } = useSWR(
    `${SWRKeys.GET_SCHEMAS_LIST}/${SWRKeys.SEARCH}/${search}`,
    async () => loadSchemaList(schema, parsedString, networkType),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={`${t("schema.title")}${data.length > 1 ? "s" : ""}`} items={data.length}>
      <DataTable columns={columns({ isDarkMode })} data={data} link={APP_ROUTES.SCHEMA_BY_ID} />
    </SearchWrapper>
  );
};
