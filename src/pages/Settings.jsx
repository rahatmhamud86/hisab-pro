import React, { useRef, useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { useTransactions } from "../hooks/useTransactions";
import { deleteCurrentAccount } from "../firebase/authService";
import {
  createInvite,
  getFamilyMembers,
  removeFamilyMember,
} from "../firebase/firestoreService";
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
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [removingUid, setRemovingUid] = useState(null);

  const isOwner = profile?.familyId && user?.uid === profile.familyId;

  const loadMembers = useCallback(async () => {
    if (!profile?.familyId) return;
    setMembersLoading(true);
    const data = await getFamilyMembers(profile.familyId);
    setMembers(data.members);
    setMembersLoading(false);
  }, [profile?.familyId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

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

  async function handleSendInvite() {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setInviteMsg("❌ সঠিক ইমেইল দিন");
      return;
    }
    setInviteBusy(true);
    setInviteMsg("");
    try {
      await createInvite(profile.familyId, profile.name, inviteEmail.trim());
      setInviteMsg("✅ Invite ইমেইল পাঠানো হয়েছে");
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      setInviteMsg("❌ Invite পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setInviteBusy(false);
    }
  }

  async function handleRemoveMember(targetUid, name) {
    if (!window.confirm(`${name}-কে Family Group থেকে বাদ দিতে চান? সে আর আপনাদের লেনদেন দেখতে পারবে না।`))
      return;
    setRemovingUid(targetUid);
    try {
      await removeFamilyMember(profile.familyId, targetUid);
      await loadMembers();
    } catch (err) {
      setInviteMsg("❌ রিমুভ করতে সমস্যা হয়েছে");
    } finally {
      setRemovingUid(null);
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
          <div className="cardTitle">
            👨‍👩‍👧‍👦 Family Group {members.length > 0 && `(${members.length} জন)`}
          </div>
          <div className="subTitle" style={{ marginTop: 8, marginBottom: 10 }}>
            ইমেইল দিয়ে পরিবারের সদস্যকে ইনভাইট করুন — তারা যোগ হলে সবার লেনদেন একসাথে দেখা যাবে
          </div>

          {membersLoading ? (
            <div className="subTitle">লোড হচ্ছে...</div>
          ) : (
            <div style={{ marginBottom: 14 }}>
              {members.map((m) => (
                <div
                  key={m.uid}
                  className="row"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {m.name} {m.uid === profile.familyId && "👑"} {m.uid === user.uid && "(আপনি)"}
                    </div>
                    <div className="subTitle" style={{ fontSize: 12 }}>{m.email}</div>
                  </div>
                  {isOwner && m.uid !== user.uid && (
                    <button
                      className="btn"
                      style={{ borderColor: "var(--red)", color: "var(--red)", padding: "6px 10px" }}
                      onClick={() => handleRemoveMember(m.uid, m.name)}
                      disabled={removingUid === m.uid}
                    >
                      {removingUid === m.uid ? "..." : "🗑️ Remove"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
            <input
              className="input"
              type="email"
              placeholder="member@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <button className="btn" onClick={handleSendInvite} disabled={inviteBusy}>
              {inviteBusy ? "পাঠানো হচ্ছে..." : "📧 Invite পাঠান"}
            </button>
          </div>
          {inviteMsg && (
            <div className="smallNote" style={{ marginTop: 8 }}>
              {inviteMsg}
            </div>
          )}
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