import { HotelInfoProps } from "@/types/hotel";

export const HotelInfo = ({ hotelName, roomName, price }: HotelInfoProps) => (
    <div className="bg-muted/50 p-4 rounded-md mb-4">
        <h3 className="font-semibold">{hotelName}</h3>
        <p className="text-sm">
            {roomName} - ${price} per night
        </p>
    </div>
);