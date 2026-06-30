import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/data/auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · ManaCrib" },
      {
        name: "description",
        content: "Accede a tu cuenta de ManaCrib para gestionar tus espacios y reservas.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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
          <h1 className="font-display text-xl">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accede para publicar espacios o gestionar tus reservas.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

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
                  placeholder="••••••"
                  required
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[image:var(--gradient-gold)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>

          <div className="mt-4 rounded-xl border border-border/30 bg-background/40 p-3">
            <p className="text-xs font-medium text-muted-foreground">Cuentas de demostración:</p>
          </div>
        </div>
      </div>
    </div>
  );
}
