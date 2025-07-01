import { BookingDetail } from "@/types/bookings";

export function calculateTotalPrice(booking: BookingDetail | null): number {
    console.log("Calculating total price for booking:", booking);
  if (!booking || !booking.room || !booking.checkIn || !booking.checkOut) {
    return 0;
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  console.log("Check-in Date:", checkInDate);
  console.log("Check-out Date:", checkOutDate);
  // Ensure valid dates
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return 0;
  }

  const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return booking.room.price * numberOfNights;
}