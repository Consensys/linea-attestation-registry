import { t } from "i18next";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/attestation";
import { EQueryParams } from "@/enums/queryParams.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { loadAttestationReceivedList } from "./loadAttestationReceivedList.ts";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

export const SearchAttestationsReceived: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search }) => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { data } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}/${sortByDateDirection}`,
    async () => loadAttestationReceivedList(sdk.attestation, parsedString, sortByDateDirection),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={t("attestation.received")} items={data.length}>
      <DataTable columns={columns({ chain })} data={data} link={APP_ROUTES.ATTESTATION_BY_ID} />
    </SearchWrapper>
  );
};
