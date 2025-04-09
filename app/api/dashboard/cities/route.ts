import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      include: {
        country: true,
        hotels: true
      }
    })
    return NextResponse.json(cities)
  } catch (error) {
    console.error("Error fetching cities:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, countryId } = body

    const city = await prisma.city.create({
      data: {
        name,
        countryId
      },
      include: {
        country: true
      }
    })

    return NextResponse.json(city)
  } catch (error) {
    console.error("Error creating city:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}