import { ColumnDef } from "@tanstack/react-table";
import { ChainName, Module } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, ZERO_ADDRESS } from "../index";

import LineaMainnetIconDark from "@/assets/networks/linea-dark.svg?react";
import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { Tooltip } from "@/components/Tooltip";
import { chains } from "@/config";
import { NETWORK_TOOLTIP_STYLE } from "@/constants/components";
import { ColumnsOptions } from "@/interfaces/components";
import { NetworkName } from "@/interfaces/config";
import { toModuleById } from "@/routes/constants";
import { getBlockExplorerLink } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver.ts";
import { cropString } from "@/utils/stringUtils";

interface ColumnsProps {
  isDarkMode: boolean;
}

export const columns = ({ isDarkMode }: ColumnsProps): ColumnDef<Module>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="module" />
        {t("module.list.columns.name")}
      </div>
    ),
    cell: ({ row }) => {
      const { name, id } = row.original;
      const chainName = row.original.chainName as ChainName;
      const network = NetworkResolver.getNetworkSlugFromChainName(chainName);
      const networkName = NetworkResolver.getNetworkNameFromChainName(chainName);

      return (
        <div className="flex space-x-2 items-center">
          <Tooltip
            content={<div style={NETWORK_TOOLTIP_STYLE}>{networkName}</div>}
            placement="top"
            isDarkMode={isDarkMode}
            minWidth="auto"
            compact
          >
            <div className="w-[24px]">{NetworkResolver.getNetworkLogoByChainName(chainName, isDarkMode)}</div>
          </Tooltip>
          <Link to={toModuleById(id, network)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
            {name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => t("module.list.columns.description"),
    cell: ({ row }) => <p className="max-w-[400px] overflow-hidden text-ellipsis">{row.original.description}</p>,
  },
  {
    accessorKey: "moduleAddress",
    header: () => <p className="text-right">{t("module.list.columns.contractAddress")}</p>,
    cell: ({ row }) => {
      const address = row.original.moduleAddress;
      const id = row.original.id;
      const chainName = row.original.chainName as ChainName;
      const network = NetworkResolver.getNetworkSlugFromChainName(chainName);
      const networkConfig = chains.find((chain) => chain.network === network);
      const blockExplorerLink = networkConfig ? getBlockExplorerLink(networkConfig.chain) : "";

      return (
        <TdHandler
          valueUrl={`${blockExplorerLink}/${address}`}
          value={cropString(address)}
          to={toModuleById(id, network)}
        />
      );
    },
  },
];

export const skeletonModules = (itemPerPage = ITEMS_PER_PAGE_DEFAULT): Array<Module> =>
  Array.from(
    Array(itemPerPage).map(() => ({
      network: <LineaMainnetIconDark />,
      id: ZERO_ADDRESS,
      moduleAddress: ZERO_ADDRESS,
      name: NetworkName.LINEA,
      description: EMPTY_STRING,
    })),
  );

export const moduleColumnsOption: ColumnsOptions = {
  0: {
    minWidth: 111,
    maxWidth: 171,
    isRandomWidth: true,
  },
  1: {
    minWidth: 137,
    maxWidth: 350,
    isRandomWidth: true,
  },
  2: {
    width: 92,
  },
};
