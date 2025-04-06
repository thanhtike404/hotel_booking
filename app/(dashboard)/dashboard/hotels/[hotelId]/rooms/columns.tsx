"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Room } from "@/types/rooms"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
export const columns: ColumnDef<Room>[] = [
    {
        accessorKey: "roomType",
        header: "Room Type",
        cell: ({ row }) => {
            const type = row.getValue("roomType") as string
            return <Badge variant="default">{type}</Badge>
        },
        meta: {
            search: false,
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
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string
            return <div className="relative w-20 h-20">
                <Image src={image} alt="room image"
                    height={300}
                    width={300}
                    className="object-cover rounded-md hover:opacity-80 transition-opacity" />
            </div>
        }
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
