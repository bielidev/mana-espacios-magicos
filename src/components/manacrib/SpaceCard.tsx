import { Link } from "@tanstack/react-router";
import { MapPin, Star, Users } from "lucide-react";
import type { Space } from "@/data/spaces";

const levelTone: Record<string, string> = {
  Casual: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Optimizado: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  cEDH: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Link
      to="/space/$id"
      params={{ id: space.id }}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card/50 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={space.image}
          alt={space.title}
          loading="lazy"
          width={1280}
          height={896}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {space.levels.map((lvl) => (
            <span
              key={lvl}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium backdrop-blur ${levelTone[lvl]}`}
            >
              {lvl}
            </span>
          ))}
          {space.open24h && (
            <span className="ml-auto rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur">
              24h
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base leading-snug text-foreground">{space.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {space.rating}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {space.neighborhood}, {space.city}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Hasta {space.capacityPlayers}
          </span>
        </div>
        <div className="pt-1">
          <span className="font-display text-lg text-primary">
            {space.priceUnit === "hora" ? space.pricePerHour : space.pricePerPlayer}€
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            / {space.priceUnit === "hora" ? "hora" : "jugador"}
          </span>
        </div>
      </div>
    </Link>
  );
}
