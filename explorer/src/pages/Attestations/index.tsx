import { Attestation_filter, OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { Address, isAddress } from "viem";

import { DataTable } from "@/components/DataTable";
import { EnsNameDisplay } from "@/components/EnsNameDisplay";
import { Pagination } from "@/components/Pagination";
import { BasicPagination } from "@/components/Pagination/Basic";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { EQueryParams } from "@/enums/queryParams";
import { ETableSorting } from "@/enums/tableSorting";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { buildAttestationId } from "@/utils/attestationIdUtils.ts";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

import { TitleAndSwitcher } from "./components/TitleAndSwitcher";

export const Attestations: React.FC = () => {
  const { sdk, network } = useNetworkContext();

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${network.chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  const [searchParams] = useSearchParams();

  const totalItems = attestationsCount ?? ZERO;
  const page = pageBySearchParams(searchParams, totalItems);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);
  const itemsPerPage = Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT;
  const where = searchParams.get(EQueryParams.WHERE)
    ? (JSON.parse(searchParams.get(EQueryParams.WHERE) ?? "") as Attestation_filter)
    : undefined;

  const [lastID, setLastID] = useState<number>(getItemsByPage(page, itemsPerPage));

  const { data: attestationsList, isLoading } = useSWR(
    totalItems > 0
      ? `${SWRKeys.GET_ATTESTATION_LIST}/${itemsPerPage}/${lastID}/${sortByDateDirection}/${network.chain.id}`
      : null,
    () =>
      sdk.attestation.findBy(
        itemsPerPage,
        undefined,
        {
          ...where,
          ...((sortByDateDirection as OrderDirection) === null ||
          (sortByDateDirection as OrderDirection) === undefined ||
          (sortByDateDirection as OrderDirection) === ETableSorting.DESC
            ? { id_lte: buildAttestationId(totalItems - (page - 1) * itemsPerPage, network.prefix) }
            : { id_gt: buildAttestationId(lastID, network.prefix) }),
        },
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
    : { columns: columns({ chain: network.chain }), list: attestationsList || [] };

  const attestationTableData = useMemo(() => {
    return data.list.map((attestation) => {
      if (!attestation || !attestation.subject) {
        return attestation;
      }

      const isValidAddress = isAddress(attestation.subject);

      return {
        ...attestation,
        subject: isValidAddress ? <EnsNameDisplay address={attestation.subject as Address} /> : attestation.subject,
      };
    });
  }, [data.list]);

  const renderPagination = () => {
    if (attestationsCount) {
      if (where) {
        return <BasicPagination handlePage={handlePage} />;
      } else {
        return <Pagination itemsCount={attestationsCount} handlePage={handlePage} />;
      }
    } else {
      return null;
    }
  };

  return (
    <TitleAndSwitcher>
      <DataTable columns={data.columns} data={attestationTableData} link={APP_ROUTES.ATTESTATION_BY_ID} />
      {renderPagination()}
    </TitleAndSwitcher>
  );
};
