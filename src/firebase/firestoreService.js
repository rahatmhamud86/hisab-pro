// Firestore service
// গঠন: users/{uid} -> { name, email, photo, createdAt, currency, theme }
//       users/{uid}/transactions/{transactionId} -> { type, amount, category, note, date, createdAt }
// প্রতিটি ইউজার শুধু নিজের ডেটা read/write করতে পারবে (দেখুন firestore.rules)

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

/* ---------------- USER PROFILE ---------------- */

export async function createOrUpdateUserProfile(uid, { name, email, photo }) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name,
      email,
      photo,
      currency: "BDT",
      theme: "dark",
      createdAt: serverTimestamp(),
    });
  } else {
    // প্রোফাইল photo/name আপডেট থাকলে সিঙ্ক করে রাখা (কিন্তু ইউজারের কাস্টম নাম override করবে না)
    await updateDoc(ref, { email, photo });
  }
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
}

/* ---------------- TRANSACTIONS ---------------- */

function txnCollection(uid) {
  return collection(db, "users", uid, "transactions");
}

/**
 * রিয়েল-টাইম লিসেনার। ইউজার যেকোনো ডিভাইস থেকে লগইন করলেই
 * তার আগের সব transaction এখান থেকে অটোমেটিক লোড হয়ে যায়।
 */
export function subscribeToTransactions(uid, callback, onError) {
  const q = query(txnCollection(uid), orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const txns = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(txns);
    },
    (err) => {
      console.error("Firestore sync error:", err);
      if (onError) onError(err);
    }
  );
}

export async function addTransaction(uid, txn) {
  const ref = await addDoc(txnCollection(uid), {
    type: txn.type,
    amount: Number(txn.amount),
    category: txn.category,
    note: txn.note || "",
    date: txn.date, // ISO string — user-visible transaction date
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTransaction(uid, txnId, data) {
  const ref = doc(db, "users", uid, "transactions", txnId);
  await updateDoc(ref, {
    type: data.type,
    amount: Number(data.amount),
    category: data.category,
    note: data.note || "",
    date: data.date,
  });
}

export async function deleteTransaction(uid, txnId) {
  const ref = doc(db, "users", uid, "transactions", txnId);
  await deleteDoc(ref);
}

/**
 * Restore/Backup ইমপোর্টের জন্য — একসাথে অনেক transaction লেখা (batched write)
 */
export async function bulkAddTransactions(uid, txns) {
  const batches = [];
  let batch = writeBatch(db);
  let count = 0;

  for (const t of txns) {
    const ref = doc(txnCollection(uid));
    batch.set(ref, {
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
      note: t.note || "",
      date: t.date,
      createdAt: serverTimestamp(),
    });
    count++;
    if (count === 450) {
      batches.push(batch.commit());
      batch = writeBatch(db);
      count = 0;
    }
  }
  if (count > 0) batches.push(batch.commit());
  await Promise.all(batches);
}
