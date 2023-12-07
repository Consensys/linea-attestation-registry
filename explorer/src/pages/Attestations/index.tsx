import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useState } from "react";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { columns } from "@/constants/columns/attestation";
import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

import { TitleAndSwitcher } from "./components/TitleAndSwitcher";

export const Attestations: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  const totalItems = attestationsCount ?? ZERO;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchParams(searchParams, totalItems);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const [skip, setSkip] = useState<number>(getItemsByPage(page));

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${skip}/${sortByDateDirection}/${chain.id}`,
    () =>
      sdk.attestation.findBy(
        ITEMS_PER_PAGE_DEFAULT,
        skip,
        undefined,
        "attestedDate",
        sortByDateDirection as OrderDirection,
      ),
  );

  const handlePage = (retrievedPage: number) => {
    setSkip(getItemsByPage(retrievedPage));
  };

  return (
    <TitleAndSwitcher>
      {/* TODO: add skeleton for table */}
      <DataTable columns={columns()} data={attestationsList || []} />
      {attestationsCount && <Pagination itemsCount={attestationsCount} handlePage={handlePage} />}
    </TitleAndSwitcher>
  );
};
