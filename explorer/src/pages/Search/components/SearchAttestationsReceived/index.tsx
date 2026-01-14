import { t } from "i18next";

import { loadAttestationReceivedList } from "./loadAttestationReceivedList.ts";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/attestation";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { EQueryParams } from "@/enums/queryParams.ts";
import { useNetworkTypeSWR } from "@/hooks/useNetworkTypeSWR";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const SearchAttestationsReceived: React.FC<SearchComponentProps> = ({
  getSearchData,
  parsedString,
  search,
  isDarkMode,
}) => {
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();

  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { data } = useNetworkTypeSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${SWRKeys.SEARCH}/${search}/${sortByDateDirection}`,
    async () => loadAttestationReceivedList(sdk.attestation, parsedString, sortByDateDirection, networkType),
    {
      shouldRetryOnError: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={t("attestation.received")} items={data.length}>
      <DataTable columns={columns({ isDarkMode, networkType })} data={data} link={APP_ROUTES.ATTESTATION_BY_ID} />
    </SearchWrapper>
  );
};
