import { ColumnDef } from "@tanstack/react-table";
import { ChainName, Portal } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { Tooltip } from "@/components/Tooltip";
import { chains } from "@/config";
import { EMPTY_STRING, ZERO, ZERO_ADDRESS } from "@/constants";
import { NETWORK_TOOLTIP_STYLE } from "@/constants/components";
import { ColumnsOptions } from "@/interfaces/components";
import { toPortalById } from "@/routes/constants";
import { getBlockExplorerLink } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver.ts";
import { cropString } from "@/utils/stringUtils";

interface ColumnsProps {
  isDarkMode: boolean;
}

interface PortalWithNetworks extends Portal {
  networks?: string[];
  networkCount?: number;
}

export const columns = ({ isDarkMode }: ColumnsProps): ColumnDef<PortalWithNetworks>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="portal" />
        {t("portal.list.columns.name")}
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const id = row.original.id;
      const networks = row.original.networks || (row.original.chainName ? [row.original.chainName] : []);
      const networkCount = row.original.networkCount || networks.length;

      const primaryNetwork = networks[0] as ChainName | undefined;
      const network = primaryNetwork ? NetworkResolver.getNetworkSlugFromChainName(primaryNetwork) : undefined;

      return (
        <div className="flex space-x-2 items-center">
          <div className="flex items-center">
            {primaryNetwork && (
              <Tooltip
                content={
                  <div style={NETWORK_TOOLTIP_STYLE}>{NetworkResolver.getNetworkNameFromChainName(primaryNetwork)}</div>
                }
                placement="top"
                isDarkMode={isDarkMode}
                minWidth="auto"
                compact
              >
                <div className="w-[24px]">{NetworkResolver.getNetworkLogoByChainName(primaryNetwork, isDarkMode)}</div>
              </Tooltip>
            )}
            {networkCount > 1 && (
              <div className="ml-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5">
                +{networkCount - 1}
              </div>
            )}
          </div>
          {network ? (
            <Link to={toPortalById(id, network)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => t("portal.list.columns.description"),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <p className="max-w-[300px] overflow-hidden text-ellipsis">{description}</p>;
    },
  },
  {
    accessorKey: "owner",
    header: () => <p>{t("portal.list.columns.owner")}</p>,
    cell: ({ row }) => {
      const address = row.original.ownerAddress;
      const id = row.original.id;
      const networks = row.original.networks || (row.original.chainName ? [row.original.chainName] : []);
      const primaryNetwork = networks[0] as ChainName | undefined;
      const network = primaryNetwork ? NetworkResolver.getNetworkSlugFromChainName(primaryNetwork) : undefined;

      const networkConfig = network ? chains.find((chain) => chain.network === network) : undefined;
      const blockExplorerLink = networkConfig ? getBlockExplorerLink(networkConfig.chain) : "";

      return (
        <TdHandler
          valueUrl={blockExplorerLink ? `${blockExplorerLink}/${address}` : undefined}
          value={cropString(address)}
          to={network ? toPortalById(id, network) : ""}
        />
      );
    },
  },
];

export const portalColumnsOption: ColumnsOptions = {
  0: {
    minWidth: 150,
    maxWidth: 200,
    isRandomWidth: true,
  },
  1: {
    minWidth: 200,
    maxWidth: 400,
    isRandomWidth: true,
  },
  2: {
    width: 150,
  },
};

export const skeletonPortals = (count: number) =>
  Array(count)
    .fill(null)
    .map(() => ({
      id: ZERO_ADDRESS,
      name: EMPTY_STRING,
      description: EMPTY_STRING,
      ownerAddress: ZERO_ADDRESS,
      ownerName: EMPTY_STRING,
      modules: [],
      isRevocable: false,
      attestationCounter: ZERO,
    }));
