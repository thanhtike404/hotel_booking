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
import { BookingStatusSelect } from "@/components/dashboard/BookingStatusSelect";

export interface Booking {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  hotel: {
    id: string;
    name: string;
    image: string;
    city: {
      name: string;
      country: {
        name: string;
      };
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const columns: ColumnDef<Booking, unknown>[] = [
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
    accessorKey: "user.name",
    header: "Username",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h2>{row.original.user?.name || 'N/A'}</h2>
      </div>
    ),
  },
  {
    accessorKey: "hotel.name",
    header: "Hotel Name",
    cell: ({ row }) => (
      <Link href={`/dashboard/hotels/${row.original.hotel?.id || '#'}`}>
        {row.original.hotel?.name || 'N/A'}
      </Link>
    ),
  },
  {
    accessorKey: "hotel.city.name",
    header: "Location",
    cell: ({ row }) => (
      <span>
        {row.original.hotel?.city?.name || 'N/A'}, {row.original.hotel?.city?.country?.name || 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
  },
  {
    accessorKey: "status",
    header: "Booking Status",
    cell: ({ row }) => (
      <BookingStatusSelect
        bookingId={row.original.id}
        currentStatus={row.original.status}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const deleteBooking = useMutation({
        mutationFn: async (id: string) => {
          await axios.delete(`/api/dashboard/bookings/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
      });

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/bookings/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/hotels/edit/${row.original.hotel?.id || '#'}`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this booking?")) {
                deleteBooking.mutate(row.original.id);
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
