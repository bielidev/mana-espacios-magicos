import type { Space } from "./spaces";
import { MOCK_SPACES } from "./mock-spaces";

const BASE_URL = "http://localhost:3001";

export async function fetchBoats(): Promise<Space[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/boats`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("Failed to fetch boats");
    return res.json();
  } catch {
    console.warn("API not available, using mock data");
    return MOCK_SPACES;
  }
}

export async function fetchBoatBySlug(slug: string): Promise<Space> {
  try {
    const res = await fetch(`${BASE_URL}/api/boats/${slug}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) {
      if (res.status === 404) throw new Error("NOT_FOUND");
      throw new Error("Failed to fetch boat");
    }
    return res.json();
  } catch (err) {
    const mock = MOCK_SPACES.find((s) => s.id === slug);
    if (!mock) throw err;
    console.warn("API not available, using mock data");
    return mock;
  }
}
