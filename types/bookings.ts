import { Room } from "./rooms";
import { Hotel } from "./hotel";
import { BaseEntity } from "./common";

export interface User extends BaseEntity {
    name: string;
    email: string;
    password: string;
    emailVerified: Date | null;
    image: string | null;
}

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Booking extends BaseEntity {
    hotelId: string;
    userId: string;
    roomId?: string;
    checkIn: Date | string;
    checkOut: Date | string;
    status: BookingStatus;
    hotel: Hotel;
    user: User;
    _count: {
        rooms: number;
    };
}

export type BookingDetail = Booking & {
    hotel: {
        name: string;
        image: string;
        description: string;
        rooms: Array<{
            id: string;
            name: string;
            price: number;
        }>;
    };
    user: {
        name: string;
    };
    totalPrice: string;
    room: Room;
    booking: Booking;
};

// Booking-related component props and API types
export interface BookingModalProps {
    email: string | '';
    isOpen: boolean;
    onClose: () => void;
    room: Room;
    hotelId: string;
    hotelName: string;
}

export interface BookingSummaryProps {
    room: Room;
    checkIn: Date;
    checkOut: Date;
}

export interface BookingData {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    userId: string;
    customerName?: string;
    customerPhone?: string;
}

export interface BookingResponse {
    success: boolean;
    booking: {
        id: string;
        bookingId: string;
        roomId: string;
        booking: Booking;
        room: Room;
    };
}

export interface BookingStatusSelectProps {
    bookingId: string;
    currentStatus: string;
}  