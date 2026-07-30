import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatBDT } from "../utils/formatters";

export default function MonthlyChart({ data }) {
  return (
    <div className="card">
      <div className="cardTitle">মাসভিত্তিক ট্রেন্ড (গত ১২ মাস)</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.55)" fontSize={11} />
          <YAxis stroke="rgba(255,255,255,0.55)" fontSize={12} />
          <Tooltip formatter={(v) => `৳ ${formatBDT(v)}`} contentStyle={{ background: "#0f2a2a", border: "1px solid rgba(255,255,255,0.12)" }} />
          <Legend />
          <Bar dataKey="income" name="আয়" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="ব্যয়" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
