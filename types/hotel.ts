// Define the possible RoomType values as a union type
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY';

import { Room } from './rooms';
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

export type City = {
  id: string;
  name: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
};

export type Hotel = {
  id: string;
  name: string;
  description: string;
  cityId: string;
  city: City;
  image: string;
  rating: number;
  featured: boolean;
  amenities: string[];
  latitude: number;
  longitude: number;
  rooms: Room[];
  reviews: Review[];
  bookings: Booking[];
  createdAt: string;
  updatedAt: string;
  location: string;
  _count: {
    rooms: number
  };
  room: Room[]
};

export type CreateHotelResponse = {
  id: string
  // ... other hotel fields
}