import { t } from "i18next";
import { useRef } from "react";
import useSWR from "swr";
import { Address } from "viem";

import { DataTable } from "@/components/DataTable";
import { columns, portalColumnsOption, skeletonPortals } from "@/constants/columns/portal";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { isNotNullOrUndefined } from "@/utils";

export const ModulePortals: React.FC<{ moduleId: Address }> = ({ moduleId }) => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: portals, isLoading } = useSWR(
    `${SWRKeys.GET_MODULE_PORTAL_LIST}/${moduleId}/${chain.id}`,
    async () => {
      const allPortals = await sdk.portal.findBy(100, 0);
      const portalList = allPortals.filter((portal) => portal.modules.includes(moduleId));
      return portalList.slice(0, 5).map((portal) => ({
        ...portal,
        id: portal.id as `0x${string}`,
      }));
    },
    {
      shouldRetryOnError: false,
    },
  );

  const columnsSkeletonRef = useRef(columnsSkeleton(columns({ chain }), portalColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonPortals(5) }
    : { columns: columns({ chain }), list: portals?.filter(isNotNullOrUndefined) || [] };

  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p className="text-xl not-italic font-semibold text-text-primary dark:text-whiteDefault">{t("portal.title")}</p>
      <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.PORTAL_BY_ID} />
    </div>
  );
};
