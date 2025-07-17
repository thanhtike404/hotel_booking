"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Country } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
type CountryCol = Country & {
  cities?: {
    id: string
    name: string
  }[]
}

export const columns: ColumnDef<CountryCol>[] = [
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
  },

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