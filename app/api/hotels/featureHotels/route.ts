import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {

    try {
        const hotels = await prisma.hotel.findMany({
            where: {
                featured: true,
            }, include: {
                city: {
                    include: {
                        country: true,
                    },
                },
            },
        })
        return NextResponse.json(hotels)
    } catch (error) {
        console.error("Error fetching featured hotels:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}