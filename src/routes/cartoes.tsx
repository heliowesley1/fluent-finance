import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard as CreditCardIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { AddCardDialog, PayInvoiceDialog } from "@/components/entity-dialogs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — Nexus Finance" },
      {
        name: "description",
        content: "Faturas, limites, parcelamentos e vencimentos dos seus cartões de crédito.",
      },
      { property: "og:title", content: "Cartões — Nexus Finance" },
      {
        property: "og:description",
        content: "Acompanhe fatura atual, limite disponível e compras de cada cartão.",
      },
    ],
  }),
  component: CartoesPage,
});

function CartoesPage() {
  const { cards, transactions, categoryById } = useFinance();
  const [selected, setSelected] = useState(cards[0]?.id ?? "");
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const card = cards.find((c) => c.id === selected) ?? cards[0];

  const totalInvoice = cards.reduce((s, c) => s + c.currentInvoice, 0);
  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);
  const purchases = transactions.filter((t) => t.cardId === card?.id);

  return (
    <>
      <PageHeader
        title="Cartões"
        subtitle="Faturas e limites em tempo real."
        actions={
          <Button className="gap-2" onClick={() => setNewCardOpen(true)}>
            <Plus className="size-4" />
            Novo cartão
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Faturas abertas" value={formatCurrency(totalInvoice)} tone="negative" icon={CreditCardIcon} />
        <StatCard label="Limite total" value={formatCurrency(totalLimit)} />
        <StatCard label="Limite disponível" value={formatCurrency(totalLimit - totalInvoice)} tone="positive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          {cards.map((c) => {
            const usage = (c.currentInvoice / c.limit) * 100;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={
                  "w-full rounded-2xl p-5 text-left text-white shadow-[var(--shadow-float)] transition-transform hover:-translate-y-0.5 " +
                  (c.id === card?.id ? "ring-2 ring-primary/50" : "")
                }
                style={{
                  background: `linear-gradient(135deg, ${c.color}, color-mix(in oklab, ${c.color} 55%, black))`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-[11px] opacity-80">{c.bank}</p>
                  </div>
                  <span className="shrink-0 text-[11px] opacity-90">{c.brand}</span>
                </div>
                <p className="num mt-8 text-sm tracking-[0.3em] opacity-90">•••• {c.last4}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase opacity-75">Fatura atual</p>
                    <p className="num text-lg font-semibold">{formatCurrency(c.currentInvoice)}</p>
                  </div>
                  <p className="num text-[11px] opacity-85">{usage.toFixed(0)}% do limite</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-6 lg:col-span-2">
          {card && (
            <Surface
              title={`Fatura — ${card.name}`}
              action={
                <Badge variant="secondary">
                  Fecha {String(card.closingDay).padStart(2, "0")} · Vence{" "}
                  {String(card.dueDay).padStart(2, "0")}
                </Badge>
              }
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase">Fatura atual</p>
                  <p className="num text-xl font-semibold">{formatCurrency(card.currentInvoice)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase">Limite disponível</p>
                  <p className="num text-xl font-semibold text-success">
                    {formatCurrency(card.limit - card.currentInvoice)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase">Limite total</p>
                  <p className="num text-xl font-semibold">{formatCurrency(card.limit)}</p>
                </div>
              </div>
              <ProgressBar
                className="mt-5"
                value={(card.currentInvoice / card.limit) * 100}
                tone={card.currentInvoice / card.limit > 0.8 ? "destructive" : "primary"}
              />
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => setPayOpen(true)}>
                  Pagar fatura
                </Button>
                <Button variant="outline" onClick={() => toast.info("Estorno solicitado — acompanhe pelo app do banco")}>
                  Solicitar estorno
                </Button>
              </div>
            </Surface>
          )}

          <Surface title="Compras da fatura" className="p-0">
            <ul className="divide-y">
              {purchases.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(t.date)} · {categoryById(t.categoryId)?.name ?? "Outros"}
                      {t.installments && ` · ${t.installments.current}/${t.installments.total}`}
                      {t.recurring && " · recorrente"}
                    </p>
                  </div>
                  <span className="num shrink-0 text-sm font-medium">{formatCurrency(t.amount)}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </div>

      <AddCardDialog open={newCardOpen} onOpenChange={setNewCardOpen} />
      {card && <PayInvoiceDialog open={payOpen} onOpenChange={setPayOpen} cardId={card.id} />}
    </>
  );
}
