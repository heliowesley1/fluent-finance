import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Redefinir senha — Nexus Finance" },
    { name: "description", content: "Crie uma nova senha para sua conta Nexus Finance." },
    { property: "og:title", content: "Redefinir senha — Nexus Finance" },
    { property: "og:description", content: "Recupere o acesso seguro à sua conta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validRecovery, setValidRecovery] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    setValidRecovery(hash.get("type") === "recovery" || query.get("type") === "recovery");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    if (password.length < 6) { toast.error("A senha deve ter ao menos 6 caracteres"); return; }
    if (password !== confirmation) { toast.error("As senhas não coincidem"); return; }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Senha atualizada");
      navigate({ to: "/", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <span className="mb-6 grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><KeyRound className="size-5" /></span>
        <h1 className="text-2xl font-semibold">Crie uma nova senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">{validRecovery ? "Use uma senha com pelo menos 6 caracteres." : "Abra esta página pelo link enviado ao seu e-mail."}</p>
        {validRecovery ? <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5"><Label htmlFor="new-password">Nova senha</Label><Input id="new-password" name="password" type="password" autoComplete="new-password" /></div>
          <div className="space-y-1.5"><Label htmlFor="confirmation">Confirmar senha</Label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" /></div>
          <Button className="w-full" type="submit" disabled={loading}>{loading ? "Atualizando..." : "Atualizar senha"}</Button>
        </form> : <Button className="mt-8 w-full" variant="outline" onClick={() => navigate({ to: "/login" })}>Voltar para entrar</Button>}
      </div>
    </div>
  );
}