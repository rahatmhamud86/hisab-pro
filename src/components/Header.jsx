import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { updateUserProfile } from "../firebase/firestoreService";

export default function Header({ showAccount = false }) {
  const { profile, user, signOutUser, refreshProfile } = useAuthContext();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || "");

  function startEdit() {
    setNameInput(profile?.name || "");
    setEditingName(true);
  }

  async function saveName() {
    const n = nameInput.trim() || "ইউজার";
    refreshProfile({ name: n });
    if (user) await updateUserProfile(user.uid, { name: n });
    setEditingName(false);
  }

  return (
    <header className="topbar">
      <div className="brand">
        {profile?.photo ? (
          <img src={profile.photo} alt="profile" className="logo profilePhoto" />
        ) : (
          <div className="logo">৳</div>
        )}
        <div className="brandText">
          {!showAccount ? (
            <div className="appTitle">হিসাব প্রো</div>
          ) : !editingName ? (
            <>
              <div className="appTitle">{profile?.name || "হিসাব প্রো"}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="linkBtn" onClick={startEdit}>
                  নাম বদলাও
                </button>
                <button className="linkBtn" onClick={signOutUser}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nameEdit">
              <input
                className="input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="আপনার নাম"
                autoFocus
              />
              <button className="btn" onClick={saveName}>
                Save
              </button>
            </div>
          )}
          <div className="subTitle">Income • Expense • Balance</div>
        </div>
      </div>
    </header>
  );
}