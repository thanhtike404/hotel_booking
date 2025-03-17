import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Hotel } from "@/types/hotel"
import Link from "next/link"
async function getData(): Promise<Hotel[]> {
  // Return dummy hotel data that conforms to your types
  return [
    {
      id: "hotel_1",
      name: "Grand Palace Hotel",
      description: "A luxurious hotel with stunning city views and top-notch amenities.",
      location: "New York, USA",
      image: "https://source.unsplash.com/400x300/?hotel,luxury",
      rating: 4.8,
      pricePerNight: 250,
      featured: true,
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
      rooms: [], // No rooms provided for now
      reviews: [
        {
          id: "review_1",
          hotelId: "hotel_1",
          userId: "user_1",
          rating: 5,
          comment: "Amazing experience, highly recommended!",
          date: "2024-03-01T12:00:00.000Z",
          createdAt: "2024-03-01T12:00:00.000Z",
          updatedAt: "2024-03-01T12:00:00.000Z"
        },
        {
          id: "review_2",
          hotelId: "hotel_1",
          userId: "user_2",
          rating: 4.5,
          comment: "The room service was excellent.",
          date: "2024-03-01T12:00:00.000Z",
          createdAt: "2024-03-01T12:00:00.000Z",
          updatedAt: "2024-03-01T12:00:00.000Z"
        }
      ],
      bookings: [
        {
          id: "booking_1",
          hotelId: "hotel_1",
          userId: "user_1",
          roomId: undefined, // No specific room booked
          checkIn: "2024-05-10T14:00:00.000Z",
          checkOut: "2024-05-15T12:00:00.000Z",
          status: "confirmed",
          createdAt: "2024-05-10T14:00:00.000Z",
          updatedAt: "2024-05-15T12:00:00.000Z"
        },
        {
          id: "booking_2",
          hotelId: "hotel_1",
          userId: "user_2",
          roomId: undefined,
          checkIn: "2024-06-01T15:00:00.000Z",
          checkOut: "2024-06-05T11:00:00.000Z",
          status: "confirmed",
          createdAt: "2024-06-01T15:00:00.000Z",
          updatedAt: "2024-06-05T11:00:00.000Z"
        }
      ],
      createdAt: "2024-03-01T12:00:00.000Z",
      updatedAt: "2024-03-05T15:30:00.000Z"
    },
    {
      id: "hotel_2",
      name: "Ocean View Resort",
      description: "Enjoy the sound of the waves from your beachfront room.",
      location: "Maldives",
      image: "https://source.unsplash.com/400x300/?beach,resort",
      rating: 4.9,
      pricePerNight: 350,
      featured: true,
      amenities: ["Beachfront", "Infinity Pool", "Snorkeling", "All-inclusive"],
      rooms: [],
      reviews: [
        {
          id: "review_1",
          hotelId: "hotel_2",
          userId: "user_3",
          rating: 5,
          comment: "The most peaceful and beautiful place I've stayed!",
          date: "2024-02-20T10:15:00.000Z",
          createdAt: "2024-02-20T10:15:00.000Z",
          updatedAt: "2024-02-20T10:15:00.000Z"
        },
        {
          id: "review_2",
          hotelId: "hotel_2",
          userId: "user_4",
          rating: 4.7,
          comment: "Excellent service and breathtaking views.",
          date: "2024-02-20T10:15:00.000Z",
          createdAt: "2024-02-20T10:15:00.000Z",
          updatedAt: "2024-02-20T10:15:00.000Z"
        }
      ],
      bookings: [
        {
          id: "booking_1",
          hotelId: "hotel_2",
          userId: "user_3",
          roomId: undefined,
          checkIn: "2024-03-10T14:00:00.000Z",
          checkOut: "2024-03-14T12:00:00.000Z",
          status: "confirmed",
          createdAt: "2024-03-10T14:00:00.000Z",
          updatedAt: "2024-03-14T12:00:00.000Z"
        }
      ],
      createdAt: "2024-02-20T10:15:00.000Z",
      updatedAt: "2024-02-25T14:45:00.000Z"
    },
    {
      id: "hotel_3",
      name: "Mountain Retreat Lodge",
      description: "A peaceful getaway in the heart of the mountains.",
      location: "Swiss Alps",
      image: "https://source.unsplash.com/400x300/?mountains,lodge",
      rating: 4.6,
      pricePerNight: 180,
      featured: false,
      amenities: ["Hiking Trails", "Fireplace", "Sauna", "Free Breakfast"],
      rooms: [],
      reviews: [
        {
          id: "review_1",
          hotelId: "hotel_3",
          userId: "user_5",
          rating: 4.8,
          comment: "A great place for a retreat, very quiet and serene.",
          date: "2024-01-15T08:30:00.000Z",
          createdAt: "2024-01-15T08:30:00.000Z",
          updatedAt: "2024-01-15T08:30:00.000Z"
        }
      ],
      bookings: [
        {
          id: "booking_1",
          hotelId: "hotel_3",
          userId: "user_5",
          roomId: undefined,
          checkIn: "2024-04-10T15:00:00.000Z",
          checkOut: "2024-04-12T11:00:00.000Z",
          status: "confirmed",
          createdAt: "2024-04-10T15:00:00.000Z",
          updatedAt: "2024-04-12T11:00:00.000Z"
        }
      ],
      createdAt: "2024-01-15T08:30:00.000Z",
      updatedAt: "2024-02-10T11:00:00.000Z"
    }
  ]
}

export default async function Hotels() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Hotels</h1>
        <p className="text-muted-foreground">List of all hotels</p>
      </div>
      <Button className="mt-8">
        <Link href="/dashboard/hotels/create">Add Hotel</Link>
      </Button>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
