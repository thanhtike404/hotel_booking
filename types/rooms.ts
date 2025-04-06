export type Room = {
    id: string;
    hotelId: string;
    available: number;
    total: number;
    roomType: 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY';
    createdAt: string;
    updatedAt: string;
    hotel: {
        name: string;
    };
};

export type RoomResponse = {
    rooms: Room[];
};