import { hotels } from "@/data/hotels";
import React from "react";
import { 
  Star, 
  MapPin, 
  Users, 
  Wifi, 
  Waves, 
  Dumbbell, 
  UtensilsCrossed, 
  Ship,
  Bath
} from "lucide-react";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link"
import { HomeIcon } from "lucide-react"

// Update the amenity icons mapping
const amenityIcons = {
  "Spa": Bath,
  "Gym": Dumbbell,
  "Pool": Waves,
  "Restaurant": UtensilsCrossed,
  "Private Beach": Ship,
  "Water Sports": Ship,
  "Fine Dining": UtensilsCrossed,
  "Business Center": Users,
  "Bar": UtensilsCrossed,
  "Conference Rooms": Users,
  "Butler Service": Users,
  "Private Pool": Waves,
};

export default function HotelsPage() {
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
        <div className="space-y-8">
          {/* Add navigation section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Our Hotels</h1>
              <p className="text-muted-foreground">
                Discover our collection of luxury hotels and resorts worldwide
              </p>
            </div>
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Hotels</TabsTrigger>
                <TabsTrigger value="luxury">Luxury</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="resort">Resort</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.featured.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hotel.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {amenityIcons[amenity as keyof typeof amenityIcons] && 
                          React.createElement(amenityIcons[amenity as keyof typeof amenityIcons], { className: "h-3 w-3" })}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">${hotel.pricePerNight}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <Button>Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Separate destinations section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.popularDestinations.map((destination) => (
                <div key={destination.id} className="relative h-64 rounded-lg overflow-hidden group">
                  <Image
                    src={destination.image}
                    alt={destination.city}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                    <h3 className="text-white text-xl font-bold">{destination.city}</h3>
                    <p className="text-white/80 text-sm">{destination.hotels} hotels</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}