"use client"

import { hotels } from "@/data/hotels"
import { useState } from "react"
import { CustomLink as Link } from "@/components/ui/custom-link"
import { HomeIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rating, setRating] = useState(0)

  const filteredHotels = hotels.featured.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1]
    const matchesRating = hotel.rating >= rating

    return matchesSearch && matchesPrice && matchesRating
  })

  return (
   <>
   <div className="border-b">
  <div className="container flex h-16 items-center px-4">
    <Link href="/">
      <Button variant="ghost" className="flex items-center gap-2">
        <HomeIcon className="h-5 w-5" />
        <span className="font-bold">Hotel Booking</span>
      </Button>
    </Link>
    <nav className="flex items-center space-x-6 ml-6">
      <Link href="/hotels" className="text-sm font-medium transition-colors hover:text-primary">
        Hotels
      </Link>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
    </nav>
  </div>
</div>
    <div className="container mx-auto py-10">
      
      <div className="grid grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Search</h3>
            <Input
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-4">Price Range</h3>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={50}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Minimum Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant={rating === star ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRating(rating === star ? 0 : star)}
                >
                  {star}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id}>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
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
                  <div className="mt-4">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="mr-1">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                // In your Card component, update the Button in CardFooter
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">${hotel.pricePerNight}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <Link href={`/hotels/${hotel.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
   </>
  )
}