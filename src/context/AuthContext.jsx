import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges, loginWithGoogle, logout } from "../firebase/authService";
import {
  getUserProfile,
  createOrUpdateUserProfile,
} from "../firebase/firestoreService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // firebase auth user
  const [profile, setProfile] = useState(null); // firestore users/{uid} doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persistent Login: অ্যাপ রিলোড হলেও onAuthStateChanged আগের সেশন ফিরিয়ে দেয়
    const unsub = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        let p = await getUserProfile(firebaseUser.uid);
        if (!p) {
          await createOrUpdateUserProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || "ইউজার",
            email: firebaseUser.email || "",
            photo: firebaseUser.photoURL || "",
          });
          p = await getUserProfile(firebaseUser.uid);
        }
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn() {
    await loginWithGoogle();
  }

  async function signOutUser() {
    await logout();
  }

  function refreshProfile(newData) {
    setProfile((prev) => ({ ...prev, ...newData }));
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signOutUser, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
