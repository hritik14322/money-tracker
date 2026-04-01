import { useFinance, type UserRole } from "@/context/FinanceContext";
import { Eye, Shield } from "lucide-react";

const RoleToggle = () => {
  const { role, setRole } = useFinance();

  return (
    <div className="inline-flex items-center rounded-lg bg-secondary p-1 text-sm">
      {(["viewer", "admin"] as UserRole[]).map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium capitalize transition-all duration-200 ${
            role === r
              ? "bg-card card-shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {r === "viewer" ? <Eye className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          {r}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;
