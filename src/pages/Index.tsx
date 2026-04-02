import { FinanceProvider } from "@/context/FinanceContext";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceChart from "@/components/dashboard/BalanceChart";
import SpendingChart from "@/components/dashboard/SpendingChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import RoleToggle from "@/components/dashboard/RoleToggle";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { LayoutDashboard } from "lucide-react";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h1 className="font-heading text-xl font-bold tracking-tight">FinBoard</h1>
            </div>
            <div className="flex items-center gap-2">
              <RoleToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          <SummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BalanceChart />
            </div>
            <SpendingChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionsTable />
            </div>
            <InsightsPanel />
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
};

export default Index;
