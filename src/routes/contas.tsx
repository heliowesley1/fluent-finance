import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, Building2, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAccountDialog, TransferDialog } from "@/components/entity-dialogs";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatCard, Surface } from "@/components/finance-ui";
import { EvolutionChart } from "@/components/charts";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatDate, shortMonth } from "@/lib/format";
import { monthKeys } from "@/lib/mock-data";

export const Route = createFileRoute("/contas")({
  head: () => ({
    meta: [
      { title: "Contas — Nexus Finance" },
      {
        name: "description",
        content: "Gerencie contas correntes, digitais, poupança e dinheiro físico em um só lugar.",
      },
      { property: "og:title", content: "Contas — Nexus Finance" },
      {
        property: "og:description",
        content: "Saldos, histórico e evolução de cada uma das suas contas.",
      },
    ],
  }),
  component: ContasPage,
});

function ContasPage() {
  const { accounts, transactions } = useFinance();
  const [selected, setSelected] = useState(accounts[0]?.id ?? "");
  const [newAccountOpen, setNewAccountOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const account = accounts.find((a) => a.id === selected) ?? accounts[0];
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const accountTx = transactions.filter(
    (t) => t.accountId === account?.id || t.toAccountId === account?.id,
  );
  const entradas = accountTx
    .filter((t) => t.kind === "receita" || t.toAccountId === account?.id)
    .reduce((s, t) => s + t.amount, 0);
  const saidas = accountTx
    .filter((t) => t.kind === "despesa" || (t.kind === "transferencia" && t.accountId === account?.id))
    .reduce((s, t) => s + t.amount, 0);

  const evolution = monthKeys(6).map((key, index) => ({
    label: shortMonth(`${key}-01`),
    saldo: Math.round(((account?.balance ?? 0) * (0.72 + index * 0.055)) * 100) / 100,
  }));

  return (
    <>
      <PageHeader
        title="Contas"
        subtitle="Saldos consolidados e histórico por conta."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => toast.info("Transferência entre contas em breve")}
            >
              <ArrowLeftRight className="size-4" />
              Transferir
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Nova conta adicionada ao rascunho")}>
              <Plus className="size-4" />
              Nova conta
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saldo consolidado" value={formatCurrency(total)} icon={Wallet} />
        <StatCard label="Entradas na conta" value={formatCurrency(entradas)} tone="positive" />
        <StatCard label="Saídas na conta" value={formatCurrency(saidas)} tone="negative" />
        <StatCard label="Contas ativas" value={String(accounts.length)} icon={Building2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={
                "surface w-full p-4 text-left transition-all hover:shadow-[var(--shadow-float)] " +
                (a.id === account?.id ? "ring-2 ring-primary/40" : "")
              }
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.institution}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 capitalize">{a.type}</Badge>
              </div>
              <p className="num mt-3 text-lg font-semibold">{formatCurrency(a.balance)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Última movimentação em {formatDate(a.lastMovementAt)}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Surface title={`Evolução — ${account?.name ?? ""}`}>
            <EvolutionChart
              data={evolution}
              series={[{ key: "saldo", name: "Saldo", color: "var(--chart-1)" }]}
            />
          </Surface>

          <Surface title="Histórico da conta" className="p-0">
            <ul className="divide-y">
              {accountTx.slice(0, 10).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(t.date)}</p>
                  </div>
                  <span
                    className={
                      "num shrink-0 text-sm font-medium " +
                      (t.kind === "receita" ? "text-success" : t.kind === "despesa" ? "text-destructive" : "")
                    }
                  >
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </div>
    </>
  );
}
