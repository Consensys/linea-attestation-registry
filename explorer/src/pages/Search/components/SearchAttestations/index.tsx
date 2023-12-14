import { t } from "i18next";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/attestation";
import { EQueryParams } from "@/enums/queryParams";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { loadAttestationList } from "./loadAttestationList";
import { SearchWrapper } from "../SearchWrapper";

export const SearchAttestations: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);

  const {
    sdk: { attestation },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: attestationList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadAttestationList(attestation, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!attestationList || !attestationList.length) return null;
  return (
    <SearchWrapper title={t("attestation.title")} items={attestationList.length}>
      <DataTable columns={columns({ sortByDate: false })} data={attestationList} />
    </SearchWrapper>
  );
};
