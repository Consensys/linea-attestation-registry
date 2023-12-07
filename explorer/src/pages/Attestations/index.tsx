import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";

import { Pagination } from "@/components/Pagination";
import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { columns } from "@/constants/columns/attestation";
import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

import { ListSwitcher } from "./components/ListSwitcher";
import { MyAttestations } from "./components/MyAttestations";
import { DataTable } from "./table/dataTable";

export const Attestations: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();
  const { address } = useAccount();

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  const totalItems = attestationsCount ?? ZERO;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchParams(searchParams, totalItems);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);
  const isMyAttestations = searchParams.get(EQueryParams.SHOW_MY_ATTESTATIONS);

  const [skip, setSkip] = useState<number>(getItemsByPage(page));

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${skip}/${isMyAttestations ? address : EMPTY_STRING}/${sortByDateDirection}/${
      chain.id
    }`,
    () =>
      sdk.attestation.findBy(
        ITEMS_PER_PAGE_DEFAULT,
        skip,
        isMyAttestations ? { attester: address } : undefined,
        "attestedDate",
        sortByDateDirection as OrderDirection,
      ),
  );

  const handlePage = (retrievedPage: number) => {
    setSkip(getItemsByPage(retrievedPage));
  };

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter zinc-950">Explore Attestations</h1>
      </div>
      <div>
        <ListSwitcher />
        {/* TODO: add skeleton for table */}
        <MyAttestations attestationsList={attestationsList} />
        {!isMyAttestations && (
          <>
            <DataTable columns={columns()} data={attestationsList || []} />
            {attestationsCount && <Pagination itemsCount={attestationsCount} handlePage={handlePage} />}
          </>
        )}
      </div>
    </div>
  );
};
