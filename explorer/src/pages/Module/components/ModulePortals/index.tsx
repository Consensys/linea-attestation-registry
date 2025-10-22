import { t } from "i18next";
import { useRef } from "react";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";
import { Address } from "viem";

import { DataTable } from "@/components/DataTable";
import { chains } from "@/config";
import { columns, portalColumnsOption, skeletonPortals } from "@/constants/columns/portal";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { useNetwork } from "@/contexts/NetworkContext";
import { NetworkName } from "@/interfaces/config";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { isNotNullOrUndefined } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver";

export interface ModulePortalsProps {
  moduleId: Address;
  network?: NetworkName | string;
}

export const ModulePortals: React.FC<ModulePortalsProps> = ({ moduleId, network }) => {
  const { getSDKForNetwork } = useNetworkContext();
  const { isDarkMode } = useTernaryDarkMode();
  const { currentNetwork } = useNetwork();

  const resolvedNetwork = network
    ? typeof network === "string" && !Object.values(NetworkName).includes(network as NetworkName)
      ? NetworkResolver.tryParseNetwork(network)
      : (network as NetworkName)
    : currentNetwork;

  if (!resolvedNetwork) {
    throw new Error("Unable to determine network for module portals");
  }

  const networkConfig = chains.find((chain) => chain.network === resolvedNetwork);

  if (!networkConfig) {
    throw new Error(`Network configuration not found for ${resolvedNetwork}`);
  }

  const { data: portals, isLoading } = useSWR(
    `${SWRKeys.GET_MODULE_PORTAL_LIST}/${moduleId}/${resolvedNetwork}`,
    async () => {
      const sdk = getSDKForNetwork(networkConfig);
      const result = await sdk.portal.findBy(undefined, undefined, { modules_contains: [moduleId] });
      const chainNameEnum = NetworkResolver.getChainNameFromNetwork(resolvedNetwork);

      return result.map((portal) => {
        if (portal) {
          return { ...portal, chainName: chainNameEnum };
        }
        return portal;
      });
    },
    {
      shouldRetryOnError: false,
    },
  );

  const columnsSkeletonRef = useRef(columnsSkeleton(columns({ isDarkMode }), portalColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonPortals(5) }
    : { columns: columns({ isDarkMode }), list: portals?.filter(isNotNullOrUndefined) || [] };

  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p className="text-xl not-italic font-semibold text-text-primary dark:text-whiteDefault">{t("portal.title")}</p>
      <DataTable
        columns={data.columns}
        data={data.list}
        link={APP_ROUTES.PORTAL_BY_ID}
        linkParams={{ network: resolvedNetwork }}
      />
    </div>
  );
};
