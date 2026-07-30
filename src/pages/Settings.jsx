import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { useTransactions } from "../hooks/useTransactions";
import { deleteCurrentAccount } from "../firebase/authService";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  backupToJSON,
  parseBackupFile,
} from "../utils/exportUtils";

export default function Settings() {
  const { user, profile, signOutUser } = useAuthContext();
  const { currency, setCurrency, theme, setTheme, CURRENCY_SYMBOLS } = useAppContext();
  const { txns, restore } = useTransactions();
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const summary = txns.reduce(
    (s, t) => {
      if (t.type === "income") s.income += Number(t.amount);
      else s.expense += Number(t.amount);
      return s;
    },
    { income: 0, expense: 0 }
  );
  summary.balance = summary.income - summary.expense;

  async function handleExport(kind) {
    if (txns.length === 0) return setMsg("এক্সপোর্ট করার মতো কোনো লেনদেন নেই");
    if (kind === "csv") exportToCSV(txns);
    if (kind === "excel") exportToExcel(txns);
    if (kind === "pdf") exportToPDF(txns, summary);
    setMsg("✅ এক্সপোর্ট সম্পন্ন হয়েছে");
  }

  function handleBackup() {
    if (txns.length === 0) return setMsg("ব্যাকআপ করার মতো কোনো লেনদেন নেই");
    backupToJSON(txns);
    setMsg("✅ ব্যাকআপ ডাউনলোড হয়েছে");
  }

  async function handleRestoreFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const data = await parseBackupFile(file);
      await restore(data);
      setMsg(`✅ ${data.length}টি লেনদেন রিস্টোর হয়েছে`);
    } catch (err) {
      setMsg("❌ ব্যাকআপ ফাইল পড়তে সমস্যা হয়েছে");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "আপনার অ্যাকাউন্ট মুছে ফেলতে চান? এই কাজটি ফেরানো যাবে না। (আগে লেনদেনগুলোর ব্যাকআপ নিয়ে রাখুন)"
      )
    )
      return;
    setBusy(true);
    try {
      await deleteCurrentAccount();
    } catch (err) {
      setMsg("❌ অ্যাকাউন্ট ডিলিট করতে পুনরায় লগইন প্রয়োজন। আবার লগইন করে চেষ্টা করুন।");
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <div className="shell">
        <Header />

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">প্রোফাইল</div>
          <div className="row" style={{ marginTop: 10, alignItems: "center" }}>
            {profile?.photo && (
              <img src={profile.photo} alt="" style={{ width: 56, height: 56, borderRadius: 16 }} />
            )}
            <div>
              <div style={{ fontWeight: 800 }}>{profile?.name}</div>
              <div className="subTitle">{user?.email}</div>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">থিম</div>
          <div className="seg" style={{ marginTop: 10 }}>
            <button
              className={"segBtn " + (theme === "dark" ? "active" : "")}
              onClick={() => setTheme("dark")}
            >
              🌙 Dark
            </button>
            <button
              className={"segBtn " + (theme === "light" ? "active" : "")}
              onClick={() => setTheme("light")}
            >
              ☀️ Light
            </button>
          </div>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">কারেন্সি</div>
          <select
            className="input selectInput"
            style={{ marginTop: 10 }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
              <option key={code} value={code}>
                {symbol} {code}
              </option>
            ))}
          </select>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">ভাষা</div>
          <div className="subTitle" style={{ marginTop: 8 }}>
            🇧🇩 বাংলা (ডিফল্ট) — ইংরেজি সাপোর্ট শীঘ্রই আসছে
          </div>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">এক্সপোর্ট</div>
          <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => handleExport("pdf")}>📄 PDF</button>
            <button className="btn" onClick={() => handleExport("excel")}>📊 Excel</button>
            <button className="btn" onClick={() => handleExport("csv")}>📑 CSV</button>
          </div>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">ব্যাকআপ ও রিস্টোর</div>
          <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={handleBackup} disabled={busy}>
              ⬇️ ব্যাকআপ নিন
            </button>
            <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={busy}>
              ⬆️ রিস্টোর করুন
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleRestoreFile}
            />
          </div>
        </section>

        {msg && (
          <div className="smallNote" style={{ marginBottom: 14 }}>
            {msg}
          </div>
        )}

        <section className="card" style={{ marginBottom: 14 }}>
          <div className="cardTitle">অ্যাকাউন্ট</div>
          <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={signOutUser}>Logout</button>
            <button
              className="btn"
              style={{ borderColor: "var(--red)", color: "var(--red)" }}
              onClick={handleDeleteAccount}
              disabled={busy}
            >
              🗑️ Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
