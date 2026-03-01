"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

/* ─── Types ─── */
interface DashboardStats {
  savedScholarships: number;
  applications: number;
  upcomingDeadlines: number;
  matchScore: number;
}
interface Scholarship {
  id: string; name: string; provider: string;
  amount: number; currency: string; deadline: string; matchScore?: number;
}
interface Application {
  id: string; scholarshipId: string; status: string;
  appliedAt: string; scholarship?: Scholarship;
}

/* ─── Styles ─── */
const STYLES = `
  .db {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ── keyframes ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes urgPulse {
    0%,100%{ opacity:1; transform:scale(1);   }
    50%     { opacity:.4; transform:scale(.7); }
  }

  /* ── layout ── */
  .db-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 48px 48px 80px;
  }
  @media(max-width:768px){ .db-inner { padding: 32px 24px 60px; } }

  /* ── page header ── */
  .db-header {
    margin-bottom: 44px;
    animation: fadeUp .6s ease both;
  }

  .db-welcome-label {
    font-size: 11px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 10px;
  }

  .db-welcome-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 3.5vw, 44px);
    font-weight: 700; line-height: 1.05; letter-spacing: -.02em;
    color: var(--ivory);
  }
  .db-welcome-title em { font-style: italic; color: var(--gold); }

  .db-welcome-sub {
    margin-top: 8px; font-size: 14px; font-weight: 300; color: var(--muted);
  }

  /* ── stats row ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 2px;
    background: var(--border);
    border-radius: 16px; overflow: hidden;
    margin-bottom: 32px;
    animation: fadeUp .6s .05s ease both;
  }
  @media(max-width:900px){ .db-stats { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:480px){ .db-stats { grid-template-columns: 1fr 1fr; } }

  .db-stat {
    background: var(--navy);
    padding: 32px 28px;
    display: flex; align-items: center; gap: 18px;
    transition: background .2s;
  }
  .db-stat:hover { background: var(--navy-light); }

  .db-stat-icon {
    width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .db-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 34px; font-weight: 700; color: var(--ivory); line-height: 1;
  }
  .db-stat-label {
    font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--muted); margin-top: 4px;
  }

  /* ── main grid ── */
  .db-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    animation: fadeUp .6s .1s ease both;
  }
  @media(max-width:1024px){ .db-grid { grid-template-columns: 1fr; } }

  .db-col { display: flex; flex-direction: column; gap: 24px; }

  /* ── panel (replaces Card) ── */
  .db-panel {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .db-panel-head {
    padding: 24px 28px 0;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }

  .db-panel-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px; font-weight: 700; color: var(--ivory);
  }

  .db-panel-sub {
    font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 3px;
  }

  .db-panel-body { padding: 24px 28px; }

  /* view-all link */
  .db-view-all {
    font-size: 12px; font-weight: 600; color: var(--gold-light); text-decoration: none;
    border-bottom: 1px solid rgba(232,160,32,.2); padding-bottom: 1px;
    white-space: nowrap; align-self: flex-start;
    transition: color .2s, border-color .2s;
  }
  .db-view-all:hover { color: var(--gold); border-color: var(--gold); }

  /* ── deadline rows ── */
  .db-deadline-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .db-deadline-row:last-child { border-bottom: none; }

  .db-deadline-name {
    font-size: 14px; font-weight: 500; color: var(--cream);
    margin-bottom: 3px;
  }
  .db-deadline-date {
    font-size: 12px; font-weight: 300; color: var(--muted);
  }

  .db-days {
    text-align: right;
  }
  .db-days-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 26px; font-weight: 700; line-height: 1;
  }
  .db-days-num.urgent  { color: var(--terra-light); }
  .db-days-num.soon    { color: var(--gold); }
  .db-days-num.normal  { color: var(--ivory); }
  .db-days-label { font-size: 10px; font-weight:500; text-transform:uppercase; letter-spacing:.07em; color: var(--muted); }

  /* urgency pip */
  .db-urg-pip {
    display:inline-block; width:6px; height:6px; border-radius:50%;
    background: var(--terra-light); margin-right:6px;
    animation: urgPulse 1.4s ease-in-out infinite; vertical-align:middle;
  }

  /* ── saved scholarship rows ── */
  .db-sav-row {
    padding: 18px 0;
    border-bottom: 1px solid var(--border);
  }
  .db-sav-row:last-child { border-bottom: none; }

  .db-sav-head {
    display: flex; align-items: flex-start; justify-content: space-between; gap:12px;
    margin-bottom: 10px;
  }

  .db-sav-name {
    font-size: 14px; font-weight: 500; color: var(--cream);
  }
  .db-sav-provider {
    font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px;
  }

  .db-match-chip {
    font-size: 10px; font-weight: 700; letter-spacing:.06em; text-transform:uppercase;
    background: rgba(46,191,138,.12);
    border: 1px solid rgba(46,191,138,.25);
    color: #2EBF8A;
    padding: 3px 8px; border-radius: 100px; white-space: nowrap; flex-shrink:0;
  }

  .db-sav-foot {
    display: flex; align-items: center; justify-content: space-between; flex-wrap:wrap; gap:8px;
  }
  .db-sav-amount {
    font-family:'Cormorant Garant',serif;
    font-size:18px; font-weight:700; color: var(--gold-light);
  }
  .db-sav-deadline { font-size:12px; font-weight:300; color:var(--muted); }

  /* ── quick actions ── */
  .db-actions { display: flex; flex-direction: column; gap: 8px; }

  .db-action-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px; border-radius: 10px;
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .db-action-btn:hover { transform: translateX(3px); }

  .db-action-btn.primary {
    background: var(--gold); color: var(--midnight);
  }
  .db-action-btn.primary:hover { background: var(--gold-light); }

  .db-action-btn.ghost {
    background: rgba(245,237,214,.04);
    border: 1px solid var(--border);
    color: var(--cream);
  }
  .db-action-btn.ghost:hover { background: rgba(245,237,214,.08); }

  .db-action-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .db-action-btn.primary .db-action-icon { background: rgba(0,0,0,.12); }
  .db-action-btn.ghost   .db-action-icon { background: rgba(232,160,32,.1); }

  /* ── copilot requests ── */
  .db-copilot-row {
    padding: 16px 0; border-bottom: 1px solid var(--border);
  }
  .db-copilot-row:last-child { border-bottom: none; }

  .db-copilot-top {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
  }
  .db-copilot-id { font-size:13px; font-weight:500; color:var(--cream); }
  .db-copilot-date { font-size:11px; color:var(--muted); margin-top:1px; }

  .db-status-chip {
    font-size:10px; font-weight:700; letter-spacing:.07em; text-transform:uppercase;
    padding:3px 9px; border-radius:100px;
  }
  .status-completed { background:rgba(46,191,138,.12); border:1px solid rgba(46,191,138,.25); color:#2EBF8A; }
  .status-processing { background:rgba(232,160,32,.12); border:1px solid rgba(232,160,32,.25); color:var(--gold-light); }
  .status-pending    { background:rgba(245,237,214,.06); border:1px solid var(--border);        color:var(--soft); }

  .db-copilot-link {
    display:flex; align-items:center; gap:6px;
    font-size:12px; font-weight:500; color:var(--gold-light);
    text-decoration:none; margin-top:8px;
    transition:color .2s;
  }
  .db-copilot-link:hover { color:var(--gold); }

  /* ── recent activity ── */
  .db-activity-row {
    display:flex; align-items:flex-start; gap:12px;
    padding: 14px 0; border-bottom: 1px solid var(--border);
  }
  .db-activity-row:last-child { border-bottom:none; }

  .db-activity-dot {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    background: rgba(232,160,32,.10);
    border: 1px solid rgba(232,160,32,.2);
    display:flex; align-items:center; justify-content:center;
    font-size:13px;
  }

  .db-activity-title { font-size:13px; font-weight:400; color:var(--cream); line-height:1.4; }
  .db-activity-date  { font-size:11px; font-weight:300; color:var(--muted); margin-top:3px; }

  /* ── profile completion ── */
  .db-progress-bar-bg {
    height:4px; background:rgba(245,237,214,.08); border-radius:100px; overflow:hidden;
    margin: 12px 0 20px;
  }
  .db-progress-bar-fill {
    height:100%; background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius:100px; transition:width .6s ease;
  }

  .db-progress-meta {
    display:flex; justify-content:space-between; align-items:center; margin-bottom:0;
  }
  .db-progress-pct { font-size:13px; font-weight:600; color:var(--ivory); }
  .db-progress-frac { font-size:11px; color:var(--muted); }

  .db-checklist { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }

  .db-check-row { display:flex; align-items:center; gap:10px; font-size:13px; }
  .db-check-icon-done { color:#2EBF8A; font-size:15px; }
  .db-check-icon-todo { color:rgba(245,237,214,.2); font-size:15px; }
  .db-check-label-done { color:var(--cream); }
  .db-check-label-todo { color:var(--muted); }

  /* ── SKELETON SHIMMER ── */
  @keyframes db-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .db-skel {
    background: linear-gradient(90deg,
      rgba(245,237,214,.04) 25%,
      rgba(245,237,214,.09) 50%,
      rgba(245,237,214,.04) 75%
    );
    background-size: 1200px 100%;
    animation: db-shimmer 1.8s ease infinite;
    border-radius: 6px;
  }
  .db-skel-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-bottom: 28px;
  }
  @media(max-width:900px){ .db-skel-stats { grid-template-columns: repeat(2,1fr); } }
  .db-skel-stat {
    background: var(--navy);
    border-radius: 12px;
    padding: 24px 20px;
    display: flex; align-items: center; gap: 16px;
  }
  .db-skel-stat-icon { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
  .db-skel-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
  @media(max-width:1024px){ .db-skel-grid { grid-template-columns: 1fr; } }
  .db-skel-panel {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,.06);
    border-radius: 12px;
    padding: 24px 28px;
  }

  /* ── loading / error / empty ── */
  .db-loading {
    display:flex; align-items:center; justify-content:center; gap:12px;
    padding:80px; font-size:14px; font-weight:300; color:var(--muted);
  }
  .db-spinner {
    width:22px; height:22px;
    border:2px solid rgba(232,160,32,.2);
    border-top-color:var(--gold);
    border-radius:50%;
    animation:spin .8s linear infinite;
  }

  .db-error {
    display:flex; align-items:center; gap:10px;
    background:rgba(224,120,72,.08); border:1px solid rgba(224,120,72,.2);
    border-radius:12px; padding:16px 20px;
    font-size:14px; color:var(--terra-light);
    margin-bottom:24px;
  }

  .db-empty {
    text-align:center; padding:40px 0;
    font-size:13px; font-weight:300; color:var(--muted);
  }
  .db-empty-icon { font-size:32px; margin-bottom:10px; opacity:.3; }

  /* ── small CTA button ── */
  .db-btn-sm {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'Sora',sans-serif; font-size:12px; font-weight:600;
    padding:8px 16px; border-radius:6px; text-decoration:none;
    transition:background .2s, transform .15s;
  }
  .db-btn-sm:hover { transform:translateY(-1px); }
  .db-btn-sm.gold  { background:var(--gold); color:var(--midnight); }
  .db-btn-sm.gold:hover { background:var(--gold-light); }
  .db-btn-sm.outline {
    background:transparent; color:var(--cream);
    border:1px solid var(--border);
  }
  .db-btn-sm.outline:hover { border-color:rgba(245,237,214,.3); background:rgba(245,237,214,.04); }
`;

/* ─── helpers ─── */
const fmtCurrency = (a: number, c: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c || "USD", minimumFractionDigits: 0 }).format(a);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ─── Component ─── */
export default function DashboardPage() {
  const router  = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [stats, setStats]               = useState<DashboardStats>({ savedScholarships:0, applications:0, upcomingDeadlines:0, matchScore:0 });
  const [savedScholarships, setSaved]   = useState<Scholarship[]>([]);
  const [upcomingDeadlines, setDeadlines] = useState<any[]>([]);
  const [recentActivity, setActivity]   = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [copilotRequests, setCopilot]   = useState<any[]>([]);
  const [userProfile, setUserProfile]   = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        setLoading(true); setError(null);
        const [savedRes, deadlinesRes, matchRes, appsRes, copilotRes, profileRes] = await Promise.all([
          fetch("/api/saved/scholarships").catch(() => null),
          fetch("/api/scholarships/deadlines").catch(() => null),
          fetch("/api/scholarships/match").catch(() => null),
          fetch("/api/applications").catch(() => null),
          fetch("/api/copilot/requests").catch(() => null),
          fetch("/api/user/profile").catch(() => null),
        ]);

        if (profileRes?.ok) { const d = await profileRes.json(); setUserProfile(d.user || null); }

        let saved: Scholarship[] = [];
        if (savedRes?.ok) { const d = await savedRes.json(); saved = d.scholarships || []; setSaved(saved); }

        let upcoming: any[] = [];
        if (deadlinesRes?.ok) {
          const d = await deadlinesRes.json();
          upcoming = (d.scholarships || [])
            .map((s: any) => {
              const daysLeft = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / 86400000);
              return { id:s.id, scholarship:s.name, deadline:s.deadline, daysLeft, status: daysLeft<=30?"urgent":daysLeft<=60?"soon":"normal" };
            })
            .filter((s: any) => s.daysLeft > 0 && s.daysLeft <= 90)
            .sort((a: any,b: any) => a.daysLeft-b.daysLeft)
            .slice(0,3);
          setDeadlines(upcoming);
        }

        let matchScore = 0;
        if (matchRes?.ok) {
          const d = await matchRes.json();
          if (d.matches?.length) matchScore = Math.round(d.matches.reduce((s: number, m: any) => s + m.matchScore, 0) / d.matches.length);
        }

        let apps: Application[] = [];
        if (appsRes?.ok) { const d = await appsRes.json(); apps = d.applications || []; setApplications(apps); }

        if (copilotRes?.ok) { const d = await copilotRes.json(); setCopilot(d || []); }

        setStats({ savedScholarships: saved.length, applications: apps.length, upcomingDeadlines: upcoming.length, matchScore });

        const activity = [];
        if (saved.length)    activity.push({ id:1, icon:"❤️",  title: saved[0].name,                                         date:"Recently" });
        if (apps.length)     activity.push({ id:2, icon:"✅",  title: apps[0].scholarship?.name || "Application submitted",   date: fmtDate(apps[0].appliedAt) });
        if (upcoming.length) activity.push({ id:3, icon:"⏰",  title: `${upcoming[0].scholarship} — ${upcoming[0].daysLeft}d left`, date:"Upcoming" });
        setActivity(activity);
      } catch {
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  /* auth loading states */
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="db">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="db-loading"><div className="db-spinner" /> {status === "loading" ? "Checking authentication…" : "Redirecting…"}</div>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  // Data-driven profile completion
  const completionFields = [
    { done: Boolean(userProfile?.name), label: "Basic Information" },
    { done: Boolean(userProfile?.country), label: "Country" },
    { done: Boolean(userProfile?.phone), label: "Phone Number" },
    { done: Boolean(userProfile?.dateOfBirth), label: "Date of Birth" },
    { done: Boolean(userProfile?.gender), label: "Gender" },
    { done: Boolean(session?.user?.image || userProfile?.image), label: "Profile Photo" },
    { done: Boolean(userProfile?.email), label: "Email Verified" },
  ];
  const doneCount = completionFields.filter(f => f.done).length;
  const completionPct = Math.round((doneCount / completionFields.length) * 100);
  return (
    <div className="db">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="db-inner">

        {/* ══ Header ══ */}
        <div className="db-header">
          <div className="db-welcome-label">Your Dashboard</div>
          <h1 className="db-welcome-title">
            Welcome back, <em>{firstName}</em>
          </h1>
          <p className="db-welcome-sub">
            Scholarship-first platform — find funding, then find your university.
          </p>
        </div>

        {/* ══ Error ══ */}
        {error && (
          <div className="db-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ══ Loading Skeleton ══ */}
        {loading && (
          <div>
            <div className="db-skel-stats">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="db-skel-stat">
                  <div className="db-skel db-skel-stat-icon" />
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:'8px'}}>
                    <div className="db-skel" style={{height:'20px',width:'65%'}} />
                    <div className="db-skel" style={{height:'11px',width:'50%'}} />
                  </div>
                </div>
              ))}
            </div>
            <div className="db-skel-grid">
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div className="db-skel-panel">
                  <div className="db-skel" style={{height:'15px',width:'38%',marginBottom:'8px'}} />
                  <div className="db-skel" style={{height:'11px',width:'58%',marginBottom:'24px'}} />
                  {[100,82,91,68].map((w,i) => (
                    <div key={i} className="db-skel" style={{height:'13px',width:`${w}%`,marginBottom:'14px'}} />
                  ))}
                </div>
                <div className="db-skel-panel">
                  <div className="db-skel" style={{height:'15px',width:'42%',marginBottom:'8px'}} />
                  <div className="db-skel" style={{height:'11px',width:'62%',marginBottom:'24px'}} />
                  {[100,75,88].map((w,i) => (
                    <div key={i} className="db-skel" style={{height:'13px',width:`${w}%`,marginBottom:'14px'}} />
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div className="db-skel-panel">
                  <div className="db-skel" style={{height:'15px',width:'55%',marginBottom:'8px'}} />
                  <div className="db-skel" style={{height:'11px',width:'70%',marginBottom:'24px'}} />
                  {[88,70,80,60,72].map((w,i) => (
                    <div key={i} className="db-skel" style={{height:'13px',width:`${w}%`,marginBottom:'14px'}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* ══ Stats Row ══ */}
            <div className="db-stats">
              {[
                { icon:"❤️", color:"rgba(232,160,32,.12)", num: stats.savedScholarships, label:"Saved Scholarships" },
                { icon:"📄", color:"rgba(46,191,138,.10)",  num: stats.applications,      label:"Applications" },
                { icon:"📅", color:"rgba(224,120,72,.10)",  num: stats.upcomingDeadlines, label:"Upcoming Deadlines" },
                { icon:"🎯", color:"rgba(232,160,32,.12)",  num: `${stats.matchScore}%`,  label:"Match Score" },
              ].map((s) => (
                <div className="db-stat" key={s.label}>
                  <div className="db-stat-icon" style={{ background: s.color }}>{s.icon}</div>
                  <div>
                    <div className="db-stat-num">{s.num}</div>
                    <div className="db-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ══ Main Grid ══ */}
            <div className="db-grid">

              {/* ── Left Column ── */}
              <div className="db-col">

                {/* Upcoming Deadlines */}
                <div className="db-panel">
                  <div className="db-panel-head">
                    <div>
                      <div className="db-panel-title">Upcoming Deadlines</div>
                      <div className="db-panel-sub">Don't miss these opportunities</div>
                    </div>
                    <Link href="/scholarships/deadlines" className="db-view-all">View All →</Link>
                  </div>
                  <div className="db-panel-body">
                    {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item) => (
                      <div className="db-deadline-row" key={item.id}>
                        <div>
                          <div className="db-deadline-name">
                            {item.status === "urgent" && <span className="db-urg-pip" />}
                            {item.scholarship}
                          </div>
                          <div className="db-deadline-date">Deadline: {fmtDate(item.deadline)}</div>
                        </div>
                        <div className="db-days">
                          <div className={`db-days-num ${item.status}`}>{item.daysLeft}</div>
                          <div className="db-days-label">days left</div>
                        </div>
                      </div>
                    )) : (
                      <div className="db-empty">
                        <div className="db-empty-icon">📅</div>
                        No upcoming deadlines
                      </div>
                    )}
                  </div>
                </div>

                {/* Saved Scholarships */}
                <div className="db-panel">
                  <div className="db-panel-head">
                    <div>
                      <div className="db-panel-title">Saved Scholarships</div>
                      <div className="db-panel-sub">Your bookmarked opportunities</div>
                    </div>
                    <Link href="/dashboard/saved" className="db-view-all">View All →</Link>
                  </div>
                  <div className="db-panel-body">
                    {savedScholarships.length > 0 ? savedScholarships.slice(0,2).map((s) => (
                      <div className="db-sav-row" key={s.id}>
                        <div className="db-sav-head">
                          <div>
                            <div className="db-sav-name">{s.name}</div>
                            <div className="db-sav-provider">{s.provider}</div>
                          </div>
                          {s.matchScore && (
                            <span className="db-match-chip">🎯 {s.matchScore}% match</span>
                          )}
                        </div>
                        <div className="db-sav-foot">
                          <div>
                            <div className="db-sav-amount">{fmtCurrency(s.amount, s.currency)}</div>
                            <div className="db-sav-deadline">Deadline: {fmtDate(s.deadline)}</div>
                          </div>
                          <Link href={`/scholarships/${s.id}`} className="db-btn-sm outline">View Details →</Link>
                        </div>
                      </div>
                    )) : (
                      <div className="db-empty">
                        <div className="db-empty-icon">❤️</div>
                        No saved scholarships yet
                        <br />
                        <Link href="/scholarships" className="db-btn-sm gold" style={{ marginTop:16, display:"inline-flex" }}>
                          Browse Scholarships
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ── Right Column ── */}
              <div className="db-col">

                {/* Quick Actions */}
                <div className="db-panel">
                  <div className="db-panel-head" style={{ paddingBottom:20 }}>
                    <div className="db-panel-title">Quick Actions</div>
                  </div>
                  <div className="db-panel-body" style={{ paddingTop:0 }}>
                    <div className="db-actions">
                      <Link href="/scholarships/match"    className="db-action-btn primary">
                        <span className="db-action-icon">🎯</span> AI Scholarship Match
                      </Link>
                      <Link href="/scholarships/deadlines" className="db-action-btn ghost">
                        <span className="db-action-icon">📅</span> Deadline Calendar
                      </Link>
                      <Link href="/scholarships/compare"  className="db-action-btn ghost">
                        <span className="db-action-icon">⚖️</span> Compare Scholarships
                      </Link>
                      <Link href="/scholarships"          className="db-action-btn ghost">
                        <span className="db-action-icon">🔍</span> Browse 500+ Scholarships
                      </Link>
                    </div>
                  </div>
                </div>

                {/* AI Copilot Requests */}
                {copilotRequests.length > 0 && (
                  <div className="db-panel">
                    <div className="db-panel-head">
                      <div>
                        <div className="db-panel-title">🤖 AI Copilot</div>
                        <div className="db-panel-sub">Your active requests</div>
                      </div>
                      <Link href="/copilot/activate" className="db-view-all">New →</Link>
                    </div>
                    <div className="db-panel-body">
                      {copilotRequests.slice(0,3).map((r: any) => (
                        <div className="db-copilot-row" key={r.id}>
                          <div className="db-copilot-top">
                            <div>
                              <div className="db-copilot-id">Request #{r.id.slice(0,8)}</div>
                              <div className="db-copilot-date">{fmtDate(r.createdAt)}</div>
                            </div>
                            <span className={`db-status-chip status-${r.status}`}>{r.status}</span>
                          </div>
                          {r.documents?.zipGenerated && (
                            <a href={`/api/copilot/download?requestId=${r.id}`} download className="db-copilot-link">
                              ⬇ Download Package
                            </a>
                          )}
                          {r.status === "pending" && (
                            <Link href="/copilot/review" className="db-copilot-link">
                              Review Request →
                            </Link>
                          )}
                        </div>
                      ))}
                      {copilotRequests.length > 3 && (
                        <Link href="/copilot/review" className="db-view-all" style={{ marginTop:16, display:"inline-block" }}>
                          View all {copilotRequests.length} →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="db-panel">
                  <div className="db-panel-head" style={{ paddingBottom:20 }}>
                    <div className="db-panel-title">Recent Activity</div>
                  </div>
                  <div className="db-panel-body" style={{ paddingTop:0 }}>
                    {recentActivity.length > 0 ? recentActivity.map((a) => (
                      <div className="db-activity-row" key={a.id}>
                        <div className="db-activity-dot">{a.icon}</div>
                        <div>
                          <div className="db-activity-title">{a.title}</div>
                          <div className="db-activity-date">{a.date}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="db-empty">No recent activity</div>
                    )}
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="db-panel">
                  <div className="db-panel-head" style={{ paddingBottom:16 }}>
                    <div>
                      <div className="db-panel-title">Profile Completion</div>
                      <div className="db-panel-sub">Complete your profile for better matches</div>
                    </div>
                  </div>
                  <div className="db-panel-body">
                    <div className="db-progress-meta">
                      <span className="db-progress-pct">{completionPct}% Complete</span>
                      <span className="db-progress-frac">{doneCount} / {completionFields.length} sections</span>
                    </div>
                    <div className="db-progress-bar-bg">
                      <div className="db-progress-bar-fill" style={{ width:`${completionPct}%` }} />
                    </div>
                    <div className="db-checklist">
                      {completionFields.map((item) => (
                        <div className="db-check-row" key={item.label}>
                          <span className={item.done ? "db-check-icon-done" : "db-check-icon-todo"}>
                            {item.done ? "✓" : "○"}
                          </span>
                          <span className={item.done ? "db-check-label-done" : "db-check-label-todo"}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href="/profile" className="db-btn-sm gold" style={{ width:"100%", justifyContent:"center" }}>
                      Complete Profile
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}