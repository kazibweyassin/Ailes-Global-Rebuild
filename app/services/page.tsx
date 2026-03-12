"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Design tokens (same system as HomeClient + AboutPage) ─── */
const STYLES = `
  .svc-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    overflow-x: hidden;
  }

  /* ── keyframes ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100%{ opacity:1; transform:scale(1); }
    50%    { opacity:.5; transform:scale(.8); }
  }
  @keyframes marquee {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }

  /* ════ HERO ════ */
  .svc-hero {
    position:relative;
    padding: 130px 48px 90px;
    overflow:hidden;
    text-align:center;
  }
  @media(max-width:768px){ .svc-hero { padding:100px 24px 72px; } }

  .svc-hero-bg {
    position:absolute; inset:0; z-index:0;
    background:
      radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,160,32,.10), transparent 65%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(196,90,42,.09), transparent 55%),
      linear-gradient(160deg,#080D1A 0%,#0E1729 55%,#100A03 100%);
  }

  .svc-hero-grain {
    position:absolute; inset:0; z-index:1; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    opacity:.4;
  }

  .svc-hero-inner {
    position:relative; z-index:2;
    max-width:760px; margin:0 auto;
  }

  .hero-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(232,160,32,.10);
    border:1px solid rgba(232,160,32,.25);
    color:var(--gold-light);
    font-size:11px; font-weight:600; letter-spacing:.13em; text-transform:uppercase;
    padding:6px 14px; border-radius:100px;
    margin-bottom:28px;
    animation:fadeUp .7s ease both;
  }
  .hero-badge-dot {
    width:6px; height:6px; border-radius:50%;
    background:var(--gold); animation:pulse 2s ease infinite;
  }

  .svc-headline {
    font-family:'Cormorant Garant',serif;
    font-size:clamp(44px,6vw,80px);
    font-weight:700; line-height:1.0; letter-spacing:-.02em;
    color:var(--ivory);
    animation:fadeUp .7s .1s ease both;
  }
  .svc-headline em { font-style:italic; color:var(--gold); }

  .svc-sub {
    margin-top:22px;
    font-size:16px; font-weight:300; line-height:1.75;
    color:var(--soft); max-width:520px; margin-left:auto; margin-right:auto;
    animation:fadeUp .7s .2s ease both;
  }

  .hero-kpis {
    margin-top:44px;
    display:flex; flex-wrap:wrap; gap:0; justify-content:center;
    animation:fadeUp .7s .3s ease both;
  }

  .hero-kpi {
    padding:20px 40px;
    border-right:1px solid rgba(245,237,214,.08);
    text-align:center;
  }
  .hero-kpi:last-child { border-right:none; }
  @media(max-width:600px){ .hero-kpi { border-right:none; padding:14px 24px; } }

  .hero-kpi-num {
    font-family:'Cormorant Garant',serif;
    font-size:32px; font-weight:700; color:var(--gold); line-height:1;
  }
  .hero-kpi-label {
    font-size:11px; font-weight:500; letter-spacing:.09em; text-transform:uppercase;
    color:var(--soft); margin-top:6px;
  }

  .hero-ctas {
    margin-top:40px;
    display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
    animation:fadeUp .7s .4s ease both;
  }

  /* ════ TICKER ════ */
  .ticker {
    background:var(--navy);
    border-top:1px solid rgba(245,237,214,.06);
    border-bottom:1px solid rgba(245,237,214,.06);
    overflow:hidden; padding:14px 0;
  }
  .ticker-inner {
    display:flex; animation:marquee 28s linear infinite;
    width:max-content; white-space:nowrap;
  }
  .ticker-item {
    font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
    color:var(--soft); padding:0 36px;
  }
  .ticker-sep { color:rgba(245,237,214,.2); }

  /* ════ PRICING ════ */
  .pricing-section {
    padding:100px 48px;
    max-width:1200px; margin:0 auto;
  }
  @media(max-width:768px){ .pricing-section { padding:72px 24px; } }

  .pricing-header { text-align:center; margin-bottom:60px; }

  .s-label {
    font-size:11px; font-weight:600; letter-spacing:.16em; text-transform:uppercase;
    color:var(--gold-light); margin-bottom:14px;
  }
  .s-title {
    font-family:'Cormorant Garant',serif;
    font-size:clamp(32px,3.8vw,52px);
    font-weight:700; line-height:1.08; letter-spacing:-.02em;
    color:var(--ivory);
  }
  .s-title em { font-style:italic; color:var(--gold); }

  .pricing-grid {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:2px;
    background:rgba(245,237,214,.04);
    border-radius:20px; overflow:hidden;
  }
  @media(max-width:768px){ .pricing-grid { grid-template-columns:1fr; } }

  .price-card {
    background:var(--navy);
    padding:48px 40px;
    position:relative;
    transition:background .25s;
    display:flex; flex-direction:column;
  }
  .price-card:hover { background:var(--navy-light); }
  .price-card.featured {
    background:var(--navy-light);
    outline:1px solid rgba(232,160,32,.4);
    outline-offset:-1px;
  }

  .price-tag {
    position:absolute; top:24px; right:24px;
    font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    background:var(--gold); color:var(--midnight);
    padding:4px 10px; border-radius:100px;
  }

  .price-tier {
    font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
    color:var(--gold-light); margin-bottom:12px;
  }

  .price-amount {
    font-family:'Cormorant Garant',serif;
    font-size:clamp(40px,4vw,58px); font-weight:700; color:var(--ivory); line-height:1;
  }
  .price-amount span { font-size:22px; font-weight:400; color:var(--soft); }

  .price-tagline {
    font-size:13px; font-weight:300; color:var(--soft); margin-top:8px; margin-bottom:28px;
  }

  .price-divider {
    height:1px; background:rgba(245,237,214,.07); margin-bottom:28px;
  }

  .price-features {
    display:flex; flex-direction:column; gap:12px;
    flex:1;
  }

  .price-feat {
    display:flex; align-items:flex-start; gap:10px;
  }
  .price-feat-icon {
    width:20px; height:20px; border-radius:50%; flex-shrink:0; margin-top:1px;
    background:rgba(232,160,32,.12);
    border:1px solid rgba(232,160,32,.25);
    display:flex; align-items:center; justify-content:center;
    color:var(--gold-light); font-size:10px;
  }
  .price-feat-text { font-size:13px; font-weight:300; color:var(--cream); line-height:1.5; }

  .price-cta {
    margin-top:36px;
  }

  .price-guarantee {
    margin-top:12px;
    font-size:11px; font-weight:500; text-align:center;
    color:var(--soft);
  }

  /* ════ SERVICES GRID ════ */
  .services-section {
    padding:0 48px 100px;
    max-width:1200px; margin:0 auto;
  }
  @media(max-width:768px){ .services-section { padding:0 24px 72px; } }

  .services-header { text-align:center; margin-bottom:60px; }

  .svc-grid {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:2px;
    background:rgba(245,237,214,.04);
    border-radius:20px; overflow:hidden;
  }
  @media(max-width:900px){ .svc-grid { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:580px){ .svc-grid { grid-template-columns:1fr; } }

  .svc-card {
    background:var(--navy);
    padding:44px 36px;
    position:relative;
    cursor:default;
    transition:background .25s;
    display:flex; flex-direction:column;
  }
  .svc-card:hover { background:var(--navy-light); }
  .svc-card:hover .svc-arrow { transform:translateX(5px); opacity:1; }

  .svc-card-num {
    font-family:'Cormorant Garant',serif;
    font-size:72px; font-weight:700;
    color:rgba(232,160,32,.07); line-height:1;
    position:absolute; top:20px; right:24px;
  }

  .svc-icon {
    width:48px; height:48px; border-radius:12px;
    background:rgba(232,160,32,.10);
    border:1px solid rgba(232,160,32,.2);
    display:flex; align-items:center; justify-content:center;
    font-size:20px; margin-bottom:22px;
  }

  .svc-card-title {
    font-family:'Cormorant Garant',serif;
    font-size:22px; font-weight:700; color:var(--ivory); margin-bottom:12px; line-height:1.2;
  }

  .svc-card-desc {
    font-size:14px; font-weight:300; line-height:1.7; color:var(--soft); margin-bottom:24px; flex:1;
  }

  .svc-features {
    display:flex; flex-direction:column; gap:8px; margin-bottom:28px;
  }

  .svc-feat-row {
    display:flex; align-items:flex-start; gap:10px;
  }
  .svc-feat-check {
    font-size:11px; color:var(--gold-light); flex-shrink:0; margin-top:2px;
  }
  .svc-feat-label { font-size:13px; font-weight:300; color:var(--cream); line-height:1.4; }

  .svc-card-link {
    display:inline-flex; align-items:center; gap:8px;
    font-size:13px; font-weight:600; color:var(--gold-light);
    text-decoration:none;
    border-bottom:1px solid rgba(232,160,32,.2);
    padding-bottom:2px;
    transition:color .2s, border-color .2s;
    align-self:flex-start;
  }
  .svc-card-link:hover { color:var(--gold); border-color:var(--gold); }

  .svc-arrow {
    transition:transform .2s, opacity .2s;
    opacity:.7;
  }

  /* ════ CTA ════ */
  .svc-cta {
    background:var(--navy);
    border-top:1px solid rgba(245,237,214,.06);
    padding:120px 48px;
    text-align:center;
    position:relative; overflow:hidden;
  }
  @media(max-width:768px){ .svc-cta { padding:80px 24px; } }

  .svc-cta-glow {
    position:absolute; inset:0;
    background:radial-gradient(ellipse 60% 50% at 50% 100%, rgba(232,160,32,.07), transparent 70%);
    pointer-events:none;
  }

  .svc-cta-inner {
    position:relative; z-index:2;
    max-width:640px; margin:0 auto;
  }

  .cta-headline {
    font-family:'Cormorant Garant',serif;
    font-size:clamp(38px,5vw,64px);
    font-weight:700; line-height:1.05;
    color:var(--ivory); margin-bottom:18px;
  }
  .cta-headline em { font-style:italic; color:var(--gold); }

  .cta-sub {
    font-size:16px; font-weight:300; line-height:1.7; color:var(--soft); margin-bottom:12px;
  }
  .cta-highlight {
    font-family:'Cormorant Garant',serif;
    font-size:24px; font-weight:600; color:var(--gold-light); margin-bottom:40px;
  }

  .cta-btns {
    display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
  }

  /* ── shared buttons ── */
  .btn-gold {
    display:inline-flex; align-items:center; gap:10px;
    background:var(--gold); color:var(--midnight);
    font-family:'Sora',sans-serif; font-size:14px; font-weight:600;
    padding:15px 32px; border-radius:4px; text-decoration:none;
    transition:background .2s, transform .2s, box-shadow .2s;
  }
  .btn-gold:hover { background:var(--gold-light); transform:translateY(-2px); box-shadow:0 12px 32px rgba(232,160,32,.25); }

  .btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    background:transparent; color:var(--cream);
    font-family:'Sora',sans-serif; font-size:14px; font-weight:500;
    padding:15px 32px; border-radius:4px;
    border:1px solid rgba(245,237,214,.2); text-decoration:none;
    transition:border-color .2s, background .2s, transform .2s;
  }
  .btn-outline:hover { border-color:rgba(245,237,214,.5); background:rgba(245,237,214,.05); transform:translateY(-2px); }
`;

/* ─── Data ─── */
const KPIS = [
  { num: "85%",   label: "Admission Rate" },
  { num: "$18K",  label: "Avg Scholarship" },
  { num: "55hrs", label: "Time Saved" },
  { num: "127+",  label: "Students Placed" },
];



const SERVICES = [
  { icon: "🎯", title: "AI University Matching",        desc: "Our AI analyzes your profile, academic background, and goals to match you with the perfect universities worldwide.", features: ["Personalized recommendations", "Program-specific suggestions", "Scholarship availability indicators", "Match score breakdown"],             href: "/university-matcher" },
  { icon: "📄", title: "Application Guidance",          desc: "Expert guidance through every step of the application process, from document preparation to submission deadlines.",  features: ["Application strategy", "Document checklist & review", "Deadline management", "Submission support"],                                          href: "/contact" },
  { icon: "✍️", title: "Statement of Purpose Editing",  desc: "Professional editing and feedback on your SOP to make it stand out to admissions committees.",                     features: ["Expert review & feedback", "Content enhancement", "Grammar & style polish", "Multiple revision rounds"],                                   href: "/contact" },
  { icon: "✈️", title: "Visa Application Assistance",   desc: "Comprehensive support for visa applications including document preparation, interview prep, and follow-up.",         features: ["Visa requirement analysis", "Document preparation guide", "Interview preparation", "Application tracking"],                               href: "/contact" },
  { icon: "🌍", title: "Pre-Departure Orientation",     desc: "Prepare for your journey with comprehensive orientation sessions covering everything you need to know before you go.", features: ["Cultural orientation", "Academic preparation", "Living arrangements", "Health & safety guidance"],                                      href: "/contact" },
  { icon: "📊", title: "Application Status Tracker",    desc: "Real-time tracking of your applications with visual timelines, automated notifications, and document management.",   features: ["Visual progress timeline", "Status updates", "Deadline reminders", "Document management"],                                               href: "/dashboard" },
];

const TICKER_ITEMS = [
  "85% Admission Rate", "500+ Students Helped", "$18K Avg Scholarship",
  "50+ Partner Universities", "30+ Countries", "AI-Powered Matching",
  "24/7 Copilot Support", "50% Refund Guarantee",
];

export default function ServicesPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="svc-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ══ HERO ══ */}
      <section className="svc-hero">
        <div className="svc-hero-bg" />
        <div className="svc-hero-grain" />

        <div className="svc-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Full-Service Study Abroad Platform
          </div>

          <h1 className="svc-headline">
            Get admitted <em>with</em><br />a scholarship
          </h1>

          <p className="svc-sub">
            We handle everything: applications, essays, scholarships, and admissions.
            Expert guidance from first search to final acceptance.
          </p>

          <div className="hero-kpis">
            {KPIS.map((k) => (
              <div className="hero-kpi" key={k.label}>
                <div className="hero-kpi-num">{k.num}</div>
                <div className="hero-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="hero-ctas">
            <Link href="/find-scholarships" className="btn-gold">
              Find My Scholarships Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/institutions" className="btn-outline">
              For Institutions
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ticker" aria-hidden>
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}>
              {item}<span className="ticker-sep"> ✦ </span>
            </span>
          ))}
        </div>
      </div>



      {/* ══ SERVICES ══ */}
      <section className="services-section">
        <div className="services-header">
          <div className="s-label">What's Included</div>
          <h2 className="s-title">Everything you need to get <em>admitted & funded</em></h2>
        </div>

        <div className="svc-grid">
          {SERVICES.map((svc, i) => (
            <div
              className="svc-card"
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="svc-card-num">0{i + 1}</div>
              <div className="svc-icon">{svc.icon}</div>
              <div className="svc-card-title">{svc.title}</div>
              <p className="svc-card-desc">{svc.desc}</p>
              <div className="svc-features">
                {svc.features.map((f) => (
                  <div className="svc-feat-row" key={f}>
                    <span className="svc-feat-check">→</span>
                    <span className="svc-feat-label">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={svc.href} className="svc-card-link">
                Learn More
                <span className="svc-arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="svc-cta">
        <div className="svc-cta-glow" />
        <div className="svc-cta-inner">
          <h2 className="cta-headline">
            Start your <em>journey</em><br />today
          </h2>
          <p className="cta-sub">
            Join 127+ students who got admitted with scholarships.
          </p>
          <div className="cta-btns">
            <Link href="/find-scholarships" className="btn-gold">
              Find My Scholarships Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/institutions" className="btn-outline">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}