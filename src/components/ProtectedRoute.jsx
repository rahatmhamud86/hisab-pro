import React from "react";
import { useAuthContext } from "../context/AuthContext";
import Login from "./Login";
import LoadingScreen from "./LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;
  if (!user) return <Login />;
  return children;
}
