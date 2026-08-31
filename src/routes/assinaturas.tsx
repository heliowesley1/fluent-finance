import { createFileRoute } from "@tanstack/react-router";
import { Repeat } from "lucide-react";
import { PageHeader, StatCard, Surface } from "@/components/finance-ui";
import { Badge } from "@/components/ui/badge";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/assinaturas")({
  head: () => ({
    meta: [
      { title: "Assinaturas — Nexus Finance" },
      {
        name: "description",
        content: "Contas recorrentes e assinaturas com periodicidade, valor e calendário de cobrança.",
      },
      { property: "og:title", content: "Assinaturas — Nexus Finance" },
      { property: "og:description", content: "Veja tudo que se repete todo mês no seu orçamento." },
    ],
  }),
  component: AssinaturasPage,
});

function AssinaturasPage() {
  const { subscriptions, categoryById } = useFinance();

  const mensal = subscriptions
    .filter((s) => s.periodicity === "mensal")
    .reduce((sum, s) => sum + s.amount, 0);
  const anual = subscriptions
    .filter((s) => s.periodicity === "anual")
    .reduce((sum, s) => sum + s.amount, 0);

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
  const today = new Date().getDate();

  return (
    <>
      <PageHeader
        title="Assinaturas e recorrentes"
        subtitle="Tudo que se repete, organizado por data de cobrança."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Custo mensal" value={formatCurrency(mensal)} icon={Repeat} tone="negative" />
        <StatCard label="Custo anual estimado" value={formatCurrency(mensal * 12 + anual)} />
        <StatCard label="Assinaturas ativas" value={String(subscriptions.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface title="Lista" className="p-0 lg:col-span-2">
          <ul className="divide-y">
            {subscriptions.map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {categoryById(s.categoryId)?.name} · {s.source} · dia{" "}
                    {String(s.chargeDay).padStart(2, "0")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="secondary" className="capitalize">{s.periodicity}</Badge>
                  <span className="num text-sm font-medium">{formatCurrency(s.amount)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Surface>

        <Surface title="Calendário financeiro">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const charges = subscriptions.filter((s) => s.chargeDay === day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  title={charges.map((c) => `${c.name} — ${formatCurrency(c.amount)}`).join("\n")}
                  className={
                    "flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] transition-colors " +
                    (charges.length
                      ? "border-primary/40 bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground") +
                    (isToday ? " ring-2 ring-primary/50" : "")
                  }
                >
                  {day}
                  {charges.length > 0 && <span className="mt-0.5 size-1 rounded-full bg-primary" />}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Dias destacados possuem cobranças recorrentes agendadas.
          </p>
        </Surface>
      </div>
    </>
  );
}
