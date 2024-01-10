import { ColumnDef } from "@tanstack/react-table";
import { Portal } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { toPortalById } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

import { links } from "../index";

export const columns = ({ chainId }: { chainId: number }): ColumnDef<Portal>[] => [
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
          valueUrl={chainId ? `${links[chainId].address}/${address}` : "#"}
          value={cropString(address)}
          to={toPortalById(id)}
        />
      );
    },
  },
];
