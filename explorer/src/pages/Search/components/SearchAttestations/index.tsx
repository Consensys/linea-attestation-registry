import { t } from "i18next";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/attestation";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { loadAttestationList } from "./loadAttestationList";
import { SearchComponentProps } from "../interfaces";
import { SearchWrapper } from "../SearchWrapper";

export const SearchAttestations: React.FC<SearchComponentProps> = ({ getSearchData, parsedString, search }) => {
  const {
    sdk: { attestation },
    network: { chain },
  } = useNetworkContext();

  const { data } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => loadAttestationList(attestation, parsedString),
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (successData) => getSearchData(successData.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!data || !data.length) return null;
  return (
    <SearchWrapper title={t("attestation.title")} items={data.length}>
      <DataTable columns={columns()} data={data} />
    </SearchWrapper>
  );
};
