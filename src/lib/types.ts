export type TransactionKind = "receita" | "despesa" | "transferencia";

export type TransactionStatus = "pago" | "pendente" | "agendado";

export type PaymentMethod =
  | "pix"
  | "debito"
  | "credito"
  | "dinheiro"
  | "boleto"
  | "transferencia";

export interface Category {
  id: string;
  name: string;
  kind: "receita" | "despesa";
  color: string; // css var token, e.g. "var(--chart-1)"
  icon: string; // lucide icon name key
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: "corrente" | "poupanca" | "digital" | "carteira" | "dinheiro";
  balance: number;
  lastMovementAt: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  brand: "Visa" | "Mastercard" | "Elo" | "Amex";
  limit: number;
  currentInvoice: number;
  closingDay: number;
  dueDay: number;
  color: string;
  last4: string;
}

export interface Transaction {
  id: string;
  kind: TransactionKind;
  description: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  categoryId?: string | undefined;
  accountId?: string | undefined;
  cardId?: string | undefined;
  toAccountId?: string | undefined;
  method: PaymentMethod;
  status: TransactionStatus;
  notes?: string | undefined;
  recurring?: boolean | undefined;
  installments?: { current: number; total: number } | undefined;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  description?: string;
}

export interface Investment {
  id: string;
  name: string;
  ticker?: string;
  class: "Renda fixa" | "Ações" | "FIIs" | "ETFs" | "Cripto" | "Tesouro" | "CDB";
  invested: number;
  currentValue: number;
}

export interface Debt {
  id: string;
  creditor: string;
  originalAmount: number;
  currentAmount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  interestRate: number;
  dueDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  periodicity: "mensal" | "semanal" | "anual";
  chargeDay: number;
  categoryId: string;
  source: string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueInDays: number;
  source: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "ativo" | "passivo";
  group: string;
  value: number;
}
