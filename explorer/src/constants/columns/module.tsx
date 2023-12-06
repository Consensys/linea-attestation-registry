import { ColumnDef } from "@tanstack/react-table";
import { Module } from "@verax-attestation-registry/verax-sdk";

import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { toModuleById } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

import { links } from "../index";

export const columns = (): ColumnDef<Module>[] => [
  {
    accessorKey: "id",
    header: () => "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Link to={toModuleById(id)} className="hover:underline hover:text-text-quaternary">
          {cropString(id)}
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="module" />
        Module Name
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return name;
    },
  },
  {
    accessorKey: "description",
    header: () => "Module Description",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return <p className="max-w-[400px] overflow-hidden text-ellipsis">{description as string}</p>;
    },
  },
  {
    accessorKey: "moduleAddress",
    header: () => <p className="text-right">Contract Address</p>,
    cell: ({ row }) => {
      const address = row.getValue("moduleAddress") as string;
      return (
        <a
          href={`${links.lineascan.address}/${address}`}
          target="_blank"
          className="hover:underline hover:text-text-quaternary"
        >
          {cropString(address)}
        </a>
      );
    },
  },
];
