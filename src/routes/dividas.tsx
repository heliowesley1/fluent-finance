import { createFileRoute } from "@tanstack/react-router";
import { HandCoins } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ProgressBar, StatCard, Surface } from "@/components/finance-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/dividas")({
  head: () => ({
    meta: [
      { title: "Dívidas — Nexus Finance" },
      {
        name: "description",
        content: "Controle credores, parcelas pagas, juros e o total que ainda falta quitar.",
      },
      { property: "og:title", content: "Dívidas — Nexus Finance" },
      { property: "og:description", content: "Timeline de pagamento e saldo devedor por credor." },
    ],
  }),
  component: DividasPage,
});

function DividasPage() {
  const { debts, payDebtInstallment } = useFinance();

  const original = debts.reduce((s, d) => s + d.originalAmount, 0);
  const restante = debts.reduce((s, d) => s + d.currentAmount, 0);

  return (
    <>
      <PageHeader title="Dívidas" subtitle="Quanto falta para você ficar livre." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total contratado" value={formatCurrency(original)} icon={HandCoins} />
        <StatCard label="Já pago" value={formatCurrency(original - restante)} tone="positive" />
        <StatCard label="Saldo devedor" value={formatCurrency(restante)} tone="negative" />
      </div>

      <div className="space-y-4">
        {debts.map((d) => {
          const pct = (d.installmentsPaid / d.installmentsTotal) * 100;
          return (
            <Surface key={d.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.creditor}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Próximo vencimento em {formatDate(d.dueDate)} · juros {d.interestRate}% a.m.
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {d.installmentsPaid}/{d.installmentsTotal} parcelas
                </Badge>
              </div>

              <ProgressBar className="mt-4" value={pct} />

              <div className="mt-4 grid gap-3 text-xs sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground">Valor original</p>
                  <p className="num font-medium">{formatCurrency(d.originalAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Saldo atual</p>
                  <p className="num font-medium text-destructive">{formatCurrency(d.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Parcelas restantes</p>
                  <p className="num font-medium">{d.installmentsTotal - d.installmentsPaid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor da parcela</p>
                  <p className="num font-medium">
                    {formatCurrency(d.originalAmount / d.installmentsTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-1">
                {Array.from({ length: d.installmentsTotal }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      "h-1.5 flex-1 rounded-full " +
                      (index < d.installmentsPaid ? "bg-primary" : "bg-muted")
                    }
                  />
                ))}
              </div>

              <div className="mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={d.installmentsPaid >= d.installmentsTotal}
                  onClick={() => {
                    payDebtInstallment(d.id);
                    toast.success(`Parcela de ${d.creditor} registrada como paga`);
                  }}
                >
                  Pagar parcela
                </Button>
              </div>
            </Surface>
          );
        })}
      </div>
    </>
  );
}
