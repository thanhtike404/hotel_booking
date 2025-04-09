"use client"

import { ColumnDef } from "@tanstack/react-table"
import { City } from "@prisma/client"

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "name",
    header: "City Name",
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      const country = row.original.country
      return country ? country.name : 'N/A'
    }
  },
  {
    accessorKey: "hotels",
    header: "Number of Hotels",
    cell: ({ row }) => {
      const hotels = row.original.hotels
      return hotels ? hotels.length : 0
    }
  }
]