"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Room } from "@/types/rooms";
import { Badge } from "@/components/ui/badge";

export const roomColumns: ColumnDef<Room>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "roomType",
        header: "Room Type",
        cell: ({ row }) => {
            const type = row.getValue("roomType") as string;
            return <Badge variant="default">{type}</Badge>;
        },
    },
    {
        accessorKey: "available",
        header: "Available",
        cell: ({ row }) => <div>{row.getValue("available")}</div>,
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <div>{row.getValue("total")}</div>,
    },
    {
        accessorKey: "hotel.name",
        header: "Hotel",
        cell: ({ row }) => {
            const hotel = row.original.hotel;
            return <div>{hotel?.name || "—"}</div>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updatedAt"));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
];
