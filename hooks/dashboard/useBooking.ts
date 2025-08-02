import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Booking, BookingResponse } from '@/types/bookings'

async function fetchBooking(bookingId: string): Promise<BookingResponse> {
  const response = await axios.get(`/api/dashboard/bookings/${bookingId}`)
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