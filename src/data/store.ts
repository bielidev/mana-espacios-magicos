import type { Space, Booking, NewSpaceInput, NewBooking, User } from "./spaces";
import { MOCK_SPACES } from "./mock-spaces";

const STORE_KEY = "manacrib_store";

interface PersistedStore {
  users: User[];
  spaces: Space[];
  bookings: Booking[];
}

function uid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function load(): PersistedStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as PersistedStore;
  } catch {
    // localStorage unavailable
  }
  return { users: [], spaces: [], bookings: [] };
}

function save(data: PersistedStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

function init() {
  const store = load();

  const domain = import.meta.env.VITE_APP_EMAIL_DOMAIN;
  const demoEmail = import.meta.env.VITE_APP_DEMO_EMAIL;
  const demoName = import.meta.env.VITE_APP_DEMO_NAME;
  const rawUsers = import.meta.env.VITE_APP_SEEDED_USERS ?? "";
  if (!domain) {
    console.warn("Falta la configuración de seguridad en el .env");
    return store;
  }

  if (store.spaces.length === 0 && MOCK_SPACES.length > 0) {
    const userList: string[] = rawUsers
      .split(",")
      .map((name: string) => name.trim())
      .filter(Boolean);

    const seededEmails: Record<string, string> = {};

    userList.forEach((name) => {
      const emailUser = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      seededEmails[name] = `${emailUser}@${domain}`;
    });

    if (store.users.length === 0) {
      Object.entries(seededEmails).forEach(([name, email]) => {
        store.users.push({
          id: uid(),
          email,
          name,
          role: "host",
        });
      });
      store.users.push({
        id: uid(),
        email: demoEmail,
        name: demoName,
        role: "player",
      });
    }

    store.spaces = MOCK_SPACES.map((s) => ({
      ...s,
      ownerId: store.users.find((u) => u.name === s.host)?.id,
      createdAt: "2025-01-01",
    }));

    save(store);
  }

  return store;
}

const _store = init();

function persist() {
  save(_store);
}

export function getUsers(): User[] {
  return _store.users;
}

export function findUserByEmail(email: string): User | undefined {
  return _store.users.find((u) => u.email === email.toLowerCase().trim());
}

export function registerUser(email: string, name: string, role: User["role"]): User {
  const existing = findUserByEmail(email);
  if (existing) throw new Error("EMAIL_EXISTS");
  const user: User = { id: uid(), email: email.toLowerCase().trim(), name, role };
  _store.users.push(user);
  persist();
  return user;
}

export function getSpaces(): Space[] {
  return _store.spaces;
}

export function getSpaceBySlug(slug: string): Space | undefined {
  return _store.spaces.find((s) => s.id === slug);
}

export function getSpacesByOwner(ownerId: string): Space[] {
  return _store.spaces.filter((s) => s.ownerId === ownerId);
}

export function createSpace(input: NewSpaceInput, ownerId: string): Space {
  const slug =
    input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || `espacio-${uid().slice(0, 8)}`;

  const owner = _store.users.find((u) => u.id === ownerId);
  const space: Space = {
    id: `${slug}-${uid().slice(0, 6)}`,
    ...input,
    image: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    host: owner?.name ?? "Anfitrión",
    rating: 0,
    reviews: 0,
    ownerId,
    createdAt: new Date().toISOString(),
  };
  _store.spaces.push(space);
  persist();
  return space;
}

export function updateSpace(id: string, input: Partial<NewSpaceInput>, ownerId: string): Space {
  const idx = _store.spaces.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("NOT_FOUND");
  if (_store.spaces[idx].ownerId !== ownerId) throw new Error("FORBIDDEN");
  _store.spaces[idx] = { ..._store.spaces[idx], ...input };
  persist();
  return _store.spaces[idx];
}

export function deleteSpace(id: string, ownerId: string): void {
  const idx = _store.spaces.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("NOT_FOUND");
  if (_store.spaces[idx].ownerId !== ownerId) throw new Error("FORBIDDEN");
  _store.spaces.splice(idx, 1);
  persist();
}

export function createBooking(input: NewBooking): Booking {
  const booking: Booking = { ...input, id: uid(), createdAt: new Date().toISOString() };
  _store.bookings.push(booking);
  persist();
  return booking;
}

export function getBookingsByEmail(email: string): Booking[] {
  return _store.bookings.filter((b) => b.guestEmail === email.toLowerCase().trim());
}

export function getBookingsBySpaceId(spaceId: string): Booking[] {
  return _store.bookings.filter((b) => b.spaceId === spaceId);
}
