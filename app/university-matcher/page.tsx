"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  GraduationCap, Search, TrendingUp, DollarSign, MapPin, Award,
  Bookmark, ExternalLink, Loader2, ArrowRight, ArrowLeft, CheckCircle2,
  ChevronDown, BookOpen, Globe, Target
} from "lucide-react";
import Link from "next/link";

/* ─── Inline styles ── */
const STYLES = `
  .um-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ── HERO HEADER ── */
  .um-hero {
    position: relative;
    padding: 88px 48px 64px;
    text-align: center;
    overflow: hidden;
  }
  @media (max-width: 640px) { .um-hero { padding: 72px 24px 48px; } }

  .um-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 80% 90%, rgba(196,90,42,0.07) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }
  .um-hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3; z-index: 1;
  }
  .um-hero-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }

  .um-hero-icon {
    width: 56px; height: 56px;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 14px;
    display: inline-flex; align-items: center; justify-content: center;
    color: var(--gold);
    margin-bottom: 24px;
  }

  .um-hero-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 14px;
  }

  .um-hero-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 600; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--ivory);
    margin-bottom: 16px;
  }
  .um-hero-title em { font-style: italic; color: var(--gold); }

  .um-hero-sub {
    font-size: 16px; font-weight: 300;
    line-height: 1.7; color: var(--soft);
    max-width: 520px; margin: 0 auto 32px;
  }

  /* Intake CTA Banner */
  .um-intake-banner {
    background: var(--navy);
    border: 1px solid rgba(232,160,32,0.15);
    border-radius: 12px;
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    max-width: 680px;
    margin: 0 auto;
    text-align: left;
    position: relative;
    overflow: hidden;
  }
  .um-intake-banner::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--terra));
  }
  @media (max-width: 640px) { .um-intake-banner { flex-direction: column; text-align: center; } }

  .um-intake-title {
    font-size: 14px; font-weight: 600; color: var(--ivory); margin-bottom: 4px;
  }
  .um-intake-desc {
    font-size: 12px; font-weight: 300; color: var(--soft); line-height: 1.5;
  }

  /* ── PROGRESS STEPPER ── */
  .um-stepper-wrap {
    max-width: 520px; margin: 0 auto 48px;
    padding: 0 48px;
  }
  @media (max-width: 640px) { .um-stepper-wrap { padding: 0 24px; } }

  .um-stepper {
    display: flex; align-items: center;
    position: relative;
  }

  .um-step-item {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; flex: 1; position: relative;
  }

  .um-step-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600;
    font-family: 'Sora', sans-serif;
    border: 1px solid rgba(245,237,214,0.12);
    color: var(--soft);
    background: var(--navy);
    transition: all 0.3s;
    position: relative; z-index: 2;
  }
  .um-step-circle.active {
    background: var(--gold); color: var(--midnight);
    border-color: var(--gold);
    box-shadow: 0 0 0 4px rgba(232,160,32,0.15);
  }
  .um-step-circle.done {
    background: rgba(34,197,94,0.15);
    border-color: rgba(34,197,94,0.4);
    color: var(--success);
  }

  .um-step-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--soft); opacity: 0.5;
  }
  .um-step-label.active { color: var(--gold-light); opacity: 1; }
  .um-step-label.done { color: var(--success); opacity: 0.8; }

  .um-step-connector {
    flex: 1; height: 1px;
    background: rgba(245,237,214,0.08);
    margin: 0 -4px;
    margin-bottom: 22px;
    position: relative; z-index: 1;
    transition: background 0.3s;
  }
  .um-step-connector.done { background: rgba(34,197,94,0.3); }

  /* ── FORM CARD ── */
  .um-card-wrap {
    max-width: 720px; margin: 0 auto;
    padding: 0 48px 80px;
  }
  @media (max-width: 640px) { .um-card-wrap { padding: 0 24px 60px; } }

  .um-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 16px;
    overflow: hidden;
  }

  .um-card-head {
    padding: 32px 40px 0;
    border-bottom: 1px solid rgba(245,237,214,0.06);
    padding-bottom: 28px;
    position: relative;
  }
  .um-card-head::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--terra));
  }

  .um-card-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 28px; font-weight: 600;
    color: var(--ivory); margin-bottom: 6px;
  }
  .um-card-desc {
    font-size: 13px; font-weight: 300; color: var(--soft);
  }

  .um-card-body { padding: 32px 40px 40px; }
  @media (max-width: 640px) {
    .um-card-head { padding: 28px 24px; }
    .um-card-body { padding: 24px 24px 32px; }
  }

  /* ── FORM FIELDS ── */
  .um-field { margin-bottom: 24px; }

  .um-label {
    display: block;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--soft); margin-bottom: 8px;
  }

  .um-input {
    width: 100%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 8px;
    padding: 13px 16px;
    font-size: 14px; font-weight: 400;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .um-input::placeholder { color: var(--soft); opacity: 0.4; }
  .um-input:focus {
    border-color: rgba(232,160,32,0.35);
    background: rgba(232,160,32,0.03);
  }

  .um-select-wrap { position: relative; }
  .um-select {
    width: 100%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 8px;
    padding: 13px 40px 13px 16px;
    font-size: 14px; font-weight: 400;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .um-select:focus {
    border-color: rgba(232,160,32,0.35);
    background: rgba(232,160,32,0.03);
  }
  .um-select option { background: var(--navy); color: var(--ivory); }
  .um-select-icon {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--soft); pointer-events: none;
  }

  .um-textarea {
    width: 100%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 8px;
    padding: 13px 16px;
    font-size: 14px; font-weight: 300;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none; resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s, background 0.2s;
    line-height: 1.6;
  }
  .um-textarea::placeholder { color: var(--soft); opacity: 0.4; }
  .um-textarea:focus {
    border-color: rgba(232,160,32,0.35);
    background: rgba(232,160,32,0.03);
  }

  /* Country toggle grid */
  .um-country-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  @media (max-width: 500px) { .um-country-grid { grid-template-columns: 1fr 1fr; } }

  .um-country-btn {
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.09);
    border-radius: 8px;
    padding: 11px 14px;
    font-size: 13px; font-weight: 400;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    cursor: pointer; text-align: left;
    display: flex; align-items: center; justify-content: space-between;
    gap: 6px;
    transition: border-color 0.2s, background 0.2s;
  }
  .um-country-btn:hover {
    border-color: rgba(232,160,32,0.25);
    background: rgba(232,160,32,0.03);
  }
  .um-country-btn.selected {
    border-color: var(--gold) !important;
    background: rgba(232,160,32,0.08) !important;
    color: var(--ivory); font-weight: 500;
  }
  .um-country-check {
    width: 16px; height: 16px;
    border-radius: 50%; background: var(--gold);
    display: flex; align-items: center; justify-content: center;
    color: var(--midnight); font-size: 9px; font-weight: 700;
    flex-shrink: 0;
  }

  /* Review summary grid */
  .um-review-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-bottom: 24px;
  }
  @media (max-width: 500px) { .um-review-grid { grid-template-columns: 1fr; } }

  .um-review-item {}
  .um-review-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--soft); opacity: 0.6; margin-bottom: 4px;
  }
  .um-review-value {
    font-size: 14px; font-weight: 500; color: var(--ivory);
  }

  .um-tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .um-tag {
    font-size: 11px; font-weight: 500;
    color: var(--gold-light);
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.18);
    padding: 4px 12px; border-radius: 100px;
  }

  /* ── BUTTONS ── */
  .btn-gold-um {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    padding: 14px 28px; border-radius: 6px;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .btn-gold-um:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(232,160,32,0.2);
  }
  .btn-gold-um:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-outline-um {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: transparent; color: var(--cream);
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
    padding: 14px 28px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.15); cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
  }
  .btn-outline-um:hover {
    border-color: rgba(245,237,214,0.4);
    background: rgba(245,237,214,0.04);
  }

  .btn-ghost-sm-um {
    display: inline-flex; align-items: center; gap: 6px;
    background: transparent; color: var(--soft);
    font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500;
    padding: 8px 14px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.1); cursor: pointer;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost-sm-um:hover { border-color: rgba(245,237,214,0.3); color: var(--cream); }

  .btn-row { display: flex; gap: 12px; }
  .btn-row > * { flex: 1; }

  /* ── RESULTS ── */
  .um-results-wrap {
    max-width: 1200px; margin: 0 auto;
    padding: 0 48px 100px;
  }
  @media (max-width: 640px) { .um-results-wrap { padding: 0 24px 80px; } }

  .um-results-head { margin-bottom: 40px; }

  .um-results-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 600; line-height: 1.05;
    color: var(--ivory); margin-bottom: 10px;
  }
  .um-results-title em { font-style: italic; color: var(--gold); }
  .um-results-sub { font-size: 14px; font-weight: 300; color: var(--soft); }

  .um-match-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-bottom: 32px;
  }
  @media (max-width: 1000px) { .um-match-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .um-match-grid { grid-template-columns: 1fr; } }

  .um-match-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    padding: 28px;
    display: flex; flex-direction: column;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    position: relative; overflow: hidden;
  }
  .um-match-card:hover {
    border-color: rgba(232,160,32,0.2);
    background: var(--navy-light);
    transform: translateY(-3px);
  }

  .um-match-score-badge {
    position: absolute; top: 20px; right: 20px;
    display: flex; flex-direction: column; align-items: center;
  }
  .um-match-score-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 28px; font-weight: 700;
    color: var(--gold-light); line-height: 1;
  }
  .um-match-score-label {
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--soft); opacity: 0.6;
  }

  .um-match-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px; font-weight: 600;
    color: var(--ivory); line-height: 1.2;
    margin-bottom: 6px; padding-right: 60px;
  }

  .um-match-location {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 300;
    color: var(--soft); margin-bottom: 20px;
  }

  .um-match-meta {
    display: flex; flex-direction: column;
    gap: 8px; margin-bottom: 20px; flex: 1;
  }

  .um-match-meta-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--soft); font-weight: 300;
  }
  .um-match-meta-row svg { flex-shrink: 0; color: var(--gold); opacity: 0.7; }

  .um-match-actions {
    display: flex; gap: 8px;
    padding-top: 16px;
    border-top: 1px solid rgba(245,237,214,0.06);
  }

  .um-btn-save {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    flex: 1; padding: 10px 12px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.12);
    background: transparent; color: var(--soft);
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .um-btn-save:hover { border-color: rgba(232,160,32,0.3); color: var(--gold-light); }
  .um-btn-save.saved {
    border-color: rgba(232,160,32,0.3);
    background: rgba(232,160,32,0.07);
    color: var(--gold-light);
  }

  .um-btn-visit {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    flex: 1; padding: 10px 12px; border-radius: 6px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none;
    transition: background 0.2s;
  }
  .um-btn-visit:hover { background: var(--gold-light); }

  /* Empty state */
  .um-empty {
    text-align: center; padding: 80px 24px;
  }
  .um-empty-icon {
    width: 64px; height: 64px;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: var(--soft); opacity: 0.5;
  }
  .um-empty-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 34px; font-weight: 600;
    color: var(--ivory); margin-bottom: 10px;
  }
  .um-empty-body { font-size: 14px; font-weight: 300; color: var(--soft); margin-bottom: 28px; }

  .um-results-footer { text-align: center; margin-top: 16px; }
`;

export default function UniversityMatcher() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [savedUniversities, setSavedUniversities] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    gpa: "",
    degreeLevel: "",
    fieldOfStudy: "",
    budget: "",
    preferredCountries: [] as string[],
    careerGoals: "",
  });

  const handleInput = (field: string, value: any) =>
    setFormData(p => ({ ...p, [field]: value }));

  const toggleCountry = (c: string) =>
    setFormData(p => ({
      ...p,
      preferredCountries: p.preferredCountries.includes(c)
        ? p.preferredCountries.filter(x => x !== c)
        : [...p.preferredCountries, c],
    }));

  const findMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/universities/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMatches(res.ok ? data.matches : []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  const toggleSave = async (id: string) => {
    if (!session) { alert("Please sign in to save universities"); return; }
    try {
      const res = await fetch(`/api/universities/${id}/save`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSavedUniversities(prev => {
          const next = new Set(prev);
          data.saved ? next.add(id) : next.delete(id);
          return next;
        });
      }
    } catch { /* silent */ }
  };

  const stepMeta = [
    { label: "Profile" },
    { label: "Review" },
    { label: "Matches" },
  ];

  return (
    <div className="um-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <div className="um-hero">
        <div className="um-hero-bg" />
        <div className="um-hero-grain" />
        <div className="um-hero-inner">
          <div className="um-hero-icon"><GraduationCap size={24} /></div>
          <p className="um-hero-label">AI-Powered</p>
          <h1 className="um-hero-title">
            Find your <em>perfect</em><br />university match
          </h1>
          <p className="um-hero-sub">
            Tell us about yourself and we'll match you with universities and programs
            worldwide that align with your goals.
          </p>

          {/* Intake CTA */}
          <div className="um-intake-banner">
            <div>
              <div className="um-intake-title">Want personalised guidance?</div>
              <div className="um-intake-desc">
                Complete our intake form for tailored scholarship recommendations and expert university matching.
              </div>
            </div>
            <Link href="/student-intake" className="btn-gold-um" style={{ width: "auto", whiteSpace: "nowrap", padding: "12px 24px" }}>
              Complete Intake Form <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── STEPPER ── */}
      <div className="um-stepper-wrap">
        <div className="um-stepper">
          {stepMeta.map((s, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={num} style={{ display: "contents" }}>
                <div className="um-step-item">
                  <div className={`um-step-circle${isActive ? " active" : isDone ? " done" : ""}`}>
                    {isDone ? <CheckCircle2 size={16} /> : num}
                  </div>
                  <span className={`um-step-label${isActive ? " active" : isDone ? " done" : ""}`}>{s.label}</span>
                </div>
                {i < stepMeta.length - 1 && (
                  <div className={`um-step-connector${isDone ? " done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: PROFILE FORM ── */}
      {step === 1 && (
        <div className="um-card-wrap">
          <div className="um-card">
            <div className="um-card-head">
              <div className="um-card-title">Tell us about yourself</div>
              <div className="um-card-desc">Help us understand your academic background and goals</div>
            </div>
            <div className="um-card-body">

              <div className="um-field">
                <label className="um-label">GPA / Academic Score</label>
                <input className="um-input" type="text" placeholder="e.g., 3.5 or 85%"
                  value={formData.gpa} onChange={e => handleInput("gpa", e.target.value)} />
              </div>

              <div className="um-field">
                <label className="um-label">Degree Level</label>
                <div className="um-select-wrap">
                  <select className="um-select" value={formData.degreeLevel}
                    onChange={e => handleInput("degreeLevel", e.target.value)}>
                    <option value="">Select degree level</option>
                    <option value="bachelors">Bachelor's</option>
                    <option value="masters">Master's</option>
                    <option value="phd">PhD</option>
                  </select>
                  <span className="um-select-icon"><ChevronDown size={14} /></span>
                </div>
              </div>

              <div className="um-field">
                <label className="um-label">Field of Study</label>
                <input className="um-input" type="text"
                  placeholder="e.g., Computer Science, Business, Engineering"
                  value={formData.fieldOfStudy} onChange={e => handleInput("fieldOfStudy", e.target.value)} />
              </div>

              <div className="um-field">
                <label className="um-label">Budget Range (per year)</label>
                <div className="um-select-wrap">
                  <select className="um-select" value={formData.budget}
                    onChange={e => handleInput("budget", e.target.value)}>
                    <option value="">Select budget range</option>
                    <option value="0-10000">$0 – $10,000</option>
                    <option value="10000-25000">$10,000 – $25,000</option>
                    <option value="25000-50000">$25,000 – $50,000</option>
                    <option value="50000+">$50,000+</option>
                    <option value="scholarship">Scholarship Required</option>
                  </select>
                  <span className="um-select-icon"><ChevronDown size={14} /></span>
                </div>
              </div>

              <div className="um-field">
                <label className="um-label">Preferred Countries</label>
                <div className="um-country-grid">
                  {["United States", "United Kingdom", "Canada", "Germany", "Australia", "Netherlands"].map(c => {
                    const sel = formData.preferredCountries.includes(c);
                    return (
                      <button key={c} type="button"
                        className={`um-country-btn${sel ? " selected" : ""}`}
                        onClick={() => toggleCountry(c)}>
                        <span>{c}</span>
                        {sel && <span className="um-country-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="um-field">
                <label className="um-label">Career Goals</label>
                <textarea className="um-textarea"
                  placeholder="Tell us about your career aspirations..."
                  value={formData.careerGoals}
                  onChange={e => handleInput("careerGoals", e.target.value)} />
              </div>

              <button className="btn-gold-um"
                onClick={() => setStep(2)}
                disabled={!formData.gpa || !formData.degreeLevel || !formData.fieldOfStudy}>
                Continue to Review <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: REVIEW ── */}
      {step === 2 && (
        <div className="um-card-wrap">
          <div className="um-card">
            <div className="um-card-head">
              <div className="um-card-title">Review your profile</div>
              <div className="um-card-desc">Confirm your information before we find matches</div>
            </div>
            <div className="um-card-body">
              <div className="um-review-grid">
                {[
                  ["GPA", formData.gpa],
                  ["Degree Level", formData.degreeLevel],
                  ["Field of Study", formData.fieldOfStudy],
                  ["Budget", formData.budget || "Not specified"],
                ].map(([label, val]) => (
                  <div key={label} className="um-review-item">
                    <div className="um-review-label">{label}</div>
                    <div className="um-review-value" style={{ textTransform: label === "Degree Level" ? "capitalize" : "none" }}>{val}</div>
                  </div>
                ))}
              </div>

              {formData.preferredCountries.length > 0 && (
                <div className="um-field">
                  <div className="um-review-label">Preferred Countries</div>
                  <div className="um-tag-list">
                    {formData.preferredCountries.map(c => (
                      <span key={c} className="um-tag">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {formData.careerGoals && (
                <div className="um-field">
                  <div className="um-review-label">Career Goals</div>
                  <div style={{ fontSize: 13, fontWeight: 300, color: "var(--soft)", lineHeight: 1.65 }}>
                    {formData.careerGoals}
                  </div>
                </div>
              )}

              <div className="btn-row" style={{ marginTop: 8 }}>
                <button className="btn-outline-um" onClick={() => setStep(1)}>
                  <ArrowLeft size={14} /> Back
                </button>
                <button className="btn-gold-um" onClick={findMatches} disabled={loading}>
                  {loading
                    ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Finding Matches…</>
                    : <>Find Matches <Search size={14} /></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step === 3 && (
        <div className="um-results-wrap">
          {matches.length > 0 ? (
            <>
              <div className="um-results-head">
                <button className="btn-ghost-sm-um" style={{ marginBottom: 20 }}
                  onClick={() => { setStep(1); setMatches([]); }}>
                  <ArrowLeft size={12} /> New Search
                </button>
                <h2 className="um-results-title">
                  <em>{matches.length} universities</em> match your profile
                </h2>
                <p className="um-results-sub">
                  Based on your academic background, goals, and preferred destinations
                </p>
              </div>

              <div className="um-match-grid">
                {matches.map(m => (
                  <div key={m.id} className="um-match-card">
                    {m.matchScore && (
                      <div className="um-match-score-badge">
                        <span className="um-match-score-num">{m.matchScore}%</span>
                        <span className="um-match-score-label">Match</span>
                      </div>
                    )}

                    <div className="um-match-name">{m.name}</div>
                    <div className="um-match-location">
                      <MapPin size={12} />
                      {m.city ? `${m.city}, ${m.country}` : m.country}
                    </div>

                    <div className="um-match-meta">
                      {m.programs?.length > 0 && (
                        <div className="um-match-meta-row">
                          <BookOpen size={13} />
                          <span>{m.programs[0].name}</span>
                        </div>
                      )}
                      {m.tuitionMin && (
                        <div className="um-match-meta-row">
                          <DollarSign size={13} />
                          <span>
                            {m.currency === "USD" ? "$" : m.currency}{" "}
                            {m.tuitionMin.toLocaleString()}
                            {m.tuitionMax && ` – ${m.tuitionMax.toLocaleString()}`}/yr
                          </span>
                        </div>
                      )}
                      {m.ranking && (
                        <div className="um-match-meta-row">
                          <TrendingUp size={13} />
                          <span>Ranked #{m.ranking} globally</span>
                        </div>
                      )}
                      {m.minGPA && (
                        <div className="um-match-meta-row">
                          <Award size={13} style={{ color: "var(--success)", opacity: 1 }} />
                          <span>Min GPA: {m.minGPA}</span>
                        </div>
                      )}
                    </div>

                    <div className="um-match-actions">
                      <button
                        className={`um-btn-save${savedUniversities.has(m.id) ? " saved" : ""}`}
                        onClick={() => toggleSave(m.id)}>
                        <Bookmark size={13}
                          style={{ fill: savedUniversities.has(m.id) ? "currentColor" : "none" }} />
                        {savedUniversities.has(m.id) ? "Saved" : "Save"}
                      </button>
                      {m.website && (
                        <button className="um-btn-visit"
                          onClick={() => window.open(m.website, "_blank")}>
                          Visit <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="um-results-footer">
                <button className="btn-outline-um" style={{ width: "auto", display: "inline-flex", padding: "12px 28px" }}
                  onClick={() => { setStep(1); setMatches([]); }}>
                  Start New Search
                </button>
              </div>
            </>
          ) : (
            <div className="um-empty">
              <button className="btn-ghost-sm-um" style={{ marginBottom: 24 }}
                onClick={() => { setStep(1); setMatches([]); }}>
                <ArrowLeft size={12} /> Back
              </button>
              <div className="um-empty-icon"><Search size={28} /></div>
              <div className="um-empty-title">No matches found</div>
              <p className="um-empty-body">
                We couldn't find universities matching your criteria.<br />
                Try adjusting your preferences.
              </p>
              <button className="btn-gold-um" style={{ width: "auto", display: "inline-flex", padding: "14px 32px" }}
                onClick={() => setStep(1)}>
                Update Search Criteria <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}