import type {
  Account,
  AssetItem,
  Budget,
  Category,
  CreditCard,
  Debt,
  Goal,
  Investment,
  Subscription,
  Transaction,
  UpcomingBill,
} from "./types";

const now = new Date();

function iso(offsetDays: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export function currentMonthKey() {
  return now.toISOString().slice(0, 7);
}

export function monthKeys(count: number) {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(d.toISOString().slice(0, 7));
  }
  return keys;
}

export const categories: Category[] = [
  { id: "alimentacao", name: "Alimentação", kind: "despesa", color: "var(--chart-1)", icon: "utensils" },
  { id: "transporte", name: "Transporte", kind: "despesa", color: "var(--chart-3)", icon: "car" },
  { id: "moradia", name: "Moradia", kind: "despesa", color: "var(--chart-2)", icon: "home" },
  { id: "lazer", name: "Lazer", kind: "despesa", color: "var(--chart-4)", icon: "party-popper" },
  { id: "saude", name: "Saúde", kind: "despesa", color: "var(--chart-5)", icon: "heart-pulse" },
  { id: "educacao", name: "Educação", kind: "despesa", color: "var(--chart-6)", icon: "graduation-cap" },
  { id: "assinaturas", name: "Assinaturas", kind: "despesa", color: "var(--chart-7)", icon: "repeat" },
  { id: "compras", name: "Compras", kind: "despesa", color: "var(--chart-8)", icon: "shopping-bag" },
  { id: "outros", name: "Outros", kind: "despesa", color: "var(--chart-8)", icon: "circle-dashed" },
  { id: "salario", name: "Salário", kind: "receita", color: "var(--chart-1)", icon: "briefcase" },
  { id: "freelance", name: "Freelance", kind: "receita", color: "var(--chart-5)", icon: "laptop" },
  { id: "investimentos", name: "Rendimentos", kind: "receita", color: "var(--chart-4)", icon: "trending-up" },
];

export const accounts: Account[] = [
  {
    id: "nubank",
    name: "Conta Nubank",
    institution: "Nu Pagamentos",
    type: "digital",
    balance: 6420.35,
    lastMovementAt: iso(0),
  },
  {
    id: "inter",
    name: "Conta Inter",
    institution: "Banco Inter",
    type: "corrente",
    balance: 4310.9,
    lastMovementAt: iso(1),
  },
  {
    id: "poupanca",
    name: "Poupança",
    institution: "Caixa",
    type: "poupanca",
    balance: 1528.75,
    lastMovementAt: iso(9),
  },
  {
    id: "carteira",
    name: "Carteira",
    institution: "Dinheiro físico",
    type: "carteira",
    balance: 280,
    lastMovementAt: iso(2),
  },
];

export const cards: CreditCard[] = [
  {
    id: "card-nubank",
    name: "Nubank Ultravioleta",
    bank: "Nubank",
    brand: "Mastercard",
    limit: 4000,
    currentInvoice: 1240.8,
    closingDay: 3,
    dueDay: 10,
    color: "var(--chart-6)",
    last4: "4528",
  },
  {
    id: "card-inter",
    name: "Inter Black",
    bank: "Banco Inter",
    brand: "Visa",
    limit: 6000,
    currentInvoice: 2180.45,
    closingDay: 20,
    dueDay: 28,
    color: "var(--chart-3)",
    last4: "9012",
  },
];

export const transactions: Transaction[] = [
  { id: "t1", kind: "despesa", description: "Almoço no Vila", amount: 38.5, date: iso(0), categoryId: "alimentacao", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t2", kind: "despesa", description: "Uber para o escritório", amount: 18.5, date: iso(0), categoryId: "transporte", accountId: "nubank", method: "debito", status: "pago" },
  { id: "t3", kind: "despesa", description: "Mercado do mês", amount: 342.3, date: iso(1), categoryId: "alimentacao", cardId: "card-nubank", method: "credito", status: "pago" },
  { id: "t4", kind: "receita", description: "Salário", amount: 6200, date: iso(3), categoryId: "salario", accountId: "inter", method: "transferencia", status: "pago" },
  { id: "t5", kind: "receita", description: "Freelance landing page", amount: 1800, date: iso(5), categoryId: "freelance", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t6", kind: "despesa", description: "Aluguel", amount: 1850, date: iso(6), categoryId: "moradia", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t7", kind: "despesa", description: "Netflix", amount: 39.9, date: iso(7), categoryId: "assinaturas", cardId: "card-nubank", method: "credito", status: "pago", recurring: true },
  { id: "t8", kind: "despesa", description: "Academia", amount: 129.9, date: iso(8), categoryId: "saude", cardId: "card-inter", method: "credito", status: "pago", recurring: true },
  { id: "t9", kind: "despesa", description: "Notebook novo", amount: 600, date: iso(9), categoryId: "compras", cardId: "card-inter", method: "credito", status: "pago", installments: { current: 3, total: 12 } },
  { id: "t10", kind: "despesa", description: "Cinema com amigos", amount: 92, date: iso(10), categoryId: "lazer", accountId: "nubank", method: "debito", status: "pago" },
  { id: "t11", kind: "despesa", description: "Curso de inglês", amount: 320, date: iso(12), categoryId: "educacao", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t12", kind: "despesa", description: "Farmácia", amount: 87.4, date: iso(13), categoryId: "saude", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t13", kind: "despesa", description: "Gasolina", amount: 210, date: iso(14), categoryId: "transporte", cardId: "card-nubank", method: "credito", status: "pago" },
  { id: "t14", kind: "receita", description: "Rendimento CDB", amount: 148.23, date: iso(15), categoryId: "investimentos", accountId: "inter", method: "transferencia", status: "pago" },
  { id: "t15", kind: "despesa", description: "Jantar aniversário", amount: 186.7, date: iso(16), categoryId: "alimentacao", cardId: "card-inter", method: "credito", status: "pago" },
  { id: "t16", kind: "despesa", description: "Internet fibra", amount: 99.9, date: iso(18), categoryId: "moradia", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t17", kind: "despesa", description: "Spotify", amount: 21.9, date: iso(19), categoryId: "assinaturas", cardId: "card-nubank", method: "credito", status: "pago", recurring: true },
  { id: "t18", kind: "transferencia", description: "Reserva mensal", amount: 800, date: iso(20), accountId: "nubank", toAccountId: "poupanca", method: "transferencia", status: "pago" },
  { id: "t19", kind: "despesa", description: "Roupas", amount: 259.9, date: iso(22), categoryId: "compras", cardId: "card-inter", method: "credito", status: "pago" },
  { id: "t20", kind: "despesa", description: "Padaria", amount: 24.8, date: iso(24), categoryId: "alimentacao", accountId: "carteira", method: "dinheiro", status: "pago" },
  { id: "t21", kind: "despesa", description: "Conta de luz", amount: 178.35, date: iso(26), categoryId: "moradia", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t22", kind: "despesa", description: "Show de música", amount: 240, date: iso(28), categoryId: "lazer", cardId: "card-nubank", method: "credito", status: "pago" },
  { id: "t23", kind: "receita", description: "Venda de item usado", amount: 350, date: iso(30), categoryId: "outros", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t24", kind: "despesa", description: "Seguro do carro", amount: 189, date: iso(32), categoryId: "transporte", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t25", kind: "despesa", description: "Presente", amount: 120, date: iso(35), categoryId: "compras", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t26", kind: "receita", description: "Salário", amount: 6200, date: iso(34), categoryId: "salario", accountId: "inter", method: "transferencia", status: "pago" },
  { id: "t27", kind: "despesa", description: "Aluguel", amount: 1850, date: iso(37), categoryId: "moradia", accountId: "inter", method: "boleto", status: "pago", recurring: true },
  { id: "t28", kind: "despesa", description: "Mercado", amount: 398.2, date: iso(40), categoryId: "alimentacao", cardId: "card-nubank", method: "credito", status: "pago" },
  { id: "t29", kind: "despesa", description: "Consulta médica", amount: 250, date: iso(44), categoryId: "saude", accountId: "nubank", method: "pix", status: "pago" },
  { id: "t30", kind: "receita", description: "Freelance dashboard", amount: 2400, date: iso(48), categoryId: "freelance", accountId: "nubank", method: "pix", status: "pago" },
];

export const budgets: Budget[] = [
  { id: "b1", categoryId: "alimentacao", limit: 900, spent: 405.6 },
  { id: "b2", categoryId: "transporte", limit: 400, spent: 228.5 },
  { id: "b3", categoryId: "moradia", limit: 2200, spent: 1949.9 },
  { id: "b4", categoryId: "lazer", limit: 300, spent: 332 },
  { id: "b5", categoryId: "assinaturas", limit: 200, spent: 61.8 },
  { id: "b6", categoryId: "compras", limit: 500, spent: 859.9 },
];

export const goals: Goal[] = [
  { id: "g1", name: "Reserva de emergência", target: 10000, current: 3500, deadline: "2026-12-31", category: "Segurança" },
  { id: "g2", name: "Viagem para o Chile", target: 5000, current: 1200, deadline: "2027-03-15", category: "Lazer" },
  { id: "g3", name: "Computador novo", target: 8000, current: 5200, deadline: "2026-11-30", category: "Trabalho" },
  { id: "g4", name: "Entrada do carro", target: 25000, current: 4100, deadline: "2028-01-31", category: "Patrimônio" },
];

export const investments: Investment[] = [
  { id: "i1", name: "Tesouro Selic 2029", class: "Tesouro", invested: 18000, currentValue: 19640 },
  { id: "i2", name: "CDB Inter 110% CDI", class: "CDB", invested: 12000, currentValue: 12980 },
  { id: "i3", name: "ITSA4", ticker: "ITSA4", class: "Ações", invested: 8200, currentValue: 9450 },
  { id: "i4", name: "HGLG11", ticker: "HGLG11", class: "FIIs", invested: 7500, currentValue: 7820 },
  { id: "i5", name: "IVVB11", ticker: "IVVB11", class: "ETFs", invested: 5000, currentValue: 6240 },
  { id: "i6", name: "Bitcoin", ticker: "BTC", class: "Cripto", invested: 4000, currentValue: 5310 },
];

export const debts: Debt[] = [
  {
    id: "d1",
    creditor: "Financiamento notebook",
    originalAmount: 7200,
    currentAmount: 5400,
    installmentsTotal: 12,
    installmentsPaid: 3,
    interestRate: 1.2,
    dueDate: iso(-8),
  },
  {
    id: "d2",
    creditor: "Empréstimo pessoal Inter",
    originalAmount: 15000,
    currentAmount: 8750,
    installmentsTotal: 24,
    installmentsPaid: 10,
    interestRate: 2.4,
    dueDate: iso(-12),
  },
  {
    id: "d3",
    creditor: "Parcelamento odontológico",
    originalAmount: 3600,
    currentAmount: 1200,
    installmentsTotal: 6,
    installmentsPaid: 4,
    interestRate: 0,
    dueDate: iso(-3),
  },
];

export const subscriptions: Subscription[] = [
  { id: "s1", name: "Netflix", amount: 39.9, periodicity: "mensal", chargeDay: 10, categoryId: "assinaturas", source: "Nubank Ultravioleta" },
  { id: "s2", name: "Spotify", amount: 21.9, periodicity: "mensal", chargeDay: 5, categoryId: "assinaturas", source: "Nubank Ultravioleta" },
  { id: "s3", name: "Internet fibra", amount: 99.9, periodicity: "mensal", chargeDay: 15, categoryId: "moradia", source: "Conta Inter" },
  { id: "s4", name: "Academia", amount: 129.9, periodicity: "mensal", chargeDay: 8, categoryId: "saude", source: "Inter Black" },
  { id: "s5", name: "iCloud", amount: 12.9, periodicity: "mensal", chargeDay: 22, categoryId: "assinaturas", source: "Nubank Ultravioleta" },
  { id: "s6", name: "Domínio + hospedagem", amount: 348, periodicity: "anual", chargeDay: 2, categoryId: "assinaturas", source: "Inter Black" },
];

export const upcomingBills: UpcomingBill[] = [
  { id: "u1", name: "Netflix", amount: 39.9, dueInDays: 2, source: "Nubank Ultravioleta" },
  { id: "u2", name: "Aluguel", amount: 1850, dueInDays: 5, source: "Conta Inter" },
  { id: "u3", name: "Internet fibra", amount: 99.9, dueInDays: 8, source: "Conta Inter" },
  { id: "u4", name: "Fatura Nubank", amount: 1240.8, dueInDays: 11, source: "Nubank Ultravioleta" },
];

export const patrimonyItems: AssetItem[] = [
  { id: "p1", name: "Contas bancárias", type: "ativo", group: "Liquidez", value: 12540 },
  { id: "p2", name: "Investimentos", type: "ativo", group: "Investimentos", value: 61440 },
  { id: "p3", name: "Veículo (Honda City)", type: "ativo", group: "Bens", value: 62000 },
  { id: "p4", name: "Equipamentos", type: "ativo", group: "Bens", value: 14500 },
  { id: "p5", name: "Faturas de cartão", type: "passivo", group: "Cartões", value: 3421.25 },
  { id: "p6", name: "Empréstimo pessoal", type: "passivo", group: "Empréstimos", value: 8750 },
  { id: "p7", name: "Financiamentos", type: "passivo", group: "Financiamentos", value: 5400 },
  { id: "p8", name: "Outras dívidas", type: "passivo", group: "Dívidas", value: 1200 },
];

export const patrimonyHistory = monthKeys(12).map((key, index) => ({
  month: key,
  ativos: 118000 + index * 3200 + (index % 3) * 900,
  passivos: 26000 - index * 780,
}));

export const monthlyHistory = monthKeys(6).map((key, index) => {
  const receitas = [7850, 8120, 7600, 9400, 8300, 8548][index] ?? 8000;
  const despesas = [5920, 6480, 5310, 7120, 6040, 5836][index] ?? 6000;
  return { month: key, receitas, despesas, saldo: receitas - despesas };
});

export const profile = {
  name: "Você",
  fullName: "",
  email: "",
  currency: "BRL",
  dateFormat: "DD/MM/YYYY",
};
