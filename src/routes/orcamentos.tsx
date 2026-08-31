import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, parseCurrencyInput } from "@/lib/format";

export const Route = createFileRoute("/orcamentos")({
  head: () => ({
    meta: [
      { title: "Orçamentos — Nexus Finance" },
      {
        name: "description",
        content: "Defina limites mensais por categoria e acompanhe o quanto ainda pode gastar.",
      },
      { property: "og:title", content: "Orçamentos — Nexus Finance" },
      {
        property: "og:description",
        content: "Limites por categoria com estados de atenção e estouro.",
      },
    ],
  }),
  component: OrcamentosPage,
});

function OrcamentosPage() {
  const { budgets, categoryById, setBudgetLimit } = useFinance();

  const limite = budgets.reduce((s, b) => s + b.limit, 0);
  const gasto = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <>
      <PageHeader title="Orçamentos" subtitle="Limites mensais por categoria." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Orçamento total" value={formatCurrency(limite)} icon={Target} />
        <StatCard label="Gasto no mês" value={formatCurrency(gasto)} tone="negative" />
        <StatCard
          label="Disponível"
          value={formatCurrency(limite - gasto)}
          tone={limite - gasto >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map((b) => {
          const category = categoryById(b.categoryId);
          const pct = (b.spent / b.limit) * 100;
          const state = pct >= 100 ? "Estourado" : pct >= 80 ? "Atenção" : "Normal";
          const tone = pct >= 100 ? "destructive" : pct >= 80 ? "warning" : "primary";

          return (
            <Surface key={b.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: category?.color }}
                    />
                    <span className="truncate">{category?.name}</span>
                  </p>
                  <p className="num mt-1 text-[11px] text-muted-foreground">
                    Gasto {formatCurrency(b.spent)} de {formatCurrency(b.limit)}
                  </p>
                </div>
                <Badge
                  variant={state === "Normal" ? "secondary" : state === "Atenção" ? "outline" : "destructive"}
                  className="shrink-0"
                >
                  {state}
                </Badge>
              </div>

              <ProgressBar className="mt-4" value={pct} tone={tone as "primary"} />

              <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                <p className="num text-xs text-muted-foreground">
                  Restante{" "}
                  <span className={b.limit - b.spent < 0 ? "text-destructive" : "text-success"}>
                    {formatCurrency(b.limit - b.spent)}
                  </span>
                </p>
                <Input
                  defaultValue={String(b.limit)}
                  className="h-8 w-28 text-right"
                  aria-label={`Limite de ${category?.name}`}
                  onBlur={(e) => {
                    const next = parseCurrencyInput(e.target.value);
                    if (!next) return;
                    setBudgetLimit(b.categoryId, next);
                    toast.success("Limite atualizado");
                  }}
                />
              </div>
            </Surface>
          );
        })}
      </div>
    </>
  );
}
