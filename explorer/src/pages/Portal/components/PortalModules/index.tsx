import { t } from "i18next";
import { useRef } from "react";
import useSWR from "swr";
import { Address } from "viem";

import { DataTable } from "@/components/DataTable";
import { columns, moduleColumnsOption, skeletonModules } from "@/constants/columns/module";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { isNotNullOrUndefined } from "@/utils";

export const PortalModules: React.FC<{ portalModules: Array<Address> }> = ({ portalModules }) => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: retrievedModules, isLoading } = useSWR(
    `${SWRKeys.GET_PORTAL_MODULE_LIST}/${chain.id}`,
    async () => Promise.all(portalModules.map((moduleId) => sdk.module.findOneById(moduleId))),
    {
      shouldRetryOnError: false,
    },
  );
  const modulesList = retrievedModules?.filter(isNotNullOrUndefined);

  const columnsSkeletonRef = useRef(columnsSkeleton(columns(), moduleColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonModules(5) }
    : { columns: columns({ chainId: chain.id }), list: modulesList?.slice(-5).reverse() || [] };

  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p className="text-xl not-italic font-semibold text-text-primary dark:text-whiteDefault">{t("module.title")}</p>
      <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.PORTAL_BY_ID} />
    </div>
  );
};
