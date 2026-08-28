import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { navItems } from "@/components/nav-items";
import { useFinance } from "@/lib/finance-store";
import { formatCurrency, formatDate } from "@/lib/format";

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { transactions, accounts, cards, goals, categories } = useFinance();

  function go(to: string) {
    onOpenChange(false);
    navigate({ to });
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar lançamentos, contas, cartões, metas..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          {navItems.map((item) => (
            <CommandItem key={item.to} value={`ir ${item.label}`} onSelect={() => go(item.to)}>
              <item.icon className="size-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Lançamentos">
          {transactions.slice(0, 8).map((t) => (
            <CommandItem
              key={t.id}
              value={`${t.description} ${t.amount}`}
              onSelect={() => go("/lancamentos")}
            >
              <span className="truncate">{t.description}</span>
              <span className="num ml-auto text-xs text-muted-foreground">
                {formatCurrency(t.amount)} · {formatDate(t.date)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Contas e cartões">
          {accounts.map((a) => (
            <CommandItem key={a.id} value={`conta ${a.name}`} onSelect={() => go("/contas")}>
              {a.name}
              <span className="num ml-auto text-xs text-muted-foreground">
                {formatCurrency(a.balance)}
              </span>
            </CommandItem>
          ))}
          {cards.map((c) => (
            <CommandItem key={c.id} value={`cartao ${c.name}`} onSelect={() => go("/cartoes")}>
              {c.name}
              <span className="num ml-auto text-xs text-muted-foreground">
                {formatCurrency(c.currentInvoice)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Metas e categorias">
          {goals.map((g) => (
            <CommandItem key={g.id} value={`meta ${g.name}`} onSelect={() => go("/metas")}>
              {g.name}
            </CommandItem>
          ))}
          {categories.map((c) => (
            <CommandItem
              key={c.id}
              value={`categoria ${c.name}`}
              onSelect={() => go("/orcamentos")}
            >
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
