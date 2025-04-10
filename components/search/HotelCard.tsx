"use client"

import { Hotel } from "@/types/hotel"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import Image from "next/image"
import { CustomLink as Link } from "@/components/ui/custom-link"

type HotelCardProps = {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {hotel.location}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{hotel.rating}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <Link href={`/hotels/${hotel.id}`} className="text-primary-600">View Details</Link>
      </CardFooter>
    </Card>
  )
}