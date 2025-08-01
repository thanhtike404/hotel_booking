import { Country, City } from "@prisma/client";

export interface CardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: {
    direction: 'up' | 'down';
    value: string;
  };
}

export interface DashboardBooking {
  id: number;
  guestName: string;
  roomType: string;
  date: string;
  status: string;
}

export interface RoomStatus {
  type: string;
  percentage: number;
}

// Dashboard column types
export type CountryCol = Country & {
  cities?: {
    id: string;
    name: string;
  }[];
};

export type CityCol = City & {
  country?: {
    name: string;
  };
};

// Dashboard component props
export interface ColumnsProps {
  onImageClick: (image: string) => void;
}