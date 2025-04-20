"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/types/hotel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Booking } from "@/types/bookings";
interface BookingColumnMeta {
  search?: boolean;
  calendar?: boolean;
}

export const columns: ColumnDef<Booking, unknown>[] = [
  {
    accessorKey: "name",
    header: "username",
    meta: {
      search: true,
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h2>{row.original.user.name}</h2>
      </div>
    ),
  },
  {
    accessorKey: "hotel.name",
    header: "Hotel Name",
    cell: ({ row }) => (
      <Link href={row.original.hotel.name}>{row.original.hotel.name}</Link>
    ),
  },
  {
    accessorKey: "hotel.rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="text-yellow-500 font-medium">
        {row.original.hotel.rating} ★
      </span>
    ),
  },
  {
    accessorKey: "_count.rooms",
    header: "Rooms",
    cell: ({ row }) => {
      const count = row.original._count?.rooms ?? 0;
      return <div>{count}</div>;
    },
  },

  {
    id: "featured",
    header: "Featured",
    accessorFn: (row) => row.hotel?.featured,
    cell: ({ getValue }) => {
      const isFeatured = getValue();
      return (
        <Badge variant={isFeatured ? "default" : "secondary"}>
          {isFeatured ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const rowValue = row.getValue(columnId) as string; // Explicitly type as string
      if (!rowValue) return false;

      // Parse dates without timezone conversion
      const parseDate = (dateString: string) => {
        const parts = dateString.split("-");
        return new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        );
      };

      const rowDate = parseDate(rowValue.split("T")[0]);
      const filterDate = parseDate(filterValue as string);

      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
    meta: {
      calendar: true,
    } as BookingColumnMeta,
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const rowValue = row.getValue(columnId) as string; // Explicitly type as string
      if (!rowValue) return false;

      // Parse dates without timezone conversion
      const parseDate = (dateString: string) => {
        const parts = dateString.split("-");
        return new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        );
      };

      const rowDate = parseDate(rowValue.split("T")[0]);
      const filterDate = parseDate(filterValue as string);

      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
    meta: {
      calendar: true,
    } as BookingColumnMeta,
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
            queryKey: ["hotels"],
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
];
