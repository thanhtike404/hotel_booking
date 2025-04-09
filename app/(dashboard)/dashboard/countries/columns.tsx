"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Country } from "@prisma/client"

export const columns: ColumnDef<Country>[] = [
  {
    accessorKey: "name",
    header: "Country Name",
  },
  {
    accessorKey: "code",
    header: "Country Code",
  },
  {
    accessorKey: "cities",
    header: "Number of Cities",
    cell: ({ row }) => {
      const cities = row.original.cities
      return cities ? cities.length : 0
    }
  }
]