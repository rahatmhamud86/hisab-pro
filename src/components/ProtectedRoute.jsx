import React from "react";
import { useAuthContext } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import LoadingScreen from "./LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;
  if (!user) return <LandingPage />;
  return children;
}