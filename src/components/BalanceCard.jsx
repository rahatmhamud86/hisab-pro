import React, { useEffect, useState } from "react";
import { formatAmount, formatBDT } from "../utils/formatters";
import { useAppContext } from "../context/AppContext";

export default function BalanceCard({ summary, titleRange }) {
  const { currencySymbol } = useAppContext();
  const [animatedBalance, setAnimatedBalance] = useState(0);

  useEffect(() => {
    const target = Number(summary.balance) || 0;
    const duration = 600;
    const start = performance.now();
    const from = animatedBalance;
    let rafId;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (target - from) * p);
      setAnimatedBalance(val);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.balance]);

  const savings = summary.income > 0 ? Math.max(0, summary.balance) : 0;
  const savingsPct =
    summary.income > 0 ? Math.round((savings / summary.income) * 100) : 0;

  return (
    <div className="card hero glass glow">
      <div className="heroHead">
        <div>
          <div className="heroTitle">{titleRange} এর হিসাব</div>
          <div className="heroHint">ডেটা ক্লাউডে নিরাপদে সিঙ্ক হয় (Firestore)</div>
        </div>
        <div className="pill">Balance</div>
      </div>

      <div className="balance balanceAnimated">
        {currencySymbol} {formatBDT(animatedBalance)}
      </div>

      <div className="stats statsThree">
        <div className="stat">
          <div className="statLabel">Income</div>
          <div className="statValue" style={{ color: "var(--green)" }}>
            {formatAmount(summary.income, currencySymbol)}
          </div>
        </div>
        <div className="stat">
          <div className="statLabel">Expense</div>
          <div className="statValue" style={{ color: "var(--red)" }}>
            {formatAmount(summary.expense, currencySymbol)}
          </div>
        </div>
        <div className="stat">
          <div className="statLabel">Savings ({savingsPct}%)</div>
          <div className="statValue">{formatAmount(savings, currencySymbol)}</div>
        </div>
      </div>
    </div>
  );
}
