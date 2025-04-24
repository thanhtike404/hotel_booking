import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


export const formSchema = z.object({
    name: z.string().min(2, {
        message: "Hotel name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    country: z.string().min(1, {
        message: "Country is required.",
    }),
    cityId: z.string().min(1, {
        message: "City is required.",
    }),
    image: z.string().url({
        message: "Please enter a valid image URL.",
    }),
    rating: z.number().min(0).max(5),

    featured: z.boolean().default(false),
    amenities: z.array(z.string()).min(1, {
        message: "Please select at least one amenity.",
    }),
});

