import { ColumnDef } from "@tanstack/react-table";
import { ChainName, Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT } from "../index";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { Tooltip } from "@/components/Tooltip";
import { NETWORK_TOOLTIP_STYLE } from "@/constants/components";
import { ColumnsOptions } from "@/interfaces/components";
import { toSchemaById } from "@/routes/constants";
import { NetworkResolver } from "@/utils/networkResolver.ts";

interface ColumnsProps {
  isDarkMode: boolean;
}

interface SchemaWithNetworks extends Schema {
  networks?: string[];
  networkCount?: number;
}

export const columns = ({ isDarkMode }: ColumnsProps): ColumnDef<SchemaWithNetworks>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="schema" />
        {t("schema.list.columns.name")}
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const id = row.original.id;
      const networks = row.original.networks || (row.original.chainName ? [row.original.chainName] : []);
      const networkCount = row.original.networkCount || networks.length;

      const primaryNetwork = networks[0] as ChainName | undefined;

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
          <Link to={toSchemaById(id)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
            {name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => t("schema.list.columns.description"),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <p className="max-w-[300px] overflow-hidden text-ellipsis">{description}</p>;
    },
  },
  {
    accessorKey: "context",
    cell: ({ row }) => {
      const context = row.getValue("context") as string;
      return <p className="max-w-[300px] overflow-hidden text-ellipsis">{context}</p>;
    },
  },
  {
    accessorKey: "schema",
    header: () => <p className="text-left md:pl-2">{t("schema.list.columns.schema")}</p>,
    cell: ({ row }) => {
      const schema = row.getValue("schema") as string;
      const id = row.original.id;

      return <TdHandler value={schema} to={toSchemaById(id)} isTextLeft />;
    },
  },
];

export const skeletonSchemas = (itemPerPage = ITEMS_PER_PAGE_DEFAULT): Array<Schema> =>
  Array.from(
    Array(itemPerPage).map((_, index) => ({
      id: index.toString(),
      name: EMPTY_STRING,
      description: EMPTY_STRING,
      context: EMPTY_STRING,
      schema: EMPTY_STRING,
      attestationCounter: 0,
    })),
  );

export const schemaColumnsOption: ColumnsOptions = {
  0: {
    width: 200,
  },
  1: {
    width: 300,
  },
  2: {
    width: 282,
  },
  3: {
    width: 200,
  },
};
