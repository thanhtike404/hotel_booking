"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/providers/webSocketProvider";
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
import { useCreateBooking } from "./createBooking";

interface BookingModalProps {
    email: string | '';
    isOpen: boolean;
    onClose: () => void;
    room: Room;
    hotelId: string;
    hotelName: string;
}

export default function BookingModal({
    email,
    isOpen,
    onClose,
    room,
    hotelId,
    hotelName,
}: BookingModalProps) {
    const { sendNotification, isConnected, connectionState } = useWebSocket();
    const notificationSentRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const form = useBookingForm(room);
    const { mutate: createBookingMutation } = useCreateBooking();
    const { data: session } = useSession();

    useEffect(() => {
        if (isOpen && room) {
            // Reset the notification ref when modal opens
            notificationSentRef.current = false;

            form.reset({
                checkIn: new Date(),
                checkOut: addDays(new Date(), 1),
                guests: room.maxOccupancy || 2,
                name: "",
                email: session?.user?.email || email || "",
                phone: "",
            });
            setError("");
            setSuccess(false);
        }
    }, [isOpen, room, form, session?.user?.email, email]);

    async function onSubmit(values: BookingFormValues) {
        try {
            const requestData = await setBookingData(values);
            if (!requestData) {
                setError("Failed to create booking");
                return;
            }

            setIsLoading(true);

            createBookingMutation(requestData, {
                onSuccess: (response) => {
                    setSuccess(true);

                    // Send notification only once per booking
                    if (!notificationSentRef.current && response?.bookingId) {
                        notificationSentRef.current = true;
                        try {
                            console.log('Sending booking notification with ID:', response.bookingId);
                            sendNotification({
                                action: "sendNotification",
                                message: `🏨 New booking request for ${room.name} at ${hotelName}`,
                                bookingId: response.bookingId,
                                status: "REQUESTED",
                                type: "booking",
                                userId: session?.user?.id,
                            }); 
                        } catch (error) {
                            console.error("Error sending notification:", error);
                        }
                    }

                    setTimeout(() => onClose(), 2000);
                },
                onError: (error: any) => {
                    setError(error?.message || "Failed to create booking");
                },
                onSettled: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to create booking");
            setIsLoading(false);
        }
    }

    const setBookingData = async (values: BookingFormValues) => {
        const nights = Math.ceil(
            (new Date(values.checkOut).getTime() - new Date(values.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="user@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="snoop doggy dogg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="09...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            {form.watch("checkIn") && form.watch("checkOut") && (
                                <BookingSummary room={room} checkIn={form.watch("checkIn")} checkOut={form.watch("checkOut")} />
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