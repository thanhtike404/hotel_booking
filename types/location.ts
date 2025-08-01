import { BaseEntity } from "./common";

// Location-related types
export interface Country extends BaseEntity {
  name: string;
  code: string;
  cities?: City[];
}

export interface City extends BaseEntity {
  name: string;
  countryId: string;
  country?: Country;
}

// Map component types
export interface MapProps {
  center: [number, number];
  name: string;
  location: string;
  zoom?: number;
  markers?: MapMarker[];
}

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
}