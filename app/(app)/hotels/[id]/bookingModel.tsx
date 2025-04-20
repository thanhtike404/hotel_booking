"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDays } from "date-fns";

import { Room } from "@/types/rooms";
import { useBookingForm, BookingFormValues } from "./bookingForm";
import { DateField } from "./date-fields";
import { BookingSummary } from "./booking-summary";
import { HotelInfo } from "./hotel-info";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room;
    hotelId: string;
    hotelName: string;
}

export default function BookingModal({
    isOpen,
    onClose,
    room,
    hotelId,
    hotelName,
}: BookingModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const form = useBookingForm(room);

    useEffect(() => {
        if (isOpen && room) {
            form.reset({
                checkIn: new Date(),
                checkOut: addDays(new Date(), 1),
                guests: room.maxOccupancy || 2,
                name: "",
                email: "",
                phone: "",
            });
            setError("");
            setSuccess(false);
        }
    }, [isOpen, room, form]);

    async function onSubmit(values: BookingFormValues) {
        try {
            setIsLoading(true);
            setError("");

            const nights = Math.ceil(
                (new Date(values.checkOut).getTime() - new Date(values.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotelId,
                    roomId: room.id,
                    roomName: room.name,
                    hotelName,
                    checkIn: values.checkIn.toISOString(),
                    checkOut: values.checkOut.toISOString(),
                    guests: values.guests,
                    customerName: values.name,
                    customerEmail: values.email,
                    customerPhone: values.phone,
                    totalPrice: room.price * nights,
                    nights,
                }),
            });

            if (!response.ok) {
                throw new Error((await response.json()).error || "Failed to create booking");
            }

            setSuccess(true);
            setTimeout(() => onClose(), 2000);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to create booking");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book {room?.name || "Room"}</DialogTitle>
                </DialogHeader>

                {success ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-md">
                        <h3 className="font-semibold">Booking Successful!</h3>
                        <p>Your reservation has been confirmed. Redirecting...</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <HotelInfo
                                hotelName={hotelName}
                                roomName={room?.name}
                                price={room?.price}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="checkIn"
                                    render={({ field }) => (
                                        <DateField
                                            label="Check-in Date"
                                            field={field}
                                            disabledDates={(date) => date < new Date() || date < new Date("1900-01-01")}
                                        />
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="checkOut"
                                    render={({ field }) => (
                                        <DateField
                                            label="Check-out Date"
                                            field={field}
                                            disabledDates={(date) =>
                                                date <= form.getValues().checkIn || date < new Date("1900-01-01")
                                            }
                                        />
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="guests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Guests</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={room.maxOccupancy || 10}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Other form fields remain similar */}

                            {form.watch("checkIn") && form.watch("checkOut") && (
                                <BookingSummary
                                    room={room}
                                    checkIn={form.watch("checkIn")}
                                    checkOut={form.watch("checkOut")}
                                />
                            )}

                            <div className="pt-4 border-t">
                                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Processing..." : "Confirm Booking"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}