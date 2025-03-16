'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/types/hotel"; // Adjust path based on where your types are stored
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // Helper function for conditional classNames

export const columns: ColumnDef<Hotel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Hotel Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "pricePerNight",
    header: "Price Per Night",
    cell: ({ row }) => <span>${row.getValue("pricePerNight")}</span>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="text-yellow-500 font-medium">{row.getValue("rating")} ★</span>
    ),
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <Badge variant={row.getValue("featured") ? "default" : "secondary"}>
        {row.getValue("featured") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPpp"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        className="text-sm text-blue-500 hover:underline"
        onClick={() => console.log("Edit", row.original.id)}
      >
        Edit
      </button>
    ),
  },
];
