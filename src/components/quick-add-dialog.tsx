import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, maskCurrency, parseCurrencyInput, todayISO } from "@/lib/format";
import { smartParse } from "@/lib/smart-parse";
import type { PaymentMethod, TransactionKind } from "@/lib/types";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialKind?: TransactionKind;
}

export function QuickAddDialog({ open, onOpenChange, initialKind = "despesa" }: Props) {
  const { categories, accounts, cards, addTransaction } = useFinance();

  const [kind, setKind] = useState<TransactionKind>(initialKind);
  const [smart, setSmart] = useState("");
  const [amount, setAmount] = useState("0,00");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("alimentacao");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id ?? "");
  const [cardId, setCardId] = useState(cards[0]?.id ?? "");
  const [date, setDate] = useState(todayISO());
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [installmentsOn, setInstallmentsOn] = useState(false);
  const [installments, setInstallments] = useState(12);

  useEffect(() => {
    if (open) setKind(initialKind);
  }, [open, initialKind]);

  const suggestion = useMemo(() => smartParse(smart), [smart]);

  const availableCategories = categories.filter((c) =>
    kind === "receita" ? c.kind === "receita" : c.kind === "despesa",
  );

  const numericAmount = parseCurrencyInput(amount);
  const perInstallment = installmentsOn && installments > 0 ? numericAmount / installments : 0;

  function applySuggestion() {
    if (!suggestion) return;
    setKind(suggestion.kind);
    setAmount(
      suggestion.amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
    setDescription(suggestion.description);
    if (suggestion.categoryId) setCategoryId(suggestion.categoryId);
    setSmart("");
  }

  function reset() {
    setSmart("");
    setAmount("0,00");
    setDescription("");
    setNotes("");
    setRecurring(false);
    setInstallmentsOn(false);
    setDate(todayISO());
  }

  function submit() {
    if (numericAmount <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }
    if (!description.trim()) {
      toast.error("Descreva o lançamento.");
      return;
    }

    addTransaction({
      kind,
      description: description.trim(),
      amount: numericAmount,
      date,
      categoryId: kind === "transferencia" ? undefined : categoryId,
      accountId: method === "credito" && kind === "despesa" ? undefined : accountId,
      cardId: method === "credito" && kind === "despesa" ? cardId : undefined,
      toAccountId: kind === "transferencia" ? toAccountId : undefined,
      method,
      status: "pago",
      notes: notes.trim() || undefined,
      recurring: recurring || undefined,
      installments: installmentsOn ? { current: 1, total: installments } : undefined,
    });

    toast.success("Lançamento salvo", {
      description: `${description.trim()} · ${formatCurrency(numericAmount)}`,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
          <DialogDescription>
            Cadastre em segundos. Use o campo inteligente ou preencha os detalhes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={kind} onValueChange={(v) => setKind(v as TransactionKind)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receita">Receita</TabsTrigger>
            <TabsTrigger value="despesa">Despesa</TabsTrigger>
            <TabsTrigger value="transferencia">Transferência</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div className="rounded-xl border border-dashed bg-muted/40 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-primary" />
              <Input
                value={smart}
                onChange={(e) => setSmart(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applySuggestion();
                  }
                }}
                placeholder='Lançamento inteligente: "Almoço 35"'
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {suggestion && (
              <button
                type="button"
                onClick={applySuggestion}
                className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-lg bg-background p-2 text-left text-xs transition-colors hover:bg-accent"
              >
                <Badge variant={suggestion.kind === "receita" ? "default" : "secondary"}>
                  {suggestion.kind === "receita" ? "Receita" : "Despesa"}
                </Badge>
                <span className="num font-medium">{formatCurrency(suggestion.amount)}</span>
                <span className="text-muted-foreground">{suggestion.description}</span>
                <span className="ml-auto text-muted-foreground">Usar sugestão</span>
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="valor">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valor"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(maskCurrency(e.target.value))}
                  className="num pl-9 text-base font-semibold"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Mercado do mês"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {kind !== "transferencia" && (
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Forma de pagamento</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {method === "credito" && kind === "despesa" ? (
              <div className="space-y-1.5">
                <Label>Cartão</Label>
                <Select value={cardId} onValueChange={setCardId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>{kind === "transferencia" ? "Conta de origem" : "Conta"}</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {kind === "transferencia" && (
              <div className="space-y-1.5">
                <Label>Conta de destino</Label>
                <Select value={toAccountId} onValueChange={setToAccountId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter((a) => a.id !== accountId)
                      .map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {kind === "despesa" && (
            <div className="space-y-3 rounded-xl border p-3">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={recurring}
                  onCheckedChange={(v) => setRecurring(Boolean(v))}
                />
                É recorrente
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={installmentsOn}
                  onCheckedChange={(v) => setInstallmentsOn(Boolean(v))}
                />
                É parcelado
              </label>
              {installmentsOn && (
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={2}
                    max={48}
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {installments}x de{" "}
                    <span className="num font-medium text-foreground">
                      {formatCurrency(perInstallment)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="obs">Observação</Label>
            <Textarea
              id="obs"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>Salvar lançamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
