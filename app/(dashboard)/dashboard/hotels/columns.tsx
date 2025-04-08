"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Hotel } from "@/types/hotel"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


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
    meta: {
      search: true
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.image}
          alt={row.getValue("name")}
          className="h-8 w-8 rounded-full object-cover"
        />
        <Link href={`/dashboard/hotels/${row.original.id}/rooms`}> <span className="font-medium">{row.getValue("name")}</span></Link>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="text-yellow-500 font-medium">
        {row.getValue("rating")} ★
      </span>
    ),
  },
  {
    accessorKey: "_count.rooms",
    header: "Rooms",
    cell: ({ row }) => {
      const count = row.original._count?.rooms ?? 0
      return <div>{count}</div>
    },
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
    cell: ({ row }) => {
      const dateStr = row.getValue("createdAt") as string
      if (!dateStr) return null
      const date = new Date(dateStr)
      return date.toLocaleString()
    },
  },
  {

    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();

      const deleteHotel = useMutation({
        mutationFn: async (id: string) => {
          await axios.delete("/api/dashboard/hotels", { data: { id } });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["hotels"]
          });
        },
      });

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/hotels/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/hotels/edit/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this hotel?")) {
                deleteHotel.mutate(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
]
