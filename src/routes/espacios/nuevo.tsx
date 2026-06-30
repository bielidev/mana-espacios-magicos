import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/data/auth";
import { createSpace } from "@/data/store";
import {
  ALL_AMENITIES,
  LEVELS,
  type CompetitivenessLevel,
  type Amenity,
  type PriceUnit,
} from "@/data/spaces";
import { Header } from "@/components/manacrib/Header";

export const Route = createFileRoute("/espacios/nuevo")({
  head: () => ({
    meta: [
      { title: "Publicar espacio · ManaCrib" },
      {
        name: "description",
        content: "Publica tu espacio de Commander y empieza a recibir reservas.",
      },
    ],
  }),
  component: NewSpacePage,
});

const CITIES = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Bilbao",
  "Granada",
  "Zaragoza",
  "Málaga",
];

function NewSpacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("hora");
  const [pricePerHour, setPricePerHour] = useState(10);
  const [pricePerPlayer, setPricePerPlayer] = useState(8);
  const [capacityPlayers, setCapacityPlayers] = useState(4);
  const [tables, setTables] = useState(1);
  const [open24h, setOpen24h] = useState(false);
  const [levels, setLevels] = useState<CompetitivenessLevel[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl">Debes iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Solo los anfitriones pueden publicar espacios.
          </p>
          <Link
            to="/auth/login"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const toggle = <T,>(arr: T[], value: T, set: (v: T[]) => void) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!city) {
      setError("Selecciona una ciudad");
      return;
    }
    if (levels.length === 0) {
      setError("Selecciona al menos un nivel de competitividad");
      return;
    }

    setSaving(true);
    try {
      const space = createSpace(
        {
          title: title.trim(),
          city,
          neighborhood: neighborhood.trim(),
          description: description.trim(),
          priceUnit,
          pricePerHour,
          pricePerPlayer,
          capacityPlayers,
          tables,
          open24h,
          levels,
          amenities,
        },
        user.id,
      );
      toast.success("Espacio publicado");
      router.navigate({ to: "/espacios/$id/editar", params: { id: space.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <h1 className="mt-6 font-display text-2xl sm:text-3xl">Publicar espacio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa los datos de tu sala de Commander para que los jugadores la encuentren.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Field label="Título del espacio">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Loft del Conjurador en Malasaña"
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ciudad">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
              >
                <option value="">Selecciona</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Barrio / zona">
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ej: Malasaña"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe el ambiente, las mesas, el horario…"
              className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>

          <div className="rounded-xl border border-border/40 bg-card/30 p-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Precio</span>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setPriceUnit("hora")}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${priceUnit === "hora" ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground"}`}
              >
                Por hora
              </button>
              <button
                type="button"
                onClick={() => setPriceUnit("jugador")}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${priceUnit === "jugador" ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground"}`}
              >
                Por jugador
              </button>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  {priceUnit === "hora" ? "Precio por hora (€)" : "Precio por hora (€, opcional)"}
                </span>
                <input
                  type="number"
                  min={0}
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  {priceUnit === "jugador"
                    ? "Precio por jugador (€)"
                    : "Precio por jugador (€, opcional)"}
                </span>
                <input
                  type="number"
                  min={0}
                  value={pricePerPlayer}
                  onChange={(e) => setPricePerPlayer(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Capacidad (jugadores)">
              <input
                type="number"
                min={1}
                max={32}
                value={capacityPlayers}
                onChange={(e) => setCapacityPlayers(Number(e.target.value))}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
              />
            </Field>
            <Field label="Mesas">
              <input
                type="number"
                min={1}
                max={10}
                value={tables}
                onChange={(e) => setTables(Number(e.target.value))}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
              />
            </Field>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
            <input
              type="checkbox"
              checked={open24h}
              onChange={(e) => setOpen24h(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span className="text-sm">Abierto 24h — disponible para sesiones nocturnas</span>
          </label>

          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Niveles de competitividad
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LEVELS.map((lvl) => {
                const active = levels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggle(levels, lvl, setLevels)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Extras incluidos
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_AMENITIES.map((a) => {
                const active = amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggle(amenities, a, setAmenities)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-accent bg-accent/15 text-accent-foreground"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && <Check className="mr-1 inline h-3 w-3" />}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[image:var(--gradient-gold)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-50"
          >
            {saving ? "Publicando…" : "Publicar espacio"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
