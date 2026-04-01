import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const cards = [
  { key: "balance" as const, label: "Total Balance", icon: Wallet, color: "text-primary" },
  { key: "income" as const, label: "Total Income", icon: TrendingUp, color: "text-income" },
  { key: "expenses" as const, label: "Total Expenses", icon: TrendingDown, color: "text-expense" },
];

const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();
  const values = { balance: totalBalance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-card rounded-xl p-5 lg:p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className={`p-2 rounded-lg bg-secondary ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-heading font-bold tracking-tight">
            {formatCurrency(values[key])}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
