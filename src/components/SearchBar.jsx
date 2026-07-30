import React from "react";

export default function SearchBar({ value, onChange, placeholder = "🔎 Search..." }) {
  return (
    <div className="searchBox">
      <span>🔎</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
