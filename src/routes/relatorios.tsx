import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatCard, Surface } from "@/components/finance-ui";
import { EvolutionChart, MonthlyComparisonChart, CategoryDonut } from "@/components/charts";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, shortMonth } from "@/lib/format";
import { monthlyHistory, patrimonyHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Nexus Finance" },
      {
        name: "description",
        content: "Relatórios de receitas, despesas, fluxo de caixa e evolução patrimonial por período.",
      },
      { property: "og:title", content: "Relatórios — Nexus Finance" },
      { property: "og:description", content: "Análises financeiras com exportação em CSV e PDF." },
    ],
  }),
  component: RelatoriosPage,
});

const RANGES = [
  { id: "7", label: "7 dias" },
  { id: "30", label: "30 dias" },
  { id: "90", label: "3 meses" },
  { id: "180", label: "6 meses" },
  { id: "365", label: "1 ano" },
];

function RelatoriosPage() {
  const { transactions, categoryById } = useFinance();
  const [range, setRange] = useState("30");

  const limit = new Date();
  limit.setDate(limit.getDate() - Number(range));
  const inRange = transactions.filter((t) => new Date(`${t.date}T12:00:00`) >= limit);

  const receitas = inRange.filter((t) => t.kind === "receita").reduce((s, t) => s + t.amount, 0);
  const despesas = inRange.filter((t) => t.kind === "despesa").reduce((s, t) => s + t.amount, 0);

  const byCategory = Object.entries(
    inRange.reduce<Record<string, number>>((acc, t) => {
      if (t.kind !== "despesa" || !t.categoryId) return acc;
      acc[t.categoryId] = (acc[t.categoryId] ?? 0) + t.amount;
      return acc;
    }, {}),
  ).map(([id, value]) => ({
    name: categoryById(id)?.name ?? "Outros",
    value,
    color: categoryById(id)?.color ?? "var(--chart-8)",
  }));

  const comparison = monthlyHistory.map((m) => ({
    label: shortMonth(`${m.month}-01`),
    receitas: m.receitas,
    despesas: m.despesas,
    saldo: m.saldo,
  }));

  const patrimony = patrimonyHistory.map((p) => ({
    label: shortMonth(`${p.month}-01`),
    ativos: p.ativos,
    passivos: p.passivos,
    liquido: p.ativos - p.passivos,
  }));

  function exportCsv() {
    const rows = [
      ["Data", "Descrição", "Tipo", "Categoria", "Valor"],
      ...inRange.map((t) => [
        t.date,
        t.description,
        t.kind,
        categoryById(t.categoryId)?.name ?? "",
        String(t.amount),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-${range}-dias.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado em CSV");
  }

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Análises do período selecionado."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={exportCsv}>
              <Download className="size-4" />
              CSV
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <FileText className="size-4" />
              PDF
            </Button>
          </div>
        }
      />

      <Tabs value={range} onValueChange={setRange} className="mb-6">
        <TabsList className="flex-wrap">
          {RANGES.map((r) => (
            <TabsTrigger key={r.id} value={r.id} className="text-xs">
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Receitas no período" value={formatCurrency(receitas)} tone="positive" />
        <StatCard label="Despesas no período" value={formatCurrency(despesas)} tone="negative" />
        <StatCard
          label="Resultado"
          value={formatCurrency(receitas - despesas)}
          tone={receitas - despesas >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface title="Despesas por categoria">
          <CategoryDonut data={byCategory} />
        </Surface>
        <Surface title="Fluxo mensal" className="lg:col-span-2">
          <MonthlyComparisonChart data={comparison} />
        </Surface>
      </div>

      <div className="mt-6">
        <Surface title="Evolução patrimonial">
          <EvolutionChart
            data={patrimony}
            series={[
              { key: "ativos", name: "Ativos", color: "var(--chart-1)" },
              { key: "passivos", name: "Passivos", color: "var(--chart-2)" },
              { key: "liquido", name: "Líquido", color: "var(--chart-4)" },
            ]}
          />
        </Surface>
      </div>
    </>
  );
}
