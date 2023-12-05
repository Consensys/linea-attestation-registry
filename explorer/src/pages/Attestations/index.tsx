import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { ListSwitcher } from "./components/ListSwitcher";
import { columns } from "./table/columns";
import { DataTable } from "./table/dataTable";

export const Attestations: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const [searchParams] = useSearchParams();
  const [skip, setSkip] = useState<number>(ZERO);

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

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter zinc-950">Explore Attestations</h1>
      </div>
      <div>
        <ListSwitcher />
        {/* TODO: add skeleton for table */}
        {attestationsList && <DataTable columns={columns} data={attestationsList} />}
        {attestationsCount && <Pagination itemsCount={attestationsCount} handleSkip={setSkip} />}
      </div>
    </div>
  );
};
