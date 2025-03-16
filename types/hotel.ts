// Define the possible RoomType values as a union type
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY';

export type Room = {
  id: string;
  hotelId: string;
  available: number;
  total: number;
  roomType: RoomType;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  hotelId: string;
  userId?: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  hotelId: string;
  userId: string;
  roomId?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Hotel = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  pricePerNight: number;
  featured: boolean;
  amenities: string[];
  rooms: Room[];
  reviews: Review[];
  bookings: Booking[];
  createdAt: string;
  updatedAt: string;
};
