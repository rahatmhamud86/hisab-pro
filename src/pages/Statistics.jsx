import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import PieChartCard from "../components/PieChartCard";
import BarChartCard from "../components/BarChartCard";
import MonthlyChart from "../components/MonthlyChart";
import { useTransactions } from "../hooks/useTransactions";
import { rangeBounds, inRange, last12MonthsBuckets, FILTER_LABELS } from "../utils/dateRange";
import { formatAmount } from "../utils/formatters";
import { useAppContext } from "../context/AppContext";

export default function Statistics() {
  const { txns, loading } = useTransactions();
  const { currencySymbol } = useAppContext();
  const [filter, setFilter] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const { from, to } = useMemo(
    () => rangeBounds(filter, customFrom, customTo),
    [filter, customFrom, customTo]
  );

  const filtered = useMemo(() => {
    if (!from || !to) return txns;
    return txns.filter((t) => inRange(t.date, from, to));
  }, [txns, from, to]);

  const pieData = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      if (t.type === "expense") map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(map)
      .map((key) => ({ name: key, value: map[key] }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const barData = useMemo(() => {
    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return [{ label: FILTER_LABELS[filter], income, expense }];
  }, [filtered, filter]);

  const monthlyData = useMemo(() => last12MonthsBuckets(txns), [txns]);

  const topExpense = pieData[0];
  const top5 = pieData.slice(0, 5);

  return (
    <div className="page">
      <div className="shell">
        <Header />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          customFrom={customFrom}
          customTo={customTo}
          setCustomFrom={setCustomFrom}
          setCustomTo={setCustomTo}
        />

        {loading ? (
          <div className="card" style={{ marginTop: 14, textAlign: "center", opacity: 0.7 }}>
            লোড হচ্ছে...
          </div>
        ) : (
          <>
            <section className="grid" style={{ marginTop: 14 }}>
              <PieChartCard data={pieData} title="ক্যাটাগরি-ভিত্তিক খরচ" />
              <div className="card">
                <div className="cardTitle">সংক্ষিপ্ত বিবরণ</div>
                {topExpense ? (
                  <>
                    <div style={{ fontWeight: 700, marginTop: 8 }}>
                      সবচেয়ে বেশি খরচ: {topExpense.name} —{" "}
                      {formatAmount(topExpense.value, currencySymbol)}
                    </div>
                    <div style={{ marginTop: 10, opacity: 0.9, fontSize: 13 }}>
                      Top খাতগুলো:
                      {top5.map((x) => (
                        <div key={x.name} style={{ marginTop: 4 }}>
                          • {x.name}: {formatAmount(x.value, currencySymbol)}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ opacity: 0.6 }}>এই রেঞ্জে কোনো খরচ নেই</div>
                )}
              </div>
            </section>

            <section style={{ marginTop: 14 }}>
              <BarChartCard data={barData} title={`আয় বনাম ব্যয় — ${FILTER_LABELS[filter]}`} />
            </section>

            <section style={{ marginTop: 14 }}>
              <MonthlyChart data={monthlyData} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
