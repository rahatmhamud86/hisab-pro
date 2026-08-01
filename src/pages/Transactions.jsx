import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { SkeletonTransactionList } from "../components/Skeleton";
import { useTransactions } from "../hooks/useTransactions";
import { rangeBounds, inRange } from "../utils/dateRange";

export default function Transactions() {
  const { txns, loading, add, update, remove } = useTransactions();
  const [filter, setFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | income | expense
  const [editingTxn, setEditingTxn] = useState(null);

  const { from, to } = useMemo(
    () => rangeBounds(filter, customFrom, customTo),
    [filter, customFrom, customTo]
  );

  const filtered = useMemo(() => {
    let data = txns;
    if (from && to) data = data.filter((t) => inRange(t.date, from, to));
    if (typeFilter !== "all") data = data.filter((t) => t.type === typeFilter);
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      data = data.filter(
        (t) =>
          (t.category || "").toLowerCase().includes(q) ||
          (t.note || "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [txns, from, to, typeFilter, searchText]);

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

        <div className="seg" style={{ marginTop: 10 }}>
          <button
            className={"segBtn " + (typeFilter === "all" ? "active" : "")}
            onClick={() => setTypeFilter("all")}
          >
            সব
          </button>
          <button
            className={"segBtn " + (typeFilter === "income" ? "active" : "")}
            onClick={() => setTypeFilter("income")}
          >
            আয়
          </button>
          <button
            className={"segBtn " + (typeFilter === "expense" ? "active" : "")}
            onClick={() => setTypeFilter("expense")}
          >
            ব্যয়
          </button>
        </div>

        <section className="grid" style={{ marginTop: 14, gridTemplateColumns: "0.8fr 1.2fr" }}>
          <TransactionForm
            onSubmit={handleSubmit}
            editingTxn={editingTxn}
            onCancelEdit={() => setEditingTxn(null)}
          />
          {loading ? (
            <SkeletonTransactionList rows={6} />
          ) : (
            <TransactionList items={filtered} onEdit={setEditingTxn} onDelete={handleDelete} />
          )}
        </section>
      </div>
    </div>
  );
}