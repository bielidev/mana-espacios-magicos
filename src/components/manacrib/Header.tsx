import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Header() {
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
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="#explorar">Explorar</a>
          <a className="hover:text-foreground" href="#como-funciona">Cómo funciona</a>
          <a className="hover:text-foreground" href="#anfitriones">Para anfitriones</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
            Iniciar sesión
          </button>
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Sé anfitrión
          </button>
        </div>
      </div>
    </header>
  );
}