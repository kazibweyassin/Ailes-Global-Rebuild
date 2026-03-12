"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Filter, ChevronDown, ArrowRight,
  Clock, CheckCircle2, XCircle, AlertCircle, Star,
  FileText, Globe2, Building2, CalendarDays, MoreHorizontal,
  Pencil, Trash2, ExternalLink, TrendingUp, Award
} from "lucide-react";

/* ─── Types ─── */
type AppStatus = "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WAITLISTED";

interface Application {
  id: string;
  status: AppStatus;
  programName?: string;
  notes?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  scholarship?: { id: string; name: string; provider: string; amount: number; currency: string; deadline: string; country: string };
  university?:  { id: string; name: string; country: string };
}

/* ─── Status config ─── */
const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  DRAFT:        { label: "Draft",        color: "#8A97AA", bg: "rgba(138,151,170,.12)", border: "rgba(138,151,170,.25)", icon: <FileText    size={12}/> },
  IN_PROGRESS:  { label: "In Progress",  color: "#E8A020", bg: "rgba(232,160,32,.12)", border: "rgba(232,160,32,.3)",   icon: <Clock       size={12}/> },
  SUBMITTED:    { label: "Submitted",    color: "#60A5FA", bg: "rgba(96,165,250,.12)", border: "rgba(96,165,250,.3)",   icon: <ArrowRight  size={12}/> },
  UNDER_REVIEW: { label: "Under Review", color: "#A78BFA", bg: "rgba(167,139,250,.12)",border: "rgba(167,139,250,.3)", icon: <AlertCircle size={12}/> },
  ACCEPTED:     { label: "Accepted 🎉",  color: "#2EBF8A", bg: "rgba(46,191,138,.12)", border: "rgba(46,191,138,.3)",  icon: <CheckCircle2 size={12}/> },
  REJECTED:     { label: "Rejected",     color: "#EF4444", bg: "rgba(239,68,68,.10)",  border: "rgba(239,68,68,.25)",  icon: <XCircle     size={12}/> },
  WAITLISTED:   { label: "Waitlisted",   color: "#F59E0B", bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.3)",  icon: <Star        size={12}/> },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as AppStatus[];

/* ─── Styles ─── */
const STYLES = `
  .tracker-root {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }
  .tracker-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 48px 80px;
  }
  @media(max-width:768px){ .tracker-inner { padding: 32px 20px 60px; } }

  /* header */
  .tr-header { margin-bottom: 40px; }
  .tr-breadcrumb {
    font-size: 12px; color: var(--muted); margin-bottom: 16px;
    display: flex; align-items: center; gap: 6px;
  }
  .tr-breadcrumb a { color: var(--muted); text-decoration: none; transition: color .15s; }
  .tr-breadcrumb a:hover { color: var(--gold); }
  .tr-heading {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px,4vw,44px); font-weight: 700;
    color: var(--ivory); line-height: 1.1; margin-bottom: 8px;
  }
  .tr-heading em { font-style: italic; color: var(--gold); }
  .tr-sub { font-size: 14px; font-weight: 300; color: var(--soft); }

  /* stats strip */
  .tr-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }
  @media(max-width:900px){ .tr-stats { grid-template-columns: repeat(3,1fr); } }
  @media(max-width:540px){ .tr-stats { grid-template-columns: repeat(2,1fr); } }

  .tr-stat {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(245,237,214,.07);
    border-radius: 12px;
    padding: 16px 20px;
    cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .tr-stat:hover { border-color: rgba(232,160,32,.3); background: rgba(232,160,32,.04); }
  .tr-stat.active { border-color: rgba(232,160,32,.5); background: rgba(232,160,32,.07); }

  .tr-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 28px; font-weight: 700; line-height: 1;
    margin-bottom: 4px;
  }
  .tr-stat-label { font-size: 11px; font-weight: 500; color: var(--soft); letter-spacing: .04em; }

  /* toolbar */
  .tr-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .tr-search {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .tr-search svg {
    position: absolute;
    left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
  .tr-search-input {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 8px;
    padding: 10px 14px 10px 38px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: var(--ivory);
    outline: none;
    transition: border-color .2s;
  }
  .tr-search-input:focus { border-color: rgba(232,160,32,.4); }
  .tr-search-input::placeholder { color: var(--muted); }

  .tr-filter-select {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: var(--soft);
    outline: none;
    cursor: pointer;
    transition: border-color .2s;
  }
  .tr-filter-select:focus { border-color: rgba(232,160,32,.4); }
  .tr-filter-select option { background: #0E1729; }

  .tr-btn-new {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background .2s, transform .15s;
  }
  .tr-btn-new:hover { background: var(--gold-light); transform: translateY(-1px); }

  /* pipeline view */
  .tr-pipeline {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;
    margin-bottom: 36px;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  @media(max-width:900px){ .tr-pipeline { grid-template-columns: repeat(4,1fr); } }
  @media(max-width:540px){ .tr-pipeline { grid-template-columns: repeat(2,1fr); } }

  .tr-pipe-col {
    background: rgba(255,255,255,.02);
    border: 1px solid rgba(245,237,214,.06);
    border-radius: 12px;
    padding: 14px;
    min-height: 80px;
  }

  .tr-pipe-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .tr-pipe-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .04em;
    padding: 3px 8px;
    border-radius: 100px;
  }

  .tr-pipe-count {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px;
    font-weight: 700;
  }

  /* table / list */
  .tr-table-wrap {
    background: rgba(255,255,255,.02);
    border: 1px solid rgba(245,237,214,.07);
    border-radius: 16px;
    overflow: hidden;
  }

  .tr-table-head {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 80px;
    padding: 12px 20px;
    background: rgba(255,255,255,.03);
    border-bottom: 1px solid rgba(245,237,214,.06);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  @media(max-width:900px){ .tr-table-head { display: none; } }

  .tr-row {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr 80px;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(245,237,214,.05);
    align-items: center;
    transition: background .15s;
    gap: 8px;
  }
  .tr-row:last-child { border-bottom: none; }
  .tr-row:hover { background: rgba(245,237,214,.02); }
  @media(max-width:900px){
    .tr-row {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 20px;
    }
  }

  .tr-row-name { font-size: 14px; font-weight: 600; color: var(--ivory); margin-bottom: 3px; }
  .tr-row-provider { font-size: 12px; color: var(--soft); }
  .tr-row-country {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--soft);
  }
  .tr-row-amount { font-size: 14px; font-weight: 600; color: var(--gold); }
  .tr-row-deadline { font-size: 12px; color: var(--soft); }
  .tr-row-deadline.urgent { color: #EF4444; font-weight: 600; }
  .tr-row-deadline.soon   { color: #F59E0B; font-weight: 500; }

  .tr-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 100px;
    border: 1px solid;
    white-space: nowrap;
  }

  .tr-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tr-action-btn {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 6px;
    color: var(--soft);
    cursor: pointer;
    transition: background .15s, color .15s, border-color .15s;
  }
  .tr-action-btn:hover { background: rgba(245,237,214,.06); color: var(--ivory); border-color: rgba(245,237,214,.2); }
  .tr-action-btn.danger:hover { background: rgba(239,68,68,.1); color: #EF4444; border-color: rgba(239,68,68,.3); }

  /* empty state */
  .tr-empty {
    text-align: center;
    padding: 80px 24px;
  }
  .tr-empty-icon {
    width: 64px; height: 64px;
    background: rgba(232,160,32,.1);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--gold);
  }
  .tr-empty-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 24px; font-weight: 700;
    color: var(--ivory); margin-bottom: 8px;
  }
  .tr-empty-sub {
    font-size: 14px; color: var(--soft);
    margin-bottom: 28px; max-width: 360px; margin-left: auto; margin-right: auto;
    line-height: 1.7;
  }

  /* modal */
  .tr-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.7);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .tr-modal {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,.12);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .tr-modal-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 26px; font-weight: 700;
    color: var(--ivory); margin-bottom: 24px;
  }
  .tr-modal-field {
    display: flex; flex-direction: column; gap: 7px;
    margin-bottom: 18px;
  }
  .tr-modal-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--soft);
  }
  .tr-modal-input, .tr-modal-select, .tr-modal-textarea {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(245,237,214,.12);
    border-radius: 8px;
    padding: 11px 14px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: var(--ivory);
    outline: none;
    transition: border-color .2s;
    width: 100%;
  }
  .tr-modal-input:focus, .tr-modal-select:focus, .tr-modal-textarea:focus {
    border-color: rgba(232,160,32,.45);
  }
  .tr-modal-select option { background: #0E1729; }
  .tr-modal-textarea { resize: vertical; min-height: 90px; }
  .tr-modal-actions {
    display: flex; gap: 12px; margin-top: 8px;
  }
  .tr-modal-submit {
    flex: 1;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 700;
    padding: 13px; border-radius: 8px;
    border: none; cursor: pointer;
    transition: background .2s;
  }
  .tr-modal-submit:hover { background: var(--gold-light); }
  .tr-modal-cancel {
    flex: 1;
    background: transparent; color: var(--soft);
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 500;
    padding: 13px; border-radius: 8px;
    border: 1px solid rgba(245,237,214,.12);
    cursor: pointer;
    transition: background .2s;
  }
  .tr-modal-cancel:hover { background: rgba(245,237,214,.05); }

  .tr-status-select-wrap {
    display: flex; flex-direction: column; gap: 8px;
  }
  .tr-status-opt {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    border: 1px solid rgba(245,237,214,.08);
    cursor: pointer; transition: border-color .15s, background .15s;
  }
  .tr-status-opt:hover { border-color: rgba(232,160,32,.3); background: rgba(232,160,32,.04); }
  .tr-status-opt.selected { border-color: rgba(232,160,32,.5); background: rgba(232,160,32,.08); }
`;

/* ─── Helpers ─── */
const fmtCurrency = (a: number, c: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c || "USD", minimumFractionDigits: 0 }).format(a);

const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ─── Component ─── */
export default function ApplicationTrackerPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "ALL">("ALL");
  const [showModal, setShowModal]       = useState(false);
  const [editApp, setEditApp]           = useState<Application | null>(null);
  const [saving, setSaving]             = useState(false);

  // new/edit form state
  const [form, setForm] = useState({
    scholarshipName: "", provider: "", country: "", amount: "",
    deadline: "", programName: "", status: "DRAFT" as AppStatus, notes: "",
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin?callbackUrl=/applications");
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch("/api/applications")
      .then(r => r.json())
      .then(d => setApplications(d.applications || []))
      .finally(() => setLoading(false));
  }, [authStatus]);

  /* filtered list */
  const filtered = applications.filter(a => {
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q
      || a.scholarship?.name?.toLowerCase().includes(q)
      || a.scholarship?.provider?.toLowerCase().includes(q)
      || a.scholarship?.country?.toLowerCase().includes(q)
      || a.university?.name?.toLowerCase().includes(q)
      || a.programName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  /* stats */
  const stats: { status: AppStatus | "ALL"; label: string; count: number; color: string }[] = [
    { status: "ALL",          label: "Total",        count: applications.length,                                color: "var(--gold)" },
    { status: "IN_PROGRESS",  label: "In Progress",  count: applications.filter(a=>a.status==="IN_PROGRESS").length,  color: "#E8A020" },
    { status: "SUBMITTED",    label: "Submitted",    count: applications.filter(a=>a.status==="SUBMITTED").length,    color: "#60A5FA" },
    { status: "UNDER_REVIEW", label: "Under Review", count: applications.filter(a=>a.status==="UNDER_REVIEW").length, color: "#A78BFA" },
    { status: "ACCEPTED",     label: "Accepted",     count: applications.filter(a=>a.status==="ACCEPTED").length,     color: "#2EBF8A" },
  ];

  /* actions */
  const openNew = () => {
    setEditApp(null);
    setForm({ scholarshipName:"", provider:"", country:"", amount:"", deadline:"", programName:"", status:"DRAFT", notes:"" });
    setShowModal(true);
  };

  const openEdit = (app: Application) => {
    setEditApp(app);
    setForm({
      scholarshipName: app.scholarship?.name || "",
      provider:        app.scholarship?.provider || "",
      country:         app.scholarship?.country || "",
      amount:          app.scholarship?.amount?.toString() || "",
      deadline:        app.scholarship?.deadline ? app.scholarship.deadline.slice(0,10) : "",
      programName:     app.programName || "",
      status:          app.status,
      notes:           app.notes || "",
    });
    setShowModal(true);
  };

  const handleStatusUpdate = async (id: string, status: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this application from your tracker?")) return;
    setApplications(prev => prev.filter(a => a.id !== id));
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        programName: form.programName || undefined,
        notes:       form.notes       || undefined,
        status:      form.status,
      };
      if (editApp) {
        const res = await fetch(`/api/applications/${editApp.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setApplications(prev => prev.map(a => a.id === editApp.id ? data.application : a));
      } else {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setApplications(prev => [data.application, ...prev]);
      }
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="tracker-root">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="tracker-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", gap: 12, color: "var(--soft)", fontSize: 14 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--gold)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
            Loading your applications…
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="tracker-root">
        <div className="tracker-inner">

          {/* ── Header ── */}
          <div className="tr-header">
            <div className="tr-breadcrumb">
              <Link href="/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Application Tracker</span>
            </div>
            <h1 className="tr-heading">My <em>Application</em> Tracker</h1>
            <p className="tr-sub">Track every scholarship application from first research to final decision.</p>
          </div>

          {/* ── Stats ── */}
          <div className="tr-stats">
            {stats.map(s => (
              <div
                key={s.status}
                className={`tr-stat${filterStatus === s.status ? " active" : ""}`}
                onClick={() => setFilterStatus(s.status as any)}
              >
                <div className="tr-stat-num" style={{ color: s.color }}>{s.count}</div>
                <div className="tr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Pipeline overview ── */}
          <div className="tr-pipeline">
            {ALL_STATUSES.map(st => {
              const cfg   = STATUS_CONFIG[st];
              const count = applications.filter(a => a.status === st).length;
              return (
                <div className="tr-pipe-col" key={st}>
                  <div className="tr-pipe-col-header">
                    <span
                      className="tr-pipe-status"
                      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <div className="tr-pipe-count" style={{ color: cfg.color }}>{count}</div>
                </div>
              );
            })}
          </div>

          {/* ── Toolbar ── */}
          <div className="tr-toolbar">
            <div className="tr-search">
              <Search size={14} />
              <input
                className="tr-search-input"
                placeholder="Search scholarships, universities, countries…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="tr-filter-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              {ALL_STATUSES.map(st => (
                <option key={st} value={st}>{STATUS_CONFIG[st].label}</option>
              ))}
            </select>
            <button className="tr-btn-new" onClick={openNew}>
              <Plus size={15} /> Add Application
            </button>
          </div>

          {/* ── Table ── */}
          {filtered.length === 0 ? (
            <div className="tr-empty">
              <div className="tr-empty-icon"><Award size={28} /></div>
              <div className="tr-empty-title">
                {applications.length === 0 ? "No applications yet" : "No matches found"}
              </div>
              <p className="tr-empty-sub">
                {applications.length === 0
                  ? "Start tracking your scholarship applications. Add each one and update the status as you progress."
                  : "Try adjusting your search or filter."}
              </p>
              {applications.length === 0 && (
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="tr-btn-new" onClick={openNew}><Plus size={15}/> Add Your First Application</button>
                  <Link href="/scholarships" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",border:"1px solid rgba(245,237,214,.2)",borderRadius:8,color:"var(--soft)",textDecoration:"none",fontSize:13 }}>
                    Browse Scholarships <ArrowRight size={14}/>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="tr-table-wrap">
              <div className="tr-table-head">
                <span>Scholarship / University</span>
                <span>Country</span>
                <span>Amount</span>
                <span>Deadline</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {filtered.map(app => {
                const sch      = app.scholarship;
                const uni      = app.university;
                const cfg      = STATUS_CONFIG[app.status];
                const days     = sch?.deadline ? daysUntil(sch.deadline) : null;
                const deadlineClass = days !== null ? (days <= 14 ? "urgent" : days <= 30 ? "soon" : "") : "";
                return (
                  <div className="tr-row" key={app.id}>
                    {/* Name */}
                    <div>
                      <div className="tr-row-name">{sch?.name || uni?.name || app.programName || "Untitled Application"}</div>
                      <div className="tr-row-provider">{sch?.provider || uni?.country || "—"}</div>
                    </div>
                    {/* Country */}
                    <div className="tr-row-country">
                      <Globe2 size={12} />
                      {sch?.country || uni?.country || "—"}
                    </div>
                    {/* Amount */}
                    <div className="tr-row-amount">
                      {sch ? fmtCurrency(sch.amount, sch.currency) : "—"}
                    </div>
                    {/* Deadline */}
                    <div className={`tr-row-deadline ${deadlineClass}`}>
                      {sch?.deadline
                        ? days !== null && days > 0
                          ? `${fmtDate(sch.deadline)} (${days}d)`
                          : fmtDate(sch.deadline)
                        : "—"}
                    </div>
                    {/* Status */}
                    <div>
                      <select
                        style={{
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          color: cfg.color,
                          borderRadius: 100,
                          padding: "4px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "Sora, sans-serif",
                          cursor: "pointer",
                          outline: "none",
                        }}
                        value={app.status}
                        onChange={e => handleStatusUpdate(app.id, e.target.value as AppStatus)}
                      >
                        {ALL_STATUSES.map(st => (
                          <option key={st} value={st} style={{ background: "#0E1729" }}>
                            {STATUS_CONFIG[st].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Actions */}
                    <div className="tr-actions">
                      <button className="tr-action-btn" title="Edit" onClick={() => openEdit(app)}>
                        <Pencil size={13} />
                      </button>
                      {sch?.id && (
                        <Link href={`/scholarships/${sch.id}`} className="tr-action-btn" title="View scholarship">
                          <ExternalLink size={13} />
                        </Link>
                      )}
                      <button className="tr-action-btn danger" title="Remove" onClick={() => handleDelete(app.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="tr-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="tr-modal">
            <div className="tr-modal-title">{editApp ? "Edit Application" : "Add Application"}</div>

            {!editApp && (
              <div style={{ background: "rgba(232,160,32,.08)", border: "1px solid rgba(232,160,32,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "var(--soft)", lineHeight: 1.6 }}>
                💡 Tip: Browse{" "}
                <Link href="/scholarships" style={{ color: "var(--gold)" }}>our scholarship database</Link>
                {" "}and use the "Track" button on any scholarship to add it here automatically.
              </div>
            )}

            <div className="tr-modal-field">
              <label className="tr-modal-label">Status</label>
              <select className="tr-modal-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AppStatus }))}>
                {ALL_STATUSES.map(st => <option key={st} value={st}>{STATUS_CONFIG[st].label}</option>)}
              </select>
            </div>

            <div className="tr-modal-field">
              <label className="tr-modal-label">Programme / Course Name</label>
              <input className="tr-modal-input" placeholder="e.g. MSc Computer Science" value={form.programName} onChange={e => setForm(p => ({ ...p, programName: e.target.value }))} />
            </div>

            <div className="tr-modal-field">
              <label className="tr-modal-label">Notes</label>
              <textarea className="tr-modal-textarea" placeholder="Checklist, contacts, essay status, next steps…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <div className="tr-modal-actions">
              <button className="tr-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tr-modal-submit" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editApp ? "Save Changes" : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
