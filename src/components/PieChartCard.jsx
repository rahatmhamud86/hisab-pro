import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../utils/categories";
import { formatBDT } from "../utils/formatters";

export default function PieChartCard({ data, title = "খরচের চার্ট" }) {
  const hasData = data && data.length > 0;

  return (
    <div className="card">
      <div className="cardTitle">{title}</div>
      {!hasData ? (
        <div style={{ opacity: 0.6 }}>কোন ডেটা নেই</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={85}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `৳ ${formatBDT(v)}`} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
