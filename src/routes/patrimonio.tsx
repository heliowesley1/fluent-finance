import { createFileRoute } from "@tanstack/react-router";
import { Gem } from "lucide-react";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { EvolutionChart } from "@/components/charts";
import { formatCurrency, shortMonth } from "@/lib/format";
import { patrimonyHistory, patrimonyItems } from "@/lib/mock-data";

export const Route = createFileRoute("/patrimonio")({
  head: () => ({
    meta: [
      { title: "Patrimônio — Nexus Finance" },
      {
        name: "description",
        content: "Ativos, passivos e a evolução do seu patrimônio líquido mês a mês.",
      },
      { property: "og:title", content: "Patrimônio — Nexus Finance" },
      { property: "og:description", content: "Quanto você realmente tem, descontadas as dívidas." },
    ],
  }),
  component: PatrimonioPage,
});

function PatrimonioPage() {
  const ativos = patrimonyItems.filter((p) => p.type === "ativo");
  const passivos = patrimonyItems.filter((p) => p.type === "passivo");
  const totalAtivos = ativos.reduce((s, p) => s + p.value, 0);
  const totalPassivos = passivos.reduce((s, p) => s + p.value, 0);

  const evolution = patrimonyHistory.map((p) => ({
    label: shortMonth(`${p.month}-01`),
    ativos: p.ativos,
    passivos: p.passivos,
    liquido: p.ativos - p.passivos,
  }));

  return (
    <>
      <PageHeader title="Patrimônio" subtitle="Ativos menos passivos, com histórico de 12 meses." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de ativos" value={formatCurrency(totalAtivos)} tone="positive" />
        <StatCard label="Total de passivos" value={formatCurrency(totalPassivos)} tone="negative" />
        <StatCard
          label="Patrimônio líquido"
          value={formatCurrency(totalAtivos - totalPassivos)}
          icon={Gem}
          delta={6.2}
        />
      </div>

      <Surface title="Evolução patrimonial" className="mb-6">
        <EvolutionChart
          data={evolution}
          series={[
            { key: "ativos", name: "Ativos", color: "var(--chart-1)" },
            { key: "passivos", name: "Passivos", color: "var(--chart-2)" },
            { key: "liquido", name: "Líquido", color: "var(--chart-4)" },
          ]}
        />
      </Surface>

      <div className="grid gap-6 lg:grid-cols-2">
        <Surface title="Ativos">
          <ul className="space-y-4">
            {ativos.map((item) => (
              <li key={item.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.name}</span>
                  <span className="num font-medium">{formatCurrency(item.value)}</span>
                </div>
                <ProgressBar className="mt-2" value={(item.value / totalAtivos) * 100} />
                <p className="mt-1 text-[11px] text-muted-foreground">{item.group}</p>
              </li>
            ))}
          </ul>
        </Surface>

        <Surface title="Passivos">
          <ul className="space-y-4">
            {passivos.map((item) => (
              <li key={item.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.name}</span>
                  <span className="num font-medium text-destructive">
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <ProgressBar
                  className="mt-2"
                  value={(item.value / totalPassivos) * 100}
                  tone="destructive"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">{item.group}</p>
              </li>
            ))}
          </ul>
        </Surface>
      </div>
    </>
  );
}
