import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CreditCard as CreditCardIcon,
  Gem,
  PiggyBank,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { CashFlowChart, CategoryDonut, MonthlyComparisonChart } from "@/components/charts";
import { useFinance } from "@/lib/finance-store";
import { useQuickAdd } from "@/components/app-shell";
import { formatCurrency, greeting, shortMonth, formatDate } from "@/lib/format";
import { monthlyHistory, patrimonyItems, upcomingBills } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nexus Finance" },
      {
        name: "description",
        content:
          "Visão completa das suas finanças: saldo, receitas, despesas, metas e cartões em um só painel.",
      },
      { property: "og:title", content: "Dashboard — Nexus Finance" },
      {
        property: "og:description",
        content: "Entenda sua vida financeira em poucos segundos.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, transactions, accounts, cards, goals, categories } = useFinance();
  const quickAdd = useQuickAdd();
  const [period, setPeriod] = useState<"dia" | "semana" | "mes">("dia");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - 30);
  const monthTx = transactions.filter((t) => new Date(`${t.date}T12:00:00`) >= windowStart);

  const receitas = monthTx
    .filter((t) => t.kind === "receita")
    .reduce((s, t) => s + t.amount, 0);
  const despesas = monthTx
    .filter((t) => t.kind === "despesa")
    .reduce((s, t) => s + t.amount, 0);
  const saldoTotal = accounts.reduce((s, a) => s + a.balance, 0);

  const ativos = patrimonyItems
    .filter((p) => p.type === "ativo")
    .reduce((s, p) => s + p.value, 0);
  const passivos = patrimonyItems
    .filter((p) => p.type === "passivo")
    .reduce((s, p) => s + p.value, 0);

  const cashFlow = useMemo(() => {
    const buckets = new Map<string, { receitas: number; despesas: number }>();
    const source = transactions.filter((t) => t.kind !== "transferencia");

    for (const t of source) {
      let key = t.date;
      if (period === "mes") key = t.date.slice(0, 7);
      if (period === "semana") {
        const d = new Date(`${t.date}T12:00:00`);
        d.setDate(d.getDate() - d.getDay());
        key = d.toISOString().slice(0, 10);
      }
      const current = buckets.get(key) ?? { receitas: 0, despesas: 0 };
      if (t.kind === "receita") current.receitas += t.amount;
      else current.despesas += t.amount;
      buckets.set(key, current);
    }

    return [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([key, value]) => ({
        label: period === "mes" ? shortMonth(`${key}-01`) : key.slice(8) + "/" + key.slice(5, 7),
        ...value,
      }));
  }, [transactions, period]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTx) {
      if (t.kind !== "despesa" || !t.categoryId) continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return [...map.entries()]
      .map(([id, value]) => {
        const category = categories.find((c) => c.id === id);
        return { id, name: category?.name ?? "Outros", value, color: category?.color ?? "var(--chart-8)" };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTx, categories]);

  const comparison = monthlyHistory.map((m) => ({
    label: shortMonth(`${m.month}-01`),
    receitas: m.receitas,
    despesas: m.despesas,
    saldo: m.saldo,
  }));

  const selectedDetails = selectedCategory
    ? monthTx.filter(
        (t) => categories.find((c) => c.id === t.categoryId)?.name === selectedCategory,
      )
    : [];

  return (
    <>
      <PageHeader
        title={`${greeting(profile.name)} 👋`}
        subtitle="Resumo dos últimos 30 dias. Tudo em dia por aqui."
        actions={
          <Button className="gap-2" onClick={() => quickAdd.open("despesa")}>
            <Plus className="size-4" />
            Adicionar
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        <StatCard
          label="Saldo total"
          value={formatCurrency(saldoTotal)}
          delta={8.4}
          icon={Wallet}
          footer="em relação ao mês anterior"
        />
        <StatCard
          label="Receitas"
          value={formatCurrency(receitas)}
          tone="positive"
          icon={TrendingUp}
          footer="recebido no período"
        />
        <StatCard
          label="Despesas"
          value={formatCurrency(despesas)}
          tone="negative"
          icon={TrendingDown}
          footer="gasto no período"
        />
        <StatCard
          label="Saldo do período"
          value={formatCurrency(receitas - despesas)}
          tone={receitas - despesas >= 0 ? "positive" : "negative"}
          icon={PiggyBank}
          footer="receitas menos despesas"
        />
        <StatCard
          label="Patrimônio líquido"
          value={formatCurrency(ativos - passivos)}
          icon={Gem}
          footer="ativos menos passivos"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Surface
          className="lg:col-span-2"
          title="Fluxo de caixa"
          action={
            <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <TabsList className="h-8">
                <TabsTrigger value="dia" className="text-xs">Dia</TabsTrigger>
                <TabsTrigger value="semana" className="text-xs">Semana</TabsTrigger>
                <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <CashFlowChart data={cashFlow} />
        </Surface>

        <Surface title="Despesas por categoria">
          <CategoryDonut data={byCategory} onSelect={setSelectedCategory} />
          <div className="mt-4 space-y-2.5">
            {byCategory.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="num font-medium">{formatCurrency(c.value)}</span>
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="mt-4 rounded-lg border bg-muted/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold">{selectedCategory}</span>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedCategory(null)}
                >
                  Fechar
                </button>
              </div>
              <div className="space-y-1.5">
                {selectedDetails.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex justify-between text-xs">
                    <span className="truncate text-muted-foreground">{t.description}</span>
                    <span className="num">{formatCurrency(t.amount)}</span>
                  </div>
                ))}
                {selectedDetails.length === 0 && (
                  <p className="text-xs text-muted-foreground">Sem lançamentos neste mês.</p>
                )}
              </div>
            </div>
          )}
        </Surface>
      </div>

      <div className="mt-6">
        <Surface title="Comparação mensal">
          <MonthlyComparisonChart data={comparison} />
        </Surface>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Surface
          title="Próximas contas"
          action={
            <Link to="/lancamentos" className="text-xs font-medium text-primary hover:underline">
              Ver todas
            </Link>
          }
        >
          <div className="divide-y">
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{bill.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CalendarClock className="size-3" />
                    Vence em {bill.dueInDays} dias
                  </p>
                </div>
                <span className="num shrink-0 text-sm font-medium">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface
          title="Cartões de crédito"
          action={
            <Link to="/cartoes" className="text-xs font-medium text-primary hover:underline">
              Ver faturas
            </Link>
          }
        >
          <div className="space-y-4">
            {cards.map((card) => {
              const available = card.limit - card.currentInvoice;
              return (
                <div key={card.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                      <CreditCardIcon className="size-4 shrink-0" style={{ color: card.color }} />
                      <span className="truncate">{card.name}</span>
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      Venc. {String(card.dueDay).padStart(2, "0")}
                    </Badge>
                  </div>
                  <p className="num mt-3 text-lg font-semibold">
                    {formatCurrency(card.currentInvoice)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Fatura atual</p>
                  <ProgressBar
                    className="mt-3"
                    value={(card.currentInvoice / card.limit) * 100}
                    tone={card.currentInvoice / card.limit > 0.8 ? "destructive" : "primary"}
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Disponível <span className="num">{formatCurrency(available)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface
          title="Metas financeiras"
          action={
            <Link to="/metas" className="text-xs font-medium text-primary hover:underline">
              Ver todas
            </Link>
          }
        >
          <div className="space-y-5">
            {goals.slice(0, 3).map((goal) => {
              const pct = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="truncate font-medium">{goal.name}</span>
                    <span className="num text-muted-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <ProgressBar value={pct} />
                  <p className="num mt-1.5 text-[11px] text-muted-foreground">
                    {formatCurrency(goal.current)} de {formatCurrency(goal.target)} · até{" "}
                    {formatDate(goal.deadline)}
                  </p>
                </div>
              );
            })}
          </div>
          <Link
            to="/metas"
            className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Criar nova meta <ArrowRight className="size-3" />
          </Link>
        </Surface>
      </div>
    </>
  );
}
