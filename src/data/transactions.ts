export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investments"
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Healthcare"
  | "Travel"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export const CATEGORIES: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Shopping",
  "Transportation", "Entertainment", "Utilities", "Healthcare", "Travel", "Education", "Other",
];

export const INCOME_CATEGORIES: Category[] = ["Salary", "Freelance", "Investments"];
export const EXPENSE_CATEGORIES: Category[] = CATEGORIES.filter(c => !INCOME_CATEGORIES.includes(c));

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2026-03-01", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "2", date: "2026-03-02", description: "Grocery Store", amount: 85.50, category: "Food & Dining", type: "expense" },
  { id: "3", date: "2026-03-03", description: "Netflix Subscription", amount: 15.99, category: "Entertainment", type: "expense" },
  { id: "4", date: "2026-03-04", description: "Freelance Project", amount: 1200, category: "Freelance", type: "income" },
  { id: "5", date: "2026-03-05", description: "Electric Bill", amount: 120, category: "Utilities", type: "expense" },
  { id: "6", date: "2026-03-06", description: "New Sneakers", amount: 89.99, category: "Shopping", type: "expense" },
  { id: "7", date: "2026-03-07", description: "Uber Ride", amount: 24.50, category: "Transportation", type: "expense" },
  { id: "8", date: "2026-03-08", description: "Dividend Payment", amount: 340, category: "Investments", type: "income" },
  { id: "9", date: "2026-03-10", description: "Restaurant Dinner", amount: 62.00, category: "Food & Dining", type: "expense" },
  { id: "10", date: "2026-03-12", description: "Online Course", amount: 49.99, category: "Education", type: "expense" },
  { id: "11", date: "2026-03-14", description: "Gas Station", amount: 45.00, category: "Transportation", type: "expense" },
  { id: "12", date: "2026-03-15", description: "Doctor Visit", amount: 150, category: "Healthcare", type: "expense" },
  { id: "13", date: "2026-03-17", description: "Coffee Shop", amount: 12.50, category: "Food & Dining", type: "expense" },
  { id: "14", date: "2026-03-18", description: "Weekend Trip", amount: 320, category: "Travel", type: "expense" },
  { id: "15", date: "2026-03-20", description: "Freelance Bonus", amount: 500, category: "Freelance", type: "income" },
  { id: "16", date: "2026-03-22", description: "Gym Membership", amount: 40, category: "Healthcare", type: "expense" },
  { id: "17", date: "2026-03-23", description: "Amazon Purchase", amount: 67.30, category: "Shopping", type: "expense" },
  { id: "18", date: "2026-03-25", description: "Water Bill", amount: 35, category: "Utilities", type: "expense" },
  { id: "19", date: "2026-03-27", description: "Movie Tickets", amount: 28, category: "Entertainment", type: "expense" },
  { id: "20", date: "2026-03-28", description: "Parking Fee", amount: 15, category: "Transportation", type: "expense" },
  // February data for comparison
  { id: "21", date: "2026-02-01", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "22", date: "2026-02-03", description: "Grocery Store", amount: 95.00, category: "Food & Dining", type: "expense" },
  { id: "23", date: "2026-02-05", description: "Freelance Project", amount: 800, category: "Freelance", type: "income" },
  { id: "24", date: "2026-02-08", description: "Shopping Mall", amount: 210, category: "Shopping", type: "expense" },
  { id: "25", date: "2026-02-10", description: "Electric Bill", amount: 135, category: "Utilities", type: "expense" },
  { id: "26", date: "2026-02-14", description: "Valentine Dinner", amount: 95, category: "Food & Dining", type: "expense" },
  { id: "27", date: "2026-02-18", description: "Gas Station", amount: 50, category: "Transportation", type: "expense" },
  { id: "28", date: "2026-02-20", description: "Concert Tickets", amount: 75, category: "Entertainment", type: "expense" },
  { id: "29", date: "2026-02-25", description: "Dividend Payment", amount: 310, category: "Investments", type: "income" },
  { id: "30", date: "2026-02-28", description: "Internet Bill", amount: 60, category: "Utilities", type: "expense" },
];
