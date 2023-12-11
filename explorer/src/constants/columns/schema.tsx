import { ColumnDef } from "@tanstack/react-table";
import { Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";

import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { toSchemaById } from "@/routes/constants";

export const columns = (): ColumnDef<Schema>[] => [
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

      return (
        <Link to={toSchemaById(id)} className="hover:underline hover:text-text-quaternary">
          {name}
        </Link>
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
      return <p className="max-w-[300px] overflow-hidden text-ellipsis text-left w-full">{schema}</p>;
    },
  },
];
