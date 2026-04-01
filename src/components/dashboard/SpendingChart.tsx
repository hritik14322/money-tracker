import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(172 40% 55%)",
  "hsl(215 60% 65%)",
];

const SpendingChart = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="bg-card rounded-xl p-5 lg:p-6 card-shadow">
      <h3 className="font-heading font-semibold text-lg mb-4">Spending by Category</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">No expenses yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 13,
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SpendingChart;
