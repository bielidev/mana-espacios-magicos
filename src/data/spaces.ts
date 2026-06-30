export type CompetitivenessLevel = "Casual" | "Optimizado" | "cEDH";
export type PriceUnit = "hora" | "jugador";

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
}

export const LEVELS: CompetitivenessLevel[] = ["Casual", "Optimizado", "cEDH"];
export const AMENITY_FILTERS: Amenity[] = [
  "Espacio para dados y contadores",
  "Tapetes incluidos",
  "Snacks & bebidas",
  "Luces regulables",
  "Música de ambiente",
  "Abierto 24h",
];
