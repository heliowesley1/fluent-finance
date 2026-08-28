import { categories } from "./mock-data";

const KEYWORDS: Record<string, string> = {
  almoço: "alimentacao",
  almoco: "alimentacao",
  janta: "alimentacao",
  jantar: "alimentacao",
  café: "alimentacao",
  cafe: "alimentacao",
  mercado: "alimentacao",
  padaria: "alimentacao",
  ifood: "alimentacao",
  lanche: "alimentacao",
  uber: "transporte",
  gasolina: "transporte",
  ônibus: "transporte",
  onibus: "transporte",
  estacionamento: "transporte",
  aluguel: "moradia",
  luz: "moradia",
  água: "moradia",
  agua: "moradia",
  internet: "moradia",
  condomínio: "moradia",
  cinema: "lazer",
  show: "lazer",
  bar: "lazer",
  viagem: "lazer",
  farmácia: "saude",
  farmacia: "saude",
  academia: "saude",
  médico: "saude",
  medico: "saude",
  curso: "educacao",
  livro: "educacao",
  faculdade: "educacao",
  netflix: "assinaturas",
  spotify: "assinaturas",
  assinatura: "assinaturas",
  roupa: "compras",
  presente: "compras",
  compra: "compras",
  salário: "salario",
  salario: "salario",
  freela: "freelance",
  freelance: "freelance",
  pagamento: "freelance",
  rendimento: "investimentos",
  dividendo: "investimentos",
};

const INCOME_CATEGORIES = new Set(["salario", "freelance", "investimentos"]);

export interface SmartResult {
  kind: "receita" | "despesa";
  amount: number;
  description: string;
  categoryId?: string;
}

/** Interpreta entradas como "Almoço 35" ou "Salário 3500". */
export function smartParse(input: string): SmartResult | null {
  const text = input.trim();
  if (!text) return null;

  const amountMatch = text.match(/(\d+(?:[.,]\d{1,2})?)\s*$/) ?? text.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (!amountMatch) return null;

  const amount = Number(amountMatch[1].replace(".", "").replace(",", "."));
  if (!amount || Number.isNaN(amount)) return null;

  const description = text.replace(amountMatch[0], "").replace(/r\$/i, "").trim();
  const normalized = description.toLowerCase();

  let categoryId: string | undefined;
  for (const [word, id] of Object.entries(KEYWORDS)) {
    if (normalized.includes(word)) {
      categoryId = id;
      break;
    }
  }

  const kind = categoryId && INCOME_CATEGORIES.has(categoryId) ? "receita" : "despesa";

  return {
    kind,
    amount,
    description: description ? description.charAt(0).toUpperCase() + description.slice(1) : "Lançamento",
    categoryId: categoryId ?? (kind === "despesa" ? "outros" : undefined),
  };
}

export function categoryName(id?: string) {
  return categories.find((c) => c.id === id)?.name ?? "Sem categoria";
}
