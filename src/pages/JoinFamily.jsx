import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { acceptInvite } from "../firebase/firestoreService";

export default function JoinFamily() {
    const { inviteId } = useParams();
    const navigate = useNavigate();
    const { user, signIn, loading, refreshProfile } = useAuthContext();
    const [status, setStatus] = useState("idle"); // idle | joining | success | error
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (loading) return;
        if (!user) return; // লগইন করা না থাকলে বাটন দেখাবে

        async function join() {
            setStatus("joining");
            try {
                const familyId = await acceptInvite(inviteId, user.uid, user.email, user.displayName);
                refreshProfile({ familyId });
                setStatus("success");
                setTimeout(() => navigate("/"), 2000);
            } catch (err) {
                setStatus("error");
                setMsg(err.message || "কিছু একটা সমস্যা হয়েছে");
            }
        }
        join();
    }, [user, loading, inviteId]);

    return (
        <div className="page">
            <div className="shell" style={{ textAlign: "center", paddingTop: 60 }}>
                <h2>👨‍👩‍👧‍👦 Family Group এ যোগ দিন</h2>

                {loading && <p>লোড হচ্ছে...</p>}

                {!loading && !user && (
                    <div style={{ marginTop: 20 }}>
                        <p>যোগ দিতে প্রথমে লগইন করুন</p>
                        <button className="btn" onClick={signIn}>Google দিয়ে লগইন করুন</button>
                    </div>
                )}

                {status === "joining" && <p>যোগ করা হচ্ছে...</p>}
                {status === "success" && <p>✅ সফলভাবে Family Group এ যোগ হয়েছেন! Dashboard এ নিয়ে যাওয়া হচ্ছে...</p>}
                {status === "error" && <p style={{ color: "var(--red)" }}>❌ {msg}</p>}
            </div>
        </div>
    );
}