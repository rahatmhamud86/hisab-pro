import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatBDT } from "../utils/formatters";

export default function BarChartCard({ data, title = "আয় বনাম ব্যয়" }) {
  const hasData = data && data.length > 0;
  return (
    <div className="card">
      <div className="cardTitle">{title}</div>
      {!hasData ? (
        <div style={{ opacity: 0.6 }}>কোন ডেটা নেই</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.55)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.55)" fontSize={12} />
            <Tooltip formatter={(v) => `৳ ${formatBDT(v)}`} contentStyle={{ background: "#0f2a2a", border: "1px solid rgba(255,255,255,0.12)" }} />
            <Legend />
            <Bar dataKey="income" name="আয়" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="ব্যয়" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
