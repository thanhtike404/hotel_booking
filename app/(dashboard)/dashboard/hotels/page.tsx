"use client"

import { hotels } from "@/data/hotels"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

type Hotel = (typeof hotels.featured)[0]

const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="relative w-20 h-20">
          <Image
            src={row.getValue("image")}
            alt={row.getValue("name")}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{row.getValue("rating")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "pricePerNight",
    header: "Price",
    cell: ({ row }) => {
      return <div>${row.getValue("pricePerNight")}</div>
    },
  },
  {
    accessorKey: "amenities",
    header: "Amenities",
    cell: ({ row }) => {
      const amenities: string[] = row.getValue("amenities")
      return (
        <div className="flex gap-1 flex-wrap">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary">
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="secondary">+{amenities.length - 3}</Badge>
          )}
        </div>
      )
    },
  },
]

export default function HotelsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Hotels Management</h2>
        <p className="text-muted-foreground">
          Manage your hotel listings and properties
        </p>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={hotels.featured} />
      </div>
    </div>
  )
}