import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  name: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currency: string;
  dateFormat: string;
}

interface ProfilePatch {
  fullName?: string;
  email?: string;
  currency?: string;
  dateFormat?: string;
}

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<"signed-in" | "confirm-email">;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string, currentPassword?: string) => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "você";
}

function fallbackName(user: User) {
  const metadataName = user.user_metadata?.['full_name'] ?? user.user_metadata?.['name'];
  if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();
  const localPart = user.email?.split("@")[0] ?? "Usuário";
  return localPart.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function resolveUser(authUser: User): Promise<AuthUser> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, currency, date_format")
    .eq("id", authUser.id)
    .maybeSingle();
  const fullName = data?.full_name?.trim() || fallbackName(authUser);
  return {
    id: authUser.id,
    name: firstName(fullName),
    fullName,
    email: authUser.email ?? "",
    ...(data?.avatar_url ? { avatarUrl: data.avatar_url } : {}),
    currency: data?.currency ?? "BRL",
    dateFormat: data?.date_format ?? "DD/MM/YYYY",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user ? await resolveUser(data.user) : null);
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      if (!session?.user) {
        setUser(null);
        setReady(true);
        return;
      }
      window.setTimeout(() => {
        void resolveUser(session.user).then((next) => {
          if (active) setUser(next);
        });
      }, 0);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return data.session ? "signed-in" : "confirm-email";
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) throw result.error;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string, currentPassword?: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
      ...(currentPassword ? { current_password: currentPassword } : {}),
    });
    if (error) throw error;
  }, []);

  const updateProfile = useCallback(async (patch: ProfilePatch) => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Sua sessão expirou. Entre novamente.");
    if (patch.email && patch.email !== authData.user.email) {
      const { error } = await supabase.auth.updateUser({ email: patch.email });
      if (error) throw error;
    }
    const profilePatch = {
      ...(patch.fullName !== undefined ? { full_name: patch.fullName } : {}),
      ...(patch.currency !== undefined ? { currency: patch.currency } : {}),
      ...(patch.dateFormat !== undefined ? { date_format: patch.dateFormat } : {}),
    };
    if (Object.keys(profilePatch).length) {
      const { error } = await supabase.from("profiles").update(profilePatch).eq("id", authData.user.id);
      if (error) throw error;
    }
    const { data: refreshed } = await supabase.auth.getUser();
    if (refreshed.user) setUser(await resolveUser(refreshed.user));
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, ready, signIn, signUp, signInWithGoogle, resetPassword, updatePassword, updateProfile, signOut }),
    [user, ready, signIn, signUp, signInWithGoogle, resetPassword, updatePassword, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}