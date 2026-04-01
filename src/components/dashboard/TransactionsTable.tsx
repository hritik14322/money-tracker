import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate } from "@/utils/format";
import { CATEGORIES, type Category, type TransactionType, type Transaction } from "@/data/transactions";
import { Search, ArrowUpDown, Plus, Pencil, Trash2, X, Check } from "lucide-react";

const TransactionsTable = () => {
  const { filteredTransactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSort = (field: "date" | "amount") => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortBy: field, sortOrder: "desc" });
    }
  };

  return (
    <div className="bg-card rounded-xl card-shadow overflow-hidden">
      <div className="p-5 lg:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-heading font-semibold text-lg">Transactions</h3>
          {role === "admin" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-secondary border-none outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={filters.category}
            onChange={e => setFilters({ category: e.target.value as Category | "all" })}
            className="px-3 py-2 text-sm rounded-lg bg-secondary border-none outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.type}
            onChange={e => setFilters({ type: e.target.value as TransactionType | "all" })}
            className="px-3 py-2 text-sm rounded-lg bg-secondary border-none outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {showAddForm && <AddTransactionRow onAdd={addTransaction} onCancel={() => setShowAddForm(false)} />}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("date")}>
                <span className="inline-flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-right px-5 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                <span className="inline-flex items-center gap-1 justify-end">Amount <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              {role === "admin" && <th className="px-5 py-3 w-20"></th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={role === "admin" ? 6 : 5} className="text-center py-12 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t =>
                editingId === t.id ? (
                  <EditTransactionRow key={t.id} transaction={t} onSave={(updates) => { editTransaction(t.id, updates); setEditingId(null); }} onCancel={() => setEditingId(null)} />
                ) : (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="px-5 py-3.5">{t.description}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{t.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold uppercase ${t.type === "income" ? "text-income" : "text-expense"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-medium tabular-nums ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setEditingId(t.id)} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-expense">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline add form
const AddTransactionRow = ({ onAdd, onCancel }: { onAdd: (t: Omit<Transaction, "id">) => void; onCancel: () => void }) => {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Food & Dining" as Category, type: "expense" as TransactionType });

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) return;
    onAdd({ ...form, amount: parseFloat(form.amount) });
    onCancel();
  };

  return (
    <div className="p-4 border-b border-border bg-secondary/30">
      <div className="flex flex-wrap gap-2 items-end">
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="px-2 py-1.5 text-sm rounded-lg bg-background border border-border" />
        <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="px-2 py-1.5 text-sm rounded-lg bg-background border border-border flex-1 min-w-[120px]" />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="px-2 py-1.5 text-sm rounded-lg bg-background border border-border w-24" />
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="px-2 py-1.5 text-sm rounded-lg bg-background border border-border">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TransactionType }))} className="px-2 py-1.5 text-sm rounded-lg bg-background border border-border">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button onClick={handleSubmit} className="p-1.5 rounded-lg bg-primary text-primary-foreground"><Check className="w-4 h-4" /></button>
        <button onClick={onCancel} className="p-1.5 rounded-lg bg-secondary text-secondary-foreground"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// Inline edit row
const EditTransactionRow = ({ transaction, onSave, onCancel }: { transaction: Transaction; onSave: (t: Partial<Transaction>) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(transaction);

  return (
    <tr className="border-b border-border bg-secondary/30">
      <td className="px-5 py-2"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="px-1 py-1 text-sm rounded bg-background border border-border w-full" /></td>
      <td className="px-5 py-2"><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="px-1 py-1 text-sm rounded bg-background border border-border w-full" /></td>
      <td className="px-5 py-2">
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="px-1 py-1 text-sm rounded bg-background border border-border">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </td>
      <td className="px-5 py-2">
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TransactionType }))} className="px-1 py-1 text-sm rounded bg-background border border-border">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </td>
      <td className="px-5 py-2 text-right">
        <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} className="px-1 py-1 text-sm rounded bg-background border border-border w-24 text-right" />
      </td>
      <td className="px-5 py-2">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onSave(form)} className="p-1 rounded text-income hover:bg-secondary"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={onCancel} className="p-1 rounded text-muted-foreground hover:bg-secondary"><X className="w-3.5 h-3.5" /></button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionsTable;
