import {
  Attestation,
  Attestation_filter,
  Attestation_orderBy,
  ChainName,
  OrderDirection,
} from "@verax-attestation-registry/verax-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { TitleAndSwitcher } from "./components/TitleAndSwitcher";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { BasicPagination } from "@/components/Pagination/Basic";
import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { regexEthAddress } from "@/constants/regex";
import { useNetwork } from "@/contexts/NetworkContext";
import { EQueryParams } from "@/enums/queryParams";
import { ETableSorting } from "@/enums/tableSorting";
import { useNetworkTypeSWR } from "@/hooks/useNetworkTypeSWR";
import { SWRKeys } from "@/interfaces/swr/enum";
import { issuersData } from "@/pages/Home/data";
import { AttestationDefinition } from "@/pages/Home/interface.ts";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { mainnets, testnets } from "@/utils";
import { pageBySearchParams } from "@/utils/paginationUtils";
import { pageToTimestampCursor, storePaginationCursors } from "@/utils/timestampPaginationUtils";

interface CacheEntry {
  count: number;
  timestamp: number;
}

const attestationCountCache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 60000;

export const Attestations: React.FC = () => {
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const { isDarkMode } = useTernaryDarkMode();

  const [searchParams, setSearchParams] = useSearchParams();

  const chainsForQuery = useMemo(() => (networkType === "mainnet" ? mainnets : testnets), [networkType]);

  const countCacheKey = useMemo(
    () => `${networkType}:${[...chainsForQuery].sort().join("|")}`,
    [networkType, chainsForQuery],
  );

  const { data: attestationsCount } = useNetworkTypeSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}`,
    async () => {
      const cachedData = attestationCountCache.get(countCacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
        return cachedData.count;
      }

      const count = await sdk.attestation.getAttestationCountMultiChain(chainsForQuery);

      attestationCountCache.set(countCacheKey, {
        count,
        timestamp: Date.now(),
      });

      return count;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      dedupingInterval: CACHE_DURATION_MS,
    },
  );

  const totalItems = attestationsCount ?? ZERO;
  const page = useMemo(() => pageBySearchParams(searchParams, totalItems), [searchParams, totalItems]);
  const sortByDateDirection = useMemo(() => searchParams.get(EQueryParams.SORT_BY_DATE), [searchParams]);
  const itemsPerPage = useMemo(
    () => Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT,
    [searchParams],
  );

  const [paginationCursor, setPaginationCursor] = useState<{
    currentPage: number;
    currentTimestamp: number | null;
    oldestTimestamp: number | null;
    newestTimestamp: number | null;
  }>({
    currentPage: page,
    currentTimestamp: null,
    oldestTimestamp: null,
    newestTimestamp: null,
  });

  const where = useMemo(() => {
    const whereParam = searchParams.get(EQueryParams.WHERE);
    return whereParam ? (JSON.parse(whereParam) as Attestation_filter) : undefined;
  }, [searchParams]);

  const isByAttestationType = useMemo(() => "schema_" in (where || {}), [where]);
  const isFilteredByWhere = useMemo(
    () => where && (isByAttestationType || where.portal_in?.length),
    [where, isByAttestationType],
  );
  const portalId = useMemo(
    () => (isByAttestationType ? where?.portal_?.id : where?.portal_in?.[0]),
    [isByAttestationType, where],
  );
  const schemaId = useMemo(() => where?.schema_?.id, [where]);

  const issuerData = useMemo(() => {
    const findIssuerBySchema = () =>
      issuersData.find((issuer) =>
        issuer.attestationDefinitions.some(
          (definition) => definition.schema === where?.schema_?.id && definition.portal === where?.portal_?.id,
        ),
      );

    const findIssuerByPortal = () =>
      issuersData.find((issuer) =>
        issuer.attestationDefinitions.some((definition) => where?.portal_in?.includes(definition.portal)),
      );

    const result = isByAttestationType ? findIssuerBySchema() : findIssuerByPortal();
    return {
      name: result?.name || "",
      attestationDefinitions: result?.attestationDefinitions || [],
    };
  }, [where, isByAttestationType]);

  const { name, attestationDefinitions } = issuerData;

  const attestationDefinition = useMemo(() => {
    return attestationDefinitions.find((definition: AttestationDefinition) => definition.schema === where?.schema_?.id);
  }, [attestationDefinitions, where]);

  const attestationName = attestationDefinition?.name || "";
  const attestationPortal = attestationDefinition?.portal || "";

  const isPortalMatch = useMemo(() => portalId === attestationPortal, [portalId, attestationPortal]);

  const { data: portal } = useNetworkTypeSWR(
    isPortalMatch ? null : `${SWRKeys.GET_PORTAL_LIST}`,
    async () => {
      if (portalId && regexEthAddress.byNumberOfChar[42].test(portalId))
        return sdk.portal.findOneById(portalId || EMPTY_STRING);
    },
    { revalidateOnFocus: false },
  );

  const { data: schema } = useNetworkTypeSWR(
    schemaId ? `${SWRKeys.GET_SCHEMA_BY_ID}/${schemaId}` : null,
    async () => {
      if (schemaId && regexEthAddress.byNumberOfChar[64].test(schemaId)) return sdk.schema.findOneById(schemaId);
    },
    { revalidateOnFocus: false },
  );

  const generateTitle = useCallback(() => {
    const titleByAttestationType = isPortalMatch
      ? `${name} - ${attestationName}`
      : `Attestations matching Portal ${portal?.name} for Schema ${schema?.name}`;
    const titleByIssuer = `Attestations from ${name || portal?.ownerName}`;
    return isByAttestationType ? titleByAttestationType : titleByIssuer;
  }, [isPortalMatch, portal, schema, name, attestationName, isByAttestationType]);

  const getPaginationParams = useCallback(() => {
    const { currentTimestamp, oldestTimestamp, newestTimestamp } = paginationCursor;

    if (!currentTimestamp) {
      return { itemsPerPage };
    }

    return pageToTimestampCursor(page, itemsPerPage, {
      currentPage: paginationCursor.currentPage,
      currentTimestamp,
      oldestKnownTimestamp: oldestTimestamp || 0,
      newestKnownTimestamp: newestTimestamp || Date.now(),
    });
  }, [page, itemsPerPage, paginationCursor]);

  const findByMultiChainWithTimestampPagination = useCallback(
    async (
      chainNames: ChainName[],
      paginationParams: {
        itemsPerPage: number;
        beforeTimestamp?: number;
        afterTimestamp?: number;
        estimatedPage?: number;
      },
      whereFilter?: Attestation_filter,
      orderBy?: Attestation_orderBy,
      orderDirection: OrderDirection = "desc",
    ) => {
      const { itemsPerPage, beforeTimestamp, afterTimestamp } = paginationParams;

      const timestampFilter: Attestation_filter = {};
      if (beforeTimestamp) {
        timestampFilter.attestedDate_lt = beforeTimestamp;
      }
      if (afterTimestamp) {
        timestampFilter.attestedDate_gt = afterTimestamp;
      }

      const combinedFilter = { ...whereFilter, ...timestampFilter };

      const networksCount = chainNames.length;
      const queryLimit = itemsPerPage * Math.max(3, networksCount);

      try {
        const allAttestations = await sdk.attestation.findByMultiChain(
          chainNames,
          queryLimit,
          undefined,
          combinedFilter,
          orderBy,
          orderDirection,
        );

        const sortedAttestations = allAttestations.sort((a: Attestation, b: Attestation) => {
          if (orderDirection === "asc") {
            return a.attestedDate - b.attestedDate;
          } else {
            return b.attestedDate - a.attestedDate;
          }
        });

        return sortedAttestations.slice(0, itemsPerPage);
      } catch (_error) {
        return [];
      }
    },
    [sdk],
  );

  const attestationsListKey = useMemo(
    () => (totalItems > 0 ? `${SWRKeys.GET_ATTESTATION_LIST}/${itemsPerPage}/${page}/${sortByDateDirection}` : null),
    [totalItems, itemsPerPage, page, sortByDateDirection],
  );

  const { data: attestationsList, isLoading } = useNetworkTypeSWR(
    attestationsListKey,
    async () => {
      const paginationParams = getPaginationParams();
      return await findByMultiChainWithTimestampPagination(
        chainsForQuery as ChainName[],
        paginationParams,
        where,
        "attestedDate" as Attestation_orderBy,
        (sortByDateDirection as OrderDirection) || ETableSorting.DESC,
      );
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (attestationsList && attestationsList.length) {
      const newCursors = storePaginationCursors(attestationsList, page);
      if (newCursors.currentTimestamp !== paginationCursor.currentTimestamp) {
        setPaginationCursor((prevState) => ({
          ...prevState,
          currentPage: page,
          currentTimestamp: newCursors.currentTimestamp,
          oldestTimestamp: newCursors.oldestTimestamp || prevState.oldestTimestamp,
          newestTimestamp: newCursors.newestTimestamp || prevState.newestTimestamp,
        }));
      }
    }
  }, [attestationsList, page, paginationCursor.currentTimestamp]);

  const handlePage = useCallback(
    (retrievedPage: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(EQueryParams.PAGE, retrievedPage.toString());
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams],
  );

  const memoizedColumns = useMemo(() => columns({ isDarkMode, networkType }), [isDarkMode, networkType]);
  const columnsSkeletonRef = useRef(columnsSkeleton(memoizedColumns, attestationColumnsOption));

  const tableData = useMemo(() => {
    if (isLoading) {
      return {
        columns: columnsSkeletonRef.current,
        list: skeletonAttestations(itemsPerPage),
      };
    }
    return {
      columns: memoizedColumns,
      list: attestationsList || [],
    };
  }, [isLoading, memoizedColumns, attestationsList, itemsPerPage]);

  const paginationComponent = useMemo(() => {
    if (!attestationsCount) return null;

    if (where) {
      return <BasicPagination handlePage={handlePage} />;
    } else {
      return <Pagination itemsCount={attestationsCount} handlePage={handlePage} />;
    }
  }, [attestationsCount, where, handlePage]);

  const titleProps = useMemo(() => {
    return isFilteredByWhere ? { title: generateTitle() } : {};
  }, [isFilteredByWhere, generateTitle]);

  return (
    <TitleAndSwitcher {...titleProps}>
      <DataTable columns={tableData.columns} data={tableData.list} link={APP_ROUTES.ATTESTATION_BY_ID} />
      {paginationComponent}
    </TitleAndSwitcher>
  );
};
