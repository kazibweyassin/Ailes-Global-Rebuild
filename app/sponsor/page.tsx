"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Heart, Users, Globe2, ArrowRight, CheckCircle2, Mail,
  Star, Shield, TrendingUp, Sparkles, Building2,
  BookOpen, GraduationCap, Award
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  .sp-root {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .sp-hero {
    position: relative;
    min-height: 88vh;
    display: flex;
    align-items: center;
    padding: 120px 48px 80px;
    overflow: hidden;
  }
  @media(max-width:768px){ .sp-hero { padding: 100px 24px 60px; min-height: auto; } }

  .sp-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 80% 20%, rgba(196,90,42,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 10% 80%, rgba(232,160,32,0.10) 0%, transparent 55%),
      linear-gradient(160deg, #080D1A 0%, #0E1729 55%, #0A0F1E 100%);
    z-index: 0;
  }
  .sp-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,237,214,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,237,214,.025) 1px, transparent 1px);
    background-size: 64px 64px;
    z-index: 1;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }

  .sp-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 440px;
    gap: 80px;
    align-items: center;
  }
  @media(max-width:1024px){ .sp-hero-inner { grid-template-columns: 1fr; gap: 52px; } }

  .sp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(196,90,42,.14);
    border: 1px solid rgba(196,90,42,.3);
    color: var(--terra-light, #E07040);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
  }

  .sp-hero-heading {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(42px, 6vw, 70px);
    font-weight: 700;
    line-height: 1.08;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 24px;
  }
  .sp-hero-heading em {
    font-style: italic;
    color: var(--terra-light, #E07040);
  }

  .sp-hero-sub {
    font-size: 17px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft, rgba(245,237,214,.65));
    max-width: 540px;
    margin-bottom: 40px;
  }
  @media(max-width:768px){ .sp-hero-sub { font-size: 15px; } }

  .sp-hero-ctas {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .sp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--terra-light, #E07040);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .sp-btn-primary:hover {
    background: #d4622e;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(196,90,42,.35);
  }

  .sp-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid rgba(245,237,214,.2);
    cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .sp-btn-outline:hover {
    border-color: rgba(245,237,214,.5);
    background: rgba(245,237,214,.05);
  }

  /* ── HERO TRUST CARD ── */
  .sp-trust-card {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(8px);
  }
  @media(max-width:1024px){ .sp-trust-card { max-width: 480px; } }

  .sp-trust-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sp-trust-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(245,237,214,.06);
  }
  .sp-trust-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .sp-trust-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(196,90,42,.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sp-trust-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 3px;
  }
  .sp-trust-desc {
    font-size: 12px;
    color: var(--soft, rgba(245,237,214,.55));
    line-height: 1.5;
  }

  /* ── STATS STRIP ── */
  .sp-stats {
    background: rgba(196,90,42,.06);
    border-top: 1px solid rgba(196,90,42,.15);
    border-bottom: 1px solid rgba(196,90,42,.15);
    padding: 56px 48px;
  }
  @media(max-width:768px){ .sp-stats { padding: 40px 24px; } }

  .sp-stats-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    text-align: center;
  }
  @media(max-width:900px){ .sp-stats-inner { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width:480px){ .sp-stats-inner { grid-template-columns: 1fr 1fr; gap: 24px; } }

  .sp-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 52px;
    font-weight: 700;
    color: var(--terra-light, #E07040);
    line-height: 1;
    margin-bottom: 8px;
  }
  @media(max-width:768px){ .sp-stat-num { font-size: 38px; } }

  .sp-stat-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--soft, rgba(245,237,214,.6));
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  /* ── SECTIONS ── */
  .sp-section {
    padding: 96px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media(max-width:768px){ .sp-section { padding: 64px 24px; } }

  .sp-section-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--terra-light, #E07040);
    margin-bottom: 16px;
  }

  .sp-section-heading {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 700;
    color: var(--ivory, #F8F4EC);
    line-height: 1.1;
    margin-bottom: 20px;
    max-width: 760px;
  }
  .sp-section-heading em { font-style: italic; color: var(--gold); }

  .sp-section-sub {
    font-size: 16px;
    line-height: 1.75;
    color: var(--soft, rgba(245,237,214,.6));
    max-width: 660px;
    margin-bottom: 64px;
  }

  /* ── IMPACT GRID ── */
  .sp-impact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin-top: 56px;
  }
  @media(max-width:900px){ .sp-impact-grid { grid-template-columns: 1fr; } }

  .sp-impact-card {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(245,237,214,.08);
    border-radius: 16px;
    padding: 36px 32px;
    transition: border-color .2s, background .2s;
  }
  .sp-impact-card:hover {
    border-color: rgba(196,90,42,.3);
    background: rgba(196,90,42,.04);
  }

  .sp-impact-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: rgba(196,90,42,.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--terra-light, #E07040);
  }
  .sp-impact-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 12px;
  }
  .sp-impact-desc {
    font-size: 14px;
    color: var(--soft, rgba(245,237,214,.6));
    line-height: 1.7;
  }

  /* ── HOW IT WORKS ── */
  .sp-hiw {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 48px;
    margin-top: 56px;
    position: relative;
  }
  @media(max-width:900px){ .sp-hiw { grid-template-columns: 1fr; gap: 32px; } }

  .sp-hiw-step {
    position: relative;
    text-align: center;
    padding: 0 16px;
  }

  .sp-hiw-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 72px;
    font-weight: 700;
    color: rgba(196,90,42,.18);
    line-height: 1;
    margin-bottom: 16px;
  }

  .sp-hiw-label {
    font-size: 16px;
    font-weight: 700;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 12px;
  }

  .sp-hiw-desc {
    font-size: 14px;
    color: var(--soft, rgba(245,237,214,.6));
    line-height: 1.7;
  }

  /* ── TIERS ── */
  .sp-tiers {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin-top: 56px;
  }
  @media(max-width:1024px){ .sp-tiers { grid-template-columns: 1fr; max-width: 480px; } }

  .sp-tier {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(245,237,214,.08);
    border-radius: 20px;
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: border-color .2s, transform .2s;
  }
  .sp-tier:hover { transform: translateY(-4px); }
  .sp-tier.featured {
    border-color: rgba(196,90,42,.45);
    background: rgba(196,90,42,.05);
  }

  .sp-tier-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--terra-light, #E07040);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }

  .sp-tier-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ivory, #F8F4EC);
    margin-bottom: 8px;
  }

  .sp-tier-price {
    font-family: 'Cormorant Garant', serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--terra-light, #E07040);
    line-height: 1;
    margin-bottom: 4px;
  }
  .sp-tier-price span {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--soft, rgba(245,237,214,.5));
    margin-left: 4px;
  }

  .sp-tier-period {
    font-size: 12px;
    color: var(--soft, rgba(245,237,214,.5));
    margin-bottom: 16px;
  }

  .sp-tier-desc {
    font-size: 14px;
    color: var(--soft, rgba(245,237,214,.6));
    line-height: 1.65;
    margin-bottom: 24px;
    flex: 1;
  }

  .sp-tier-divider {
    height: 1px;
    background: rgba(245,237,214,.08);
    margin-bottom: 24px;
  }

  .sp-tier-features {
    list-style: none;
    padding: 0;
    margin: 0 0 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sp-tier-feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: var(--soft, rgba(245,237,214,.7));
    line-height: 1.5;
  }
  .sp-tier-feature svg { flex-shrink: 0; margin-top: 1px; color: var(--terra-light, #E07040); }

  /* ── FORM ── */
  .sp-form-wrap {
    max-width: 760px;
    margin: 0 auto;
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(245,237,214,.08);
    border-radius: 20px;
    padding: 48px;
  }
  @media(max-width:768px){ .sp-form-wrap { padding: 28px 20px; } }

  .sp-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width:640px){ .sp-form-grid { grid-template-columns: 1fr; } }

  .sp-field { display: flex; flex-direction: column; gap: 8px; }
  .sp-field.full { grid-column: 1 / -1; }

  .sp-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--soft, rgba(245,237,214,.6));
  }

  .sp-input, .sp-select, .sp-textarea {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(245,237,214,.12);
    border-radius: 8px;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    padding: 12px 16px;
    outline: none;
    transition: border-color .2s;
    width: 100%;
    box-sizing: border-box;
  }
  .sp-input:focus, .sp-select:focus, .sp-textarea:focus {
    border-color: rgba(196,90,42,.5);
  }
  .sp-select { appearance: none; cursor: pointer; }
  .sp-textarea { resize: vertical; min-height: 120px; }
  ::placeholder { color: rgba(245,237,214,.25); }
  option { background: #0E1729; color: var(--cream); }

  .sp-type-toggle {
    display: flex;
    gap: 12px;
    grid-column: 1 / -1;
  }

  .sp-type-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(245,237,214,.12);
    background: transparent;
    color: var(--soft, rgba(245,237,214,.6));
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .sp-type-btn.active {
    border-color: rgba(196,90,42,.5);
    background: rgba(196,90,42,.1);
    color: var(--terra-light, #E07040);
  }

  .sp-anon-row {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }
  .sp-anon-row input[type=checkbox] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: var(--terra-light, #E07040);
  }
  .sp-anon-label {
    font-size: 13px;
    color: var(--soft, rgba(245,237,214,.6));
  }

  .sp-submit {
    margin-top: 24px;
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    border: none;
    background: var(--terra-light, #E07040);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background .2s, transform .2s;
  }
  .sp-submit:hover:not(:disabled) {
    background: #d4622e;
    transform: translateY(-1px);
  }
  .sp-submit:disabled { opacity: .6; cursor: not-allowed; }

  /* ── FAQ ── */
  .sp-faq { max-width: 720px; margin: 0 auto; margin-top: 56px; }

  .sp-faq-item {
    border-bottom: 1px solid rgba(245,237,214,.08);
    padding: 20px 0;
  }

  .sp-faq-q {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: var(--ivory, #F8F4EC);
    gap: 16px;
    user-select: none;
  }

  .sp-faq-chevron {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--terra-light, #E07040);
    transition: transform .2s;
  }
  .sp-faq-chevron.open { transform: rotate(180deg); }

  .sp-faq-a {
    font-size: 14px;
    color: var(--soft, rgba(245,237,214,.6));
    line-height: 1.75;
    padding-top: 14px;
    overflow: hidden;
    max-height: 0;
    transition: max-height .3s ease, padding .2s;
  }
  .sp-faq-a.open { max-height: 400px; }

  /* ── CTA BAND ── */
  .sp-cta-band {
    background: linear-gradient(135deg, rgba(196,90,42,.15) 0%, rgba(232,160,32,.08) 100%);
    border-top: 1px solid rgba(196,90,42,.2);
    padding: 96px 48px;
    text-align: center;
  }
  @media(max-width:768px){ .sp-cta-band { padding: 64px 24px; } }
`;

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const IMPACT_ITEMS = [
  {
    icon: <BookOpen size={22} />,
    title: "Application Support",
    desc: "Your sponsorship covers access to our AI tools, expert review sessions, and document preparation — giving students an edge they couldn't afford alone.",
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Scholarship Discovery",
    desc: "We actively match sponsored students to fully-funded scholarships worth $10K–$60K. The best outcome is you sponsor one year, and a scholarship covers the rest.",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Community Impact",
    desc: "Every student you support sends knowledge, skills, and networks back to their community. Your investment multiplies far beyond one person.",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    label: "Choose your tier",
    desc: "Select a sponsorship level that fits your capacity. You can change or cancel at any time.",
  },
  {
    num: "02",
    label: "We match you with a student",
    desc: "Our team handpicks a verified student whose goals align with your preferences — field, country, or story.",
  },
  {
    num: "03",
    label: "Track their journey",
    desc: "Receive regular updates on the student's progress — applications sent, scholarships won, milestones reached.",
  },
];

const TIERS = [
  {
    name: "Mentor",
    price: "$50",
    period: "/ month",
    tierName: "Mentor",
    amount: "50",
    desc: "Great for individuals who want to make a difference without a large commitment. Support one student with tools and guidance.",
    features: [
      "Full platform access for 1 student",
      "Monthly progress update",
      "Name listed on student profile",
      "Cancel anytime",
    ],
    featured: false,
    cta: "Start Mentoring",
  },
  {
    name: "Champion",
    price: "$200",
    period: "/ month",
    tierName: "Champion",
    amount: "200",
    desc: "Cover a student's full scholarship journey — from matching to acceptance. The most impactful individual tier.",
    features: [
      "Full journey support for 1 student",
      "Weekly milestone updates",
      "Priority student matching",
      "Invitation to graduation celebration",
      "Sponsor recognition certificate",
    ],
    featured: true,
    cta: "Become a Champion",
  },
  {
    name: "Corporate",
    price: "Custom",
    period: "",
    tierName: "Corporate",
    amount: "",
    desc: "For companies running CSR or DEI programmes. Sponsor multiple students with full brand visibility.",
    features: [
      "Sponsor 5–50 students per cohort",
      "Logo on Ailes Global homepage",
      "Co-branded impact report",
      "Team giving portal",
      "Dedicated account manager",
    ],
    featured: false,
    cta: "Contact Us",
  },
];

const FAQS = [
  {
    q: "Where does my money actually go?",
    a: "100% of your sponsorship funds the student's access to our platform, expert sessions, and application tools. We do not take an operational cut from sponsor contributions. Ailes Global's operations are funded separately through institutional partnerships.",
  },
  {
    q: "Can I choose which student I sponsor?",
    a: "By default, our team matches you with the best-fit student based on your preferences (field of study, country, etc.). If you'd like to sponsor a specific student you already know, just mention it in the form and we'll facilitate it.",
  },
  {
    q: "What if I want to remain anonymous?",
    a: "Absolutely. Check the 'remain anonymous' box in the form and the student will only know they have a sponsor — your identity will not be shared.",
  },
  {
    q: "Is this tax deductible?",
    a: "Ailes Global is a for-profit platform, so sponsorships are not tax-deductible charitable donations. For CSR and corporate giving programmes, please contact us directly to discuss appropriate arrangements.",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function SponsorPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [sponsorType, setSponsorType] = useState<"individual" | "corporate">("individual");
  const [selectedTier, setSelectedTier] = useState<(typeof TIERS)[0] | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    customAmount: "",
    preferredField: "",
    preferredCountry: "",
    message: "",
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const chooseTier = (tier: (typeof TIERS)[0]) => {
    setSelectedTier(tier);
    document.getElementById("sponsor-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = selectedTier?.name === "Corporate"
      ? form.customAmount
      : selectedTier?.amount || form.customAmount;

    if (!form.name || !form.email || !form.phone || !amount) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          sponsorType,
          companyName: form.companyName || undefined,
          companyWebsite: form.companyWebsite || undefined,
          tierName: selectedTier?.tierName || "Custom",
          amount: parseFloat(amount),
          preferredField: form.preferredField || undefined,
          preferredCountry: form.preferredCountry || undefined,
          message: form.message || undefined,
          anonymous,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sp-root">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="sp-hero">
          <div className="sp-hero-bg" />
          <div className="sp-hero-grid" />
          <div className="sp-hero-inner">

            {/* Left */}
            <div>
              <div className="sp-badge">
                <Heart size={12} /> Make a Difference
              </div>
              <h1 className="sp-hero-heading">
                Fund an African student's<br /><em>journey abroad</em>
              </h1>
              <p className="sp-hero-sub">
                Thousands of brilliant African students have the grades and the drive — but not the resources
                to navigate the global scholarship system. Your sponsorship changes that.
              </p>
              <div className="sp-hero-ctas">
                <button
                  className="sp-btn-primary"
                  onClick={() => document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See Sponsorship Tiers <ArrowRight size={15} />
                </button>
                <button
                  className="sp-btn-outline"
                  onClick={() => document.getElementById("sponsor-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Apply Directly
                </button>
              </div>
            </div>

            {/* Right — trust card */}
            <div className="sp-trust-card">
              <div className="sp-trust-title">
                <Shield size={18} style={{ color: "var(--terra-light, #E07040)" }} />
                Why sponsors choose us
              </div>
              {[
                { icon: <Heart size={15} style={{ color: "var(--terra-light, #E07040)" }} />, label: "100% to the student", desc: "Every cent funds the student's tools, sessions & applications." },
                { icon: <TrendingUp size={15} style={{ color: "var(--terra-light, #E07040)" }} />, label: "Tracked outcomes", desc: "You receive regular updates on the student's milestones." },
                { icon: <Shield size={15} style={{ color: "var(--terra-light, #E07040)" }} />, label: "Verified students", desc: "Every student is screened and verified by our admissions team." },
                { icon: <Sparkles size={15} style={{ color: "var(--terra-light, #E07040)" }} />, label: "Cancel anytime", desc: "No lock-in. Change your tier or pause at any point." },
              ].map((item, i) => (
                <div className="sp-trust-item" key={i}>
                  <div className="sp-trust-icon">{item.icon}</div>
                  <div>
                    <div className="sp-trust-label">{item.label}</div>
                    <div className="sp-trust-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────── */}
        <section className="sp-stats">
          <div className="sp-stats-inner">
            {[
              { num: "1,200+", label: "Active Students" },
              { num: "50+",    label: "Countries" },
              { num: "$18K",   label: "Avg Scholarship Found" },
              { num: "100%",   label: "Goes to Students" },
            ].map((s, i) => (
              <div key={i}>
                <div className="sp-stat-num">{s.num}</div>
                <div className="sp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── IMPACT ───────────────────────────────────────────── */}
        <div className="sp-section">
          <div className="sp-section-tag">Your Impact</div>
          <h2 className="sp-section-heading">
            What your sponsorship <em>actually</em> does
          </h2>
          <p className="sp-section-sub">
            We don't just collect funds — we deploy them with precision to give students the exact tools and
            guidance they need at the most critical stages of their journey.
          </p>
          <div className="sp-impact-grid">
            {IMPACT_ITEMS.map((item, i) => (
              <div className="sp-impact-card" key={i}>
                <div className="sp-impact-icon">{item.icon}</div>
                <div className="sp-impact-title">{item.title}</div>
                <div className="sp-impact-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <div style={{ background: "rgba(14,23,41,.5)", borderTop: "1px solid rgba(245,237,214,.06)", borderBottom: "1px solid rgba(245,237,214,.06)", padding: "96px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="sp-section-tag">The Process</div>
            <h2 className="sp-section-heading">Simple to start. <em>Powerful</em> in impact.</h2>
            <div className="sp-hiw">
              {HOW_STEPS.map((step, i) => (
                <div className="sp-hiw-step" key={i}>
                  <div className="sp-hiw-num">{step.num}</div>
                  <div className="sp-hiw-label">{step.label}</div>
                  <div className="sp-hiw-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TIERS ────────────────────────────────────────────── */}
        <div className="sp-section" id="tiers">
          <div className="sp-section-tag">Sponsorship Tiers</div>
          <h2 className="sp-section-heading">Choose your <em>level of impact</em></h2>
          <p className="sp-section-sub">
            Every tier makes a real difference. Start with what you can — you can always upgrade.
          </p>
          <div className="sp-tiers">
            {TIERS.map((tier, i) => (
              <div className={`sp-tier ${tier.featured ? "featured" : ""}`} key={i}>
                {tier.featured && <div className="sp-tier-badge">Most Popular</div>}
                <div className="sp-tier-name">{tier.name}</div>
                <div className="sp-tier-price">
                  {tier.price}
                  {tier.period && <span>{tier.period}</span>}
                </div>
                <div className="sp-tier-desc">{tier.desc}</div>
                <div className="sp-tier-divider" />
                <ul className="sp-tier-features">
                  {tier.features.map((f, j) => (
                    <li className="sp-tier-feature" key={j}>
                      <CheckCircle2 size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={tier.featured ? "sp-btn-primary" : "sp-btn-outline"}
                  style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
                  onClick={() => chooseTier(tier)}
                >
                  {tier.cta} <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORM ─────────────────────────────────────────────── */}
        <div style={{ background: "rgba(14,23,41,.5)", borderTop: "1px solid rgba(245,237,214,.06)", padding: "96px 48px" }} id="sponsor-form">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="sp-section-tag">Apply to Sponsor</div>
            <h2 className="sp-section-heading">Ready to <em>change a life?</em></h2>
            <p className="sp-section-sub">
              Fill in the form below and our team will confirm your sponsorship match within 2 business days.
            </p>

            {submitted ? (
              <div style={{ maxWidth: 600, margin: "0 auto", background: "rgba(46,191,138,.08)", border: "1px solid rgba(46,191,138,.25)", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
                <CheckCircle2 size={48} style={{ color: "#2EBF8A", margin: "0 auto 20px", display: "block" }} />
                <h3 style={{ fontFamily: "Cormorant Garant, serif", fontSize: 30, color: "var(--ivory, #F8F4EC)", marginBottom: 12 }}>
                  You're a sponsor!
                </h3>
                <p style={{ fontSize: 15, color: "var(--soft, rgba(245,237,214,.65))", lineHeight: 1.75 }}>
                  Thank you for your generosity. Our team will reach out within 2 business days
                  with your matched student profile and next steps.
                </p>
                <Link
                  href="/"
                  className="sp-btn-primary"
                  style={{ marginTop: 28, display: "inline-flex" }}
                >
                  Back to Home <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="sp-form-wrap">
                {selectedTier && (
                  <div style={{ background: "rgba(196,90,42,.1)", border: "1px solid rgba(196,90,42,.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--terra-light, #E07040)", fontWeight: 600 }}>
                      Selected: {selectedTier.name} Tier {selectedTier.price !== "Custom" ? `— ${selectedTier.price}/mo` : ""}
                    </span>
                    <button onClick={() => setSelectedTier(null)} style={{ background: "none", border: "none", color: "var(--soft, rgba(245,237,214,.5))", cursor: "pointer", fontSize: 13 }}>
                      Change
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="sp-form-grid">

                    {/* Sponsor type toggle */}
                    <div className="sp-field full">
                      <label className="sp-label">I am sponsoring as *</label>
                      <div className="sp-type-toggle">
                        <button
                          type="button"
                          className={`sp-type-btn ${sponsorType === "individual" ? "active" : ""}`}
                          onClick={() => setSponsorType("individual")}
                        >
                          <Heart size={14} /> Individual
                        </button>
                        <button
                          type="button"
                          className={`sp-type-btn ${sponsorType === "corporate" ? "active" : ""}`}
                          onClick={() => setSponsorType("corporate")}
                        >
                          <Building2 size={14} /> Corporate / Organisation
                        </button>
                      </div>
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Full Name *</label>
                      <input className="sp-input" name="name" required value={form.name} onChange={handle} placeholder="Your full name" />
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Email Address *</label>
                      <input className="sp-input" type="email" name="email" required value={form.email} onChange={handle} placeholder="you@example.com" />
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Phone / WhatsApp *</label>
                      <input className="sp-input" name="phone" required value={form.phone} onChange={handle} placeholder="+1 555 000 0000" />
                    </div>

                    {/* Tier selector if none chosen from above */}
                    {!selectedTier && (
                      <div className="sp-field">
                        <label className="sp-label">Sponsorship Tier *</label>
                        <select
                          className="sp-select"
                          required
                          onChange={(e) => {
                            const found = TIERS.find((t) => t.tierName === e.target.value);
                            if (found) setSelectedTier(found);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Select a tier…</option>
                          {TIERS.map((t) => (
                            <option key={t.tierName} value={t.tierName}>
                              {t.name} {t.price !== "Custom" ? `(${t.price}/mo)` : "(Custom amount)"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Custom amount for Corporate or if no tier set */}
                    {(selectedTier?.name === "Corporate" || !selectedTier) && (
                      <div className="sp-field">
                        <label className="sp-label">Monthly Amount (USD) *</label>
                        <input className="sp-input" name="customAmount" type="number" min="1" required value={form.customAmount} onChange={handle} placeholder="e.g. 500" />
                      </div>
                    )}

                    {sponsorType === "corporate" && (
                      <>
                        <div className="sp-field">
                          <label className="sp-label">Organisation Name</label>
                          <input className="sp-input" name="companyName" value={form.companyName} onChange={handle} placeholder="Acme Corp" />
                        </div>
                        <div className="sp-field">
                          <label className="sp-label">Organisation Website</label>
                          <input className="sp-input" name="companyWebsite" value={form.companyWebsite} onChange={handle} placeholder="https://acmecorp.com" />
                        </div>
                      </>
                    )}

                    <div className="sp-field">
                      <label className="sp-label">Preferred Student Field (optional)</label>
                      <select className="sp-select" name="preferredField" value={form.preferredField} onChange={handle}>
                        <option value="">No preference</option>
                        <option>STEM</option>
                        <option>Medicine / Health</option>
                        <option>Business / Finance</option>
                        <option>Law</option>
                        <option>Arts & Humanities</option>
                        <option>Social Sciences</option>
                        <option>Engineering</option>
                        <option>Education</option>
                      </select>
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">Preferred Student Country (optional)</label>
                      <select className="sp-select" name="preferredCountry" value={form.preferredCountry} onChange={handle}>
                        <option value="">Any African country</option>
                        <option>Nigeria</option>
                        <option>Kenya</option>
                        <option>Ghana</option>
                        <option>Ethiopia</option>
                        <option>South Africa</option>
                        <option>Tanzania</option>
                        <option>Uganda</option>
                        <option>Rwanda</option>
                        <option>Cameroon</option>
                        <option>Senegal</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="sp-field full">
                      <label className="sp-label">Message (optional)</label>
                      <textarea
                        className="sp-textarea"
                        name="message"
                        value={form.message}
                        onChange={handle}
                        placeholder="Tell us a little about why you want to sponsor a student, or any special preferences…"
                      />
                    </div>

                    <label className="sp-anon-row">
                      <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                      <span className="sp-anon-label">I would like to remain anonymous — do not share my identity with the student</span>
                    </label>

                  </div>

                  {error && (
                    <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, color: "#F87171", fontSize: 13 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="sp-submit" disabled={loading}>
                    {loading ? "Submitting…" : <><Heart size={16} /> Submit Sponsorship Application <ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="sp-section">
          <div className="sp-section-tag">Questions</div>
          <h2 className="sp-section-heading" style={{ marginBottom: 0 }}>
            Common <em>questions</em>
          </h2>
          <div className="sp-faq">
            {FAQS.map((faq, i) => (
              <div className="sp-faq-item" key={i}>
                <div className="sp-faq-q" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  {faq.q}
                  <svg
                    className={`sp-faq-chevron ${openFAQ === i ? "open" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div className={`sp-faq-a ${openFAQ === i ? "open" : ""}`}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BAND ─────────────────────────────────────────── */}
        <div className="sp-cta-band">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} style={{ color: "var(--terra-light, #E07040)" }} fill="var(--terra-light, #E07040)" />
              ))}
            </div>
            <h2 style={{ fontFamily: "Cormorant Garant, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, color: "var(--ivory, #F8F4EC)", lineHeight: 1.1, marginBottom: 16 }}>
              One sponsor can unlock an entire future.
            </h2>
            <p style={{ fontSize: 16, color: "var(--soft, rgba(245,237,214,.6))", lineHeight: 1.75, marginBottom: 36 }}>
              The students on our platform are ready. They just need someone in their corner.
              Will you be that person?
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="sp-btn-primary"
                onClick={() => document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" })}
              >
                Choose a Tier <ArrowRight size={16} />
              </button>
              <a href="mailto:sponsor@ailesglobal.com" className="sp-btn-outline">
                <Mail size={15} /> Email Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
