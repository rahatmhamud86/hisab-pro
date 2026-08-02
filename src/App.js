import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import PullToRefresh from "./components/PullToRefresh";
import InstallPrompt from "./components/InstallPrompt";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import JoinFamily from "./pages/JoinFamily";

function AuthenticatedShell({ children }) {
  return (
    <PullToRefresh>
      {children}
      <BottomNav />
      <InstallPrompt />
    </PullToRefresh>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/join-family/:inviteId" element={<JoinFamily />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AuthenticatedShell>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/statistics" element={<Statistics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Dashboard />} />
                    </Routes>
                  </AuthenticatedShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}