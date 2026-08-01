import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { SkeletonBalanceCard, SkeletonTransactionList } from "../components/Skeleton";
import { useTransactions } from "../hooks/useTransactions";
import { rangeBounds, inRange, FILTER_LABELS } from "../utils/dateRange";

export default function Dashboard() {
  const { txns, loading, add, update, remove } = useTransactions();
  const [filter, setFilter] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editingTxn, setEditingTxn] = useState(null);

  const { from, to } = useMemo(
    () => rangeBounds(filter, customFrom, customTo),
    [filter, customFrom, customTo]
  );

  const filtered = useMemo(() => {
    let data = txns;
    if (from && to) data = data.filter((t) => inRange(t.date, from, to));
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      data = data.filter(
        (t) =>
          (t.category || "").toLowerCase().includes(q) ||
          (t.note || "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [txns, from, to, searchText]);

  const summary = useMemo(() => {
    let income = 0, expense = 0;
    for (const t of filtered) {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    }
    return { income, expense, balance: income - expense };
  }, [filtered]);

  async function handleSubmit(payload) {
    if (editingTxn) {
      await update(editingTxn.id, payload);
      setEditingTxn(null);
    } else {
      await add(payload);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("এই লেনদেনটি ডিলিট করতে চান?")) {
      await remove(id);
    }
  }

  return (
    <div className="page">
      <div className="shell">
        <Header />

        <div className="row" style={{ marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          customFrom={customFrom}
          customTo={customTo}
          setCustomFrom={setCustomFrom}
          setCustomTo={setCustomTo}
        />

        {loading ? (
          <>
            <section className="grid" style={{ marginTop: 14 }}>
              <SkeletonBalanceCard />
              <SkeletonBalanceCard />
            </section>
            <SkeletonTransactionList rows={1} />
          </>
        ) : (
          <>
            <section className="grid" style={{ marginTop: 14 }}>
              <BalanceCard summary={summary} titleRange={FILTER_LABELS[filter]} />
              <TransactionForm
                onSubmit={handleSubmit}
                editingTxn={editingTxn}
                onCancelEdit={() => setEditingTxn(null)}
              />
            </section>

            <TransactionList
              items={filtered.slice(0, 1)}
              onEdit={setEditingTxn}
              onDelete={handleDelete}
              title="সর্বশেষ লেনদেন"
            />
          </>
        )}

        <footer className="foot">
          <div>© {new Date().getFullYear()} হিসাব প্রো</div>
          <div className="footHint">সব লেনদেন দেখতে "লেনদেন" ট্যাবে যান</div>
        </footer>
      </div>
    </div>
  );
}