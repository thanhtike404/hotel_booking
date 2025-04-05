import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: { hotelId: string } }
) {
    const { hotelId } = params

    try {
        const rooms = await prisma.room.findMany({
            where: { hotelId },
            include: {
                hotel: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        // 🔥 Flatten the hotel name into each room


        return new Response(JSON.stringify({ rooms }), {
            status: 200,
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
            status: 500,
        })
    }
}
