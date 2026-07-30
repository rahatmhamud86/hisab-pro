import React from "react";
const OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "Weekly" },
  { key: "month", label: "Monthly" },
  { key: "year", label: "Yearly" },
  { key: "all", label: "All" },
  { key: "custom", label: "Custom" },
];
export default function FilterBar({ filter, setFilter, customFrom, customTo, setCustomFrom, setCustomTo }) {
  return (
    <div>
      <div
        className="seg"
        style={{
          display: "flex",
          overflowX: "auto",
          flexWrap: "nowrap",
          gap: 6,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 4,
        }}
      >
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            className={"segBtn " + (filter === o.key ? "active" : "")}
            onClick={() => setFilter(o.key)}
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {filter === "custom" && (
        <div className="row" style={{ marginTop: 8 }}>
          <input
            type="date"
            className="input"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
          />
          <input
            type="date"
            className="input"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}