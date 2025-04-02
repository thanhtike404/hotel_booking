"use client"

import { hotels } from "@/data/hotels"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
export default function HotelsPage() {
  const fetchHotels = async () => {
    const response = await axios.get("/api/hotels")
    return response.data
  }
  const { data: hotels, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,

  })

  return (
    <>

      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-8">Our Hotels </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* if featured hotels hotels?.featured?.map */}
          {hotels?.map((hotel: any) => (
            <Card key={hotel.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={hotel?.image}
                    alt={hotel?.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {hotel?.rating}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{hotel?.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hotel?.location}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                  {hotel?.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel?.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold">${hotel?.pricePerNight}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <Link href={`/hotels/${hotel?.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}