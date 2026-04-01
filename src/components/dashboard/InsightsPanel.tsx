import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatPercent } from "@/utils/format";
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from "lucide-react";

const InsightsPanel = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expByCategory = new Map<string, number>();
    const monthlyExp = new Map<string, number>();
    const monthlyInc = new Map<string, number>();

    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (t.type === "expense") {
        expByCategory.set(t.category, (expByCategory.get(t.category) || 0) + t.amount);
        monthlyExp.set(month, (monthlyExp.get(month) || 0) + t.amount);
      } else {
        monthlyInc.set(month, (monthlyInc.get(month) || 0) + t.amount);
      }
    });

    // Highest spending category
    let highestCat = { name: "N/A", amount: 0 };
    expByCategory.forEach((v, k) => { if (v > highestCat.amount) highestCat = { name: k, amount: v }; });

    // Monthly comparison
    const months = Array.from(new Set([...monthlyExp.keys(), ...monthlyInc.keys()])).sort();
    let monthChange = 0;
    let currentMonthExp = 0;
    let prevMonthExp = 0;
    if (months.length >= 2) {
      currentMonthExp = monthlyExp.get(months[months.length - 1]) || 0;
      prevMonthExp = monthlyExp.get(months[months.length - 2]) || 0;
      monthChange = prevMonthExp > 0 ? ((currentMonthExp - prevMonthExp) / prevMonthExp) * 100 : 0;
    }

    // Savings rate
    const totalInc = Array.from(monthlyInc.values()).reduce((a, b) => a + b, 0);
    const totalExp = Array.from(monthlyExp.values()).reduce((a, b) => a + b, 0);
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;

    return { highestCat, monthChange, currentMonthExp, prevMonthExp, savingsRate };
  }, [transactions]);

  const cards = [
    {
      icon: AlertTriangle,
      title: "Highest Spending",
      value: insights.highestCat.name,
      sub: formatCurrency(insights.highestCat.amount),
      color: "text-chart-4" as const,
    },
    {
      icon: insights.monthChange <= 0 ? TrendingDown : TrendingUp,
      title: "Monthly Spending",
      value: formatPercent(insights.monthChange),
      sub: `${formatCurrency(insights.prevMonthExp)} → ${formatCurrency(insights.currentMonthExp)}`,
      color: insights.monthChange <= 0 ? "text-income" as const : "text-expense" as const,
    },
    {
      icon: Zap,
      title: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      sub: "of total income saved",
      color: "text-primary" as const,
    },
  ];

  return (
    <div className="bg-card rounded-xl p-5 lg:p-6 card-shadow">
      <h3 className="font-heading font-semibold text-lg mb-4">Insights</h3>
      <div className="space-y-4">
        {cards.map((card, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
            <div className={`p-2 rounded-lg bg-background ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{card.title}</p>
              <p className="font-heading font-semibold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
