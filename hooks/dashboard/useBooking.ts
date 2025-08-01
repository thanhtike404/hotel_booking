import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Hotel {
  id: string
  name: string
  rating: number
  city: {
    name: string
    country: {
      name: string
    }
  }
}

interface User {
  id: string
  name: string
  email: string
}

interface Booking {
  id: string
  hotelId: string
  userId: string
  checkIn: string
  checkOut: string
  status: string
  createdAt: string
  updatedAt: string
  hotel: Hotel
  user: User
  notifications: Array<{
    id: string
    message: string
    status: string
    createdAt: string
  }>
}

interface Room {
  id: string
  name: string
  hotelId: string
  available: number
  total: number
  roomType: string
  image: string
  amenities: string[]
  price: number
  createdAt: string
  updatedAt: string
}

interface BookingResponse {
  success: boolean
  booking: {
    id: string
    bookingId: string
    roomId: string
    booking: Booking
    room: Room
  }
}

async function fetchBooking(bookingId: string): Promise<BookingResponse> {
  const response = await axios.get(`/api/bookings/${bookingId}`)
  return response.data
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}