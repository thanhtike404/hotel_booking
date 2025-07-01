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

export interface Booking {
  id: string;
  bookingId: string;
  roomId: string;
  booking: {
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
      rating: number;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  room: {
    id: string;
    name: string;
    roomType: string;
    image: string;
    price: number;
  };
}

export const columns: ColumnDef<Booking, unknown>[] = [
  {
    accessorKey: "booking.user.name",
    header: "Username",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <h2>{row.original.booking.user.name}</h2>
      </div>
    ),
  },
  {
    accessorKey: "booking.hotel.name",
    header: "Hotel Name",
    cell: ({ row }) => (
      <Link href={`/dashboard/hotels/${row.original.booking.hotel.id}`}>
        {row.original.booking.hotel.name}
      </Link>
    ),
  },
  {
    accessorKey: "booking.hotel.rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="text-yellow-500 font-medium">
        {row.original.booking.hotel.rating} ★
      </span>
    ),
  },
  {
    accessorKey: "room.roomType",
    header: "Room Type",
    cell: ({ row }) => (
      <span>{row.original.room.roomType}</span>
    ),
  },
  {
    accessorKey: "booking.checkIn",
    header: "Check In",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
    },
  },
  {
    accessorKey: "booking.checkOut",
    header: "Check Out",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return !isNaN(date.getTime()) ? format(date, "PPP") : "Invalid date";
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
          queryClient.invalidateQueries({ queryKey: ["hotels"] });
        },
      });

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/bookings/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/hotels/edit/${row.original.booking.hotel.id}`}>
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
                deleteHotel.mutate(row.original.booking.hotel.id);
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
