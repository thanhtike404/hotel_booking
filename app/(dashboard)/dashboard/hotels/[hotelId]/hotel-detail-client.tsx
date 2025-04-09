"use client"

import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Hotel, Booking, Review, Room, RoomType } from "@prisma/client"

type HotelWithRelations = Hotel & {
  rooms: (Room & {
    roomType: RoomType
    image: string
    available: number
    total: number
    createdAt: Date
  })[]
  reviews: Review[]
  bookings: Booking[]
}

export default function HotelDetailClient({ hotel }: { hotel: HotelWithRelations | null }) {
  if (!hotel) {
    return <div>Hotel not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/hotels" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Hotels
            </Link>
          </Button>
          
          <Button asChild>
            <Link href={`/dashboard/hotels/edit/${hotel.id}`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Hotel
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
          
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <p className="text-muted-foreground mt-2">{hotel.location}</p>
              </div>
              <Badge variant={hotel.featured ? "default" : "secondary"}>
                {hotel.featured ? "Featured" : "Not Featured"}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h2 className="font-semibold">Description</h2>
                <p className="text-muted-foreground mt-1">{hotel.description}</p>
              </div>

              <div>
                <h2 className="font-semibold">Price</h2>
                <p className="text-2xl font-bold mt-1">${hotel.pricePerNight} <span className="text-sm text-muted-foreground">per night</span></p>
              </div>

              <div>
                <h2 className="font-semibold">Rating</h2>
                <p className="text-yellow-500 font-bold mt-1">{hotel.rating} ★</p>
              </div>

              <div>
                <h2 className="font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold">Created At</h2>
                <p className="text-muted-foreground mt-1">
                  {format(new Date(hotel.createdAt), "PPpp")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Rooms</h2>
            <p className="text-muted-foreground">Manage rooms for this hotel</p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/hotels/${hotel.id}/rooms/create`}>Add Room</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="py-3 px-4 text-left">Room Type</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Available</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotel.rooms.map((room) => (
                <tr key={room.id} className="border-b">
                  <td className="py-3 px-4">
                    <Badge variant="default">{room.roomType}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative w-16 h-16">
                      <img
                        src={room.image}
                        alt={room.roomType}
                        className="object-cover rounded-md"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">{room.available}</td>
                  <td className="py-3 px-4">{room.total}</td>
                  <td className="py-3 px-4">
                    {format(new Date(room.createdAt), "PP")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/hotels/${hotel.id}/rooms/${room.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}