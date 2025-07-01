// hooks/useBooking.ts
import { useQuery } from '@tanstack/react-query'

interface Booking {
  id: string
  hotelId: string
  userId: string
  checkIn: string
  checkOut: string
  status: string
  createdAt: string
  updatedAt: string
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
  id: string
  bookingId: string
  roomId: string
  booking: Booking
  room: Room
}

async function fetchBooking(bookingId: string): Promise<BookingResponse> {
  const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch booking')
  }
  
  return response.json()
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: !!bookingId, // Only run query if bookingId exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 3,
  })
}