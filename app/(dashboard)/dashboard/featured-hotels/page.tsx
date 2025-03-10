"use client"

import { hotels } from "@/data/hotels"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/hotels/columns"

export default function FeaturedHotelsPage() {
  // You can filter or transform the data differently here
  const featuredHotels = hotels.featured.filter(hotel => hotel.rating >= 4.8)

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Featured Hotels</h2>
        <p className="text-muted-foreground">
          Our highest-rated luxury accommodations
        </p>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={featuredHotels} />
      </div>
    </div>
  )
}