"use client"

import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function Hotels() {
  const { data, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/hotels')
      return response.data.hotels // Access the hotels array directly
    }
  })
  console.log(data)
  if (isLoading) {
    return <div>Loading...Mother fucker</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground">Manage your hotel listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/hotels/create">Add Hotel</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  )
}
