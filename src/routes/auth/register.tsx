import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth";
import type { UserRole } from "@/data/spaces";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Crear cuenta · ManaCrib" },
      {
        name: "description",
        content:
          "Regístrate en ManaCrib como anfitrión o jugador y únete a la comunidad Commander.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("host");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    try {
      await register(email, password, name.trim(), role);
      router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-wide">
            Mana<span className="text-primary">Crib</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-[var(--shadow-card)] backdrop-blur">
          <h1 className="font-display text-xl">Crear cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Únete a la comunidad de Commander.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Nombre</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Email</span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Contraseña
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 4 caracteres"
                  required
                  minLength={4}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Tipo de cuenta
              </span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("host")}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                    role === "host"
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Anfitrión
                </button>
                <button
                  type="button"
                  onClick={() => setRole("player")}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                    role === "player"
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Jugador
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[image:var(--gradient-gold)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
