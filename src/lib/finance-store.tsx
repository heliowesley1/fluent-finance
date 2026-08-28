import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
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
  categoryById: (id?: string) => Category | undefined;
  accountById: (id?: string) => Account | undefined;
  cardById: (id?: string) => CreditCard | undefined;
}

const FinanceContext = createContext<FinanceState | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mock.transactions);
  const [budgets, setBudgets] = useState<Budget[]>(mock.budgets);
  const [goals, setGoals] = useState<Goal[]>(mock.goals);

  const addTransaction = useCallback((input: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...input, id: uid() }, ...prev]);
    if (input.kind === "despesa" && input.categoryId) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.categoryId === input.categoryId ? { ...b, spent: b.spent + input.amount } : b,
        ),
      );
    }
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setGoals((prev) => [...prev, { ...goal, id: uid() }]);
  }, []);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g,
      ),
    );
  }, []);

  const setBudgetLimit = useCallback((categoryId: string, limit: number) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b.categoryId === categoryId);
      if (exists) {
        return prev.map((b) => (b.categoryId === categoryId ? { ...b, limit } : b));
      }
      return [...prev, { id: uid(), categoryId, limit, spent: 0 }];
    });
  }, []);

  const value = useMemo<FinanceState>(
    () => ({
      profile: mock.profile,
      categories: mock.categories,
      accounts: mock.accounts,
      cards: mock.cards,
      investments: mock.investments,
      debts: mock.debts,
      subscriptions: mock.subscriptions,
      transactions,
      budgets,
      goals,
      addTransaction,
      updateTransaction,
      removeTransaction,
      addGoal,
      contributeToGoal,
      setBudgetLimit,
      categoryById: (id?: string) => mock.categories.find((c) => c.id === id),
      accountById: (id?: string) => mock.accounts.find((a) => a.id === id),
      cardById: (id?: string) => mock.cards.find((c) => c.id === id),
    }),
    [
      transactions,
      budgets,
      goals,
      addTransaction,
      updateTransaction,
      removeTransaction,
      addGoal,
      contributeToGoal,
      setBudgetLimit,
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
