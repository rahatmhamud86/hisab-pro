import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

const AppContext = createContext(null);

const CURRENCY_SYMBOLS = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export function AppProvider({ children }) {
  const { profile, refreshProfile } = useAuthContext();
  const [currency, setCurrencyState] = useState("BDT");
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    if (profile) {
      setCurrencyState(profile.currency || "BDT");
      setThemeState(profile.theme || "dark");
    }
  }, [profile]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  async function setCurrency(code) {
    setCurrencyState(code);
    refreshProfile({ currency: code });
    if (profile?.id) await updateUserProfile(profile.id, { currency: code });
  }

  async function setTheme(mode) {
    setThemeState(mode);
    refreshProfile({ theme: mode });
    if (profile?.id) await updateUserProfile(profile.id, { theme: mode });
  }

  const currencySymbol = CURRENCY_SYMBOLS[currency] || "৳";

  return (
    <AppContext.Provider
      value={{ currency, setCurrency, currencySymbol, theme, setTheme, CURRENCY_SYMBOLS }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
