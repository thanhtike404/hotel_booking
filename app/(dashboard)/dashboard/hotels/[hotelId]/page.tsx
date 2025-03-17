import { prisma } from "@/lib/prisma";
import HotelDetailClient from "./hotel-detail-client";

export default async function HotelDetailPage({
  params,
}: {
  params: { hotelId?: string };
}) {
  // Ensure params are properly awaited
  if (!params?.hotelId) {
    return <p>Loading...</p>; // Or handle the missing hotelId case properly
  }

  const hotel = await prisma.hotel.findUnique({
    where: {
      id: params.hotelId, // Correctly accessing hotelId
    },
    include: {
      rooms: true,
      reviews: true,
      bookings: true,
    },
  });

  if (!hotel) {
    return <p>Hotel not found</p>; // Handle case where hotel is not found
  }

  return <HotelDetailClient hotel={hotel} />;
}
