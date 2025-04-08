import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const hotelId = params.hotelId
    const body = await req.json()

    // Validate hotel exists
    const existingHotel = await prisma.hotel.findUnique({
      where: { id: hotelId }
    })

    if (!existingHotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      )
    }

    // Update hotel
    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        image: body.image,
        rating: body.rating,
        amenities: body.amenities,
        featured: body.featured,
      }
    })

    return NextResponse.json(updatedHotel)
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 }
    )
  }
}