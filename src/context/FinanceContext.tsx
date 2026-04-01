import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Transaction, mockTransactions, TransactionType, Category } from "@/data/transactions";

export type UserRole = "viewer" | "admin";

interface Filters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface FinanceContextType {
  transactions: Transaction[];
  filters: Filters;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filteredTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}

const defaultFilters: Filters = {
  search: "",
  category: "all",
  type: "all",
  sortBy: "date",
  sortOrder: "desc",
};

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [role, setRole] = useState<UserRole>("admin");

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      );
    }
    if (filters.category !== "all") {
      result = result.filter(t => t.category === filters.category);
    }
    if (filters.type !== "all") {
      result = result.filter(t => t.type === filters.type);
    }
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider value={{
      transactions, filters, role, setRole, setFilters,
      addTransaction, editTransaction, deleteTransaction,
      filteredTransactions, totalIncome, totalExpenses, totalBalance,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
