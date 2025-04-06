import { prisma } from "@/lib/prisma"
import { authGuard } from "@/lib/authGuard"
export async function GET(
    req: Request,
    { params }: { params: { hotelId: string } }
) {
    const session = await authGuard();
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        })
    }
    const { hotelId } = await params

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
