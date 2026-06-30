export type CompetitivenessLevel = "Casual" | "Optimizado" | "cEDH";
export type PriceUnit = "hora" | "jugador";
export type UserRole = "host" | "player" | "both";

export type Amenity =
  | "Tapetes incluidos"
  | "Snacks & bebidas"
  | "Luces regulables"
  | "Música de ambiente"
  | "Espacio para dados y contadores"
  | "Token holders"
  | "Cartas proxy permitidas"
  | "Aire acondicionado"
  | "WiFi alta velocidad"
  | "Aparcamiento"
  | "Abierto 24h"
  | "Cocina disponible";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Space {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  image: string;
  gallery: string[];
  pricePerHour: number;
  pricePerPlayer: number;
  priceUnit: PriceUnit;
  capacityPlayers: number;
  tables: number;
  levels: CompetitivenessLevel[];
  amenities: Amenity[];
  description: string;
  host: string;
  rating: number;
  reviews: number;
  open24h: boolean;
  ownerId?: string;
  createdAt?: string;
}

export interface NewSpaceInput {
  title: string;
  city: string;
  neighborhood: string;
  pricePerHour: number;
  pricePerPlayer: number;
  priceUnit: PriceUnit;
  capacityPlayers: number;
  tables: number;
  levels: CompetitivenessLevel[];
  amenities: Amenity[];
  description: string;
  open24h: boolean;
}

export interface Booking {
  id: string;
  spaceId: string;
  spaceTitle: string;
  spaceImage: string;
  city: string;
  date: string;
  timeSlot: string;
  hours: number;
  players: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface NewBooking {
  spaceId: string;
  spaceTitle: string;
  spaceImage: string;
  city: string;
  date: string;
  timeSlot: string;
  hours: number;
  players: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
}

export const ALL_AMENITIES: Amenity[] = [
  "Tapetes incluidos",
  "Snacks & bebidas",
  "Luces regulables",
  "Música de ambiente",
  "Espacio para dados y contadores",
  "Token holders",
  "Cartas proxy permitidas",
  "Aire acondicionado",
  "WiFi alta velocidad",
  "Aparcamiento",
  "Abierto 24h",
  "Cocina disponible",
];

export const LEVELS: CompetitivenessLevel[] = ["Casual", "Optimizado", "cEDH"];
export const AMENITY_FILTERS: Amenity[] = [
  "Espacio para dados y contadores",
  "Tapetes incluidos",
  "Snacks & bebidas",
  "Luces regulables",
  "Música de ambiente",
  "Abierto 24h",
];
