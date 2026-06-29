import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, MapPin, Sparkles, Moon, Users } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import {
  SPACES,
  CITIES,
  LEVELS,
  AMENITY_FILTERS,
  type Amenity,
  type CompetitivenessLevel,
} from "@/data/spaces";
import { Header } from "@/components/manacrib/Header";
import { SpaceCard } from "@/components/manacrib/SpaceCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ManaCrib — Reserva mesas para Commander (MTG) en España" },
      {
        name: "description",
        content:
          "ManaCrib conecta jugadores de Magic: The Gathering con anfitriones que alquilan mesas y salas para partidas de Commander. Encuentra tu sitio para el próximo Commander Nocturno.",
      },
      { property: "og:title", content: "ManaCrib — Mesas para tu próximo Commander" },
      {
        property: "og:description",
        content:
          "Alquila mesas, salas o garajes acondicionados para jugar Magic: The Gathering en formato Commander. Casual, Optimizado o cEDH — tú eliges.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [city, setCity] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(20);
  const [levels, setLevels] = useState<CompetitivenessLevel[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [query, setQuery] = useState("");

  const toggle = <T extends string>(arr: T[], value: T, set: (v: T[]) => void) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const filtered = useMemo(() => {
    return SPACES.filter((s) => {
      if (city && s.city !== city) return false;
      const refPrice = s.priceUnit === "hora" ? s.pricePerHour : s.pricePerPlayer;
      if (refPrice > maxPrice) return false;
      if (levels.length && !levels.some((l) => s.levels.includes(l))) return false;
      if (amenities.length && !amenities.every((a) => s.amenities.includes(a))) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.city.toLowerCase().includes(q) &&
          !s.neighborhood.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [city, maxPrice, levels, amenities, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Mesa de Magic: The Gathering iluminada con velas"
            width={1920}
            height={1280}
            className="h-full w-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 md:pb-24 md:pt-32">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Commander Nocturno · MTG
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            Encuentra una mesa para tu próxima partida de{" "}
            <span className="bg-[image:var(--gradient-gold)] bg-clip-text text-transparent">
              Commander
            </span>
            .
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Lofts, salas privadas y garajes acondicionados en toda España.
            Reserva por horas o por jugador y juega hasta el amanecer.
          </p>

          {/* Search bar */}
          <div className="mt-10 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
              <label className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca por título o barrio…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">Toda España</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-xl bg-background/60 px-3 py-3">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <div className="flex w-full items-center gap-3 text-sm">
                  <span className="whitespace-nowrap text-muted-foreground">
                    Hasta {maxPrice}€
                  </span>
                  <input
                    type="range"
                    min={4}
                    max={20}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[var(--color-primary)]"
                  />
                </div>
              </label>
              <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Buscar
              </button>
            </div>

            {/* Filter chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 pb-1 pt-2">
              <span className="pr-1 text-xs uppercase tracking-wider text-muted-foreground">
                Nivel
              </span>
              {LEVELS.map((lvl) => {
                const active = levels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    onClick={() => toggle(levels, lvl, setLevels)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
              <span className="ml-3 pr-1 text-xs uppercase tracking-wider text-muted-foreground">
                Extras
              </span>
              {AMENITY_FILTERS.map((a) => {
                const active = amenities.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggle(amenities, a, setAmenities)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      active
                        ? "border-accent bg-accent/15 text-accent-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Moon className="h-4 w-4 text-primary" /> Sesiones nocturnas</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Pods de 4 a 16 jugadores</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Casual · Optimizado · cEDH</span>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section id="explorar" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              Espacios disponibles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "espacio" : "espacios"} encontrados
              {city ? ` en ${city}` : " en toda España"}.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No hay espacios que coincidan con tus filtros. Prueba a ampliar la búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <SpaceCard key={s.id} space={s} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} ManaCrib · Hecho para la comunidad de Commander.
          Magic: The Gathering™ es una marca de Wizards of the Coast. ManaCrib no está afiliado.
        </div>
      </footer>
    </div>
  );
}
