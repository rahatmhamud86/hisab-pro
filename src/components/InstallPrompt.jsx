import React, { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // আগে dismiss করা হয়েছে কিনা চেক করো
        if (localStorage.getItem("pwa-dismissed")) return;

        // iOS চেক
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const standalone = window.navigator.standalone;

        if (ios && !standalone) {
            setIsIOS(true);
            setTimeout(() => setShowPrompt(true), 3000);
            return;
        }

        // Android/Chrome install prompt
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setShowPrompt(true), 3000);
        });
    }, []);

    async function handleInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    }

    function handleDismiss() {
        setShowPrompt(false);
        setDismissed(true);
        localStorage.setItem("pwa-dismissed", "true");
    }

    if (!showPrompt || dismissed) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: 90,
            left: 16,
            right: 16,
            zIndex: 100,
            maxWidth: 420,
            margin: "0 auto",
        }}>
            <div className="card" style={{
                padding: "18px 20px",
                borderRadius: 22,
                background: "rgba(15, 18, 30, 0.92)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(129, 140, 248, 0.25)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.1)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: "linear-gradient(135deg, rgba(129,140,248,0.4), rgba(52,211,153,0.3))",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, flexShrink: 0,
                    }}>৳</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>হিসাব প্রো Install করুন</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>
                            App এর মতো ব্যবহার করুন — দ্রুত ও সহজ
                        </div>
                    </div>
                </div>

                {isIOS ? (
                    <div style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.7,
                        background: "rgba(255,255,255,0.05)",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.08)",
                        marginBottom: 14,
                    }}>
                        👇 নিচে <strong style={{ color: "white" }}>Share</strong> বাটনে ট্যাপ করুন,
                        তারপর <strong style={{ color: "white" }}>"Add to Home Screen"</strong> সিলেক্ট করুন
                    </div>
                ) : (
                    <button
                        className="btn primary"
                        style={{ marginTop: 0, marginBottom: 10, borderRadius: 14, fontSize: 14 }}
                        onClick={handleInstall}
                    >
                        📲 এখনই Install করুন
                    </button>
                )}

                <button
                    onClick={handleDismiss}
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 13,
                        cursor: "pointer",
                        padding: "6px 0",
                    }}
                >
                    এখন না
                </button>
            </div>
        </div>
    );
}