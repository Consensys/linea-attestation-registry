import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Attestation, ChainName, Module, Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { generatePath, useNavigate } from "react-router-dom";

import { DataTableProps } from "./interfaces";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NetworkResolver } from "@/utils/networkResolver.ts";

type TRowOriginal = Schema | Attestation | Module;

export function DataTable<TData, TValue>({ columns, data, link, linkParams }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const navigate = useNavigate();

  const trClickHandler = (original: TRowOriginal) => {
    const id = original.id;
    if (!link || !id) return;

    if (original.chainName && !linkParams) {
      const network = NetworkResolver.getNetworkSlugFromChainName(original.chainName as ChainName);
      linkParams = { network };
    }

    const params = { id, ...(linkParams || {}) };

    navigate(generatePath(link, params), {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="rounded-3xl border border-border-table dark:border-blueDark">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-xs not-italic font-normal text-text-quaternary uppercase whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => trClickHandler(row.original as TRowOriginal)}
                data-state={row.getIsSelected() && "selected"}
                className="table-row-transition hover:bg-jumbotronLight dark:hover:bg-jumbotronDark cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap text-text-secondary">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="w-full h-24 !text-center text-text-secondary">
                {t("common.messages.noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
