"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b flex flex-wrap justify-between items-end gap-4">
        {/* Left - Search Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {table
            .getAllColumns()
            .filter((col) => col.columnDef.meta?.search)
            .map((col) => (
              <Input
                key={col.id}
                placeholder={`Search ${col.id}...`}
                value={(col.getFilterValue() as string) ?? ""}
                onChange={(event) => col.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            ))}
        </div>

        {/* Right - Date Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {table
            .getAllColumns()
            .filter((col) => col.columnDef.meta?.calendar)
            .map((col) => {
              const filterValue = col.getFilterValue() as string | undefined;

              return (
                <Popover key={col.id}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start text-left font-normal"
                    >
                      {(() => {
                        const date = filterValue
                          ? new Date(filterValue)
                          : null;
                        return date && !isNaN(date.getTime())
                          ? format(date, "PPP")
                          : `Filter ${col.id}`;
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filterValue ? new Date(filterValue) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const dateStr = format(date, "yyyy-MM-dd");
                          col.setFilterValue(dateStr);
                        } else {
                          col.setFilterValue(undefined);
                        }
                      }}
                      initialFocus
                    />
                    <div className="flex justify-end px-2 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => col.setFilterValue(undefined)}
                      >
                        Reset
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4 px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
