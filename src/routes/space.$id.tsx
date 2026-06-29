import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Layers,
  Sparkles,
  Check,
  Moon,
  Shield,
} from "lucide-react";
import { getSpace, type Space } from "@/data/spaces";
import { Header } from "@/components/manacrib/Header";

export const Route = createFileRoute("/space/$id")({
  loader: ({ params }) => {
    const space = getSpace(params.id);
    if (!space) throw notFound();
    return { space };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.space;
    if (!s) return { meta: [{ title: "Espacio no encontrado · ManaCrib" }] };
    return {
      meta: [
        { title: `${s.title} · ${s.city} · ManaCrib` },
        { name: "description", content: s.description.slice(0, 155) },
        { property: "og:title", content: `${s.title} · ${s.city}` },
        { property: "og:description", content: s.description.slice(0, 155) },
        { property: "og:image", content: s.image },
        { name: "twitter:image", content: s.image },
      ],
    };
  },
  component: SpaceDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Este espacio se ha desvanecido</h1>
        <p className="mt-3 text-muted-foreground">
          Quizá fue contraconjurado. Vuelve al inicio y prueba con otro.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Algo salió mal</h1>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Reintentar
        </button>
      </div>
    </div>
  ),
});

const levelTone: Record<string, string> = {
  Casual: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Optimizado: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  cEDH: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

function SpaceDetail() {
  const { space } = Route.useLoaderData() as { space: Space };
  const [active, setActive] = useState(0);
  const [hours, setHours] = useState(3);
  const [players, setPlayers] = useState(4);

  const total =
    space.priceUnit === "hora"
      ? space.pricePerHour * hours
      : space.pricePerPlayer * players;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a los espacios
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {space.levels.map((lvl) => (
                <span
                  key={lvl}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${levelTone[lvl]}`}
                >
                  {lvl}
                </span>
              ))}
              {space.open24h && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  Abierto 24h
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">{space.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {space.neighborhood}, {space.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" /> {space.rating}{" "}
                <span className="text-muted-foreground">({space.reviews} reseñas)</span>
              </span>
              <span className="flex items-center gap-1.5">
                Anfitrión: <span className="text-foreground">{space.host}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <img
              src={space.gallery[active]}
              alt={space.title}
              width={1280}
              height={896}
              className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {space.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border transition ${
                  i === active
                    ? "border-primary shadow-[var(--shadow-glow)]"
                    : "border-border/60 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={g}
                  alt={`Vista ${i + 1}`}
                  loading="lazy"
                  width={640}
                  height={448}
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={<Users className="h-4 w-4" />} label="Jugadores" value={`Hasta ${space.capacityPlayers}`} />
              <Stat icon={<Layers className="h-4 w-4" />} label="Mesas" value={`${space.tables}`} />
              <Stat icon={<Moon className="h-4 w-4" />} label="Horario" value={space.open24h ? "24h" : "Tarde / noche"} />
              <Stat icon={<Shield className="h-4 w-4" />} label="Niveles" value={space.levels.join(" · ")} />
            </div>

            <div>
              <h2 className="font-display text-xl">Sobre este espacio</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {space.description}
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl">Extras incluidos</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {space.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 text-sm"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 shadow-[var(--shadow-card)] backdrop-blur">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-primary">
                  {space.priceUnit === "hora" ? space.pricePerHour : space.pricePerPlayer}€
                </span>
                <span className="text-sm text-muted-foreground">
                  / {space.priceUnit === "hora" ? "hora" : "jugador"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {space.priceUnit === "hora"
                  ? `También: ${space.pricePerPlayer}€ por jugador`
                  : `También: ${space.pricePerHour}€ por hora`}
              </p>

              <div className="mt-6 space-y-4">
                {space.priceUnit === "hora" ? (
                  <Field label={`Horas: ${hours}h`}>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full accent-[var(--color-primary)]"
                    />
                  </Field>
                ) : (
                  <Field label={`Jugadores: ${players}`}>
                    <input
                      type="range"
                      min={2}
                      max={space.capacityPlayers}
                      value={Math.min(players, space.capacityPlayers)}
                      onChange={(e) => setPlayers(Number(e.target.value))}
                      className="w-full accent-[var(--color-primary)]"
                    />
                  </Field>
                )}

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-sm text-muted-foreground">Total estimado</span>
                  <span className="font-display text-2xl text-foreground">{total}€</span>
                </div>

                <button className="w-full rounded-xl bg-[image:var(--gradient-gold)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Reservar
                  </span>
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Aún no se te cobrará nada. Confirmación en menos de 1h.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="mt-16 border-t border-border/60 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} ManaCrib · Hecho para la comunidad de Commander.
        </div>
      </footer>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}