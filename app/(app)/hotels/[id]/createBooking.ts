"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z } from "zod";

// Define TypeScript interface for booking data
interface BookingData {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    customerName?: string;
    customerPhone?: string;
}

export const createBooking = async (requestData: BookingData) => {
    try {
        console.log("Submitting booking:", requestData);
        const response = await axios.post("/api/bookings", requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Booking error:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
        });

        throw new Error(
            (axiosError.response?.data as any)?.error ||
            "Failed to create booking. Please try again."
        );
    }
};

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: (data) => {
            console.log("Booking created:", data);
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
        },
        onError: (error: Error) => {
            console.error("Mutation error:", error.message);
        },
    });
}