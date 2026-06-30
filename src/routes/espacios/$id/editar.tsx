import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, AlertCircle, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/data/auth";
import { getSpaceBySlug, updateSpace, deleteSpace } from "@/data/store";
import {
  ALL_AMENITIES,
  LEVELS,
  type CompetitivenessLevel,
  type Amenity,
  type PriceUnit,
} from "@/data/spaces";
import { Header } from "@/components/manacrib/Header";

export const Route = createFileRoute("/espacios/$id/editar")({
  loader: ({ params }) => {
    const space = getSpaceBySlug(params.id);
    if (!space) throw notFound();
    return { space };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Editar ${loaderData.space.title} · ManaCrib` }],
  }),
  component: EditSpacePage,
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

function EditSpacePage() {
  const { space } = Route.useLoaderData();
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(space.title);
  const [city, setCity] = useState(space.city);
  const [neighborhood, setNeighborhood] = useState(space.neighborhood);
  const [description, setDescription] = useState(space.description);
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(space.priceUnit);
  const [pricePerHour, setPricePerHour] = useState(space.pricePerHour);
  const [pricePerPlayer, setPricePerPlayer] = useState(space.pricePerPlayer);
  const [capacityPlayers, setCapacityPlayers] = useState(space.capacityPlayers);
  const [tables, setTables] = useState(space.tables);
  const [open24h, setOpen24h] = useState(space.open24h);
  const [levels, setLevels] = useState<CompetitivenessLevel[]>(space.levels);
  const [amenities, setAmenities] = useState<Amenity[]>(space.amenities);

  useEffect(() => {
    if (!user || (space.ownerId && space.ownerId !== user.id)) {
      toast.error("No tienes permiso para editar este espacio");
      router.navigate({ to: "/" });
    }
  }, [user, space, router]);

  const toggle = <T,>(arr: T[], value: T, set: (v: T[]) => void) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setSaving(true);
    try {
      updateSpace(
        space.id,
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
      toast.success("Espacio actualizado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm("¿Eliminar este espacio? No se podrá recuperar.")) return;
    setDeleting(true);
    try {
      deleteSpace(space.id, user.id);
      toast.success("Espacio eliminado");
      router.navigate({ to: "/dashboard/mis-espacios" });
    } catch (err) {
      toast.error("Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          to="/dashboard/mis-espacios"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Mis espacios
        </Link>

        <h1 className="mt-6 font-display text-2xl sm:text-3xl">Editar espacio</h1>

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
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
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
            <Field label="Barrio">
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm outline-none"
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
                <span className="text-xs text-muted-foreground">Precio por hora (€)</span>
                <input
                  type="number"
                  min={0}
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Precio por jugador (€)</span>
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
            <Field label="Capacidad">
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
            <span className="text-sm">Abierto 24h</span>
          </label>

          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Niveles</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LEVELS.map((lvl) => {
                const active = levels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggle(levels, lvl, setLevels)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Extras</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_AMENITIES.map((a) => {
                const active = amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggle(amenities, a, setAmenities)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-accent bg-accent/15 text-accent-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
                  >
                    {active && <Check className="mr-1 inline h-3 w-3" />}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[image:var(--gradient-gold)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
