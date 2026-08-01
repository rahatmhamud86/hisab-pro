import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  subscribeToFamilyTransactions,
  addFamilyTransaction,
  updateFamilyTransaction,
  deleteFamilyTransaction,
} from "../firebase/firestoreService";

/**
 * ইউজার লগইন করা মাত্র তার Family Group-এর transaction গুলোর সাথে
 * রিয়েল-টাইম সিঙ্ক শুরু হয়। পরিবারের যে কেউ অ্যাড/এডিট/ডিলিট করলে
 * সবার স্ক্রিনে সাথে সাথে আপডেট আসবে।
 */
export function useTransactions() {
  const { user, profile } = useAuthContext();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const familyId = profile?.familyId;

  useEffect(() => {
    if (!user || !familyId) {
      setTxns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToFamilyTransactions(
      familyId,
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
  }, [user, familyId]);

  const add = useCallback(
    (txn) => {
      if (!user || !familyId) return Promise.reject(new Error("লগইন করুন"));
      return addFamilyTransaction(familyId, { ...txn, addedBy: user.uid });
    },
    [user, familyId]
  );

  const update = useCallback(
    (id, data) => {
      if (!user || !familyId) return Promise.reject(new Error("লগইন করুন"));
      return updateFamilyTransaction(familyId, id, data);
    },
    [user, familyId]
  );

  const remove = useCallback(
    (id) => {
      if (!user || !familyId) return Promise.reject(new Error("লগইন করুন"));
      return deleteFamilyTransaction(familyId, id);
    },
    [user, familyId]
  );

  const restore = useCallback(
    async (list) => {
      if (!user || !familyId) return Promise.reject(new Error("লগইন করুন"));
      for (const txn of list) {
        await addFamilyTransaction(familyId, { ...txn, addedBy: user.uid });
      }
    },
    [user, familyId]
  );

  return { txns, loading, error, add, update, remove, restore };
}