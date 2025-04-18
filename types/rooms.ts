export type Room = {
    id: string;
    hotelId: string;
    available: number;
    total: number;
    roomType: 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY';
    createdAt: string;
    updatedAt: string;
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