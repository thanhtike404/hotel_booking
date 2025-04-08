"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";
const RoomSchema = z.object({
    hotelId: z.string().min(1),
    roomType: z.enum(["SINGLE", "DOUBLE", "TWIN", "SUITE", "FAMILY"]),
    price: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Price must be a number",
    }),
    totalRooms: z.string().refine((val) => !isNaN(Number(val))),
    availableRooms: z.string().refine((val) => !isNaN(Number(val))),
    roomImage: z.string().url("Must be a valid URL"),
    amenities: z.array(z.string()).optional(),
});

export async function createRoom(formData: FormData) {
    const amenities = formData.getAll("amenities") as string[];

    const parsed = RoomSchema.safeParse({
        hotelId: formData.get("hotelId"),
        roomType: formData.get("roomType"),
        price: formData.get("price"),
        totalRooms: formData.get("totalRooms"),
        availableRooms: formData.get("availableRooms"),
        roomImage: formData.get("roomImage"),
        amenities,
    });

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;

    await prisma.room.create({
        data: {
            hotelId: data.hotelId,
            roomType: data.roomType,
            price: parseFloat(data.price),
            total: parseInt(data.totalRooms),
            available: parseInt(data.availableRooms),
            image: data.roomImage,
            amenities: data.amenities || [],
        },
    });

    redirect("/dashboard/hotels");

}

export async function getHotels() {
    return prisma.hotel.findMany({
        select: { id: true, name: true },
    });
}
