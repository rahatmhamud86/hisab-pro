import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function LandingPage() {
    const { signIn } = useAuthContext();
    const [loggingIn, setLoggingIn] = useState(false);

    async function handleLogin() {
        setLoggingIn(true);
        try {
            await signIn();
        } catch (err) {
            setLoggingIn(false);
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            position: "relative",
        }}>

            {/* উপরে ডান কোণায় Login বাটন */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="logo">৳</div>
                    <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.3px" }}>হিসাব প্রো</span>
                </div>
                <button
                    className="btn"
                    style={{ width: "auto", marginTop: 0, padding: "10px 22px" }}
                    onClick={handleLogin}
                    disabled={loggingIn}
                >
                    {loggingIn ? "লোড হচ্ছে..." : "🔐 Login"}
                </button>
            </div>

            {/* Hero Section */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 0" }}>
                <div style={{
                    width: 80, height: 80, borderRadius: 24,
                    background: "linear-gradient(135deg, rgba(129,140,248,0.4), rgba(52,211,153,0.3))",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 32, marginBottom: 24,
                    boxShadow: "0 16px 40px rgba(129,140,248,0.25)"
                }}>৳</div>

                <h1 style={{
                    fontSize: "clamp(28px, 6vw, 52px)",
                    fontWeight: 900,
                    letterSpacing: "-1.5px",
                    background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.6))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: 16,
                    lineHeight: 1.15,
                }}>
                    আপনার হিসাব,<br />আপনার নিয়ন্ত্রণে
                </h1>

                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.7, marginBottom: 36 }}>
                    পরিবারের সবার আয়-ব্যয়ের হিসাব এক জায়গায়। নিরাপদ, সহজ, এবং সবসময় সাথে।
                </p>

                <button
                    className="btn primary"
                    style={{ width: "auto", padding: "16px 40px", fontSize: 16, borderRadius: 18, marginTop: 0 }}
                    onClick={handleLogin}
                    disabled={loggingIn}
                >
                    {loggingIn ? "লোড হচ্ছে..." : "🚀 Google দিয়ে শুরু করুন — বিনামূল্যে"}
                </button>
            </div>

            {/* Features Section */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
                maxWidth: 800,
                margin: "0 auto 40px",
                width: "100%",
            }}>
                {[
                    { icon: "💰", title: "আয়-ব্যয় ট্র্যাক", desc: "প্রতিটা টাকার হিসাব রাখুন সহজেই" },
                    { icon: "👨‍👩‍👧‍👦", title: "Family Sharing", desc: "পরিবারের সবাই একসাথে দেখতে পারবে" },
                    { icon: "📊", title: "সুন্দর চার্ট", desc: "খরচের বিশ্লেষণ দেখুন সুন্দর গ্রাফে" },
                    { icon: "☁️", title: "Cloud Sync", desc: "যেকোনো ডিভাইস থেকে access করুন" },
                    { icon: "📤", title: "Export", desc: "PDF, Excel, CSV এ export করুন" },
                    { icon: "🔒", title: "সম্পূর্ণ নিরাপদ", desc: "Google দিয়ে secure login" },
                ].map((f) => (
                    <div key={f.title} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, paddingBottom: 10 }}>
                © {new Date().getFullYear()} হিসাব প্রো — সম্পূর্ণ বিনামূল্যে
            </div>
        </div>
    );
}