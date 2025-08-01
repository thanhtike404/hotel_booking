import { Room } from './rooms';
import { BaseEntity } from './common';

// Define the possible RoomType values as a union type
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY';

export type Review = BaseEntity & {
  hotelId: string;
  userId?: string;
  rating: number;
  comment: string;
  date: string;
};

export type City = BaseEntity & {
  name: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
};

export type Hotel = BaseEntity & {
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
  location: string;
  rooms: Room[];
  reviews: Review[];
  bookings: any[]; // Reference to avoid circular dependency
  _count: {
    rooms: number;
  };
  room: Room[];
};

export type CreateHotelResponse = {
  id: string;
  // ... other hotel fields
};

// Hotel-specific component props
export type HotelCardProps = {
  hotel: Hotel;
};

export interface HotelInfoProps {
  hotelName: string;
  roomName: string;
  price: number;
}

export type HotelWithRelations = Hotel & {
  rooms: Room[];
  reviews: Review[];
};

export interface HotelEditPageProps {
  params: {
    hotelId: string;
  };
}