import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDateTime } from "./formatters";

function toRows(txns) {
  return txns.map((t) => ({
    Type: t.type === "income" ? "আয়" : "ব্যয়",
    Amount: t.amount,
    Category: t.category,
    Note: t.note || "",
    Date: formatDateTime(t.date),
  }));
}

export function exportToCSV(txns, filename = "hisab-transactions.csv") {
  const rows = toRows(txns);
  const header = Object.keys(rows[0] || { Type: "", Amount: "", Category: "", Note: "", Date: "" });
  const csv = [
    header.join(","),
    ...rows.map((r) => header.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

export function exportToExcel(txns, filename = "hisab-transactions.xlsx") {
  const rows = toRows(txns);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(txns, summary, filename = "hisab-transactions.pdf") {
  const docPdf = new jsPDF();
  docPdf.setFontSize(16);
  docPdf.text("Hisab Pro - Transaction Report", 14, 16);
  docPdf.setFontSize(10);
  docPdf.text(
    `Income: ${summary.income}   Expense: ${summary.expense}   Balance: ${summary.balance}`,
    14,
    24
  );

  autoTable(docPdf, {
    startY: 30,
    head: [["Type", "Amount", "Category", "Note", "Date"]],
    body: txns.map((t) => [
      t.type === "income" ? "Income" : "Expense",
      t.amount,
      t.category,
      t.note || "-",
      formatDateTime(t.date),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 197, 94] },
  });

  docPdf.save(filename);
}

/** সম্পূর্ণ ব্যাকআপ (JSON) — সব transaction ডাউনলোড হবে */
export function backupToJSON(txns, filename = "hisab-backup.json") {
  const blob = new Blob([JSON.stringify(txns, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

/** JSON ব্যাকআপ ফাইল পার্স করে transaction অ্যারে রিটার্ন করে */
export function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error("ফরম্যাট সঠিক নয়");
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
