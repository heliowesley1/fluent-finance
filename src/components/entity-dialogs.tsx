import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, maskCurrency, parseCurrencyInput } from "@/lib/format";
import type { Account, CreditCard, Investment } from "@/lib/types";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

function useMoney(initial = "") {
  const [value, setValue] = useState(initial);
  return {
    value,
    number: parseCurrencyInput(value),
    onChange: (raw: string) => setValue(maskCurrency(raw)),
    reset: () => setValue(""),
  };
}

/* ------------------------------- Nova conta ------------------------------- */

export function AddAccountDialog({ open, onOpenChange }: Props) {
  const { addAccount } = useFinance();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState<Account["type"]>("corrente");
  const money = useMoney();

  function submit() {
    if (!name.trim()) return toast.error("Informe o nome da conta");
    addAccount({ name: name.trim(), institution: institution.trim() || name.trim(), type, balance: money.number });
    toast.success("Conta criada");
    setName("");
    setInstitution("");
    money.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova conta</DialogTitle>
          <DialogDescription>Adicione uma conta bancária, digital ou carteira.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="acc-name">Nome</Label>
            <Input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Conta Nubank" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-inst">Instituição</Label>
            <Input id="acc-inst" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Nubank" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as Account["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Corrente</SelectItem>
                  <SelectItem value="poupanca">Poupança</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="carteira">Carteira</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acc-balance">Saldo inicial</Label>
              <Input id="acc-balance" inputMode="decimal" value={money.value} onChange={(e) => money.onChange(e.target.value)} placeholder="R$ 0,00" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Criar conta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------- Transferência ------------------------------ */

export function TransferDialog({ open, onOpenChange }: Props) {
  const { accounts, transfer } = useFinance();
  const [from, setFrom] = useState(accounts[0]?.id ?? "");
  const [to, setTo] = useState(accounts[1]?.id ?? "");
  const money = useMoney();

  useEffect(() => {
    if (open) {
      setFrom(accounts[0]?.id ?? "");
      setTo(accounts[1]?.id ?? "");
    }
  }, [open, accounts]);

  function submit() {
    if (!from || !to || from === to) return toast.error("Escolha contas diferentes");
    if (money.number <= 0) return toast.error("Informe um valor válido");
    transfer(from, to, money.number);
    toast.success(`Transferência de ${formatCurrency(money.number)} concluída`);
    money.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir entre contas</DialogTitle>
          <DialogDescription>O saldo é atualizado nas duas contas.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>De</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue placeholder="Conta de origem" /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Para</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue placeholder="Conta de destino" /></SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tr-amount">Valor</Label>
            <Input id="tr-amount" inputMode="decimal" value={money.value} onChange={(e) => money.onChange(e.target.value)} placeholder="R$ 0,00" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Transferir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Cartão --------------------------------- */

const CARD_COLORS = ["#7c3aed", "#0ea5e9", "#f97316", "#10b981", "#e11d48"];

export function AddCardDialog({ open, onOpenChange }: Props) {
  const { addCard } = useFinance();
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [brand, setBrand] = useState<CreditCard["brand"]>("Mastercard");
  const [closingDay, setClosingDay] = useState("1");
  const [dueDay, setDueDay] = useState("10");
  const [color, setColor] = useState(CARD_COLORS[0]!);
  const money = useMoney();

  function submit() {
    if (!name.trim()) return toast.error("Informe o nome do cartão");
    if (money.number <= 0) return toast.error("Informe o limite do cartão");
    addCard({
      name: name.trim(),
      bank: bank.trim() || name.trim(),
      brand,
      limit: money.number,
      closingDay: Number(closingDay) || 1,
      dueDay: Number(dueDay) || 10,
      color,
      last4: String(Math.floor(1000 + Math.random() * 9000)),
    });
    toast.success("Cartão adicionado");
    setName("");
    setBank("");
    money.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo cartão</DialogTitle>
          <DialogDescription>Cadastre limite, fechamento e vencimento.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="card-name">Nome</Label>
              <Input id="card-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nubank Ultravioleta" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-bank">Banco</Label>
              <Input id="card-bank" value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Nubank" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Bandeira</Label>
              <Select value={brand} onValueChange={(v) => setBrand(v as CreditCard["brand"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="Elo">Elo</SelectItem>
                  <SelectItem value="Amex">Amex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-limit">Limite</Label>
              <Input id="card-limit" inputMode="decimal" value={money.value} onChange={(e) => money.onChange(e.target.value)} placeholder="R$ 0,00" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="card-close">Dia de fechamento</Label>
              <Input id="card-close" type="number" min={1} max={31} value={closingDay} onChange={(e) => setClosingDay(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-due">Dia de vencimento</Label>
              <Input id="card-due" type="number" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {CARD_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Cor ${c}`}
                  onClick={() => setColor(c)}
                  className={"size-7 rounded-full transition-transform " + (color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "")}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Adicionar cartão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------- Pagar fatura ------------------------------- */

export function PayInvoiceDialog({
  open,
  onOpenChange,
  cardId,
}: Props & { cardId: string }) {
  const { accounts, cards, payInvoice } = useFinance();
  const card = cards.find((c) => c.id === cardId);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");

  function submit() {
    if (!card) return;
    if (card.currentInvoice <= 0) return toast.info("Esta fatura já está paga");
    if (!accountId) return toast.error("Escolha uma conta");
    payInvoice(card.id, accountId);
    toast.success(`Fatura de ${formatCurrency(card.currentInvoice)} paga`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar fatura</DialogTitle>
          <DialogDescription>
            {card ? `${card.name} — ${formatCurrency(card.currentInvoice)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Debitar da conta</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name} — {formatCurrency(a.balance)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Confirmar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Investimento ------------------------------ */

export function AddInvestmentDialog({ open, onOpenChange }: Props) {
  const { addInvestment } = useFinance();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [klass, setKlass] = useState<Investment["class"]>("Renda fixa");
  const invested = useMoney();
  const current = useMoney();

  function submit() {
    if (!name.trim()) return toast.error("Informe o nome do ativo");
    if (invested.number <= 0) return toast.error("Informe o valor investido");
    addInvestment({
      name: name.trim(),
      ...(ticker.trim() ? { ticker: ticker.trim().toUpperCase() } : {}),
      class: klass,
      invested: invested.number,
      currentValue: current.number || invested.number,
    });
    toast.success("Ativo adicionado à carteira");
    setName("");
    setTicker("");
    invested.reset();
    current.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo ativo</DialogTitle>
          <DialogDescription>Cadastre um investimento na sua carteira.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-name">Nome</Label>
              <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tesouro Selic 2029" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-ticker">Ticker (opcional)</Label>
              <Input id="inv-ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="PETR4" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Classe</Label>
            <Select value={klass} onValueChange={(v) => setKlass(v as Investment["class"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Renda fixa", "Ações", "FIIs", "ETFs", "Cripto", "Tesouro", "CDB"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-invested">Valor investido</Label>
              <Input id="inv-invested" inputMode="decimal" value={invested.value} onChange={(e) => invested.onChange(e.target.value)} placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-current">Valor atual</Label>
              <Input id="inv-current" inputMode="decimal" value={current.value} onChange={(e) => current.onChange(e.target.value)} placeholder="R$ 0,00" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Adicionar ativo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
