import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Country, CreateCountryDto } from "@/types/country"

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: {
        cities: true
      }
    })
    return NextResponse.json(countries)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code } = body as CreateCountryDto

    if (!name || !code) {
      return new NextResponse("Name and code are required", { status: 400 })
    }

    // Check if country with same name or code already exists
    const existingCountry = await prisma.country.findFirst({
      where: {
        OR: [
          { name },
          { code }
        ]
      }
    })

    if (existingCountry) {
      return new NextResponse(
        "Country with this name or code already exists",
        { status: 409 }
      )
    }

    const country = await prisma.country.create({
      data: {
        name,
        code
      }
    })

    return NextResponse.json(country)
  } catch (error) {
    console.error("Error creating country:", error)
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}