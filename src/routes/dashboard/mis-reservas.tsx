import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Users as UsersIcon,
  AlertCircle,
  Euro,
} from "lucide-react";
import { useAuth } from "@/data/auth";
import { getBookingsByEmail } from "@/data/store";
import { Header } from "@/components/manacrib/Header";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/dashboard/mis-reservas")({
  head: () => ({
    meta: [
      { title: "Mis reservas · ManaCrib" },
      { name: "description", content: "Consulta tus reservas de Commander." },
    ],
  }),
  component: MisReservasPage,
});

function MisReservasPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"proximas" | "pasadas">("proximas");
  const today = new Date().toISOString().split("T")[0];
  const bookings = useMemo(() => (user ? getBookingsByEmail(user.email) : []), [user]);

  const { upcoming, past } = useMemo(() => {
    const up: typeof bookings = [];
    const pa: typeof bookings = [];
    for (const b of bookings) {
      if (b.date >= today) up.push(b);
      else pa.push(b);
    }
    return {
      upcoming: up.sort((a, b) => a.date.localeCompare(b.date)),
      past: pa.sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [bookings, today]);

  const items = tab === "proximas" ? upcoming : past;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl">Inicia sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Debes iniciar sesión para ver tus reservas.
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Mis reservas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.name}, tienes {upcoming.length}{" "}
            {upcoming.length === 1 ? "reserva próxima" : "reservas próximas"}.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No tienes reservas aún.</p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Explorar espacios
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setTab("proximas")}
                className={`rounded-full px-4 py-1.5 text-xs transition ${tab === "proximas" ? "bg-primary/15 text-primary" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                Próximas ({upcoming.length})
              </button>
              <button
                onClick={() => setTab("pasadas")}
                className={`rounded-full px-4 py-1.5 text-xs transition ${tab === "pasadas" ? "bg-primary/15 text-primary" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                Pasadas ({past.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No hay reservas {tab === "proximas" ? "próximas" : "pasadas"}.
                </div>
              ) : (
                items.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-4"
                  >
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={b.spaceImage}
                        alt={b.spaceTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm text-foreground">{b.spaceTitle}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {new Date(b.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {b.timeSlot} · {b.hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <UsersIcon className="h-3 w-3" /> {b.players} jug.
                        </span>
                        <span className="flex items-center gap-1">
                          <Euro className="h-3 w-3" /> {b.totalPrice}€
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        Reservado por {b.guestName} · {b.guestEmail}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
