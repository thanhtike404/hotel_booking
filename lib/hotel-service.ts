import { prisma } from "@/lib/prisma"

export async function getHotelById(id: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: true,
        reviews: true,
        bookings: true,
      },
    })
    
    return hotel
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return null
  }
}