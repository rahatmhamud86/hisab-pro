export const INCOME_CATEGORIES = [
  { value: "বেতন", icon: "💼" },
  { value: "ফ্রিল্যান্স", icon: "💻" },
  { value: "কাস্টমার পেমেন্ট", icon: "💳" },
  { value: "বিকাশ/নগদ", icon: "📱" },
  { value: "রেমিটেন্স", icon: "🌍" },
  { value: "অন্যান্য আয়", icon: "➕" },
];

export const EXPENSE_CATEGORIES = [
  { value: "খাবার", icon: "🍔" },
  { value: "বাজার", icon: "🛒" },
  { value: "ভাড়া", icon: "🏠" },
  { value: "বিল", icon: "📄" },
  { value: "মেডিসিন", icon: "💊" },
  { value: "যাতায়াত", icon: "🚗" },
  { value: "শিক্ষা", icon: "📚" },
  { value: "শপিং", icon: "🛍️" },
  { value: "অন্যান্য ব্যয়", icon: "➖" },
];

export const OTHER_INCOME = "অন্যান্য আয়";
export const OTHER_EXPENSE = "অন্যান্য ব্যয়";

export const CATEGORY_ICON_MAP = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].reduce(
  (map, c) => {
    map[c.value] = c.icon;
    return map;
  },
  {}
);

export function getCategoryIcon(category) {
  return CATEGORY_ICON_MAP[category] || "📌";
}

export const CHART_COLORS = [
  "#22c55e", "#06b6d4", "#a855f7", "#f59e0b", "#ef4444",
  "#3b82f6", "#84cc16", "#f97316", "#14b8a6", "#eab308",
];
