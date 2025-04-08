import { prisma } from "@/lib/prisma";
export const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true },
});

export const createRoom = async (data: FormData) => {
    "use server";

    const hotelId = data.get("hotelId") as string;
    const roomType = data.get("roomType") as string;
    const total = parseInt(data.get("totalRooms") as string);
    const available = parseInt(data.get("availableRooms") as string);
    const image = data.get("roomImage") as string;
    const amenities = data.getAll("amenities") as string[];

    await prisma.room.create({
        data: {
            hotelId,
            roomType: roomType as any,
            total,
            available,
            image,
            amenities,
        },
    });
};
