"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/dataTable/data-table"
import { useQuery } from "@tanstack/react-query"

export default function CountriesPage() {

  
  const { data, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/countries")
      const data = await response.json()
      return data
    }
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Countries</h2>
        <p className="text-muted-foreground">Manage hotel locations by country</p>
      </div>
      <DataTable isLoading={isLoading} columns={columns} data={data || []} />
    </div>
  )
}