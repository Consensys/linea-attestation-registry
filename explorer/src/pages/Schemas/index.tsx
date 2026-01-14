import { Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { useMemo, useRef, useState } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { columns, schemaColumnsOption, skeletonSchemas } from "@/constants/columns/schema";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { EQueryParams } from "@/enums/queryParams";
import { useNetworkTypeSWR } from "@/hooks/useNetworkTypeSWR";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { mainnets, testnets } from "@/utils";
import { pageBySearchParams } from "@/utils/paginationUtils";

interface UniqueSchema extends Schema {
  networks: string[];
  networkCount: number;
}

export const Schemas: React.FC = () => {
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const { isDarkMode } = useTernaryDarkMode();

  const chainsForQuery = networkType === "mainnet" ? mainnets : testnets;

  const { data: allSchemas, isLoading: isLoadingSchemas } = useNetworkTypeSWR(
    `${SWRKeys.GET_ALL_SCHEMAS}/${chainsForQuery.join(",")}`,
    () => sdk.schema.findByMultiChain(chainsForQuery),
  );

  const uniqueSchemas = useMemo(() => {
    if (!allSchemas) return [];

    const schemasMap = new Map<string, UniqueSchema>();

    allSchemas.forEach((schema: Schema) => {
      if (schemasMap.has(schema.id)) {
        const existingSchema = schemasMap.get(schema.id)!;
        existingSchema.networks.push(schema.chainName!);
        existingSchema.networkCount = existingSchema.networks.length;
      } else {
        schemasMap.set(schema.id, {
          ...schema,
          networks: [schema.chainName!],
          networkCount: 1,
        });
      }
    });

    return Array.from(schemasMap.values());
  }, [allSchemas]);

  const totalItems = uniqueSchemas.length;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchParams(searchParams, totalItems);
  const itemsPerPage = Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT;

  const [currentPage, setCurrentPage] = useState<number>(page);

  const paginatedSchemas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return uniqueSchemas.slice(startIndex, startIndex + itemsPerPage);
  }, [uniqueSchemas, currentPage, itemsPerPage]);

  const handlePage = (retrievedPage: number) => {
    setCurrentPage(retrievedPage);
  };

  const columnsSkeletonRef = useRef(columnsSkeleton(columns({ isDarkMode }), schemaColumnsOption));
  const data = isLoadingSchemas
    ? { columns: columnsSkeletonRef.current, list: skeletonSchemas(itemsPerPage) }
    : { columns: columns({ isDarkMode }), list: paginatedSchemas || [] };

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter text-text-primary dark:text-whiteDefault">
          {t("schema.list.title")}
        </h1>
      </div>
      <div>
        <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.SCHEMA_BY_ID} />
        {Boolean(totalItems) && <Pagination itemsCount={totalItems} handlePage={handlePage} />}
      </div>
    </div>
  );
};
