import { t } from "i18next";
import { useRef, useState } from "react";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { columns, moduleColumnsOption, skeletonModules } from "@/constants/columns/module";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

export const Modules: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();
  const { data: modulesCount } = useSWR(
    `${SWRKeys.GET_MODULE_COUNT}/${chain.id}`,
    () => sdk.module.getModulesNumber() as Promise<bigint>,
  );

  const totalItems = modulesCount ? Number(modulesCount) : ZERO;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchParams(searchParams, totalItems);
  const itemsPerPage = Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT;

  const [skip, setSkip] = useState<number>(getItemsByPage(page, itemsPerPage));

  const { data: modulesList, isLoading } = useSWR(
    `${SWRKeys.GET_MODULE_LIST}/${itemsPerPage}/${skip}/${chain.id}`,
    () => sdk.module.findBy(itemsPerPage, skip),
  );

  const handlePage = (retrievedPage: number) => {
    setSkip(getItemsByPage(retrievedPage, itemsPerPage));
  };

  const columnsSkeletonRef = useRef(columnsSkeleton(columns(), moduleColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonModules(itemsPerPage) }
    : { columns: columns({ chainId: chain.id }), list: modulesList || [] };

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter text-text-primary dark:text-whiteDefault">
          {t("module.list.title")}
        </h1>
      </div>
      <div>
        <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.MODULES_BY_ID} />
        {Boolean(modulesCount) && <Pagination itemsCount={totalItems} handlePage={handlePage} />}
      </div>
    </div>
  );
};
