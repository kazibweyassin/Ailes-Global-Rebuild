"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, MapPin, DollarSign, Calendar, Loader2, Award, Users, Shield, Star, Lock, Globe, Plane, GraduationCap, BookOpen, Coins, Zap } from "lucide-react";
import Link from "next/link";

/* ─── Inline styles ── */
const STYLES = `
  .sf-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ───────────────────────────────────────────
     QUESTION FLOW
  ─────────────────────────────────────────── */
  .sf-flow {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    position: relative;
    overflow: hidden;
  }

  .sf-flow-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 10% 90%, rgba(196,90,42,0.08) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }

  .sf-flow-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: 1;
  }

  .sf-flow-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 680px;
  }

  /* Header */
  .sf-header { text-align: center; margin-bottom: 40px; }

  .sf-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
    color: var(--gold-light);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .sf-header-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: sf-pulse 2s ease infinite;
  }

  @keyframes sf-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  .sf-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 600;
    line-height: 1.05;
    color: var(--ivory);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .sf-title em { font-style: italic; color: var(--gold); }

  .sf-subtitle {
    font-size: 15px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.6;
  }

  /* Progress */
  .sf-progress-wrap { margin-bottom: 32px; }

  .sf-progress-track {
    height: 2px;
    background: rgba(245,237,214,0.08);
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .sf-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 100px;
    transition: width 0.4s ease;
  }

  .sf-progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 500;
    color: var(--soft);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  /* Question Card */
  .sf-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 16px;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .sf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--terra));
  }

  @media (max-width: 640px) { .sf-card { padding: 32px 24px; } }

  .sf-q-head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }

  .sf-q-icon {
    width: 48px; height: 48px;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--gold);
  }

  .sf-q-text {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(22px, 3.5vw, 34px);
    font-weight: 600;
    color: var(--ivory);
    line-height: 1.1;
  }

  /* Choice grid */
  .sf-choices {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 36px;
  }
  @media (max-width: 480px) { .sf-choices { grid-template-columns: 1fr; } }

  .sf-choice {
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.09);
    border-radius: 10px;
    padding: 14px 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 14px;
    font-weight: 400;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    transition: border-color 0.2s, background 0.2s;
    text-align: left;
  }
  .sf-choice:hover {
    border-color: rgba(232,160,32,0.3);
    background: rgba(232,160,32,0.04);
  }
  .sf-choice--selected {
    border-color: var(--gold) !important;
    background: rgba(232,160,32,0.08) !important;
    color: var(--ivory);
    font-weight: 500;
  }
  .sf-choice-check {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--gold);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--midnight);
    font-size: 10px;
    font-weight: 700;
  }

  /* Text input */
  .sf-input {
    width: 100%;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.12);
    border-radius: 10px;
    padding: 18px 20px;
    font-size: 16px;
    font-weight: 400;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 36px;
  }
  .sf-input::placeholder { color: var(--soft); opacity: 0.5; }
  .sf-input:focus { border-color: rgba(232,160,32,0.4); background: rgba(232,160,32,0.04); }

  /* Navigation buttons */
  .sf-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--soft);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.1);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-back:hover { border-color: rgba(245,237,214,0.3); color: var(--cream); }

  .btn-next {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-next:hover:not(:disabled) {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(232,160,32,0.2);
  }
  .btn-next:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .sf-skip {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    font-weight: 300;
    color: var(--soft);
    opacity: 0.7;
  }
  .sf-skip a {
    color: var(--gold-light);
    text-decoration: none;
    font-weight: 500;
  }
  .sf-skip a:hover { text-decoration: underline; }

  /* ───────────────────────────────────────────
     RESULTS PAGE
  ─────────────────────────────────────────── */
  .sf-results {
    min-height: 100vh;
    background: var(--midnight);
    padding: 60px 48px 100px;
  }
  @media (max-width: 640px) { .sf-results { padding: 40px 24px 80px; } }

  .sf-results-inner { max-width: 1200px; margin: 0 auto; }

  /* Results header */
  .sf-results-head { margin-bottom: 48px; }

  .btn-ghost-sm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: var(--soft);
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.1);
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
    margin-bottom: 24px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .btn-ghost-sm:hover { border-color: rgba(245,237,214,0.3); color: var(--cream); }

  .sf-results-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(30px, 4.5vw, 58px);
    font-weight: 600;
    line-height: 1.05;
    color: var(--ivory);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .sf-results-title em { font-style: italic; color: var(--gold); }

  .sf-results-subtitle {
    font-size: 15px;
    font-weight: 300;
    color: var(--soft);
    margin-bottom: 20px;
  }
  .sf-results-subtitle strong { color: var(--gold-light); font-weight: 600; }

  .sf-trust-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .sf-trust-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--soft);
    letter-spacing: 0.04em;
  }

  .sf-trust-badge svg { color: var(--gold); }
  .sf-trust-badge.green svg { color: var(--success); }
  .sf-trust-badge.star svg { color: #FACC15; }

  /* Scholarship card grid */
  .sf-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  @media (max-width: 1000px) { .sf-cards-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .sf-cards-grid { grid-template-columns: 1fr; } }

  .sf-schol-card {
    display: block;
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    padding: 28px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
  }
  .sf-schol-card:hover {
    border-color: rgba(232,160,32,0.25);
    background: var(--navy-light);
    transform: translateY(-3px);
  }

  .sf-schol-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--ivory);
    line-height: 1.2;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sf-schol-provider {
    font-size: 12px;
    font-weight: 400;
    color: var(--soft);
    margin-bottom: 18px;
    opacity: 0.8;
  }

  .sf-schol-featured {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(232,160,32,0.1);
    border: 1px solid rgba(232,160,32,0.2);
    padding: 3px 10px;
    border-radius: 100px;
    margin-bottom: 14px;
  }

  .sf-schol-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }

  .sf-schol-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .sf-schol-amount {
    font-weight: 600;
    color: var(--success);
  }

  .sf-schol-location {
    font-weight: 300;
    color: var(--soft);
  }

  .sf-schol-deadline {
    font-weight: 500;
  }
  .sf-schol-deadline.urgent { color: var(--danger); }
  .sf-schol-deadline.ok { color: var(--soft); }

  .sf-schol-cta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--gold-light);
    padding-top: 16px;
    border-top: 1px solid rgba(245,237,214,0.06);
  }

  /* Email gate */
  .sf-gate {
    background: var(--navy);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 16px;
    padding: 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 32px;
  }
  .sf-gate::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--terra));
  }
  @media (max-width: 640px) { .sf-gate { padding: 32px 24px; } }

  .sf-gate-icon {
    width: 56px; height: 56px;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--gold);
  }

  .sf-gate-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(24px, 3.5vw, 40px);
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 12px;
  }
  .sf-gate-title em { font-style: italic; color: var(--gold); }

  .sf-gate-body {
    font-size: 14px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.7;
    max-width: 440px;
    margin: 0 auto 28px;
  }

  .sf-gate-form {
    display: flex;
    gap: 10px;
    max-width: 440px;
    margin: 0 auto 12px;
  }
  @media (max-width: 520px) { .sf-gate-form { flex-direction: column; } }

  .sf-email-input {
    flex: 1;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.12);
    border-radius: 6px;
    padding: 14px 16px;
    font-size: 14px;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .sf-email-input::placeholder { color: var(--soft); opacity: 0.5; }
  .sf-email-input:focus { border-color: rgba(232,160,32,0.4); }

  .sf-gate-note {
    font-size: 11px;
    color: var(--soft);
    opacity: 0.5;
    letter-spacing: 0.04em;
  }

  /* Unlock success */
  .sf-unlock-success {
    background: rgba(34,197,94,0.06);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 12px;
    padding: 28px;
    text-align: center;
    margin-bottom: 32px;
  }
  .sf-unlock-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--ivory);
    margin-top: 12px;
    margin-bottom: 6px;
  }
  .sf-unlock-body { font-size: 13px; font-weight: 300; color: var(--soft); }

  /* Upsell section */
  .sf-upsell {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 48px;
  }
  @media (max-width: 768px) { .sf-upsell { grid-template-columns: 1fr; } }

  .sf-upsell-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 14px;
    overflow: hidden;
  }

  .sf-upsell-head {
    padding: 24px 28px 20px;
    border-bottom: 1px solid rgba(245,237,214,0.06);
    position: relative;
  }
  .sf-upsell-head::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
  }
  .sf-upsell-head.terra::before {
    background: linear-gradient(90deg, var(--terra), var(--terra-light));
  }

  .sf-upsell-head-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 6px;
  }
  .sf-upsell-head-label.terra { color: var(--terra-light); }

  .sf-upsell-head-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
  }

  .sf-upsell-body { padding: 24px 28px; }

  .sf-upsell-features {
    list-style: none;
    padding: 0; margin: 0 0 24px;
    display: flex; flex-direction: column; gap: 10px;
  }

  .sf-upsell-feat {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
  }

  .sf-upsell-feat-check {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--success-dim);
    border: 1px solid rgba(34,197,94,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--success);
    font-size: 9px;
    margin-top: 1px;
  }

  .sf-upsell-feat-name {
    font-weight: 600;
    color: var(--ivory);
    display: block;
    margin-bottom: 1px;
  }
  .sf-upsell-feat-desc { font-weight: 300; color: var(--soft); font-size: 12px; }

  .sf-upsell-price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 20px;
  }
  .sf-upsell-price-amt {
    font-family: 'Cormorant Garant', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--ivory);
  }
  .sf-upsell-price-period { font-size: 13px; font-weight: 300; color: var(--soft); }
  .sf-upsell-price-sub { font-size: 12px; font-weight: 300; color: var(--soft); opacity: 0.7; margin-top: 2px; }

  /* Empty state */
  .sf-empty {
    text-align: center;
    padding: 80px 24px;
  }
  .sf-empty-icon {
    width: 64px; height: 64px;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--soft);
    opacity: 0.5;
  }
  .sf-empty-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 32px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 10px;
  }
  .sf-empty-body { font-size: 14px; font-weight: 300; color: var(--soft); margin-bottom: 28px; }
  .sf-empty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* Bottom browse CTA */
  .sf-browse-cta {
    margin-top: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    color: var(--soft);
  }
  .sf-browse-cta a {
    color: var(--gold-light);
    font-weight: 500;
    text-decoration: none;
  }
  .sf-browse-cta a:hover { text-decoration: underline; }

  /* ── shared buttons ── */
  .btn-gold-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 14px 24px;
    border-radius: 6px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-gold-full:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(232,160,32,0.2);
  }
  .btn-gold-full:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-outline-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 14px 24px;
    border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.15);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-outline-full:hover {
    border-color: rgba(245,237,214,0.4);
    background: rgba(245,237,214,0.04);
  }

  .btn-terra-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--terra-light);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 14px 24px;
    border-radius: 6px;
    border: 1px solid rgba(196,90,42,0.3);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-terra-full:hover {
    background: rgba(196,90,42,0.08);
    border-color: rgba(196,90,42,0.5);
  }
`;

const QUESTION_ICONS = [Globe, Plane, GraduationCap, BookOpen, Coins];

export default function ScholarshipFinderFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [answers, setAnswers] = useState({
    nationality: "",
    degreeLevel: "",
    fieldOfStudy: "",
    destination: "",
    fundingType: "",
  });

  const questions = [
    { id: "nationality",   question: "Where are you from?",             placeholder: "e.g., Kenya, Uganda, Nigeria, Ghana", type: "text" },
    { id: "destination",   question: "Where do you want to study?",     options: ["United States","United Kingdom","Canada","Germany","Australia","Europe","Asia","Anywhere"], type: "choice" },
    { id: "degreeLevel",   question: "What degree are you pursuing?",   options: ["Bachelor's","Master's","PhD","Diploma / Certificate"], type: "choice" },
    { id: "fieldOfStudy",  question: "What do you want to study?",      placeholder: "e.g., Computer Science, Medicine, Engineering, Business", type: "text" },
    { id: "fundingType",   question: "What type of funding do you need?", options: ["Full Funding (Tuition + Living)","Tuition Only","Partial Funding","Any Support"], type: "choice" },
  ];

  const currentQ   = questions[currentStep];
  const progress   = ((currentStep + 1) / questions.length) * 100;
  const isAnswered = !!answers[currentQ.id as keyof typeof answers];

  const handleAnswer = (value: string) =>
    setAnswers({ ...answers, [currentQ.id]: value });

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep(s => s + 1);
    else handleFind();
  };

  const handleFind = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const africanCountries = ["kenya","uganda","nigeria","ghana","rwanda","tanzania","ethiopia","south africa","senegal","cameroon","egypt","morocco","zimbabwe","zambia","malawi","botswana","namibia","mozambique","angola"];
      if (answers.nationality) {
        if (africanCountries.some(c => answers.nationality.toLowerCase().includes(c)))
          params.append("forAfrican", "true");
      }
      if (answers.destination && answers.destination !== "Anywhere")
        params.append("search", answers.destination);
      if (answers.fieldOfStudy) {
        const s = params.get("search");
        params.set("search", s ? `${s} ${answers.fieldOfStudy}` : answers.fieldOfStudy);
      }
      const res = await fetch(`/api/scholarships?${params}&limit=50`);
      let scholarships = res.ok ? (await res.json()).scholarships ?? [] : [];
      if (!scholarships.length) {
        const fb = await fetch("/api/scholarships?limit=50");
        if (fb.ok) scholarships = (await fb.json()).scholarships ?? [];
      }
      setResults(scholarships);
    } catch {
      const fb = await fetch("/api/scholarships?limit=50").catch(() => null);
      setResults(fb?.ok ? (await fb.json()).scholarships ?? [] : []);
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

  const formatCurrency = (amount: number | null, currency = "USD") => {
    if (!amount) return "Full Funding";
    if (amount >= 1_000_000) return `${currency} ${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1_000)     return `${currency} ${(amount / 1e3).toFixed(0)}K`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const daysUntil = (d: string | null) => {
    if (!d) return null;
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
    return diff > 0 ? diff : null;
  };

  const handleEmailCapture = async () => {
    if (!email.includes("@")) return;
    setEmailLoading(true);
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "scholarship-finder" }),
      });
      if (r.ok) setEmailCaptured(true);
    } catch { /* silent */ }
    finally { setEmailLoading(false); }
  };

  const totalValue    = results.reduce((s, r) => s + (r.amount ?? 0), 0);
  const visibleResults = emailCaptured ? results : results.slice(0, 5);

  /* ── RESULTS VIEW ── */
  if (showResults) {
    return (
      <div className="sf-page">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="sf-results">
          <div className="sf-results-inner">

            {/* Header */}
            <div className="sf-results-head">
              <button
                className="btn-ghost-sm"
                onClick={() => { setShowResults(false); setCurrentStep(0); setResults([]); setEmailCaptured(false); setEmail(""); }}
              >
                <ArrowLeft size={12} /> Start Over
              </button>

              <h1 className="sf-results-title">
                {results.length > 0
                  ? <><em>{results.length} scholarships</em> match your profile</>
                  : <>No matches <em>found</em></>
                }
              </h1>

              {results.length > 0 && (
                <p className="sf-results-subtitle">
                  Total potential funding: <strong>${totalValue.toLocaleString()}</strong>
                </p>
              )}

              <div className="sf-trust-badges">
                <span className="sf-trust-badge"><Users size={14} /> 127+ students helped</span>
                <span className="sf-trust-badge star"><Star size={14} /> 85% success rate</span>
                <span className="sf-trust-badge green"><Shield size={14} /> Verified scholarships</span>
              </div>
            </div>

            {results.length > 0 ? (
              <>
                {/* Cards */}
                <div className="sf-cards-grid">
                  {visibleResults.map(s => {
                    const days = daysUntil(s.deadline);
                    return (
                      <Link key={s.id} href={`/scholarships/${s.id}`} className="sf-schol-card">
                        {s.featured && <span className="sf-schol-featured">Featured</span>}
                        <div className="sf-schol-name">{s.name}</div>
                        <div className="sf-schol-provider">{s.provider}</div>
                        <div className="sf-schol-meta">
                          <div className="sf-schol-meta-row">
                            <DollarSign size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
                            <span className="sf-schol-amount">{formatCurrency(s.amount, s.currency ?? "USD")}</span>
                          </div>
                          {s.country && (
                            <div className="sf-schol-meta-row">
                              <MapPin size={13} style={{ color: "var(--soft)", flexShrink: 0 }} />
                              <span className="sf-schol-location">{s.country}</span>
                            </div>
                          )}
                          {days && (
                            <div className="sf-schol-meta-row">
                              <Calendar size={13} style={{ color: days <= 30 ? "var(--danger)" : "var(--soft)", flexShrink: 0 }} />
                              <span className={`sf-schol-deadline ${days <= 30 ? "urgent" : "ok"}`}>
                                {days} days left
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="sf-schol-cta">
                          View Details <ArrowRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Email gate */}
                {!emailCaptured && results.length > 5 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="sf-gate">
                      <div className="sf-gate-icon"><Lock size={22} /></div>
                      <h3 className="sf-gate-title">
                        <em>{results.length - 5} more</em> scholarships waiting
                      </h3>
                      <p className="sf-gate-body">
                        Enter your email to unlock all {results.length} matching scholarships
                        worth ${totalValue.toLocaleString()}.
                      </p>
                      <div className="sf-gate-form">
                        <input
                          type="email"
                          className="sf-email-input"
                          placeholder="your@email.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        <button
                          className="btn-next"
                          style={{ borderRadius: 6, border: "none", whiteSpace: "nowrap" }}
                          onClick={handleEmailCapture}
                          disabled={emailLoading || !email.includes("@")}
                        >
                          {emailLoading
                            ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                            : <><span>Unlock All</span><ArrowRight size={14} /></>
                          }
                        </button>
                      </div>
                      <p className="sf-gate-note">No spam. Unsubscribe anytime.</p>
                    </div>
                  </motion.div>
                )}

                {/* Unlock success */}
                {emailCaptured && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="sf-unlock-success">
                      <CheckCircle2 size={36} style={{ color: "var(--success)", margin: "0 auto" }} />
                      <div className="sf-unlock-title">All {results.length} scholarships unlocked!</div>
                      <p className="sf-unlock-body">We've also sent a copy of your matches to your email.</p>
                    </div>
                  </motion.div>
                )}

                {/* Upsell */}
                <div className="sf-upsell">
                  {/* Premium card */}
                  <div className="sf-upsell-card">
                    <div className="sf-upsell-head">
                      <div className="sf-upsell-head-label">Upgrade</div>
                      <div className="sf-upsell-head-title">Premium Access — $5/mo</div>
                    </div>
                    <div className="sf-upsell-body">
                      <ul className="sf-upsell-features">
                        {[
                          ["10,000+ Verified Scholarships", "Full access to the database"],
                          ["Visa Guidance & Checklist",     "Know exactly what docs you need"],
                          ["AI Copilot Essay Help",         "Write winning essays fast"],
                          ["WhatsApp Deadline Alerts",      "Never miss a deadline"],
                          ["Application Checklists",        "Never miss a requirement"],
                        ].map(([n, d]) => (
                          <li key={n} className="sf-upsell-feat">
                            <span className="sf-upsell-feat-check">✓</span>
                            <span>
                              <span className="sf-upsell-feat-name">{n}</span>
                              <span className="sf-upsell-feat-desc">{d}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing" className="btn-gold-full">
                        Get Premium — $5/month <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Expert card */}
                  <div className="sf-upsell-card">
                    <div className="sf-upsell-head terra">
                      <div className="sf-upsell-head-label terra">Expert Service</div>
                      <div className="sf-upsell-head-title">Standard Package</div>
                    </div>
                    <div className="sf-upsell-body">
                      <ul className="sf-upsell-features">
                        {[
                          ["Expert writes your SOP",              "Professionally crafted statement"],
                          ["3–5 scholarship applications",         "Submitted on your behalf"],
                          ["Visa guidance & document checklist",  "Full document support"],
                          ["WhatsApp support until admission",    "We're with you throughout"],
                          ["50% refund if not admitted",          "Risk-free guarantee"],
                        ].map(([n, d]) => (
                          <li key={n} className="sf-upsell-feat">
                            <span className="sf-upsell-feat-check" style={{ borderColor: "rgba(196,90,42,0.4)", background: "rgba(196,90,42,0.1)", color: "var(--terra-light)" }}>✓</span>
                            <span>
                              <span className="sf-upsell-feat-name">{n}</span>
                              <span className="sf-upsell-feat-desc">{d}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="sf-upsell-price">
                        <span className="sf-upsell-price-amt">$299</span>
                        <div>
                          <span className="sf-upsell-price-period">one-time</span>
                          <div className="sf-upsell-price-sub">Avg. scholarship won: $18,000</div>
                        </div>
                      </div>
                      <Link href="/contact" className="btn-terra-full">
                        Talk to an Expert <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                <p className="sf-browse-cta">
                  Want to browse all 10,000+ scholarships?{" "}
                  <Link href="/scholarships">View Full Database →</Link>
                </p>
              </>
            ) : (
              /* Empty state */
              <div className="sf-empty">
                <div className="sf-empty-icon"><Award size={28} /></div>
                <div className="sf-empty-title">No matches found</div>
                <p className="sf-empty-body">
                  Try adjusting your search criteria or browse all scholarships in our database.
                </p>
                <div className="sf-empty-actions">
                  <button className="btn-outline-full" style={{ width: "auto", padding: "12px 24px" }}
                    onClick={() => { setShowResults(false); setCurrentStep(0); }}>
                    <ArrowLeft size={14} /> Try Again
                  </button>
                  <Link href="/scholarships" className="btn-gold-full" style={{ width: "auto", padding: "12px 24px" }}>
                    Browse All <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION FLOW VIEW ── */
  return (
    <div className="sf-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sf-flow">
        <div className="sf-flow-bg" />
        <div className="sf-flow-grain" />

        <div className="sf-flow-inner">
          {/* Header (only on step 0) */}
          {currentStep === 0 && (
            <div className="sf-header">
              <div className="sf-header-badge">
                <span className="sf-header-badge-dot" />
                AI-Powered Matching
              </div>
              <h1 className="sf-title">
                Find your <em>perfect</em><br />scholarship
              </h1>
              <p className="sf-subtitle">
                Answer 5 quick questions — we'll match you with opportunities that fit your profile.
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="sf-progress-wrap">
            <div className="sf-progress-track">
              <div className="sf-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="sf-progress-label">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="sf-card">
                <div className="sf-q-head">
                  <div className="sf-q-icon">
                    {(() => { const Icon = QUESTION_ICONS[currentStep]; return <Icon size={20} />; })()}
                  </div>
                  <h2 className="sf-q-text">{currentQ.question}</h2>
                </div>

                {currentQ.type === "choice" ? (
                  <div className="sf-choices">
                    {currentQ.options?.map(opt => {
                      const selected = answers[currentQ.id as keyof typeof answers] === opt;
                      return (
                        <button
                          key={opt}
                          className={`sf-choice${selected ? " sf-choice--selected" : ""}`}
                          onClick={() => handleAnswer(opt)}
                        >
                          <span>{opt}</span>
                          {selected && <span className="sf-choice-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="sf-input"
                    placeholder={currentQ.placeholder}
                    value={answers[currentQ.id as keyof typeof answers] || ""}
                    onChange={e => handleAnswer(e.target.value)}
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter" && isAnswered) handleNext(); }}
                  />
                )}

                <div className="sf-nav">
                  {currentStep > 0 ? (
                    <button className="btn-back" onClick={() => setCurrentStep(s => s - 1)}>
                      <ArrowLeft size={14} /> Back
                    </button>
                  ) : <span />}

                  <button className="btn-next" onClick={handleNext} disabled={!isAnswered || loading}>
                    {loading
                      ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Finding…</>
                      : currentStep < questions.length - 1
                        ? <>Next <ArrowRight size={14} /></>
                        : <><Sparkles size={14} /> Find Scholarships</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="sf-skip">
            Want to browse all scholarships instead?{" "}
            <Link href="/scholarships">Browse All →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}