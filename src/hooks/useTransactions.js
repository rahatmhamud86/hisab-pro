import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  subscribeToTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  bulkAddTransactions,
} from "../firebase/firestoreService";

/**
 * ইউজার লগইন করা মাত্র Firestore-এর সাথে রিয়েল-টাইম সিঙ্ক শুরু হয়।
 * অন্য ডিভাইস থেকে অ্যাড/এডিট/ডিলিট করলেও এখানে সাথে সাথে আপডেট আসবে।
 */
export function useTransactions() {
  const { user } = useAuthContext();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setTxns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToTransactions(
      user.uid,
      (data) => {
        setTxns(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const add = useCallback(
    (txn) => {
      if (!user) return Promise.reject(new Error("লগইন করুন"));
      return addTransaction(user.uid, txn);
    },
    [user]
  );

  const update = useCallback(
    (id, data) => {
      if (!user) return Promise.reject(new Error("লগইন করুন"));
      return updateTransaction(user.uid, id, data);
    },
    [user]
  );

  const remove = useCallback(
    (id) => {
      if (!user) return Promise.reject(new Error("লগইন করুন"));
      return deleteTransaction(user.uid, id);
    },
    [user]
  );

  const restore = useCallback(
    (list) => {
      if (!user) return Promise.reject(new Error("লগইন করুন"));
      return bulkAddTransactions(user.uid, list);
    },
    [user]
  );

  return { txns, loading, error, add, update, remove, restore };
}
