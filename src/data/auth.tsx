import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import type { User } from "./spaces";
import { findUserByEmail, registerUser } from "./store";

const SESSION_KEY = "manacrib_session";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: User["role"]) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // not in browser
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const found = findUserByEmail(email);
      if (!found) throw new Error("Credenciales inválidas");
      if (!password || password.length < 4) throw new Error("Credenciales inválidas");
      setUser(found);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
      } catch {
        // not in browser
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string, role: User["role"]) => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 400));
        if (!password || password.length < 4)
          throw new Error("La contraseña debe tener al menos 4 caracteres");
        const created = registerUser(email, name, role);
        setUser(created);
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(created));
        } catch {
          // not in browser
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // not in browser
    }
    router.navigate({ to: "/" });
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
