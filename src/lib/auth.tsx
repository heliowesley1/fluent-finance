import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  name: string;
  fullName: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => void;
  signUp: (fullName: string, email: string, password: string) => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  signOut: () => void;
}

const STORAGE_KEY = "nexus-finance:user";

const AuthContext = createContext<AuthState | null>(null);

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "você";
}

function nameFromEmail(email: string) {
  const raw = email.split("@")[0] ?? "usuario";
  const clean = raw.replace(/[._-]+/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback(
    (email: string) => {
      const full = nameFromEmail(email);
      persist({ name: firstName(full), fullName: full, email });
    },
    [persist],
  );

  const signUp = useCallback(
    (fullName: string, email: string) => {
      persist({ name: firstName(fullName), fullName, email });
    },
    [persist],
  );

  const updateProfile = useCallback(
    (patch: Partial<AuthUser>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        next.name = firstName(next.fullName);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const signOut = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthState>(
    () => ({ user, ready, signIn, signUp, updateProfile, signOut }),
    [user, ready, signIn, signUp, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
