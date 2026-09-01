import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function submit(message: string) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(message);
      navigate({ to: "/" });
    }, 600);
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
          <h1 className="text-2xl font-semibold tracking-tight">Bem-vinda de volta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para continuar acompanhando suas finanças.
          </p>

          <Tabs defaultValue="entrar" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="entrar" className="flex-1">Entrar</TabsTrigger>
              <TabsTrigger value="criar" className="flex-1">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar" className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">E-mail</Label>
                <Input id="login-email" type="email" placeholder="voce@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Senha</Label>
                <Input id="login-password" type="password" placeholder="••••••••" />
              </div>
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toast.info("Enviamos um link de recuperação para seu e-mail")}
              >
                Esqueci minha senha
              </button>
              <Button className="w-full" disabled={loading} onClick={() => submit("Login realizado")}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </TabsContent>

            <TabsContent value="criar" className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name">Nome</Label>
                <Input id="signup-name" placeholder="Seu nome" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input id="signup-email" type="email" placeholder="voce@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Senha</Label>
                <Input id="signup-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" disabled={loading} onClick={() => submit("Conta criada")}>
                {loading ? "Criando..." : "Criar conta"}
              </Button>
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
            onClick={() => toast.info("Google Login será conectado ao backend")}
          >
            Continuar com Google
          </Button>
        </div>
      </div>
    </div>
  );
}
