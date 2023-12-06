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
import { getItemsByPage, pageBySearchparams } from "@/utils/paginationUtils";

import { ListSwitcher } from "./components/ListSwitcher";

export const Attestations: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  const totalItems = attestationsCount ? attestationsCount : ZERO;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchparams(searchParams, totalItems);

  const [skip, setSkip] = useState<number>(getItemsByPage(page));

  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);
  const attester = searchParams.get(EQueryParams.ATTESTER);

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${skip}/${attester}/${sortByDateDirection}/${chain.id}`,
    () =>
      sdk.attestation.findBy(
        ITEMS_PER_PAGE_DEFAULT,
        skip,
        attester ? { attester } : undefined,
        "attestedDate",
        sortByDateDirection as OrderDirection,
      ),
  );

  const handlePage = (retrievedPage: number) => {
    setSkip(getItemsByPage(retrievedPage));
    searchParams.set(EQueryParams.PAGE, retrievedPage.toString());
    window.history.pushState(null, "", `${window.location.pathname}?${searchParams}`);
  };

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter zinc-950">Explore Attestations</h1>
      </div>
      <div>
        <ListSwitcher />
        {/* TODO: add skeleton for table */}
        {attestationsList && <DataTable columns={columns()} data={attestationsList} />}
        {attestationsCount && <Pagination itemsCount={attestationsCount} handlePage={handlePage} />}
      </div>
    </div>
  );
};
