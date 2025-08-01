"use client"

import { ColumnDef } from "@tanstack/react-table"
import { City } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { CityCol } from "@/types/dashboard";
export const columns: ColumnDef<CityCol>[] = [
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