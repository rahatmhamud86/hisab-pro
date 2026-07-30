import React, { useState, useEffect } from "react";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  OTHER_INCOME,
  OTHER_EXPENSE,
} from "../utils/categories";

const EMPTY = { type: "expense", amount: "", category: "", note: "", customCategory: "" };

export default function TransactionForm({ onSubmit, editingTxn, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTxn) {
      const isOther = editingTxn.category === OTHER_INCOME || editingTxn.category === OTHER_EXPENSE;
      setForm({
        type: editingTxn.type,
        amount: String(editingTxn.amount),
        category: isOther ? (editingTxn.type === "income" ? OTHER_INCOME : OTHER_EXPENSE) : editingTxn.category,
        note: editingTxn.note || "",
        customCategory: isOther ? editingTxn.category : "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingTxn]);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isOtherSelected = form.category === OTHER_INCOME || form.category === OTHER_EXPENSE;
  const amountPlaceholder = form.type === "income" ? "যেমন 500" : "যেমন 150";

  async function handleSubmit() {
    setError("");
    const a = parseInt(String(form.amount).trim(), 10);
    if (!a || a <= 0) return setError("Amount ঠিক মতো দাও (যেমন 150)");
    if (!form.category) return setError("Category নির্বাচন করুন");
    if (isOtherSelected && !form.customCategory.trim())
      return setError("অন্যান্য আয়/ব্যয়ের জন্য নাম লিখুন");

    const payload = {
      type: form.type,
      amount: a,
      category: isOtherSelected ? form.customCategory.trim() : form.category,
      note: form.note.trim(),
      date: editingTxn ? editingTxn.date : new Date().toISOString(),
    };

    try {
      await onSubmit(payload);
      setForm(EMPTY);
    } catch (e) {
      setError("সেভ করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="card form">
      <div className="cardTitle">
        {editingTxn ? "লেনদেন এডিট করুন" : "নতুন হিসাব যোগ করো"}
      </div>

      <div className="row">
        <button
          className={"typeBtn " + (form.type === "expense" ? "active" : "")}
          onClick={() => update({ type: "expense", category: "", customCategory: "" })}
        >
          ব্যয়
        </button>
        <button
          className={"typeBtn " + (form.type === "income" ? "active" : "")}
          onClick={() => update({ type: "income", category: "", customCategory: "" })}
        >
          আয়
        </button>
      </div>

      <label className="label">Amount (৳)</label>
      <input
        className="input"
        value={form.amount}
        onChange={(e) => update({ amount: e.target.value })}
        placeholder={amountPlaceholder}
        inputMode="numeric"
      />

      <label className="label">Category</label>
      <select
        className="input noteInput selectInput"
        value={form.category}
        onChange={(e) => update({ category: e.target.value })}
      >
        <option value="">ক্যাটাগরি নির্বাচন করুন</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.icon} {c.value}
          </option>
        ))}
      </select>

      {isOtherSelected && (
        <input
          className="input noteInput"
          placeholder="কিসের আয়/ব্যয় লিখুন"
          value={form.customCategory}
          onChange={(e) => update({ customCategory: e.target.value })}
        />
      )}

      <label className="label">নোট (ঐচ্ছিক)</label>
      <input
        className="input"
        placeholder="অতিরিক্ত তথ্য (যেমন: কার কাছ থেকে, কোথায়)"
        value={form.note}
        onChange={(e) => update({ note: e.target.value })}
      />

      {error && (
        <div className="smallNote" style={{ color: "var(--red)" }}>
          {error}
        </div>
      )}

      <button className="btn primary" onClick={handleSubmit}>
        {editingTxn ? "আপডেট করুন" : "Add"}
      </button>

      {editingTxn && (
        <button className="btn" onClick={onCancelEdit} style={{ marginTop: 8 }}>
          বাতিল করুন
        </button>
      )}

      {!editingTxn && (
        <div className="smallNote">Tip: ভুল হলে Edit করে ঠিক করা যায়।</div>
      )}
    </div>
  );
}
