import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    // Step 1: Group hotels by cityId, count them, and get top 4
    const topCityGroups = await prisma.hotel.groupBy({
        by: ['cityId'],
        _count: {
            cityId: true,
        },
        orderBy: {
            _count: {
                cityId: 'desc',
            },
        },
        take: 4,
    });

    // Step 2: Get full city info for those cityIds
    const cityIds = topCityGroups.map(group => group.cityId);

    const cities = await prisma.city.findMany({
        where: {
            id: {
                in: cityIds,
            },
        },
    });

    // Step 3: Combine city info with hotel counts
    const result = cities.map(city => {
        const countData = topCityGroups.find(group => group.cityId === city.id);
        return {
            ...city,
            hotelCount: countData?._count.cityId ?? 0,
        };
    });

    return NextResponse.json(result);
};
