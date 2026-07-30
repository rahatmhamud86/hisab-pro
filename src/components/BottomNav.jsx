import React from "react";
import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "ড্যাশবোর্ড", icon: "🏠", end: true },
  { to: "/transactions", label: "লেনদেন", icon: "📋" },
  { to: "/statistics", label: "পরিসংখ্যান", icon: "📊" },
  { to: "/settings", label: "সেটিংস", icon: "⚙️" },
];

export default function BottomNav() {
  return (
    <nav className="seg bottomNav">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => "segBtn navTab" + (isActive ? " active" : "")}
        >
          <span style={{ marginRight: 6 }}>{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
