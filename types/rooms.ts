import { BaseEntity } from "./common";
import { RoomType } from "./hotel";

export type Room = BaseEntity & {
    hotelId: string;
    available: number;
    total: number;
    roomType: RoomType;
    image: string;
    price: number;
    amenities: string[];
    name: string;
    description?: string;
    maxOccupancy?: number;
    features?: string[];
};

export type RoomResponse = {
    rooms: Room[];
};

// Room-related component props
export interface RoomCardProps {
    room: Room & {
        image: string;
        price: number;
        amenities: string[];
    };
}

export interface RoomListModalProps {
    hotelId: string;
    rooms: Room[];
}