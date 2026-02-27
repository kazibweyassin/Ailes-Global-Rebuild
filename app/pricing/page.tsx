import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { getFeaturedStories } from "@/lib/success-stories";

export const metadata: Metadata = generateSEO({
  title: "Pricing & Packages - Transparent Education Consulting Rates",
  description:
    "Affordable study abroad consulting packages. From basic scholarship search to premium full-service packages. Transparent pricing, no hidden fees. Free initial consultation available.",
  keywords: ["study abroad cost", "consulting fees", "scholarship services pricing", "education consulting rates"],
  canonicalUrl: "/pricing",
});

/* ─── Inline styles (no Tailwind dependency for new classes) ──────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Sora:wght@300;400;500;600&display=swap');

  :root {
    --midnight: #080D1A;
    --navy: #0E1729;
    --navy-light: #172038;
    --gold: #E8A020;
    --gold-light: #F5C55A;
    --terra: #C45A2A;
    --terra-light: #E07848;
    --cream: #F5EDD6;
    --ivory: #FDF8F0;
    --soft: #C4CFDF;
    --success: #22C55E;
    --success-dim: rgba(34,197,94,0.12);
  }

  .pr-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── PAGE HEADER ── */
  .pr-hero {
    position: relative;
    padding: 100px 48px 80px;
    text-align: center;
    overflow: hidden;
  }
  @media (max-width: 640px) { .pr-hero { padding: 80px 24px 60px; } }

  .pr-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(196,90,42,0.08) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }

  .pr-hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    z-index: 1;
  }

  .pr-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 760px;
    margin: 0 auto;
  }

  .pr-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--success-dim);
    border: 1px solid rgba(34,197,94,0.25);
    color: var(--success);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 28px;
  }

  .pr-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--success);
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .pr-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 600;
    line-height: 1.05;
    color: var(--ivory);
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }
  .pr-title em { font-style: italic; color: var(--gold); }

  .pr-subtitle {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    max-width: 580px;
    margin: 0 auto 28px;
  }

  .pr-success-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--gold-light);
    border: 1px solid rgba(232,160,32,0.25);
    padding: 8px 20px;
    border-radius: 100px;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
  }
  .pr-success-link:hover {
    background: rgba(232,160,32,0.08);
    border-color: rgba(232,160,32,0.5);
  }

  /* ── PRICING GRID ── */
  .pr-grid-wrap {
    padding: 0 48px 80px;
    max-width: 1320px;
    margin: 0 auto;
  }
  @media (max-width: 640px) { .pr-grid-wrap { padding: 0 24px 60px; } }

  .pr-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  @media (max-width: 1100px) { .pr-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .pr-grid { grid-template-columns: 1fr; } }

  .pr-card {
    background: var(--navy);
    padding: 40px 32px;
    position: relative;
    border-right: 1px solid rgba(245,237,214,0.06);
    display: flex;
    flex-direction: column;
    transition: background 0.3s;
  }
  .pr-card:last-child { border-right: none; }
  @media (max-width: 1100px) {
    .pr-card:nth-child(2) { border-right: none; }
    .pr-card { border-bottom: 1px solid rgba(245,237,214,0.06); }
    .pr-card:last-child { border-bottom: none; }
  }

  .pr-card--popular {
    background: var(--navy-light);
    border-right: 1px solid rgba(232,160,32,0.2) !important;
    border-left: 1px solid rgba(232,160,32,0.2);
  }
  .pr-card--popular::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
  }

  .pr-badge-popular {
    position: absolute;
    top: -1px;
    right: 24px;
    background: var(--gold);
    color: var(--midnight);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 0 0 8px 8px;
  }

  .pr-card-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 16px;
  }

  .pr-price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 4px;
  }
  .pr-price-amt {
    font-family: 'Cormorant Garant', serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--ivory);
    line-height: 1;
  }
  .pr-card--popular .pr-price-amt { color: var(--gold); }
  .pr-price-period {
    font-size: 13px;
    color: var(--soft);
    font-weight: 300;
  }

  .pr-card-desc {
    font-size: 13px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .pr-outcome {
    background: rgba(232,160,32,0.07);
    border: 1px solid rgba(232,160,32,0.15);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--gold-light);
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .pr-results {
    font-size: 11px;
    color: var(--soft);
    opacity: 0.7;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .pr-divider {
    height: 1px;
    background: rgba(245,237,214,0.07);
    margin-bottom: 20px;
  }

  .pr-features {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    margin-bottom: 24px;
  }

  .pr-feat {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.5;
  }

  .pr-feat-check {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--success-dim);
    border: 1px solid rgba(34,197,94,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--success);
    font-size: 9px;
  }

  .pr-feat-x {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    color: rgba(245,237,214,0.2);
    font-size: 9px;
  }

  .pr-feat-text--crossed {
    text-decoration: line-through;
    opacity: 0.35;
  }

  .pr-guarantee {
    background: rgba(34,197,94,0.06);
    border: 1px solid rgba(34,197,94,0.15);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 11px;
    color: rgba(34,197,94,0.9);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  /* ── BUTTONS ── */
  .btn-gold {
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
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    text-align: center;
  }
  .btn-gold:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(232,160,32,0.2);
  }

  .btn-outline-pr {
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
    border-radius: 4px;
    border: 1px solid rgba(245,237,214,0.15);
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
    text-align: center;
  }
  .btn-outline-pr:hover {
    border-color: rgba(245,237,214,0.4);
    background: rgba(245,237,214,0.04);
  }

  .btn-terra-pr {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--terra-light);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 14px 24px;
    border-radius: 4px;
    border: 1px solid rgba(196,90,42,0.3);
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
    text-align: center;
  }
  .btn-terra-pr:hover {
    background: rgba(196,90,42,0.08);
    border-color: rgba(196,90,42,0.5);
  }

  /* ── COMPARISON TABLE ── */
  .pr-compare-wrap {
    padding: 0 48px 80px;
    max-width: 1000px;
    margin: 0 auto;
  }
  @media (max-width: 640px) { .pr-compare-wrap { padding: 0 24px 60px; } }

  .pr-section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 12px;
  }

  .pr-section-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 600;
    color: var(--ivory);
    line-height: 1.1;
    margin-bottom: 40px;
  }
  .pr-section-title em { font-style: italic; color: var(--gold); }

  .pr-table-wrap {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 16px;
    overflow: hidden;
  }

  .pr-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Sora', sans-serif;
  }

  .pr-table thead th {
    padding: 20px 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(245,237,214,0.07);
  }
  .pr-table thead th:first-child { text-align: left; color: var(--soft); }
  .pr-table thead th.col-diy { text-align: center; color: var(--soft); }
  .pr-table thead th.col-ailes {
    text-align: center;
    background: rgba(232,160,32,0.06);
    color: var(--gold-light);
    border-left: 1px solid rgba(232,160,32,0.15);
    border-right: 1px solid rgba(232,160,32,0.15);
  }

  .pr-table tbody tr { border-bottom: 1px solid rgba(245,237,214,0.05); }
  .pr-table tbody tr:last-child { border-bottom: none; }
  .pr-table tbody tr:last-child td { padding-top: 24px; padding-bottom: 24px; border-top: 1px solid rgba(232,160,32,0.2); }

  .pr-table td {
    padding: 16px 24px;
    font-size: 13px;
    vertical-align: middle;
  }
  .pr-table td:first-child { font-weight: 500; color: var(--ivory); }
  .pr-table td.col-diy { text-align: center; color: var(--soft); font-weight: 300; }
  .pr-table td.col-ailes {
    text-align: center;
    background: rgba(232,160,32,0.04);
    border-left: 1px solid rgba(232,160,32,0.12);
    border-right: 1px solid rgba(232,160,32,0.12);
    font-weight: 500;
    color: var(--ivory);
  }
  .pr-table td.col-ailes.highlight { color: var(--gold-light); font-weight: 700; }
  .pr-table td.col-ailes.winner { font-size: 14px; }

  .pr-table-note {
    padding: 16px 24px;
    font-size: 12px;
    color: var(--soft);
    text-align: center;
    border-top: 1px solid rgba(245,237,214,0.06);
    font-weight: 300;
  }

  /* ── SUCCESS STORIES ── */
  .pr-stories-wrap {
    padding: 0 48px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media (max-width: 640px) { .pr-stories-wrap { padding: 0 24px 60px; } }

  .pr-stories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 36px;
  }
  @media (max-width: 900px) { .pr-stories-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .pr-stories-grid { grid-template-columns: 1fr; } }

  .pr-story-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.06);
    border-radius: 12px;
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .pr-story-card:hover {
    border-color: rgba(232,160,32,0.2);
    transform: translateY(-3px);
  }

  .pr-story-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .pr-story-avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(232,160,32,0.25);
    background: var(--navy-light);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    position: relative;
  }

  .pr-story-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ivory);
  }
  .pr-story-prog {
    font-size: 12px;
    color: var(--soft);
    margin-top: 2px;
    font-weight: 300;
  }

  .pr-story-quote {
    font-family: 'Cormorant Garant', serif;
    font-size: 40px;
    color: var(--gold);
    opacity: 0.25;
    line-height: 0.6;
    margin-bottom: 10px;
  }

  .pr-story-text {
    font-size: 13px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--soft);
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pr-story-badge {
    font-size: 11px;
    font-weight: 600;
    color: var(--gold);
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.15);
    padding: 4px 12px;
    border-radius: 100px;
    display: inline-block;
  }

  /* ── FAQ ── */
  .pr-faq-wrap {
    padding: 0 48px 80px;
    max-width: 800px;
    margin: 0 auto;
  }
  @media (max-width: 640px) { .pr-faq-wrap { padding: 0 24px 60px; } }

  .pr-faq-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pr-faq-item {
    background: var(--navy);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(245,237,214,0.06);
  }

  .pr-faq-q {
    padding: 20px 24px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ivory);
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .pr-faq-q-icon {
    font-size: 18px;
    color: var(--gold);
    flex-shrink: 0;
    margin-top: 1px;
    font-family: 'Cormorant Garant', serif;
    font-weight: 400;
    font-style: italic;
  }

  .pr-faq-a {
    padding: 0 24px 20px;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    border-top: 1px solid rgba(245,237,214,0.05);
    padding-top: 16px;
  }

  /* ── FOOTER CTA ── */
  .pr-footer-cta {
    text-align: center;
    padding: 0 48px 100px;
  }
  @media (max-width: 640px) { .pr-footer-cta { padding: 0 24px 80px; } }
  .pr-footer-cta p { font-size: 14px; font-weight: 300; color: var(--soft); margin-bottom: 16px; }
`;

export default function PricingPage() {
  const packages = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      description: "Start your scholarship search today",
      outcome: "🔍 Discover opportunities matching your profile",
      features: [
        "Browse 10,000+ verified scholarships",
        "AI scholarship matching (5 matches)",
        "Basic deadline calendar",
        "University search & comparison",
        "Educational guides & tips",
        "Community access",
      ],
      notIncluded: [
        "Application checklists",
        "AI Copilot essay help",
        "WhatsApp deadline alerts",
        "Profile review",
      ],
      cta: "Start Free",
      href: "/find-scholarships",
      popular: false,
    },
    {
      name: "Premium Access",
      price: "$5",
      period: "month",
      description: "Everything you need to apply successfully",
      outcome: "🎯 10x your chances with guided applications",
      results: "Scholarships · Visa Guide · AI Copilot · WhatsApp Alerts",
      features: [
        "Access to 10,000+ verified scholarships",
        "Visa guidance & document checklist",
        "Unlimited AI scholarship matching",
        "Application checklists for every scholarship",
        "AI Copilot for essay writing & review",
        "WhatsApp deadline alerts",
        "Profile strength analysis",
        "Essay templates & examples",
        "Priority email support",
      ],
      notIncluded: [
        "Expert consultation",
        "Done-for-you applications",
      ],
      cta: "Get Premium — $5/mo",
      href: "/payment/checkout?plan=premium",
      popular: true,
      badge: "Best Value",
    },
    {
      name: "Standard Package",
      price: "$299",
      period: "One-time",
      description: "We handle everything — you get admitted",
      outcome: "🎓 Get admitted with a scholarship",
      results: "Avg: $18,000 scholarship · 85% admission rate · Save 55+ hrs",
      features: [
        "Everything in Premium +",
        "Expert 1-hour consultation",
        "5 University + Scholarship matches",
        "Professional Statement of Purpose (2 revisions)",
        "Complete application review",
        "3–5 Scholarship applications submitted",
        "Document preparation guidance",
        "Visa guidance & document checklist",
        "WhatsApp support until decision",
      ],
      notIncluded: [
        "Unlimited consultations",
        "Visa interview preparation",
      ],
      cta: "Get Started — $299",
      href: "/payment/checkout?plan=standard",
      popular: false,
      guarantee: "💚 50% refund if not admitted to any of 5 universities",
    },
    {
      name: "Premium Mentorship",
      price: "$799",
      period: "One-time",
      description: "Complete concierge with dedicated mentor",
      outcome: "🚀 Full hand-holding: application to landing",
      results: "Avg: $25,000+ scholarship · 92% admission rate · Stress-free",
      features: [
        "Everything in Standard +",
        "Dedicated personal mentor (WhatsApp)",
        "Unlimited 1-on-1 consultations",
        "10 University + Scholarship matches",
        "Unlimited SOP revisions",
        "Test prep resources (IELTS, TOEFL)",
        "Complete visa assistance & interview prep",
        "10+ scholarship applications submitted",
        "Pre-departure orientation",
        "Post-admission support (3 months)",
        "Priority 24/7 support (2-hr response)",
      ],
      notIncluded: [],
      cta: "Get Premium — $799",
      href: "/payment/checkout?plan=mentorship",
      popular: false,
      guarantee: "💚 50% refund if not admitted + lifetime mentorship",
    },
  ];

  const stories = getFeaturedStories();

  const faqs = [
    {
      q: "What exactly am I paying for?",
      a: "You're paying for results: getting admitted to a university with scholarship funding. We handle all applications, write your essays, apply to scholarships, and support you until you receive your acceptance letter. Average outcome: $18,000 scholarship.",
    },
    {
      q: "What if I don't get admitted?",
      a: "We offer a 50% refund guarantee. If you follow our process and don't get admitted to at least 1 of your 5 matched universities within 6 months, we refund 50% — no questions asked.",
    },
    {
      q: "How is this different from doing it myself?",
      a: "DIY takes 60+ hours with a 40% success rate. With us, you invest 5 hours with an 85% success rate. We know which universities accept students like you, which scholarships to target, and how to write winning applications. Our experts have helped 127+ students get admitted.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept credit cards, debit cards, bank transfers, and mobile money (M-Pesa, MTN, Airtel). All transactions are secure and encrypted. Payment plans available for the Premium package.",
    },
    {
      q: "Can I upgrade my package later?",
      a: "Yes — you can upgrade from Free to Standard or Premium at any time. We'll credit any payments you've already made toward your new package.",
    },
  ];

  return (
    <div className="pr-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <section className="pr-hero">
        <div className="pr-hero-bg" />
        <div className="pr-hero-grain" />
        <div className="pr-hero-inner">
          <div className="pr-badge">
            <span className="pr-badge-dot" />
            Studying Abroad Made Easy
          </div>
          <h1 className="pr-title">
            Get admitted with a<br /><em>scholarship.</em>
          </h1>
          <p className="pr-subtitle">
            From application to acceptance, we handle everything. Average scholarship: $18,000.
            Success rate: 85%. Choose the package that fits your goals.
          </p>
 
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <div className="pr-grid-wrap">
        <div className="pr-grid">
          {packages.map((pkg, i) => (
            <div key={i} className={`pr-card${pkg.popular ? " pr-card--popular" : ""}`}>
              {pkg.popular && pkg.badge && (
                <div className="pr-badge-popular">{pkg.badge}</div>
              )}

              <div className="pr-card-name">{pkg.name}</div>

              <div className="pr-price">
                <span className="pr-price-amt">{pkg.price}</span>
                <span className="pr-price-period">/{pkg.period}</span>
              </div>

              <p className="pr-card-desc" style={{ marginTop: 8 }}>{pkg.description}</p>

              {pkg.outcome && <div className="pr-outcome">{pkg.outcome}</div>}
              {pkg.results && <p className="pr-results">{pkg.results}</p>}

              <div className="pr-divider" />

              <ul className="pr-features">
                {pkg.features.map((f, fi) => (
                  <li key={fi} className="pr-feat">
                    <span className="pr-feat-check">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {pkg.notIncluded.map((f, fi) => (
                  <li key={fi} className="pr-feat">
                    <span className="pr-feat-x">✕</span>
                    <span className="pr-feat-text--crossed">{f}</span>
                  </li>
                ))}
              </ul>

              {pkg.guarantee && (
                <div className="pr-guarantee">{pkg.guarantee}</div>
              )}

              <Link
                href={pkg.href}
                className={pkg.popular ? "btn-gold" : "btn-outline-pr"}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMPARISON TABLE ── */}
      <div className="pr-compare-wrap">
        <p className="pr-section-label">The ROI</p>
        <h2 className="pr-section-title">
          Why choose <em>Ailes Global?</em>
        </h2>

        <div className="pr-table-wrap">
          <table className="pr-table">
            <thead>
              <tr>
                <th></th>
                <th className="col-diy">DIY (On Your Own)</th>
                <th className="col-ailes">With Ailes Global</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Time Required", "60+ hours", "✅ 5 hours"],
                ["University Research", "20 hours guessing", "✅ We match by data"],
                ["Scholarship Hunting", "15 hrs, miss deadlines", "✅ We apply for you"],
                ["Essay Writing", "10+ hrs trial & error", "✅ Expert writes it"],
                ["Avoid Mistakes", "❌ Learn from rejections", "✅ Expert review"],
                ["Scholarship Success Rate", "~30%", "78%", true],
                ["Admission Success Rate", "~40%", "85%", true],
                ["Total Investment", "$0 + 60 hours + stress", "$299 + 5 hours", true, true],
              ].map(([label, diy, ailes, highlight, bold], ri) => (
                <tr key={ri}>
                  <td style={bold ? { fontWeight: 700, fontSize: 14 } : {}}>{label as string}</td>
                  <td className="col-diy" style={bold ? { fontWeight: 600 } : {}}>{diy as string}</td>
                  <td className={`col-ailes${highlight ? " highlight" : ""}${bold ? " winner" : ""}`}>
                    {ailes as string}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pr-table-note">
            💡 Your time is valuable. We save you 55+ hours and double your success rate.
          </div>
        </div>
      </div>

      {/* ── SUCCESS STORIES ── */}
      <div className="pr-stories-wrap">
        <p className="pr-section-label">Success Stories</p>
        <h2 className="pr-section-title">
          Real students,<br /><em>real results</em>
        </h2>

        <div className="pr-stories-grid">
          {stories.map((story, i) => (
            <div key={i} className="pr-story-card">
              <div className="pr-story-header">
                <div className="pr-story-avatar">
                  {story.image.startsWith('/') ? (
                    <Image src={story.image} alt={story.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 22 }}>{story.image}</span>
                  )}
                </div>
                <div>
                  <div className="pr-story-name">{story.name}</div>
                  <div className="pr-story-prog">{story.program}</div>
                </div>
              </div>
              <div className="pr-story-quote">&ldquo;</div>
              <p className="pr-story-text">{story.testimonial}</p>
              <span className="pr-story-badge">{story.scholarship}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/success-stories" className="btn-outline-pr" style={{ display: "inline-flex" }}>
            View All Success Stories →
          </Link>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="pr-faq-wrap">
        <p className="pr-section-label">FAQ</p>
        <h2 className="pr-section-title">
          Frequently asked<br /><em>questions</em>
        </h2>

        <div className="pr-faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="pr-faq-item">
              <div className="pr-faq-q">
                <span>{faq.q}</span>
                <span className="pr-faq-q-icon">Q</span>
              </div>
              <div className="pr-faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div className="pr-footer-cta">
        <p>Still have questions? We&apos;re happy to help.</p>
        <Link href="/contact" className="btn-terra-pr" style={{ display: "inline-flex" }}>
          Contact Us
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}