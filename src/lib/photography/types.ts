import type { Trip } from "./metadata";

export interface Photo {
  name: string;
  thumbnail: string;
  fullSize: string;
  original: string;
  lastModified?: string;
  size: number;
  trip?: string;
  order?: number;
  alt: string;
  camera: string;
}
export interface PhotoInventory {
  photos: Photo[];
  trips: (Omit<Trip, "cover"> & { cover?: string; count: number; photoNames: string[] })[];
  unorganized: string[];
  warnings: string[];
}
