export function formatBDT(n) {
  try {
    return new Intl.NumberFormat("bn-BD").format(Number(n) || 0);
  } catch {
    return String(n);
  }
}

export function formatAmount(n, symbol = "৳") {
  return `${symbol} ${formatBDT(n)}`;
}

export function formatDateTime(dateISO) {
  const dt = new Date(dateISO);
  return dt.toLocaleString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(dateISO) {
  const dt = new Date(dateISO);
  return dt.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}
