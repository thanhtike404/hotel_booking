import { City } from "@prisma/client";

// Search-related types
export type SearchFiltersProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  rating: number;
  setRating: (value: number) => void;
  selectedCountryId: string;
  setSelectedCountryId: (value: string) => void;
  selectedCityId: string;
  setSelectedCityId: (value: string) => void;
};

export type HotelFilterProps = {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  priceRange: number[];
  setPriceRange: (val: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (val: string[]) => void;
  rating: number;
  setRating: (val: number) => void;
  cities: City[];
};