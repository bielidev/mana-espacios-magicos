import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MapPin, Star, Users, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth";
import { getSpacesByOwner, deleteSpace } from "@/data/store";
import { Header } from "@/components/manacrib/Header";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/mis-espacios")({
  head: () => ({
    meta: [
      { title: "Mis espacios · ManaCrib" },
      { name: "description", content: "Gestiona tus espacios de Commander publicados." },
    ],
  }),
  component: MisEspaciosPage,
});

function MisEspaciosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl">Inicia sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Debes iniciar sesión para ver tus espacios.
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

  const spaces = getSpacesByOwner(user.id);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este espacio? No se podrá recuperar.")) return;
    setDeleting(id);
    try {
      deleteSpace(id, user.id);
      toast.success("Espacio eliminado");
      router.invalidate();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">Mis espacios</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {spaces.length} {spaces.length === 1 ? "espacio publicado" : "espacios publicados"}
            </p>
          </div>
          <Link
            to="/espacios/nuevo"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nuevo espacio
          </Link>
        </div>

        {spaces.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Aún no has publicado ningún espacio.
            </p>
            <Link
              to="/espacios/nuevo"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Publicar mi primer espacio
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {spaces.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/30"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base text-foreground">{s.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.neighborhood}, {s.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Hasta {s.capacityPlayers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {s.rating} ({s.reviews}
                      )
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/espacios/$id/editar"
                    params={{ id: s.id }}
                    className="rounded-xl border border-border/60 p-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="rounded-xl border border-destructive/30 p-2.5 text-destructive/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
