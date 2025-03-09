export interface Hotel {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  rooms: {
    available: number;
    total: number;
  };
  reviews: number;
}