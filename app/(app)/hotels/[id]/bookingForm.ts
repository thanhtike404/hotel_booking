import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Room } from "@/types/rooms";
import { format, addDays } from "date-fns";

// Define form schema
const formSchema = z.object({
    checkIn: z.date(),
    checkOut: z.date(),
    guests: z.number().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
});

export const useBookingForm = (room: Room) => {
    return useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: new Date(),
            checkOut: addDays(new Date(), 1),
            guests: room?.maxOccupancy || 2,
            name: "",
            email: "",
            phone: "",
        },
    });
};

export type BookingFormValues = z.infer<typeof formSchema>;