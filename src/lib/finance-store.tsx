import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import * as mock from "./mock-data";
import { useAuth } from "./auth";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type {
  Account,
  Budget,
  Category,
  CreditCard,
  Debt,
  Goal,
  Investment,
  Subscription,
  Transaction,
} from "./types";

interface FinanceState {
  profile: typeof mock.profile;
  categories: Category[];
  accounts: Account[];
  cards: CreditCard[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  investments: Investment[];
  debts: Debt[];
  subscriptions: Subscription[];
  addTransaction: (input: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  contributeToGoal: (id: string, amount: number) => void;
  setBudgetLimit: (categoryId: string, limit: number) => void;
  addAccount: (input: Omit<Account, "id" | "lastMovementAt">) => void;
  removeAccount: (id: string) => void;
  transfer: (fromId: string, toId: string, amount: number, description?: string) => void;
  addCard: (input: Omit<CreditCard, "id" | "currentInvoice">) => void;
  payInvoice: (cardId: string, accountId: string) => void;
  addInvestment: (input: Omit<Investment, "id">) => void;
  removeInvestment: (id: string) => void;
  addSubscription: (input: Omit<Subscription, "id">) => void;
  removeSubscription: (id: string) => void;
  payDebtInstallment: (id: string) => void;
  categoryById: (id?: string) => Category | undefined;
  accountById: (id?: string) => Account | undefined;
  cardById: (id?: string) => CreditCard | undefined;
}

const FinanceContext = createContext<FinanceState | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const hydratedUserId = useRef<string | null>(null);
  const mutationVersion = useRef(0);
  const [transactions, setTransactions] = useState<Transaction[]>(mock.transactions);
  const [budgets, setBudgets] = useState<Budget[]>(mock.budgets);
  const [goals, setGoals] = useState<Goal[]>(mock.goals);
  const [accounts, setAccounts] = useState<Account[]>(mock.accounts);
  const [cards, setCards] = useState<CreditCard[]>(mock.cards);
  const [investments, setInvestments] = useState<Investment[]>(mock.investments);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mock.subscriptions);
  const [debts, setDebts] = useState<Debt[]>(mock.debts);

  useEffect(() => {
    if (!user) {
      hydratedUserId.current = null;
      return;
    }
    let active = true;
    const load = async () => {
      const loadVersion = mutationVersion.current;
      const { data, error } = await supabase.from("finance_data").select("*").eq("user_id", user.id).maybeSingle();
      if (!active) return;
      if (error) {
        console.error("Não foi possível carregar os dados financeiros", error);
        return;
      }
      if (data) {
        if (mutationVersion.current !== loadVersion) return;
        setAccounts(data.accounts as unknown as Account[]);
        setCards(data.cards as unknown as CreditCard[]);
        setTransactions(data.transactions as unknown as Transaction[]);
        setBudgets(data.budgets as unknown as Budget[]);
        setGoals(data.goals as unknown as Goal[]);
        setInvestments(data.investments as unknown as Investment[]);
        setDebts(data.debts as unknown as Debt[]);
        setSubscriptions(data.subscriptions as unknown as Subscription[]);
      } else {
        const { error: insertError } = await supabase.from("finance_data").insert({
          user_id: user.id,
          accounts: mock.accounts as unknown as Json,
          cards: mock.cards as unknown as Json,
          transactions: mock.transactions as unknown as Json,
          budgets: mock.budgets as unknown as Json,
          goals: mock.goals as unknown as Json,
          investments: mock.investments as unknown as Json,
          debts: mock.debts as unknown as Json,
          subscriptions: mock.subscriptions as unknown as Json,
        });
        if (insertError) console.error("Não foi possível criar os dados financeiros", insertError);
      }
      hydratedUserId.current = user.id;
    };
    void load();
    return () => { active = false; };
  }, [user]);

  const mutate = useCallback(<T,>(
    setter: Dispatch<SetStateAction<T>>,
    update: SetStateAction<T>,
  ) => {
    mutationVersion.current += 1;
    setter(update);
  }, []);

  useEffect(() => {
    if (!user || hydratedUserId.current !== user.id) return;
    const timer = window.setTimeout(() => {
      void supabase.from("finance_data").update({
        accounts: accounts as unknown as Json,
        cards: cards as unknown as Json,
        transactions: transactions as unknown as Json,
        budgets: budgets as unknown as Json,
        goals: goals as unknown as Json,
        investments: investments as unknown as Json,
        debts: debts as unknown as Json,
        subscriptions: subscriptions as unknown as Json,
      }).eq("user_id", user.id).then(({ error }) => {
        if (error) console.error("Não foi possível salvar os dados financeiros", error);
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [user, accounts, cards, transactions, budgets, goals, investments, debts, subscriptions]);

  const addTransaction = useCallback((input: Omit<Transaction, "id">) => {
    mutate(setTransactions, (prev) => [{ ...input, id: uid() }, ...prev]);
    if (input.kind === "despesa" && input.categoryId) {
      mutate(setBudgets, (prev) =>
        prev.map((b) =>
          b.categoryId === input.categoryId ? { ...b, spent: b.spent + input.amount } : b,
        ),
      );
    }
    if (input.accountId) {
      const delta = input.kind === "receita" ? input.amount : -input.amount;
      mutate(setAccounts, (prev) =>
        prev.map((a) =>
          a.id === input.accountId
            ? { ...a, balance: a.balance + delta, lastMovementAt: input.date }
            : a,
        ),
      );
    }
    if (input.cardId && input.kind === "despesa") {
      mutate(setCards, (prev) =>
        prev.map((c) =>
          c.id === input.cardId ? { ...c, currentInvoice: c.currentInvoice + input.amount } : c,
        ),
      );
    }
  }, [mutate]);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    mutate(setTransactions, (prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, [mutate]);

  const removeTransaction = useCallback((id: string) => {
    mutate(setTransactions, (prev) => prev.filter((t) => t.id !== id));
  }, [mutate]);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    mutate(setGoals, (prev) => [...prev, { ...goal, id: uid() }]);
  }, [mutate]);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    mutate(setGoals, (prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g,
      ),
    );
  }, [mutate]);

  const setBudgetLimit = useCallback((categoryId: string, limit: number) => {
    mutate(setBudgets, (prev) => {
      const exists = prev.some((b) => b.categoryId === categoryId);
      if (exists) {
        return prev.map((b) => (b.categoryId === categoryId ? { ...b, limit } : b));
      }
      return [...prev, { id: uid(), categoryId, limit, spent: 0 }];
    });
  }, [mutate]);

  const addAccount = useCallback((input: Omit<Account, "id" | "lastMovementAt">) => {
    mutate(setAccounts, (prev) => [...prev, { ...input, id: uid(), lastMovementAt: today() }]);
  }, [mutate]);

  const removeAccount = useCallback((id: string) => {
    mutate(setAccounts, (prev) => prev.filter((a) => a.id !== id));
  }, [mutate]);

  const transfer = useCallback(
    (fromId: string, toId: string, amount: number, description = "Transferência") => {
      mutate(setAccounts, (prev) =>
        prev.map((a) => {
          if (a.id === fromId) return { ...a, balance: a.balance - amount, lastMovementAt: today() };
          if (a.id === toId) return { ...a, balance: a.balance + amount, lastMovementAt: today() };
          return a;
        }),
      );
      mutate(setTransactions, (prev): Transaction[] => [
        {
          id: uid(),
          kind: "transferencia",
          description,
          amount,
          date: today(),
          accountId: fromId,
          toAccountId: toId,
          method: "transferencia",
          status: "pago",
        },
        ...prev,
      ]);
    },
    [mutate],
  );

  const addCard = useCallback((input: Omit<CreditCard, "id" | "currentInvoice">) => {
    mutate(setCards, (prev) => [...prev, { ...input, id: uid(), currentInvoice: 0 }]);
  }, [mutate]);

  const payInvoice = useCallback((cardId: string, accountId: string) => {
    mutate(setCards, (prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card || card.currentInvoice <= 0) return prev;
      const amount = card.currentInvoice;
      mutate(setAccounts, (accs) =>
        accs.map((a) =>
          a.id === accountId ? { ...a, balance: a.balance - amount, lastMovementAt: today() } : a,
        ),
      );
      mutate(setTransactions, (txs): Transaction[] => [
        {
          id: uid(),
          kind: "despesa",
          description: `Pagamento fatura ${card.name}`,
          amount,
          date: today(),
          accountId,
          method: "transferencia",
          status: "pago",
        },
        ...txs,
      ]);
      return prev.map((c) => (c.id === cardId ? { ...c, currentInvoice: 0 } : c));
    });
  }, [mutate]);

  const addInvestment = useCallback((input: Omit<Investment, "id">) => {
    mutate(setInvestments, (prev) => [...prev, { ...input, id: uid() }]);
  }, [mutate]);

  const removeInvestment = useCallback((id: string) => {
    mutate(setInvestments, (prev) => prev.filter((i) => i.id !== id));
  }, [mutate]);

  const addSubscription = useCallback((input: Omit<Subscription, "id">) => {
    mutate(setSubscriptions, (prev) => [...prev, { ...input, id: uid() }]);
  }, [mutate]);

  const removeSubscription = useCallback((id: string) => {
    mutate(setSubscriptions, (prev) => prev.filter((s) => s.id !== id));
  }, [mutate]);

  const payDebtInstallment = useCallback((id: string) => {
    mutate(setDebts, (prev) =>
      prev.map((d) => {
        if (d.id !== id || d.installmentsPaid >= d.installmentsTotal) return d;
        const perInstallment = d.originalAmount / d.installmentsTotal;
        return {
          ...d,
          installmentsPaid: d.installmentsPaid + 1,
          currentAmount: Math.max(0, Math.round((d.currentAmount - perInstallment) * 100) / 100),
        };
      }),
    );
  }, [mutate]);

  const profile = useMemo(
    () => ({
      name: user?.name ?? "Você",
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      currency: user?.currency ?? "BRL",
      dateFormat: user?.dateFormat ?? "DD/MM/YYYY",
    }),
    [user],
  );

  const value = useMemo<FinanceState>(
    () => ({
      profile,
      categories: mock.categories,
      accounts,
      cards,
      investments,
      debts,
      subscriptions,
      transactions,
      budgets,
      goals,
      addTransaction,
      updateTransaction,
      removeTransaction,
      addGoal,
      contributeToGoal,
      setBudgetLimit,
      addAccount,
      removeAccount,
      transfer,
      addCard,
      payInvoice,
      addInvestment,
      removeInvestment,
      addSubscription,
      removeSubscription,
      payDebtInstallment,
      categoryById: (id?: string) => mock.categories.find((c) => c.id === id),
      accountById: (id?: string) => accounts.find((a) => a.id === id),
      cardById: (id?: string) => cards.find((c) => c.id === id),
    }),
    [
      profile,
      accounts,
      cards,
      investments,
      debts,
      subscriptions,
      transactions,
      budgets,
      goals,
      addTransaction,
      updateTransaction,
      removeTransaction,
      addGoal,
      contributeToGoal,
      setBudgetLimit,
      addAccount,
      removeAccount,
      transfer,
      addCard,
      payInvoice,
      addInvestment,
      removeInvestment,
      addSubscription,
      removeSubscription,
      payDebtInstallment,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance deve ser usado dentro de FinanceProvider");
  return ctx;
}

/* ---------------------------------- seletores --------------------------------- */

export function monthOf(date: string) {
  return date.slice(0, 7);
}

export function sumBy<T>(items: T[], pick: (item: T) => number) {
  return items.reduce((total, item) => total + pick(item), 0);
}
