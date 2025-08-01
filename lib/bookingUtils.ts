import { Wifi, Snowflake, Bath, Tv, Wine } from "lucide-react";

export function calculateTotalPrice(bookingData: any): number {
  if (!bookingData?.room || !bookingData?.booking) return 0;
  
  const checkIn = new Date(bookingData.booking.checkIn);
  const checkOut = new Date(bookingData.booking.checkOut);
  
  if (isNaN(checkIn.getTime())) return 0;
  if (isNaN(checkOut.getTime())) return 0;
  
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  return bookingData.room.price * nights;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export const amenityIcons: Record<string, React.FC<any>> = {
  "Free WiFi": Wifi,
  "Air Conditioning": Snowflake,
  "Private Bathroom": Bath,
  "TV": Tv,
  "Mini Bar": Wine
};