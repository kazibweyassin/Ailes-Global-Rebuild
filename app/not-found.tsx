"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/scholarships"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
        .nf-shell { font-family:'Sora',sans-serif; min-height:100vh; background:#080D1A; display:flex; align-items:center; justify-content:center; padding:24px; position:relative; overflow:hidden; }
        .nf-shell-bg { position:absolute; inset:0; background: radial-gradient(ellipse 60% 50% at 50% 30%,rgba(232,160,32,.06),transparent 60%); }
        .nf-card { position:relative; z-index:1; text-align:center; max-width:540px; width:100%; }
        .nf-number { font-family:'Cormorant Garant',serif; font-size:clamp(100px,18vw,160px); font-weight:600; line-height:1; color:transparent; -webkit-text-stroke:2px rgba(232,160,32,.25); letter-spacing:-.04em; margin-bottom:4px; }
        .nf-heading { font-family:'Cormorant Garant',serif; font-size:clamp(26px,4vw,38px); font-weight:600; color:#F5EDD6; margin-bottom:14px; }
        .nf-heading em { font-style:italic; color:#E8A020; }
        .nf-sub { font-size:14px; font-weight:300; color:rgba(196,207,223,.6); line-height:1.7; max-width:380px; margin:0 auto 36px; }
        .nf-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:40px; }
        .nf-btn-primary { display:inline-flex; align-items:center; gap:7px; background:#E8A020; color:#080D1A; border:none; border-radius:10px; padding:12px 24px; font-family:'Sora',sans-serif; font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; transition:background .2s; }
        .nf-btn-primary:hover { background:#F5C55A; }
        .nf-btn-ghost { display:inline-flex; align-items:center; gap:7px; background:rgba(245,237,214,.05); color:rgba(196,207,223,.7); border:1px solid rgba(245,237,214,.1); border-radius:10px; padding:11px 22px; font-family:'Sora',sans-serif; font-size:13px; font-weight:400; text-decoration:none; transition:border-color .2s,color .2s; }
        .nf-btn-ghost:hover { border-color:rgba(245,237,214,.22); color:#F5EDD6; }
        .nf-links-label { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(196,207,223,.3); margin-bottom:14px; }
        .nf-links { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
        .nf-link { font-size:12px; color:rgba(196,207,223,.45); text-decoration:none; padding:5px 12px; border:1px solid rgba(245,237,214,.07); border-radius:100px; transition:color .2s,border-color .2s; }
        .nf-link:hover { color:var(--gold); border-color:rgba(232,160,32,.3); }
        .nf-redirect { font-size:11px; color:rgba(196,207,223,.25); margin-top:32px; }
      ` }} />
      <div className="nf-shell">
        <div className="nf-shell-bg" />
        <div className="nf-card">
          <div className="nf-number">404</div>
          <h1 className="nf-heading">Page <em>not found</em></h1>
          <p className="nf-sub">The page you&apos;re looking for doesn&apos;t exist. Let&apos;s help you find the right scholarship instead.</p>
          <div className="nf-actions">
            <Link href="/scholarships" className="nf-btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Browse Scholarships
            </Link>
            <Link href="/" className="nf-btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Go Home
            </Link>
          </div>
          <p className="nf-links-label">Popular pages</p>
          <div className="nf-links">
            {[
              ["/scholarships","Scholarships"],
              ["/success-stories","Success Stories"],
              ["/pricing","Pricing"],
              ["/blog","Blog"],
              ["/dashboard","Dashboard"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="nf-link">{label}</Link>
            ))}
          </div>
          <p className="nf-redirect">Redirecting to scholarships in 5 seconds…</p>
        </div>
      </div>
    </>
  );
}

