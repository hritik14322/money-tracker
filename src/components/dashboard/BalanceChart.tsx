import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BalanceChart = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let balance = 0;
    const points: { date: string; balance: number }[] = [];
    const seen = new Set<string>();

    for (const t of sorted) {
      balance += t.type === "income" ? t.amount : -t.amount;
      const label = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(t.date));
      if (!seen.has(t.date)) {
        points.push({ date: label, balance: Math.round(balance * 100) / 100 });
        seen.add(t.date);
      } else {
        points[points.length - 1].balance = Math.round(balance * 100) / 100;
      }
    }
    return points;
  }, [transactions]);

  return (
    <div className="bg-card rounded-xl p-5 lg:p-6 card-shadow">
      <h3 className="font-heading font-semibold text-lg mb-4">Balance Trend</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={60} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 13,
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BalanceChart;
