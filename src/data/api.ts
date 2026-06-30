import type { Space } from "./spaces";
import { getSpaces, getSpaceBySlug } from "./store";

export async function fetchBoats(): Promise<Space[]> {
  return getSpaces();
}

export async function fetchBoatBySlug(slug: string): Promise<Space> {
  const space = getSpaceBySlug(slug);
  if (!space) throw new Error("NOT_FOUND");
  return space;
}
