// Authentication service — Google Sign-In, Logout, Persistent Login
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  deleteUser,
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { createOrUpdateUserProfile } from "./firestoreService";

/**
 * Google দিয়ে সাইন-ইন করুন। browserLocalPersistence ব্যবহার করা হয়েছে
 * যাতে ব্রাউজার/ডিভাইস বন্ধ করার পরও লগইন সেশন টিকে থাকে (Persistent Login)।
 */
export async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // প্রথমবার লগইন হলে users/{uid} ডকুমেন্ট তৈরি/আপডেট করুন
  await createOrUpdateUserProfile(user.uid, {
    name: user.displayName || "ইউজার",
    email: user.email || "",
    photo: user.photoURL || "",
  });

  return user;
}

export async function logout() {
  await signOut(auth);
}

/**
 * অথ স্টেট পরিবর্তন (লগইন/লগআউট) শোনার জন্য listener।
 * একই Google অ্যাকাউন্ট দিয়ে যেকোনো ডিভাইসে লগইন করলে এই listener-ই
 * ইউজারকে চিনে নেবে এবং তার আগের সব ডেটা Firestore থেকে লোড হবে।
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function deleteCurrentAccount() {
  const user = auth.currentUser;
  if (!user) throw new Error("কোনো ইউজার লগইন করা নেই");
  await deleteUser(user);
}

export function getCurrentUser() {
  return auth.currentUser;
}
