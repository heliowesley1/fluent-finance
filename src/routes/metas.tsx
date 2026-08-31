import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { EvolutionChart } from "@/components/charts";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatDate, parseCurrencyInput, shortMonth } from "@/lib/format";
import { monthKeys } from "@/lib/mock-data";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Metas — Nexus Finance" },
      {
        name: "description",
        content: "Crie metas financeiras, acompanhe o progresso e veja quanto falta para conquistar.",
      },
      { property: "og:title", content: "Metas — Nexus Finance" },
      { property: "og:description", content: "Reserva, viagem, carro: acompanhe cada objetivo." },
    ],
  }),
  component: MetasPage,
});

function MetasPage() {
  const { goals, addGoal, contributeToGoal } = useFinance();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const total = goals.reduce((s, g) => s + g.target, 0);
  const acumulado = goals.reduce((s, g) => s + g.current, 0);

  const evolution = monthKeys(6).map((key, index) => ({
    label: shortMonth(`${key}-01`),
    acumulado: Math.round(acumulado * (0.55 + index * 0.09)),
  }));

  function submit() {
    const value = parseCurrencyInput(target);
    if (!name.trim() || !value) {
      toast.error("Informe nome e valor objetivo");
      return;
    }
    addGoal({
      name: name.trim(),
      target: value,
      current: 0,
      deadline: deadline || "2027-12-31",
      category: "Geral",
    });
    toast.success("Meta criada");
    setOpen(false);
    setName("");
    setTarget("");
    setDeadline("");
  }

  return (
    <>
      <PageHeader
        title="Metas financeiras"
        subtitle="Objetivos com progresso, prazo e valor restante."
        actions={
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nova meta
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total das metas" value={formatCurrency(total)} icon={Flag} />
        <StatCard label="Já acumulado" value={formatCurrency(acumulado)} tone="positive" />
        <StatCard label="Falta acumular" value={formatCurrency(total - acumulado)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => {
          const pct = (g.current / g.target) * 100;
          return (
            <Surface key={g.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{g.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.category} · até {formatDate(g.deadline)}
                  </p>
                </div>
                <span className="num shrink-0 text-sm font-semibold">{pct.toFixed(0)}%</span>
              </div>
              <ProgressBar className="mt-4" value={pct} />
              <p className="num mt-2 text-xs text-muted-foreground">
                {formatCurrency(g.current)} de {formatCurrency(g.target)} · faltam{" "}
                {formatCurrency(Math.max(0, g.target - g.current))}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  contributeToGoal(g.id, 250);
                  toast.success("R$ 250,00 adicionados à meta");
                }}
              >
                Depositar R$ 250
              </Button>
            </Surface>
          );
        })}
      </div>

      <div className="mt-6">
        <Surface title="Evolução do acumulado">
          <EvolutionChart
            data={evolution}
            series={[{ key: "acumulado", name: "Acumulado", color: "var(--chart-1)" }]}
          />
        </Surface>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova meta</DialogTitle>
            <DialogDescription>Defina um objetivo e acompanhe o progresso.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal-name">Nome</Label>
              <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Reserva de emergência" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-target">Valor objetivo</Label>
              <Input id="goal-target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="10.000,00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-deadline">Prazo</Label>
              <Input id="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit}>Criar meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
