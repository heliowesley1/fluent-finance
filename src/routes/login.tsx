import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Nexus Finance" },
      {
        name: "description",
        content: "Acesse sua conta Nexus Finance e visualize toda a sua vida financeira em segundos.",
      },
      { property: "og:title", content: "Entrar — Nexus Finance" },
      { property: "og:description", content: "Login seguro na sua plataforma de controle financeiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginEmail = String(data.get("email") ?? "").trim();
    const loginPassword = String(data.get("password") ?? "");
    if (!loginEmail.includes("@")) { toast.error("Informe um e-mail válido"); return; }
    if (loginPassword.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      toast.success("Login realizado");
      navigate({ to: "/", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (name.trim().length < 2) { toast.error("Informe seu nome"); return; }
    if (!email.includes("@")) { toast.error("Informe um e-mail válido"); return; }
    if (password.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    setLoading(true);
    try {
      const result = await signUp(name, email, password);
      if (result === "confirm-email") {
        toast.success("Conta criada. Confirme seu e-mail para entrar.");
      } else {
        toast.success(`Conta criada. Bem-vindo(a), ${name.split(" ")[0]}!`);
        navigate({ to: "/", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(form: HTMLFormElement) {
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!email.includes("@")) { toast.error("Informe seu e-mail acima"); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Enviamos o link de recuperação para seu e-mail");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar o link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          Nexus Finance
        </span>
        <div>
          <h2 className="max-w-[18ch] text-4xl leading-tight font-semibold tracking-tight">
            Sua vida financeira inteira, entendida em segundos.
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm text-muted-foreground">
            Contas, cartões, metas, investimentos e patrimônio em um painel só — com cadastro
            rápido e relatórios prontos.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Dados de demonstração já carregados.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre ou crie sua conta para continuar.
          </p>

          <Tabs defaultValue="entrar" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="entrar" className="flex-1">Entrar</TabsTrigger>
              <TabsTrigger value="criar" className="flex-1">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar" className="mt-6">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={(event) => {
                    const form = event.currentTarget.form;
                    if (form) void handleForgotPassword(form);
                  }}
                >
                  Esqueci minha senha
                </button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar" className="mt-6">
              <form className="space-y-4" onSubmit={handleSignUp}>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="voce@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou continue com
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await signInWithGoogle();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Não foi possível entrar com Google");
                setLoading(false);
              }
            }}
          >
            Continuar com Google
          </Button>
        </div>
      </div>
    </div>
  );
}
