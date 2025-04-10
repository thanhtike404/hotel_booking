"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { notFound } from "next/navigation"
import { SearchFilters } from "@/components/search/SearchFilters"
import { HotelCard } from "@/components/search/HotelCard"
import type { Hotel } from "@/types/hotel"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [rating, setRating] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")

  const fetchHotels = async (): Promise<Hotel[]> => {
    const response = await axios.get("/api/hotels")
    return response.data
  }

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
  })

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  if (!hotels) {
    return notFound()
  }
  if (hotels.length === 0) {
    return <div className="flex justify-center items-center h-screen">No hotels found</div>
  }

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = (hotel.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hotel.city?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesRating = (hotel.rating || 0) >= rating
    const matchesLocation = !selectedCountry || (
      hotel.city?.country?.name === selectedCountry &&
      (!selectedCity || hotel.city?.name === selectedCity)
    )
    return matchesSearch && matchesRating && matchesLocation
  })

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
      {/* Mobile filter button */}
      <Button
        variant="outline"
        className="w-full mb-4 lg:hidden"
        onClick={() => document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Show Filters
      </Button>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rating={rating}
          setRating={setRating}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        {/* Results */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-muted-foreground">No hotels found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
