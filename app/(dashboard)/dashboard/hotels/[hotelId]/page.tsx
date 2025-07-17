import { prisma } from "@/lib/prisma";
import HotelDetailClient from "./hotel-detail-client";

export default async function HotelDetailPage({
  params,
}: {
  params: { hotelId?: string };
}) {

  const { hotelId} =await params;
  if (!hotelId) {
    return <p>Loading...</p>; 
  }

  const hotel = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      rooms: true,
      reviews: true,
      bookings: true,
    },
  });

  if (!hotel) {
    return <p>Hotel not found</p>; 
  }
  console.log("Hotel data:", hotel); // Debugging line to check hotel data
  return <HotelDetailClient hotel={hotel} />;
}
