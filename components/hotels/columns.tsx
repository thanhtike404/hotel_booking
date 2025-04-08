"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Hotel } from "@/types/hotel"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"

interface ColumnsProps {
  onImageClick: (image: string) => void;
}

export const columns = ({ onImageClick }: ColumnsProps): ColumnDef<Hotel>[] => [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div
        className="relative w-20 h-20 cursor-pointer"
        onClick={() => onImageClick(row.getValue("image"))}
      >
        <Image
          src={row.getValue("image")}
          alt={row.getValue("name")}
          fill
          className="object-cover rounded-md hover:opacity-80 transition-opacity"
        />
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{row.getValue("rating")}</span>
      </div>
    ),
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