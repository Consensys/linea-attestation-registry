import { t } from "i18next";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/module";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { loadModuleList } from "./loadModuleList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

export const SearchModules: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search, isDarkMode }) => {
  const {
    sdk: { module },
  } = useNetworkContext();

  const { networkType } = useNetwork();

  const { data } = useSWR(
    `${SWRKeys.GET_MODULE_LIST}/${SWRKeys.SEARCH}/${search}`,
    async () => loadModuleList(module, parsedString, networkType),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;

  return (
    <SearchWrapper title={`${t("module.title")}${data.length > 1 ? "s" : ""}`} items={data.length}>
      <DataTable columns={columns({ isDarkMode })} data={data} link={APP_ROUTES.MODULE_BY_ID} />
    </SearchWrapper>
  );
};
