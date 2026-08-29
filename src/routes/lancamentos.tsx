import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Receipt, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, PageHeader, Surface } from "@/components/finance-ui";
import { useFinance } from "@/lib/finance-store";
import { useQuickAdd } from "@/components/app-shell";
import { formatCurrency, relativeDayLabel } from "@/lib/format";

export const Route = createFileRoute("/lancamentos")({
  head: () => ({
    meta: [
      { title: "Lançamentos — Nexus Finance" },
      {
        name: "description",
        content: "Busque, filtre e organize todas as suas receitas, despesas e transferências.",
      },
      { property: "og:title", content: "Lançamentos — Nexus Finance" },
      {
        property: "og:description",
        content: "Todas as suas movimentações financeiras em uma lista clara e filtrável.",
      },
    ],
  }),
  component: LancamentosPage,
});

const PAGE_SIZE = 12;

function LancamentosPage() {
  const { transactions, categories, accounts, cards, removeTransaction, categoryById } =
    useFinance();
  const quickAdd = useQuickAdd();

  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("todos");
  const [categoryId, setCategoryId] = useState("todas");
  const [accountId, setAccountId] = useState("todas");
  const [sort, setSort] = useState("recentes");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = transactions.filter((t) => {
      if (query && !t.description.toLowerCase().includes(query.toLowerCase())) return false;
      if (kind !== "todos" && t.kind !== kind) return false;
      if (categoryId !== "todas" && t.categoryId !== categoryId) return false;
      if (accountId !== "todas" && t.accountId !== accountId && t.cardId !== accountId)
        return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sort === "maior") return b.amount - a.amount;
      if (sort === "menor") return a.amount - b.amount;
      if (sort === "antigos") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [transactions, query, kind, categoryId, accountId, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof pageItems>();
    for (const t of pageItems) {
      const label = relativeDayLabel(t.date);
      map.set(label, [...(map.get(label) ?? []), t]);
    }
    return [...map.entries()];
  }, [pageItems]);

  return (
    <>
      <PageHeader
        title="Lançamentos"
        subtitle="Todas as movimentações, agrupadas por data."
        actions={
          <Button className="gap-2" onClick={() => quickAdd.open("despesa")}>
            <Plus className="size-4" />
            Adicionar
          </Button>
        }
      />

      <Surface className="mb-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar por descrição"
              className="pl-9"
            />
          </div>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="transferencia">Transferências</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger><SelectValue placeholder="Conta / cartão" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as contas</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
              {cards.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Ordenar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
              <SelectItem value="maior">Maior valor</SelectItem>
              <SelectItem value="menor">Menor valor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Surface>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Você ainda não possui lançamentos"
          description="Cadastre sua primeira movimentação para começar a acompanhar suas finanças."
          actionLabel="+ Adicionar lançamento"
          onAction={() => quickAdd.open("despesa")}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([label, items]) => (
            <Surface key={label} className="p-0">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <span className="text-xs font-semibold tracking-wider uppercase">{label}</span>
                <span className="num text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "lançamento" : "lançamentos"}
                </span>
              </div>
              <ul className="divide-y">
                {items.map((t) => {
                  const category = categoryById(t.categoryId);
                  const sourceName =
                    accounts.find((a) => a.id === t.accountId)?.name ??
                    cards.find((c) => c.id === t.cardId)?.name ??
                    "—";
                  return (
                    <li
                      key={t.id}
                      className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t.description}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          {category && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5"
                              style={{ background: "var(--muted)" }}
                            >
                              <span
                                className="size-1.5 rounded-full"
                                style={{ background: category.color }}
                              />
                              {category.name}
                            </span>
                          )}
                          <span>{sourceName}</span>
                          <span>· {t.method}</span>
                          {t.installments && (
                            <span>
                              · {t.installments.current}/{t.installments.total}
                            </span>
                          )}
                          {t.recurring && <span>· recorrente</span>}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge variant={t.status === "pago" ? "secondary" : "outline"}>
                          {t.status}
                        </Badge>
                        <span
                          className={
                            "num text-sm font-semibold " +
                            (t.kind === "receita"
                              ? "text-success"
                              : t.kind === "despesa"
                                ? "text-destructive"
                                : "")
                          }
                        >
                          {t.kind === "receita" ? "+" : t.kind === "despesa" ? "-" : ""}
                          {formatCurrency(t.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={`Excluir ${t.description}`}
                          onClick={() => {
                            removeTransaction(t.id);
                            toast.success("Lançamento excluído");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Surface>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages} · {filtered.length} resultados
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
