import { Room } from "@/types/rooms";
import { BookingSummaryProps } from "@/types/bookings";

export const BookingSummary = ({ room, checkIn, checkOut }: BookingSummaryProps) => {
    const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium">Booking Summary</h4>
            <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                    <span>Room:</span>
                    <span>{room?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>Price per night:</span>
                    <span>${room?.price}</span>
                </div>
                <div className="flex justify-between">
                    <span>Number of nights:</span>
                    <span>{nights}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total:</span>
                    <span>${room?.price * nights}</span>
                </div>
            </div>
        </div>
    );
};