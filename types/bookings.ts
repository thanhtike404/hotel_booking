interface Hotel {
    id: string;
    name: string;
    description: string;
    cityId: string;
    image: string;
    rating: number;
    featured: boolean;
    amenities: string[];
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: Date;
    image: string;
}

export interface Booking {
    id: string;
    hotelId: string;
    userId: string;
    checkIn: Date | string;
    checkOut: Date | string;
    status: "confirmed" | "pending" | "cancelled";
    createdAt: Date | string;
    updatedAt: Date | string;
    hotel: Hotel; // Add this
    user: User;   // Add this
    _count: {
        rooms: number;
    };
}