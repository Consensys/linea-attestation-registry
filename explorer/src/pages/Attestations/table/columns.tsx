import { Address } from "viem";
import { hexToNumber } from "viem/utils";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { cropString } from "@/utils/stringUtils";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { HelperIndicator } from "@/components/HelperIndicator";
import { toAttestationById } from "@/routes/constants";
import { getTimeAgo } from "@/utils/dateUtils";
import { SortByDate } from "./components/SortByDate";

export const columns: ColumnDef<Attestation>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="attestation" />
        Attestation ID
      </div>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <Link
          to={toAttestationById(id as string)}
          className="text-text-secondary hover:underline hover:text-text-secondary"
        >
          {displayAmountWithComma(hexToNumber(id as Address))}
        </Link>
      );
    },
  },
  {
    accessorKey: "portal",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="portal" />
        Portal
      </div>
    ),
    cell: ({ row }) => cropString(row.getValue("portal")),
  },
  {
    accessorKey: "schemaString",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="schema" />
        Schema
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    // TODO: add link to lineascan
    cell: ({ row }) => cropString(row.getValue("subject")),
  },
  {
    accessorKey: "attestedDate",
    header: () => <SortByDate />,
    cell: ({ row }) => {
      const date: number = row.getValue("attestedDate");
      return getTimeAgo(date);
    },
  },
];
