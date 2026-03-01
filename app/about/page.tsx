import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = generateSEO({
  title: "About Us - Empowering African Students",
  description:
    "Learn about Ailes Global's mission to empower African students, especially women, to access world-class education through scholarships and expert guidance.",
  keywords: ["about Ailes Global", "education consulting mission", "African student support", "women empowerment education"],
  canonicalUrl: "/about",
});

/* ─── inline styles (same design system as HomeClient) ─── */
const STYLES = `
  .about-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    overflow-x: hidden;
  }

  /* ── keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1);   }
    50%      { opacity:.5; transform:scale(.8); }
  }

  /* ════════════════════════════════
     HERO
  ════════════════════════════════ */
  .about-hero {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 120px 48px 80px;
  }
  @media(max-width:768px){ .about-hero { padding: 100px 24px 60px; } }

  .about-hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 70% 60% at 80% 30%, rgba(232,160,32,.09), transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(196,90,42,.11), transparent 55%),
      linear-gradient(150deg, #080D1A 0%, #0E1729 55%, #100A03 100%);
  }

  .about-hero-grain {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    opacity: .4;
  }

  /* decorative rings */
  .about-hero-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(232,160,32,.07);
    pointer-events: none; z-index: 1;
  }

  .about-hero-inner {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  @media(max-width:900px){
    .about-hero-inner { grid-template-columns: 1fr; gap: 48px; }
  }

  .about-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,160,32,.10);
    border: 1px solid rgba(232,160,32,.25);
    color: var(--gold-light);
    font-size: 11px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    margin-bottom: 28px;
    animation: fadeUp .7s ease both;
  }
  .about-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease infinite;
  }

  .about-headline {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(40px, 5.5vw, 72px);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -.02em;
    color: var(--ivory);
    animation: fadeUp .7s .1s ease both;
  }
  .about-headline em { font-style: italic; color: var(--gold); }

  .about-quote {
    margin-top: 28px;
    padding: 24px 28px;
    border-left: 2px solid rgba(232,160,32,.35);
    background: rgba(232,160,32,.04);
    border-radius: 0 8px 8px 0;
    animation: fadeUp .7s .2s ease both;
  }
  .about-quote p {
    font-size: 15px; font-weight: 300; line-height: 1.75; color: var(--soft);
  }
  .about-quote-attr {
    margin-top: 14px;
    font-size: 12px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
    color: var(--gold-light);
  }

  .about-hero-ctas {
    margin-top: 40px;
    display: flex; flex-wrap: wrap; gap: 14px;
    animation: fadeUp .7s .3s ease both;
  }

  /* image card */
  .about-hero-visual {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp .7s .15s ease both;
  }
  .about-hero-visual img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(.85) saturate(.9);
    display: block;
  }
  .about-hero-visual-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(8,13,26,.7) 0%, transparent 50%);
  }
  .about-hero-pill {
    position: absolute; top: 20px; right: 20px;
    background: var(--gold); color: var(--midnight);
    font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
  }

  /* ── shared section utils ── */
  .section-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    width: 100%;
  }
  @media(max-width:768px){ .section-wrap { padding: 0 24px; } }

  .s-label {
    font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 14px;
  }

  .s-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(32px, 3.8vw, 52px);
    font-weight: 700; line-height: 1.08; letter-spacing: -.02em;
    color: var(--ivory);
  }
  .s-title em { font-style: italic; color: var(--gold); }

  /* ── divider line ── */
  .divider {
    height: 1px;
    background: rgba(245,237,214,.07);
    margin: 0 48px;
  }
  @media(max-width:768px){ .divider { margin: 0 24px; } }

  /* ════════════════════════════════
     STATS BAR
  ════════════════════════════════ */
  .stats-bar {
    background: var(--navy);
    padding: 60px 48px;
    border-top: 1px solid rgba(245,237,214,.06);
    border-bottom: 1px solid rgba(245,237,214,.06);
  }
  @media(max-width:768px){ .stats-bar { padding: 48px 24px; } }

  .stats-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 0;
  }
  @media(max-width:768px){ .stats-inner { grid-template-columns: repeat(2,1fr); gap: 32px; } }
  @media(max-width:400px){ .stats-inner { grid-template-columns: 1fr 1fr; } }

  .stat-item {
    text-align: center;
    padding: 0 24px;
    border-right: 1px solid rgba(245,237,214,.07);
  }
  .stat-item:last-child { border-right: none; }
  @media(max-width:768px){ .stat-item { border-right: none; } }

  .stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 700; color: var(--ivory); line-height: 1;
  }
  .stat-num span { color: var(--gold); }

  .stat-lbl {
    font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    color: var(--soft); margin-top: 8px;
  }

  /* ════════════════════════════════
     SERVICE BLOCKS
  ════════════════════════════════ */
  .services-section {
    padding: 100px 0;
  }

  .service-block {
    padding: 80px 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media(max-width:900px){
    .service-block { grid-template-columns: 1fr; gap: 40px; padding: 60px 24px; }
    .service-block.flip .sb-visual { order: -1; }
  }
  .service-block.flip .sb-text  { order: 2; }
  .service-block.flip .sb-visual { order: 1; }

  .sb-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 80px; font-weight: 700;
    color: rgba(232,160,32,.07); line-height: 1;
    margin-bottom: -16px;
  }

  .sb-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(26px, 3vw, 38px);
    font-weight: 700; color: var(--ivory);
    line-height: 1.1; margin-bottom: 16px;
  }
  .sb-title em { font-style: italic; color: var(--gold); }

  .sb-body {
    font-size: 15px; font-weight: 300; line-height: 1.75; color: var(--soft);
    margin-bottom: 28px;
  }

  .sb-checks {
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 32px;
  }

  .sb-check {
    display: flex; align-items: center; gap: 12px;
  }

  .sb-check-icon {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    background: rgba(232,160,32,.15);
    border: 1px solid rgba(232,160,32,.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold-light); font-size: 11px;
  }

  .sb-check-label {
    font-size: 14px; font-weight: 400; color: var(--cream);
  }

  /* visual panel */
  .sb-visual {
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background: var(--navy-light);
    min-height: 380px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(245,237,214,.06);
  }

  .sb-visual-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(.8) saturate(.85);
  }

  .sb-visual-tag {
    position: absolute; top: 20px; left: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    background: var(--gold); color: var(--midnight);
    padding: 5px 12px; border-radius: 100px;
  }

  .sb-visual-icon {
    opacity: .12; color: var(--gold);
  }

  /* ════════════════════════════════
     VALUES
  ════════════════════════════════ */
  .values-section {
    background: var(--navy);
    padding: 100px 48px;
    border-top: 1px solid rgba(245,237,214,.06);
  }
  @media(max-width:768px){ .values-section { padding: 72px 24px; } }

  .values-header {
    text-align: center;
    margin-bottom: 64px;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 2px;
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(245,237,214,.04);
    border-radius: 16px;
    overflow: hidden;
  }
  @media(max-width:768px){ .values-grid { grid-template-columns: 1fr; } }

  .value-card {
    background: var(--navy);
    padding: 48px 40px;
    transition: background .25s;
  }
  .value-card:hover { background: var(--navy-light); }

  .value-icon {
    width: 52px; height: 52px;
    background: rgba(232,160,32,.1);
    border: 1px solid rgba(232,160,32,.2);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 24px;
  }

  .value-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px; font-weight: 700; color: var(--ivory);
    margin-bottom: 12px;
  }

  .value-desc {
    font-size: 14px; font-weight: 300; line-height: 1.75; color: var(--soft);
  }

  /* ════════════════════════════════
     CTA
  ════════════════════════════════ */
  .about-cta {
    padding: 120px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  @media(max-width:768px){ .about-cta { padding: 80px 24px; } }

  .about-cta-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,160,32,.07), transparent 70%),
      var(--midnight);
  }

  .about-cta-inner {
    position: relative; z-index: 2;
    max-width: 640px; margin: 0 auto;
  }

  .cta-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 700; line-height: 1.05;
    color: var(--ivory); margin-bottom: 20px;
  }
  .cta-title em { font-style: italic; color: var(--gold); }

  .cta-body {
    font-size: 16px; font-weight: 300; line-height: 1.7;
    color: var(--soft); margin-bottom: 40px;
  }

  .cta-btns {
    display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;
  }

  /* ── shared buttons ── */
  .btn-gold {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 15px 32px; border-radius: 4px;
    text-decoration: none;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .btn-gold:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(232,160,32,.25);
  }

  .btn-outline-cream {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: var(--cream);
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 500;
    padding: 15px 32px; border-radius: 4px;
    border: 1px solid rgba(245,237,214,.2);
    text-decoration: none;
    transition: border-color .2s, background .2s, transform .2s;
  }
  .btn-outline-cream:hover {
    border-color: rgba(245,237,214,.5);
    background: rgba(245,237,214,.05);
    transform: translateY(-2px);
  }

  .btn-outline-gold {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: var(--gold-light);
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 500;
    padding: 12px 24px; border-radius: 4px;
    border: 1px solid rgba(232,160,32,.35);
    text-decoration: none;
    transition: background .2s, transform .2s;
  }
  .btn-outline-gold:hover {
    background: rgba(232,160,32,.08);
    transform: translateY(-2px);
  }
`;

const STATS = [
  { num: "500", suffix: "+", label: "Students Helped" },
  { num: "85",  suffix: "%", label: "Admission Success" },
  { num: "50",  suffix: "+", label: "Partner Universities" },
  { num: "30",  suffix: "+", label: "Countries" },
];

const SERVICES = [
  {
    num: "01",
    tag: "Launched 2024",
    title: <>Study Abroad <em>Consulting</em></>,
    body: "Ailes Global is a comprehensive Study Abroad Platform that helps African students access best-matched higher education opportunities globally. We specialize in scholarships, university matching, and complete application support.",
    checks: ["500+ Students Helped", "85% Admission Success Rate", "$18K Average Scholarship"],
    cta: { label: "View Our Services", href: "/services" },
    visual: "image",
    src: "/scholars.jpg",
    alt: "Study Abroad Success",
    flip: false,
  },
  {
    num: "02",
    tag: "AI-Powered",
    title: <>University & Scholarship <em>Matching</em></>,
    body: "Our advanced AI technology analyzes your academic profile, career goals, and preferences to match you with the best universities and scholarships. Get personalized recommendations in seconds.",
    checks: ["10,000+ Scholarships Database", "50+ Partner Universities", "30+ Countries Worldwide"],
    cta: { label: "Try AI Matcher", href: "/university-matcher" },
    visual: "icon",
    icon: "🎯",
    flip: true,
  },
  {
    num: "03",
    tag: "24/7 Support",
    title: <>AI Scholarship <em>Copilot</em></>,
    body: "Get instant answers about scholarships, visa requirements, and study abroad process. Our AI Copilot is trained on thousands of scholarship applications and success stories to guide you every step of the way.",
    checks: ["24/7 AI-Powered Support", "Personalized Recommendations", "Application Guidance"],
    cta: { label: "Activate AI Copilot", href: "/copilot/activate" },
    visual: "icon",
    icon: "🤖",
    flip: false,
  },
];

const VALUES = [
  { icon: "👥", title: "Student-Centered",  desc: "Every decision we make prioritizes student success and well-being above all else." },
  { icon: "🏆", title: "Excellence",        desc: "We maintain the highest standards in our services, technology, and partnerships." },
  { icon: "🤝", title: "Integrity",         desc: "Transparency, honesty, and ethical practices guide everything we do." },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ══ HERO ══ */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-grain" />
        {/* decorative rings */}
        <div className="about-hero-ring" style={{ width:500, height:500, top:-180, right:-150 }} />
        <div className="about-hero-ring" style={{ width:320, height:320, top:-80, right: -50, opacity:.5 }} />

        <div className="about-hero-inner">
          {/* left */}
          <div>
            <div className="about-badge">
              <span className="about-badge-dot" />
              Our Story
            </div>

            <h1 className="about-headline">
              Building Global<br /><em>Citizens</em> of Tomorrow
            </h1>

            <div className="about-quote">
              <p>
                We&apos;re in the business of talent mobility — enabling the global flow of ambition.
                We help individuals chase life-changing opportunities across borders, and support
                nations in meeting their evolving talent needs. Our mission is to empower the global
                citizens of tomorrow — and we exist to help them thrive, anywhere.
              </p>
              <div className="about-quote-attr">— Founder, Ailes Global</div>
            </div>

            <div className="about-hero-ctas">
              <Link href="/services" className="btn-gold">
                Our Services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/contact" className="btn-outline-cream">
                Get in Touch
              </Link>
            </div>
          </div>

          {/* right — image */}
          <div className="about-hero-visual" style={{ aspectRatio: "4/3" }}>
            <Image
              src="/scholars.jpg"
              alt="Ailes Global students celebrating"
              fill
              style={{ objectFit: "cover", filter: "brightness(.8) saturate(.85)" }}
            />
            <div className="about-hero-visual-overlay" />
            <div className="about-hero-pill">Since 2024</div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">
                {s.num}<span>{s.suffix}</span>
              </div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section className="services-section">
        {SERVICES.map((svc, i) => (
          <div key={i}>
            <div className={`service-block ${svc.flip ? "flip" : ""}`}>
              {/* text */}
              <div className="sb-text">
                <div className="sb-num">{svc.num}</div>
                <div className="s-label">{svc.tag}</div>
                <h2 className="sb-title">{svc.title}</h2>
                <p className="sb-body">{svc.body}</p>
                <div className="sb-checks">
                  {svc.checks.map((c) => (
                    <div className="sb-check" key={c}>
                      <div className="sb-check-icon">✓</div>
                      <span className="sb-check-label">{c}</span>
                    </div>
                  ))}
                </div>
                <Link href={svc.cta.href} className="btn-outline-gold">
                  {svc.cta.label} →
                </Link>
              </div>

              {/* visual */}
              <div className="sb-visual">
                {svc.visual === "image" ? (
                  <>
                    <Image
                      src={svc.src!}
                      alt={svc.alt!}
                      fill
                      style={{ objectFit: "cover", filter: "brightness(.75) saturate(.85)" }}
                    />
                    <div className="sb-visual-tag">{svc.tag}</div>
                  </>
                ) : (
                  <span style={{ fontSize: 120, opacity: .1 }}>{svc.icon}</span>
                )}
              </div>
            </div>

            {i < SERVICES.length - 1 && <div className="divider" />}
          </div>
        ))}
      </section>

      {/* ══ VALUES ══ */}
      <section className="values-section">
        <div className="values-header">
          <div className="s-label" style={{ textAlign:"center" }}>What Drives Us</div>
          <h2 className="s-title" style={{ textAlign:"center" }}>
            Our <em>Values</em>
          </h2>
        </div>

        <div className="values-grid">
          {VALUES.map((v) => (
            <div className="value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="about-cta">
        <div className="about-cta-bg" />
        <div className="about-cta-inner">
          <h2 className="cta-title">
            Ready to start your<br /><em>journey abroad?</em>
          </h2>
          <p className="cta-body">
            Book a free consultation today and take the first step towards your global
            education dream. Expert guidance, zero cost to start.
          </p>
          <div className="cta-btns">
            <Link href="/contact" className="btn-gold">
              Book Free Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/scholarships" className="btn-outline-cream">
              Browse Scholarships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}