import { Link, useRouter } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/data/auth";

export function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isHost = user?.role === "host" || user?.role === "both";
  const isPlayer = user?.role === "player" || user?.role === "both";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-wide">
            Mana<span className="text-primary">Crib</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="/#explorar">
            Explorar
          </a>
          {user ? (
            <>
              {isHost && (
                <Link to="/espacios/nuevo" className="hover:text-foreground">
                  Publicar espacio
                </Link>
              )}
              {isHost && (
                <Link to="/dashboard/mis-espacios" className="hover:text-foreground">
                  Mis espacios
                </Link>
              )}
              {isPlayer && (
                <Link to="/dashboard/mis-reservas" className="hover:text-foreground">
                  Mis reservas
                </Link>
              )}
            </>
          ) : (
            <>
              <a className="hover:text-foreground" href="/#como-funciona">
                Cómo funciona
              </a>
              <a className="hover:text-foreground" href="/#anfitriones">
                Para anfitriones
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:block">{user.name}</span>
              <button
                onClick={() => logout()}
                className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Sé anfitrión
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="ml-1 flex items-center justify-center md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            <a
              href="/#explorar"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Explorar
            </a>
            {user ? (
              <>
                {isHost && (
                  <Link
                    to="/espacios/nuevo"
                    onClick={() => setOpen(false)}
                    className="hover:text-foreground"
                  >
                    Publicar espacio
                  </Link>
                )}
                {isHost && (
                  <Link
                    to="/dashboard/mis-espacios"
                    onClick={() => setOpen(false)}
                    className="hover:text-foreground"
                  >
                    Mis espacios
                  </Link>
                )}
                {isPlayer && (
                  <Link
                    to="/dashboard/mis-reservas"
                    onClick={() => setOpen(false)}
                    className="hover:text-foreground"
                  >
                    Mis reservas
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground"
                >
                  Cerrar sesión ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="hover:text-foreground"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setOpen(false)}
                  className="hover:text-foreground"
                >
                  Sé anfitrión
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
