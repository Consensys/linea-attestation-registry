import { ColumnDef } from "@tanstack/react-table";
import { Portal } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { Chain } from "viem";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { EMPTY_0X_STRING, EMPTY_STRING, ZERO } from "@/constants";
import { toPortalById } from "@/routes/constants";
import { getBlockExplorerLink } from "@/utils";
import { cropString } from "@/utils/stringUtils";

export const columns = ({ chain }: { chain: Chain }): ColumnDef<Portal>[] => [
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

      return (
        <Link to={toPortalById(id)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
          {name}
        </Link>
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

      return (
        <TdHandler
          valueUrl={chain ? `${getBlockExplorerLink(chain)}/${address}` : "#"}
          value={cropString(address)}
          to={toPortalById(id)}
        />
      );
    },
  },
];

export const portalColumnsOption = {
  name: {
    width: "25%",
  },
  description: {
    width: "50%",
  },
  owner: {
    width: "25%",
  },
};

export const skeletonPortals = (count: number) =>
  Array(count)
    .fill(null)
    .map((_, index) => ({
      id: `0x${index.toString(16).padStart(40, "0")}` as `0x${string}`,
      name: EMPTY_STRING,
      description: EMPTY_STRING,
      ownerAddress: `${EMPTY_0X_STRING}${"0".repeat(40)}` as `0x${string}`,
      ownerName: EMPTY_STRING,
      modules: [] as `0x${string}`[],
      isRevocable: false,
      attestationCounter: ZERO,
    }));
