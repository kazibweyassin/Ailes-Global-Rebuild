"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2, Users, TrendingUp, CheckCircle2, ArrowRight,
  BarChart3, Award, Handshake, Mail, Phone, Building2, Star, Zap
} from "lucide-react";

const STYLES = `
  .inst-root {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .inst-hero {
    position: relative;
    min-height: 92vh;
    display: flex;
    align-items: center;
    padding: 120px 48px 80px;
    overflow: hidden;
  }
  @media(max-width:768px){ .inst-hero { padding: 100px 24px 60px; min-height: auto; } }

  .inst-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 80% 30%, rgba(232,160,32,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(196,90,42,0.10) 0%, transparent 55%),
      linear-gradient(160deg, #080D1A 0%, #0E1729 55%, #0A0F1E 100%);
    z-index: 0;
  }

  .inst-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,237,214,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,237,214,.025) 1px, transparent 1px);
    background-size: 64px 64px;
    z-index: 1;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }

  .inst-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 80px;
    align-items: center;
  }
  @media(max-width:1024px){ .inst-hero-inner { grid-template-columns: 1fr; gap: 48px; } }

  .inst-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(232,160,32,.12);
    border: 1px solid rgba(232,160,32,.25);
    color: var(--gold);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
  }

  .inst-hero-heading {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 700;
    line-height: 1.08;
    color: var(--ivory);
    margin-bottom: 24px;
  }
  .inst-hero-heading em {
    font-style: italic;
    color: var(--gold);
  }

  .inst-hero-sub {
    font-size: 17px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    max-width: 560px;
    margin-bottom: 40px;
  }
  @media(max-width:768px){ .inst-hero-sub { font-size: 15px; } }

  .inst-hero-ctas {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .inst-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
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
  .inst-btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232,160,32,.3);
  }

  .inst-btn-outline {
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
  .inst-btn-outline:hover {
    border-color: rgba(245,237,214,.5);
    background: rgba(245,237,214,.05);
  }

  /* ── HERO CARD ── */
  .inst-hero-card {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(8px);
  }
  @media(max-width:1024px){ .inst-hero-card { max-width: 480px; } }

  .inst-hero-card-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 28px;
  }

  /* ── STATS STRIP ── */
  .inst-stats {
    background: rgba(255,255,255,.02);
    border-top: 1px solid rgba(245,237,214,.07);
    border-bottom: 1px solid rgba(245,237,214,.07);
    padding: 56px 48px;
  }
  @media(max-width:768px){ .inst-stats { padding: 40px 24px; } }

  .inst-stats-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }
  @media(max-width:900px){ .inst-stats-inner { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width:480px){ .inst-stats-inner { grid-template-columns: 1fr 1fr; gap: 24px; } }

  .inst-stat {
    text-align: center;
  }

  .inst-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 52px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 8px;
  }
  @media(max-width:768px){ .inst-stat-num { font-size: 38px; } }

  .inst-stat-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--soft);
    letter-spacing: .03em;
  }

  /* ── SECTION COMMON ── */
  .inst-section {
    padding: 96px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media(max-width:768px){ .inst-section { padding: 64px 24px; } }

  .inst-section-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  .inst-section-heading {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 700;
    line-height: 1.1;
    color: var(--ivory);
    margin-bottom: 20px;
  }
  .inst-section-heading em { font-style: italic; color: var(--gold); }

  .inst-section-sub {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    max-width: 600px;
    margin-bottom: 56px;
  }

  /* ── WHY GRID ── */
  .inst-why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media(max-width:900px){ .inst-why-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width:580px){ .inst-why-grid { grid-template-columns: 1fr; } }

  .inst-why-card {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(245,237,214,.07);
    border-radius: 16px;
    padding: 32px;
    transition: border-color .2s, background .2s;
  }
  .inst-why-card:hover {
    border-color: rgba(232,160,32,.25);
    background: rgba(232,160,32,.04);
  }

  .inst-why-icon {
    width: 48px;
    height: 48px;
    background: rgba(232,160,32,.12);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--gold);
  }

  .inst-why-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 10px;
  }

  .inst-why-desc {
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--soft);
  }

  /* ── HOW IT WORKS ── */
  .inst-hiw-wrap {
    background: rgba(14,23,41,.6);
    border-radius: 24px;
    border: 1px solid rgba(245,237,214,.07);
    padding: 64px 56px;
  }
  @media(max-width:768px){ .inst-hiw-wrap { padding: 40px 24px; } }

  .inst-hiw-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    position: relative;
  }
  @media(max-width:900px){ .inst-hiw-steps { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width:540px){ .inst-hiw-steps { grid-template-columns: 1fr; gap: 24px; } }

  .inst-hiw-step {
    text-align: center;
  }

  .inst-hiw-num {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(232,160,32,.15);
    border: 1px solid rgba(232,160,32,.35);
    color: var(--gold);
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
  }

  .inst-hiw-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 8px;
  }

  .inst-hiw-desc {
    font-size: 13px;
    font-weight: 300;
    line-height: 1.65;
    color: var(--muted);
  }

  /* ── TIERS ── */
  .inst-tiers {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    align-items: start;
  }
  @media(max-width:900px){ .inst-tiers { grid-template-columns: 1fr; max-width: 480px; } }

  .inst-tier {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(245,237,214,.08);
    border-radius: 20px;
    padding: 36px 32px;
    transition: border-color .2s;
  }
  .inst-tier.featured {
    border-color: rgba(232,160,32,.4);
    background: rgba(232,160,32,.05);
    position: relative;
  }

  .inst-tier-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gold);
    color: var(--midnight);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    padding: 4px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }

  .inst-tier-name {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .inst-tier-price {
    font-family: 'Cormorant Garant', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--ivory);
    line-height: 1;
    margin-bottom: 6px;
  }
  .inst-tier-price span {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--soft);
  }

  .inst-tier-desc {
    font-size: 13px;
    color: var(--soft);
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .inst-tier-divider {
    height: 1px;
    background: rgba(245,237,214,.08);
    margin-bottom: 24px;
  }

  .inst-tier-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .inst-tier-feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: var(--soft);
    line-height: 1.5;
  }
  .inst-tier-feature svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }

  /* ── CONTACT FORM ── */
  .inst-form-wrap {
    background: rgba(14,23,41,.8);
    border: 1px solid rgba(245,237,214,.1);
    border-radius: 24px;
    padding: 56px;
    max-width: 760px;
    margin: 0 auto;
  }
  @media(max-width:768px){ .inst-form-wrap { padding: 32px 24px; } }

  .inst-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width:580px){ .inst-form-grid { grid-template-columns: 1fr; } }

  .inst-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .inst-field.full { grid-column: 1 / -1; }

  .inst-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--soft);
  }

  .inst-input, .inst-select, .inst-textarea {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(245,237,214,.12);
    border-radius: 10px;
    padding: 13px 16px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: var(--ivory);
    outline: none;
    transition: border-color .2s;
    width: 100%;
  }
  .inst-input:focus, .inst-select:focus, .inst-textarea:focus {
    border-color: rgba(232,160,32,.5);
  }
  .inst-select { cursor: pointer; }
  .inst-select option { background: #0E1729; color: var(--ivory); }
  .inst-textarea { resize: vertical; min-height: 120px; }

  .inst-form-submit {
    margin-top: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 700;
    padding: 16px 32px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .inst-form-submit:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(232,160,32,.3);
  }
  .inst-form-submit:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
  }

  /* ── TESTIMONIAL ── */
  .inst-quote {
    border-left: 3px solid var(--gold);
    padding: 24px 28px;
    background: rgba(232,160,32,.05);
    border-radius: 0 12px 12px 0;
    margin-top: 48px;
  }
  .inst-quote-text {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px;
    font-style: italic;
    color: var(--cream);
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .inst-quote-attr {
    font-size: 12px;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  /* ── CTA BAND ── */
  .inst-cta-band {
    background: linear-gradient(135deg, rgba(232,160,32,.12) 0%, rgba(196,90,42,.10) 100%);
    border-top: 1px solid rgba(232,160,32,.15);
    border-bottom: 1px solid rgba(232,160,32,.15);
    padding: 80px 48px;
    text-align: center;
  }
  @media(max-width:768px){ .inst-cta-band { padding: 56px 24px; } }
`;

const WHY_ITEMS = [
  {
    icon: <Users size={22} />,
    title: "Pre-Qualified Applicants",
    desc: "Every student on our platform has completed a full profile — academic background, English scores, funding needs, and country preferences. You receive applicants who already match your criteria.",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Pan-African Reach",
    desc: "We reach motivated students across 50+ African countries, including tier-1 markets like Nigeria, Kenya, Ghana, South Africa, Uganda, and Tanzania.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Scholarship-First Students",
    desc: "Our students are actively seeking funding — they are highly motivated, academically strong, and have overcome more barriers to get here than most applicants you see.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Data & Analytics",
    desc: "Partner institutions receive detailed campaign reports: impressions, profile views, application starts, and conversion rates — all trackable in real time.",
  },
  {
    icon: <Zap size={22} />,
    title: "Fast Turnaround",
    desc: "Our AI matching surfaces your scholarships or programs to the most relevant students within 24 hours of listing. No long lead times.",
  },
  {
    icon: <Handshake size={22} />,
    title: "Dedicated Account Manager",
    desc: "Every partner gets a named contact at Ailes Global who handles setup, optimisation, and ongoing communication. You're never talking to a chatbot.",
  },
];

const HOW_STEPS = [
  { num: "1", label: "Partner Onboarding", desc: "We set up your institution profile, scholarships, and target criteria in under 48 hours." },
  { num: "2", label: "AI Matching", desc: "Our system surfaces your opportunities to the most relevant student profiles automatically." },
  { num: "3", label: "Student Engagement", desc: "Interested students connect directly via our platform — you receive structured, complete applications." },
  { num: "4", label: "Track & Report", desc: "Monthly reports on reach, engagement, and enrolment outcomes. Optimise campaigns in real time." },
];

const TIERS = [
  {
    name: "Listing",
    price: "$2,500",
    period: "/year",
    desc: "Get your scholarship or programme in front of our student base.",
    features: [
      "1 scholarship / programme listing",
      "Student profile matching",
      "Deadline alerts to matched students",
      "Basic analytics dashboard",
      "Email support",
    ],
    featured: false,
    cta: "Get Listed",
  },
  {
    name: "Partner",
    price: "$8,000",
    period: "/year",
    desc: "Full recruitment partnership with active promotion and lead generation.",
    features: [
      "Up to 5 listings",
      "Featured placement in search results",
      "AI-powered student targeting",
      "Monthly analytics reports",
      "Dedicated account manager",
      "Webinar co-hosting",
      "Social media promotion",
    ],
    featured: true,
    cta: "Become a Partner",
  },
  {
    name: "Strategic",
    price: "Custom",
    period: "",
    desc: "Tailored for governments, foundations, and large-scale scholarship programmes.",
    features: [
      "Unlimited listings",
      "Co-branded campaigns",
      "Direct API / data integration",
      "Application pipeline management",
      "In-country outreach support",
      "Quarterly strategy reviews",
      "White-label options available",
    ],
    featured: false,
    cta: "Contact Us",
  },
];

export default function InstitutionsPage() {
  const [formData, setFormData] = useState({
    name: "", institution: "", role: "", email: "", phone: "",
    type: "", students: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with real API call
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="inst-root">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="inst-hero">
          <div className="inst-hero-bg" />
          <div className="inst-hero-grid" />
          <div className="inst-hero-inner">

            <div>
              <div className="inst-badge">
                <Building2 size={13} />
                For Institutions
              </div>
              <h1 className="inst-hero-heading">
                Your partner for <em>digital, direct</em> and truly global student recruitment
              </h1>
              <p className="inst-hero-sub">
                Reach and enrol the most motivated, independent African students looking for the best university match globally.
                Realise your international student recruitment ambitions through a trusted, scholarship-first platform.
              </p>
              <div className="inst-hero-ctas">
                <a href="#contact" className="inst-btn-primary">
                  Start a Partnership <ArrowRight size={16} />
                </a>
                <a href="#how-it-works" className="inst-btn-outline">
                  See How It Works
                </a>
              </div>
            </div>

            {/* Side card */}
            <div className="inst-hero-card">
              <p className="inst-hero-card-title">Why institutions choose us</p>
              {[
                "Students pre-screened by academic level & country",
                "Scholarship-first audience — highly motivated",
                "Reach 50+ African markets from one platform",
                "Trackable ROI with real-time analytics",
                "Dedicated account manager from day one",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <CheckCircle2 size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "var(--soft)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(245,237,214,.08)" }}>
                <a href="#contact" className="inst-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Request a Demo <ArrowRight size={15} />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────── */}
        <section className="inst-stats">
          <div className="inst-stats-inner">
            {[
              { num: "1,200+", label: "Active Students" },
              { num: "50+",    label: "Countries Represented" },
              { num: "300+",   label: "Scholarships Listed" },
              { num: "92%",    label: "Student Satisfaction" },
            ].map((s, i) => (
              <div className="inst-stat" key={i}>
                <div className="inst-stat-num">{s.num}</div>
                <div className="inst-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY AILES GLOBAL ─────────────────────────────── */}
        <section className="inst-section">
          <div className="inst-section-tag">Why Partner With Us</div>
          <h2 className="inst-section-heading">
            Africa's most engaged <em>scholarship-seeking</em> student audience
          </h2>
          <p className="inst-section-sub">
            Our students aren't browsing. They're actively planning, applying, and committed to studying abroad.
            That makes them the highest-intent audience any international institution can reach.
          </p>
          <div className="inst-why-grid">
            {WHY_ITEMS.map((item, i) => (
              <div className="inst-why-card" key={i}>
                <div className="inst-why-icon">{item.icon}</div>
                <div className="inst-why-title">{item.title}</div>
                <div className="inst-why-desc">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="inst-quote">
            <div className="inst-quote-text">
              "African students are among the most academically driven applicants we receive. Finding and reaching them
              at scale has always been the challenge — Ailes Global solves exactly that."
            </div>
            <div className="inst-quote-attr">International Admissions Director, European Partner University</div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section style={{ padding: "0 48px 96px" }} id="how-it-works">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="inst-section-tag">The Process</div>
            <h2 className="inst-section-heading">Simple to start. <em>Powerful</em> at scale.</h2>
            <div className="inst-hiw-wrap">
              <div className="inst-hiw-steps">
                {HOW_STEPS.map((s, i) => (
                  <div className="inst-hiw-step" key={i}>
                    <div className="inst-hiw-num">{s.num}</div>
                    <div className="inst-hiw-label">{s.label}</div>
                    <div className="inst-hiw-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING TIERS ────────────────────────────────── */}
        <section style={{ background: "rgba(14,23,41,.5)", padding: "96px 48px", borderTop: "1px solid rgba(245,237,214,.06)", borderBottom: "1px solid rgba(245,237,214,.06)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="inst-section-tag">Partnership Tiers</div>
            <h2 className="inst-section-heading">Transparent, <em>results-based</em> pricing</h2>
            <p className="inst-section-sub">
              Every tier includes full access to our student platform. You only pay for reach and engagement — no hidden fees.
            </p>
            <div className="inst-tiers">
              {TIERS.map((tier, i) => (
                <div className={`inst-tier ${tier.featured ? "featured" : ""}`} key={i}>
                  {tier.featured && <div className="inst-tier-badge">Most Popular</div>}
                  <div className="inst-tier-name">{tier.name}</div>
                  <div className="inst-tier-price">{tier.price}<span>{tier.period}</span></div>
                  <div className="inst-tier-desc">{tier.desc}</div>
                  <div className="inst-tier-divider" />
                  <ul className="inst-tier-features">
                    {tier.features.map((f, j) => (
                      <li className="inst-tier-feature" key={j}>
                        <CheckCircle2 size={14} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={tier.featured ? "inst-btn-primary" : "inst-btn-outline"} style={{ width: "100%", justifyContent: "center" }}>
                    {tier.cta} <ArrowRight size={15} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM ─────────────────────────────────── */}
        <section className="inst-section" id="contact">
          <div className="inst-section-tag">Get In Touch</div>
          <h2 className="inst-section-heading">Start your <em>partnership</em> today</h2>
          <p className="inst-section-sub">
            Tell us about your institution and recruitment goals. We'll get back to you within one business day.
          </p>

          {submitted ? (
            <div style={{ maxWidth: 760, margin: "0 auto", background: "rgba(46,191,138,.08)", border: "1px solid rgba(46,191,138,.25)", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
              <CheckCircle2 size={48} style={{ color: "#2EBF8A", margin: "0 auto 20px" }} />
              <h3 style={{ fontFamily: "Cormorant Garant, serif", fontSize: 28, color: "var(--ivory)", marginBottom: 12 }}>Thank you!</h3>
              <p style={{ fontSize: 15, color: "var(--soft)", lineHeight: 1.7 }}>
                We've received your enquiry and will be in touch within one business day.<br />
                In the meantime, feel free to browse our <Link href="/scholarships" style={{ color: "var(--gold)" }}>scholarship database</Link>.
              </p>
            </div>
          ) : (
            <div className="inst-form-wrap">
              <form onSubmit={handleSubmit}>
                <div className="inst-form-grid">
                  <div className="inst-field">
                    <label className="inst-label">Your Name *</label>
                    <input className="inst-input" name="name" required value={formData.name} onChange={handleChange} placeholder="Dr. Jane Smith" />
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Institution Name *</label>
                    <input className="inst-input" name="institution" required value={formData.institution} onChange={handleChange} placeholder="University of Example" />
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Your Role *</label>
                    <input className="inst-input" name="role" required value={formData.role} onChange={handleChange} placeholder="Head of International Admissions" />
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Work Email *</label>
                    <input className="inst-input" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="j.smith@university.edu" />
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Phone / WhatsApp</label>
                    <input className="inst-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7700 900000" />
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Institution Type *</label>
                    <select className="inst-select" name="type" required value={formData.type} onChange={handleChange}>
                      <option value="">Select type…</option>
                      <option>University / College</option>
                      <option>Government / Ministry</option>
                      <option>Scholarship Foundation</option>
                      <option>Corporate CSR Programme</option>
                      <option>NGO / Non-Profit</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">African Students Target / Year</label>
                    <select className="inst-select" name="students" value={formData.students} onChange={handleChange}>
                      <option value="">Select range…</option>
                      <option>1 – 20</option>
                      <option>21 – 100</option>
                      <option>101 – 500</option>
                      <option>500+</option>
                    </select>
                  </div>
                  <div className="inst-field">
                    <label className="inst-label">Partnership Tier Interest</label>
                    <select className="inst-select" name="tier" onChange={handleChange}>
                      <option value="">Not sure yet</option>
                      <option>Listing ($2,500/year)</option>
                      <option>Partner ($8,000/year)</option>
                      <option>Strategic (Custom)</option>
                    </select>
                  </div>
                  <div className="inst-field full">
                    <label className="inst-label">Tell us about your recruitment goals</label>
                    <textarea className="inst-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="What countries are you targeting? What challenges are you facing in African student recruitment?" />
                  </div>
                </div>
                <button type="submit" className="inst-form-submit" disabled={loading} style={{ marginTop: 24 }}>
                  {loading ? "Sending…" : <><Mail size={16} /> Send Enquiry <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────── */}
        <section className="inst-cta-band">
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              <Star size={16} style={{ color: "var(--gold)" }} />
              <Star size={16} style={{ color: "var(--gold)" }} />
              <Star size={16} style={{ color: "var(--gold)" }} />
              <Star size={16} style={{ color: "var(--gold)" }} />
              <Star size={16} style={{ color: "var(--gold)" }} />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garant, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "var(--ivory)", marginBottom: 16, lineHeight: 1.1 }}>
              Ready to reach Africa's best students?
            </h2>
            <p style={{ fontSize: 16, color: "var(--soft)", lineHeight: 1.7, marginBottom: 36 }}>
              Join institutions already using Ailes Global to build diverse, high-achieving cohorts from across the continent.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#contact" className="inst-btn-primary">
                Start a Partnership <ArrowRight size={16} />
              </a>
              <a href="mailto:partnerships@ailesglobal.com" className="inst-btn-outline">
                <Mail size={15} /> Email Us Directly
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
