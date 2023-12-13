import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { columns } from "@/constants/columns/attestation";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { SearchWrapper } from "../SearchWrapper";

export const SearchAttestations: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const { search } = useParams();
  const {
    sdk: { attestation },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => {
      const [listByAddress] = parsedString.address
        ? await Promise.all(
            parsedString.address.map(async (address) => {
              const attestationResults = await attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
                attester_contains: address,
              });
              const subjectResults = await attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
                subject_contains: address,
              });
              return { attestationResults, subjectResults };
            }),
          )
        : [];

      const [listByIds] = parsedString.attestationIds
        ? await Promise.all(
            parsedString.attestationIds.map((id) => attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { id })),
          )
        : [];

      const listBySchemaString = parsedString.schemaString
        ? await attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { schemaString: parsedString.schemaString })
        : [];

      const result = [
        ...(listByIds || []),
        ...(listByAddress?.attestationResults || []),
        ...(listByAddress?.subjectResults || []),
        ...(listBySchemaString || []),
      ];
      return result;
    },
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!attestationsList || !attestationsList.length) return null;
  return (
    <SearchWrapper title="Attestations" items={attestationsList.length}>
      <DataTable columns={columns({ sortByDate: false })} data={attestationsList} />
    </SearchWrapper>
  );
};
