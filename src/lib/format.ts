export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number) {
  return BRL.format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits).replace(".", ",")}%`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const MONTH_NAMES = MONTHS;

export function monthLabel(iso: string) {
  const month = Number(iso.slice(5, 7)) - 1;
  return `${MONTHS[month]} ${iso.slice(0, 4)}`;
}

export function shortMonth(iso: string) {
  const month = Number(iso.slice(5, 7)) - 1;
  return `${MONTHS[month].slice(0, 3)}/${iso.slice(2, 4)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function relativeDayLabel(iso: string) {
  const today = new Date();
  const date = new Date(`${iso}T12:00:00`);
  const diff = Math.round(
    (new Date(today.toDateString()).getTime() - new Date(date.toDateString()).getTime()) /
      86400000,
  );
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return formatDate(iso);
}

/** Converte "3.500,00" / "3500" para número. */
export function parseCurrencyInput(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

/** Máscara de moeda brasileira para inputs controlados. */
export function maskCurrency(raw: string) {
  const value = parseCurrencyInput(raw);
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function greeting(name: string) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return `${prefix}, ${name}`;
}
