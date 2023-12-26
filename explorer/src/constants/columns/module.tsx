import { ColumnDef } from "@tanstack/react-table";
import { Module } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { ColumnsOptions } from "@/interfaces/components";
import { toModuleById } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, links } from "../index";

interface ColumnsProps {
  chainId: number;
}

export const columns = ({ chainId }: Partial<ColumnsProps> = {}): ColumnDef<Module>[] => [
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
      return (
        <Link to={toModuleById(id)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
          {name}
        </Link>
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

      return (
        <TdHandler
          valueUrl={chainId ? `${links[chainId].address}/${address}` : "#"}
          value={cropString(address)}
          to={toModuleById(id)}
        />
      );
    },
  },
];

export const skeletonModules = (itemPerPage = ITEMS_PER_PAGE_DEFAULT): Array<Module> =>
  Array.from(
    Array(itemPerPage).map((_, index) => ({
      id: index.toString(),
      moduleAddress: `0x${index}`,
      name: EMPTY_STRING,
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
