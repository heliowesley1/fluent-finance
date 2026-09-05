import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Surface } from "@/components/finance-ui";
import { useFinance } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Nexus Finance" },
      {
        name: "description",
        content: "Perfil, tema, moeda, formato de data, categorias e preferências de notificação.",
      },
      { property: "og:title", content: "Configurações — Nexus Finance" },
      { property: "og:description", content: "Ajuste a plataforma do jeito que você trabalha." },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { profile, categories, accounts } = useFinance();
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, updatePassword, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [currency, setCurrency] = useState(user?.currency ?? "BRL");
  const [dateFormat, setDateFormat] = useState(user?.dateFormat ?? "DD/MM/YYYY");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <>
      <PageHeader title="Configurações" subtitle="Preferências da sua conta e da aplicação." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Surface title="Perfil">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={async () => {
                  if (fullName.trim().length < 2) { toast.error("Informe seu nome"); return; }
                  try {
                    await updateProfile({ fullName: fullName.trim(), email: email.trim(), currency, dateFormat });
                    toast.success("Perfil atualizado");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o perfil");
                  }
                }}
              >
                Salvar alterações
              </Button>
              <Button variant="outline" onClick={() => void signOut()}>
                Sair da conta
              </Button>
            </div>
          </div>
        </Surface>

        <Surface title="Preferências">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tema</Label>
              <Select value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Moeda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL — R$</SelectItem>
                  <SelectItem value="USD">USD — $</SelectItem>
                  <SelectItem value="EUR">EUR — €</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Formato de data</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Surface>

        <Surface title="Notificações">
          <div className="space-y-4">
            {[
              "Fatura do cartão acima de 80%",
              "Contas a vencer nos próximos 3 dias",
              "Orçamento de categoria quase estourado",
              "Progresso de metas",
            ].map((label, index) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Switch defaultChecked={index !== 3} />
              </div>
            ))}
          </div>
        </Surface>

        <Surface title="Segurança">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Autenticação em duas etapas</span>
              <Switch />
            </div>
            <Button variant="outline" onClick={async () => {
              if (!currentPassword || newPassword.length < 6) { toast.error("Informe a senha atual e uma nova senha com 6 caracteres"); return; }
              try {
                await updatePassword(newPassword, currentPassword);
                setCurrentPassword("");
                setNewPassword("");
                toast.success("Senha atualizada");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a senha");
              }
            }}>
              Atualizar senha
            </Button>
          </div>
        </Surface>

        <Surface title="Categorias">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c.id} variant="secondary" className="gap-1.5">
                <span className="size-2 rounded-full" style={{ background: c.color }} />
                {c.name}
              </Badge>
            ))}
          </div>
        </Surface>

        <Surface title="Contas conectadas">
          <ul className="divide-y">
            {accounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="truncate">{a.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{a.institution}</span>
              </li>
            ))}
          </ul>
        </Surface>
      </div>
    </>
  );
}
