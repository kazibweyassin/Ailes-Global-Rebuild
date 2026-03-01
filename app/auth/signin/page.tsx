"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Decode and validate callbackUrl
  const rawCallbackUrl = searchParams?.get("callbackUrl") || null;
  let callbackUrl = "/dashboard";
  
  if (rawCallbackUrl) {
    try {
      // Decode the URL if it's encoded
      const decoded = decodeURIComponent(rawCallbackUrl);
      // Validate it's a relative path (security)
      if (decoded.startsWith("/") && !decoded.startsWith("//")) {
        callbackUrl = decoded;
      }
    } catch (e) {
      // If decoding fails, use default
      console.error("Invalid callbackUrl:", rawCallbackUrl);
    }
  }
  
  const registered = searchParams?.get("registered") || null;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
        setLoading(false);
        return;
      }

      // If successful, refresh session and redirect
      if (result?.ok) {
        // Force a hard page reload to ensure session cookie is properly set
        // This ensures both client and server see the same session state
        const safeUrl = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
        
        // Use window.location for a full page reload to sync session state
        // This ensures the session cookie is read by both client and middleware
        window.location.href = safeUrl;
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    } finally {
      // Ensure loading is set to false even if something goes wrong
      if (loading) {
        setLoading(false);
      }
    }
  };

  const AUTH_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
    .auth-shell {
      font-family: 'Sora', sans-serif;
      min-height: 100vh;
      background: #080D1A;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    .auth-shell-bg {
      position: absolute; inset: 0; z-index: 0;
      background:
        radial-gradient(ellipse 60% 50% at 30% 0%, rgba(232,160,32,.07) 0%, transparent 60%),
        radial-gradient(ellipse 40% 50% at 80% 100%, rgba(196,90,42,.07) 0%, transparent 55%);
    }
    .auth-card {
      position: relative; z-index: 1;
      width: 100%; max-width: 440px;
      background: #0E1729;
      border: 1px solid rgba(245,237,214,.08);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 40px 100px rgba(0,0,0,.5);
    }
    .auth-logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-logo-name {
      font-family: 'Cormorant Garant', serif;
      font-size: 26px; font-weight: 600;
      color: #F5EDD6; letter-spacing: -.01em;
    }
    .auth-logo-name em { font-style: italic; color: #E8A020; }
    .auth-logo-sub {
      font-size: 12px; font-weight: 300;
      color: rgba(196,207,223,.5);
      margin-top: 4px;
    }
    .auth-heading {
      font-family: 'Cormorant Garant', serif;
      font-size: 28px; font-weight: 600;
      color: #F5EDD6; margin-bottom: 6px;
    }
    .auth-sub {
      font-size: 13px; font-weight: 300;
      color: rgba(196,207,223,.6);
      margin-bottom: 28px;
    }
    .auth-label {
      display: block;
      font-size: 11px; font-weight: 600;
      letter-spacing: .08em; text-transform: uppercase;
      color: rgba(196,207,223,.6);
      margin-bottom: 7px;
    }
    .auth-field-wrap {
      position: relative; margin-bottom: 18px;
    }
    .auth-field-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: rgba(196,207,223,.35); pointer-events: none;
    }
    .auth-input {
      width: 100%; height: 46px;
      background: rgba(8,13,26,.6);
      border: 1px solid rgba(245,237,214,.1);
      border-radius: 10px;
      padding: 0 14px 0 42px;
      font-family: 'Sora', sans-serif;
      font-size: 14px; font-weight: 300;
      color: #F5EDD6;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      box-sizing: border-box;
    }
    .auth-input::placeholder { color: rgba(196,207,223,.3); }
    .auth-input:focus {
      border-color: rgba(232,160,32,.45);
      box-shadow: 0 0 0 3px rgba(232,160,32,.08);
    }
    .auth-input.error { border-color: rgba(239,68,68,.5); }
    .auth-error-inline {
      font-size: 11px; color: #f87171;
      margin-top: -12px; margin-bottom: 14px;
      display: flex; align-items: center; gap: 4px;
    }
    .auth-row-label {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 7px;
    }
    .auth-forgot {
      font-size: 11px; color: rgba(232,160,32,.75);
      text-decoration: none;
    }
    .auth-forgot:hover { color: #E8A020; }
    .auth-banner {
      border-radius: 10px; padding: 12px 14px;
      font-size: 13px;
      display: flex; align-items: flex-start; gap: 8px;
      margin-bottom: 18px;
    }
    .auth-banner.success { background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2); color: #86efac; }
    .auth-banner.error   { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #fca5a5; }
    .auth-btn-primary {
      width: 100%; height: 48px;
      background: #E8A020;
      border: none; border-radius: 10px;
      font-family: 'Sora', sans-serif;
      font-size: 14px; font-weight: 600;
      color: #080D1A;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .2s, transform .15s, box-shadow .2s;
      margin-bottom: 16px;
    }
    .auth-btn-primary:hover { background: #F5C55A; box-shadow: 0 8px 24px rgba(232,160,32,.25); transform: translateY(-1px); }
    .auth-btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }
    .auth-divider {
      display: flex; align-items: center; gap: 12px;
      margin: 16px 0;
    }
    .auth-divider-line { flex: 1; height: 1px; background: rgba(245,237,214,.07); }
    .auth-divider-text { font-size: 11px; color: rgba(196,207,223,.35); letter-spacing: .08em; text-transform: uppercase; }
    .auth-btn-google {
      width: 100%; height: 46px;
      background: rgba(245,237,214,.04);
      border: 1px solid rgba(245,237,214,.1);
      border-radius: 10px;
      font-family: 'Sora', sans-serif;
      font-size: 13px; font-weight: 400;
      color: rgba(196,207,223,.8);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: background .2s, border-color .2s, color .2s;
      margin-bottom: 16px;
    }
    .auth-btn-google:hover {
      background: rgba(245,237,214,.07);
      border-color: rgba(245,237,214,.18);
      color: #F5EDD6;
    }
    .auth-footer-link {
      text-align: center;
      font-size: 13px; color: rgba(196,207,223,.5);
      margin-top: 4px;
    }
    .auth-footer-link a {
      color: #E8A020; font-weight: 500;
      text-decoration: none;
    }
    .auth-footer-link a:hover { color: #F5C55A; }
    .auth-back {
      text-align: center; margin-top: 24px;
      font-size: 12px; color: rgba(196,207,223,.35);
      text-decoration: none; display: block;
      transition: color .2s;
    }
    .auth-back:hover { color: rgba(196,207,223,.65); }
    @keyframes auth-spin { to { transform: rotate(360deg); } }
    .auth-spin { animation: auth-spin .8s linear infinite; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AUTH_STYLES }} />
      <div className="auth-shell">
        <div className="auth-shell-bg" />
        <div className="auth-card">
          <div className="auth-logo">
            <Link href="/">
              <div className="auth-logo-name">Ailes <em>Global</em></div>
            </Link>
            <p className="auth-logo-sub">Welcome back — sign in to continue</p>
          </div>

          <h1 className="auth-heading">Sign In</h1>
          <p className="auth-sub">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit}>
            {registered && (
              <div className="auth-banner success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Account created successfully! Please sign in.
              </div>
            )}
            {error && (
              <div className="auth-banner error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <label className="auth-label" htmlFor="email">Email Address</label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input id="email" type="email" placeholder="you@example.com" className="auth-input"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="auth-row-label">
              <label className="auth-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <Link href="/auth/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="password" type="password" placeholder="••••••••" className="auth-input"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <svg className="auth-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : null}
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            <button type="button" className="auth-btn-google" onClick={() => signIn("google", { callbackUrl })}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="auth-footer-link">Don't have an account? <Link href="/auth/signup">Sign up free</Link></p>
          <Link href="/" className="auth-back">← Back to home</Link>
        </div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", background:"#080D1A", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg style={{ animation:"spin .8s linear infinite" }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8A020" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
