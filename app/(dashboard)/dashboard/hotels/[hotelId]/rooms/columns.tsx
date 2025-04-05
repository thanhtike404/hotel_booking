"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Room } from "@/types/rooms"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Room>[] = [
    {
        accessorKey: "roomType",
        header: "Room Type",
        cell: ({ row }) => {
            const type = row.getValue("roomType") as string
            return <Badge variant="default">{type}</Badge>
        },
        meta: {
            search: true,
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
        id: "name",
        accessorFn: (row) => row.hotel?.name ?? "",
        header: "Hotel",
        meta: {
            search: false,
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updatedAt"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
]
