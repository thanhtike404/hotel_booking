"use client"

import { hotels } from "@/data/hotels"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const hotel = hotels.featured.find(h => h.id.toString() === resolvedParams.id)

  if (!hotel) {
    notFound()
  }

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
          <div className="relative h-[400px] md:h-[500px]">
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
        </div>
      </div>
    </>
  )
}