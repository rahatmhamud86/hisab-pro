import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await signIn();
    } catch (e) {
      console.error(e);
      setError("লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page loginPage">
      <div className="shell loginShell">
        <div className="card glass glow loginCard">
          <div className="logo loginLogo">৳</div>
          <div className="appTitle" style={{ fontSize: 22, marginTop: 10 }}>
            হিসাব প্রো
          </div>
          <div className="subTitle" style={{ marginTop: 6 }}>
            আপনার আয়-ব্যয়ের সম্পূর্ণ হিসাব, নিরাপদে ক্লাউডে সংরক্ষিত
          </div>

          <button className="btn primary googleBtn" onClick={handleLogin} disabled={loading}>
            {loading ? (
              "লগইন হচ্ছে..."
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.4 0 10.3-1.8 14.1-5l-6.5-5.5C29.6 35.4 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.5C41.4 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
                  />
                </svg>
                Google দিয়ে সাইন-ইন করুন
              </>
            )}
          </button>

          {error && (
            <div className="smallNote" style={{ color: "var(--red)", marginTop: 10 }}>
              {error}
            </div>
          )}

          <div className="smallNote" style={{ marginTop: 16 }}>
            লগইন করলে আপনার ডেটা নিরাপদে ক্লাউডে সেভ হবে এবং যেকোনো ডিভাইস থেকে
            একই অ্যাকাউন্ট দিয়ে লগইন করলে সব হিসাব আবার ফিরে পাবেন।
          </div>
        </div>
      </div>
    </div>
  );
}
