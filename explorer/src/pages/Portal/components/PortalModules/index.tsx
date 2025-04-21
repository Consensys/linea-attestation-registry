import { t } from "i18next";
import { useRef } from "react";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";
import { Address } from "viem";

import { DataTable } from "@/components/DataTable";
import { chains } from "@/config";
import { columns, moduleColumnsOption, skeletonModules } from "@/constants/columns/module";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { useNetwork } from "@/contexts/NetworkContext";
import { NetworkName } from "@/interfaces/config";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { isNotNullOrUndefined } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver";

export interface PortalModulesProps {
  portalModules: Array<Address>;
  network?: NetworkName | string;
}

export const PortalModules: React.FC<PortalModulesProps> = ({ portalModules, network }) => {
  const { getSDKForNetwork } = useNetworkContext();
  const { isDarkMode } = useTernaryDarkMode();
  const { currentNetwork } = useNetwork();

  const resolvedNetwork = network
    ? typeof network === "string" && !Object.values(NetworkName).includes(network as NetworkName)
      ? NetworkResolver.tryParseNetwork(network)
      : (network as NetworkName)
    : currentNetwork;

  if (!resolvedNetwork) {
    throw new Error("Unable to determine the network for the Portal Modules");
  }

  const networkConfig = chains.find((chain) => chain.network === resolvedNetwork);

  if (!networkConfig) {
    throw new Error(`Network config not found for ${resolvedNetwork}`);
  }

  const { data: retrievedModules, isLoading } = useSWR(
    `${SWRKeys.GET_PORTAL_MODULE_LIST}/${resolvedNetwork}`,
    async () => {
      const sdk = getSDKForNetwork(networkConfig);
      const modules = await Promise.all(portalModules.map((moduleId) => sdk.module.findOneById(moduleId)));
      const chainNameEnum = NetworkResolver.getChainNameFromNetwork(resolvedNetwork);

      return modules.map((module) => {
        if (module) {
          return { ...module, chainName: chainNameEnum };
        }
        return module;
      });
    },
    {
      shouldRetryOnError: false,
    },
  );

  const modulesList = retrievedModules?.filter(isNotNullOrUndefined);

  const columnsSkeletonRef = useRef(columnsSkeleton(columns({ isDarkMode }), moduleColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonModules(5) }
    : { columns: columns({ isDarkMode }), list: modulesList?.slice(-5).reverse() || [] };

  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p className="text-xl not-italic font-semibold text-text-primary dark:text-whiteDefault">{t("module.title")}</p>
      <DataTable
        columns={data.columns}
        data={data.list}
        link={APP_ROUTES.MODULE_BY_ID}
        linkParams={{ network: resolvedNetwork }}
      />
    </div>
  );
};
