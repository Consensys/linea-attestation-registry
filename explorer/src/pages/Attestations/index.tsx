import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { numberToHex } from "viem/utils";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { EQueryParams } from "@/enums/queryParams";
import { ETableSorting } from "@/enums/tableSorting";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
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

  const [searchParams] = useSearchParams();

  const totalItems = attestationsCount ?? ZERO;
  const page = pageBySearchParams(searchParams, totalItems);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);
  const itemsPerPage = Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT;

  const [lastID, setLastID] = useState<number>(getItemsByPage(page, itemsPerPage));

  const { data: attestationsList, isLoading } = useSWR(
    totalItems > 0
      ? `${SWRKeys.GET_ATTESTATION_LIST}/${itemsPerPage}/${lastID}/${sortByDateDirection}/${chain.id}`
      : null,
    () =>
      sdk.attestation.findBy(
        itemsPerPage,
        undefined,
        (sortByDateDirection as OrderDirection) === null ||
          (sortByDateDirection as OrderDirection) === undefined ||
          (sortByDateDirection as OrderDirection) === ETableSorting.DESC
          ? { id_lt: numberToHex(totalItems - (page - 1) * itemsPerPage, { size: 32 }) }
          : { id_gt: numberToHex(lastID, { size: 32 }) },
        "attestedDate",
        (sortByDateDirection as OrderDirection) || ETableSorting.DESC,
      ),
  );

  const handlePage = (retrievedPage: number) => {
    setLastID(getItemsByPage(retrievedPage, itemsPerPage));
  };

  const columnsSkeletonRef = useRef(columnsSkeleton(columns(), attestationColumnsOption));

  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonAttestations(itemsPerPage) }
    : { columns: columns({ sdk, chain }), list: attestationsList || [] };

  return (
    <TitleAndSwitcher>
      <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.ATTESTATION_BY_ID} />
      {attestationsCount ? <Pagination itemsCount={attestationsCount} handlePage={handlePage} /> : null}
    </TitleAndSwitcher>
  );
};
