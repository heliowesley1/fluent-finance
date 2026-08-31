import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard, Surface } from "@/components/finance-ui";
import { CategoryDonut } from "@/components/charts";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — Nexus Finance" },
      {
        name: "description",
        content: "Carteira de renda fixa, ações, FIIs, ETFs e cripto com rentabilidade consolidada.",
      },
      { property: "og:title", content: "Investimentos — Nexus Finance" },
      { property: "og:description", content: "Distribuição da carteira e lucro por ativo." },
    ],
  }),
  component: InvestimentosPage,
});

const CLASS_COLORS: Record<string, string> = {
  Tesouro: "var(--chart-1)",
  CDB: "var(--chart-5)",
  "Ações": "var(--chart-4)",
  FIIs: "var(--chart-3)",
  ETFs: "var(--chart-7)",
  Cripto: "var(--chart-6)",
};

function InvestimentosPage() {
  const { investments } = useFinance();

  const invested = investments.reduce((s, i) => s + i.invested, 0);
  const current = investments.reduce((s, i) => s + i.currentValue, 0);
  const profit = current - invested;

  const byClass = Object.entries(
    investments.reduce<Record<string, number>>((acc, i) => {
      acc[i.class] = (acc[i.class] ?? 0) + i.currentValue;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value, color: CLASS_COLORS[name] ?? "var(--chart-8)" }));

  return (
    <>
      <PageHeader
        title="Investimentos"
        subtitle="Sua carteira consolidada, pronta para integrar cotações em tempo real."
        actions={
          <Button className="gap-2" onClick={() => toast.success("Novo ativo adicionado ao rascunho")}>
            <Plus className="size-4" />
            Novo ativo
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Valor investido" value={formatCurrency(invested)} icon={LineChart} />
        <StatCard label="Valor atual" value={formatCurrency(current)} />
        <StatCard
          label="Lucro / prejuízo"
          value={formatCurrency(profit)}
          tone={profit >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Rentabilidade"
          value={formatPercent((profit / invested) * 100)}
          tone={profit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface title="Distribuição da carteira">
          <CategoryDonut data={byClass} />
          <div className="mt-4 space-y-2.5">
            {byClass.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="num font-medium">{((c.value / current) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface title="Ativos" className="p-0 lg:col-span-2">
          <ul className="divide-y">
            {investments.map((i) => {
              const gain = i.currentValue - i.invested;
              return (
                <li key={i.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {i.class}
                      {i.ticker ? ` · ${i.ticker}` : ""} · {((i.currentValue / current) * 100).toFixed(1)}% da carteira
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="num text-sm font-semibold">{formatCurrency(i.currentValue)}</p>
                    <p className={"num text-[11px] " + (gain >= 0 ? "text-success" : "text-destructive")}>
                      {gain >= 0 ? "+" : ""}
                      {formatCurrency(gain)} ({formatPercent((gain / i.invested) * 100)})
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Surface>
      </div>
    </>
  );
}
