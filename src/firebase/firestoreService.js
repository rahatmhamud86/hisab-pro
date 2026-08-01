// Firestore service
// গঠন: users/{uid} -> { name, email, photo, createdAt, currency, theme, familyId }
//       families/{familyId} -> { ownerId, members: [uid...], memberInfo: { uid: {name, email} } }
//       families/{familyId}/transactions/{transactionId} -> { type, amount, category, note, date, createdAt, addedBy }
// প্রতিটি ইউজার শুধু নিজের পরিবারের ডেটা read/write করতে পারবে (দেখুন firestore.rules)

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
  where,
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

/* ---------------- TRANSACTIONS (পুরনো একক-ইউজার, আর ব্যবহার হচ্ছে না তবে রেখে দেওয়া হলো) ---------------- */

function txnCollection(uid) {
  return collection(db, "users", uid, "transactions");
}

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
    date: txn.date,
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

/* ---------------- FAMILY (Multi-user) ---------------- */

function familyRef(familyId) {
  return doc(db, "families", familyId);
}

export async function ensureFamily(uid, userEmail, userName) {
  const profile = await getUserProfile(uid);
  if (profile?.familyId) return profile.familyId;

  await setDoc(familyRef(uid), {
    ownerId: uid,
    members: [uid],
    memberInfo: {
      [uid]: { name: userName || "ইউজার", email: userEmail },
    },
    createdAt: serverTimestamp(),
  });
  await updateUserProfile(uid, { familyId: uid });
  return uid;
}

export async function getFamilyMembers(familyId) {
  const snap = await getDoc(familyRef(familyId));
  if (!snap.exists()) return { ownerId: null, members: [] };
  const data = snap.data();
  const memberInfo = data.memberInfo || {};
  const members = (data.members || []).map((uid) => ({
    uid,
    name: memberInfo[uid]?.name || "ইউজার",
    email: memberInfo[uid]?.email || "",
  }));
  return { ownerId: data.ownerId, members };
}

export async function removeFamilyMember(familyId, targetUid) {
  await updateDoc(familyRef(familyId), {
    members: arrayRemove(targetUid),
    [`memberInfo.${targetUid}`]: deleteField(),
  });
}

function familyTxnCollection(familyId) {
  return collection(db, "families", familyId, "transactions");
}

export function subscribeToFamilyTransactions(familyId, callback, onError) {
  const q = query(familyTxnCollection(familyId), orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const txns = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(txns);
    },
    (err) => {
      console.error("Family sync error:", err);
      if (onError) onError(err);
    }
  );
}

export async function addFamilyTransaction(familyId, txn) {
  const ref = await addDoc(familyTxnCollection(familyId), {
    type: txn.type,
    amount: Number(txn.amount),
    category: txn.category,
    note: txn.note || "",
    date: txn.date,
    addedBy: txn.addedBy || null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateFamilyTransaction(familyId, txnId, data) {
  const ref = doc(db, "families", familyId, "transactions", txnId);
  await updateDoc(ref, {
    type: data.type,
    amount: Number(data.amount),
    category: data.category,
    note: data.note || "",
    date: data.date,
  });
}

export async function deleteFamilyTransaction(familyId, txnId) {
  const ref = doc(db, "families", familyId, "transactions", txnId);
  await deleteDoc(ref);
}

/* ---------------- INVITE SYSTEM ---------------- */

export async function createInvite(familyId, inviterName, invitedEmail) {
  const ref = await addDoc(collection(db, "invites"), {
    familyId,
    invitedEmail: invitedEmail.toLowerCase(),
    status: "pending",
    createdAt: serverTimestamp(),
  });

  const inviteLink = `${window.location.origin}/join-family/${ref.id}`;
  const { sendFamilyInviteEmail } = await import("../utils/emailInvite");
  await sendFamilyInviteEmail(inviterName, invitedEmail, inviteLink);

  return ref.id;
}

export async function acceptInvite(inviteId, uid, userEmail, userName) {
  const inviteRef = doc(db, "invites", inviteId);
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) throw new Error("এই Invite লিঙ্কটি সঠিক নয়।");

  const invite = snap.data();
  if (invite.status !== "pending") throw new Error("এই Invite আগেই ব্যবহার হয়ে গেছে।");
  if (invite.invitedEmail !== userEmail.toLowerCase()) {
    throw new Error("এই Invite অন্য একটি ইমেইলের জন্য পাঠানো হয়েছে।");
  }

  await updateDoc(familyRef(invite.familyId), {
    members: arrayUnion(uid),
    [`memberInfo.${uid}`]: { name: userName || "ইউজার", email: userEmail },
  });
  await updateUserProfile(uid, { familyId: invite.familyId });
  await updateDoc(inviteRef, { status: "accepted" });

  return invite.familyId;
}