import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const GET = async (req: Request, { params }: { params: { cityId: string } }) => {
    const { cityId } = await params;
    try {
        const country = await prisma.city.findUnique({
            where: { id: cityId },
            select: {
                country: true,
            },
        });
        if (!country) {
            return NextResponse.json(
                { error: "Country not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(country.country);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch country" },
            { status: 500 }
        );
    }
};