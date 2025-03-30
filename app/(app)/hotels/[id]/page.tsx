"use client"

import React from 'react'
import { hotels } from '@/data/hotels'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" />
})

// Example coordinates - you should add these to your hotel data
const coordinates: { [key: string]: [number, number] } = {
  "Bali, Indonesia": [-8.4095, 115.1889],
  "New York, USA": [40.7128, -74.0060],
  "Maldives": [3.2028, 73.2207]
}

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params)
  const id = unwrappedParams?.id as string | undefined

  // Find the hotel using the unwrapped id
  const hotel = hotels.featured.find((hotel) => hotel.id.toString() === id)

  if (!hotel) {
    return <div>Hotel not found</div>
  }

  const hotelCoords = coordinates[hotel.location] || [-8.4095, 115.1889] // Default to Bali

  return (
    <>
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/hotels">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Hotels</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px]">
            <Image
              src={hotel.image}
              alt={hotel.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {hotel.location}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotel.rating}</span>
                <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">${hotel.pricePerNight}</p>
                  <p className="text-muted-foreground">per night</p>
                </div>
                <Button size="lg">Book Now</Button>
              </div>
            </div>
          </div>

          {/* Add Map Section */}
          <div className="col-span-full">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <Map
              center={hotelCoords}
              name={hotel.name}
              location={hotel.location}
            />
          </div>
        </div>
      </div>
    </>
  )
}