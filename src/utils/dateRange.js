export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function inRange(dateISO, from, toExclusive) {
  const t = new Date(dateISO).getTime();
  return t >= from.getTime() && t < toExclusive.getTime();
}

/**
 * filter: "today" | "week" | "month" | "year" | "all" | "custom"
 * customFrom / customTo: ISO date strings (yyyy-mm-dd), used only when filter === "custom"
 */
export function rangeBounds(filter, customFrom, customTo) {
  const now = new Date();
  const todayStart = startOfDay(now);

  if (filter === "today") {
    return { from: todayStart, to: addDays(todayStart, 1) };
  }
  if (filter === "week") {
    const from = addDays(todayStart, -6);
    const to = addDays(todayStart, 1);
    return { from, to };
  }
  if (filter === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { from, to };
  }
  if (filter === "year") {
    const from = new Date(now.getFullYear(), 0, 1);
    const to = new Date(now.getFullYear() + 1, 0, 1);
    return { from, to };
  }
  if (filter === "custom" && customFrom && customTo) {
    const from = startOfDay(new Date(customFrom));
    const to = addDays(startOfDay(new Date(customTo)), 1);
    return { from, to };
  }
  return { from: null, to: null }; // all
}

export const FILTER_LABELS = {
  today: "আজ",
  week: "শেষ ৭ দিন",
  month: "এই মাস",
  year: "এই বছর",
  custom: "কাস্টম রেঞ্জ",
  all: "সব",
};

/** গত ১২ মাসের মাসভিত্তিক income/expense সামারি (Monthly Chart-এর জন্য) */
export function last12MonthsBuckets(txns) {
  const now = new Date();
  const buckets = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("bn-BD", { month: "short", year: "2-digit" });
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label, income: 0, expense: 0 });
  }
  const map = new Map(buckets.map((b) => [b.key, b]));
  txns.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const b = map.get(key);
    if (!b) return;
    if (t.type === "income") b.income += Number(t.amount);
    else b.expense += Number(t.amount);
  });
  return buckets;
}
