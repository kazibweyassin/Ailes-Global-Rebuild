import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Destinations | Ailes Global",
  description: "Explore scholarship and university opportunities across 50+ countries. Ailes Global helps African students find the perfect study destination worldwide.",
};

const COUNTRIES = [
  {
    slug: "united-states",
    flag: "🇺🇸",
    name: "United States",
    universities: "150+",
    scholarships: "200+",
    language: "English",
    tint: "rgba(59,130,246,.14)",
    highlight: "Top research universities, Ivy League & full-funding fellowships",
  },
  {
    slug: "united-kingdom",
    flag: "🇬🇧",
    name: "United Kingdom",
    universities: "80+",
    scholarships: "150+",
    language: "English",
    tint: "rgba(220,38,38,.12)",
    highlight: "Chevening, Commonwealth & 1-year accelerated Masters",
  },
  {
    slug: "canada",
    flag: "🇨🇦",
    name: "Canada",
    universities: "100+",
    scholarships: "180+",
    language: "English / French",
    tint: "rgba(239,68,68,.12)",
    highlight: "Post-study work permit & multicultural campuses",
  },
  {
    slug: "germany",
    flag: "🇩🇪",
    name: "Germany",
    universities: "60+",
    scholarships: "120+",
    language: "German / English",
    tint: "rgba(234,179,8,.1)",
    highlight: "Tuition-free public universities & DAAD scholarships",
  },
  {
    slug: "australia",
    flag: "🇦🇺",
    name: "Australia",
    universities: "50+",
    scholarships: "100+",
    language: "English",
    tint: "rgba(22,163,74,.1)",
    highlight: "Australia Awards & world-class quality of life",
  },
  {
    slug: "netherlands",
    flag: "🇳🇱",
    name: "Netherlands",
    universities: "40+",
    scholarships: "80+",
    language: "Dutch / English",
    tint: "rgba(249,115,22,.12)",
    highlight: "Holland Scholarship & 2,100+ English-taught programmes",
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
  .dp-page { font-family:'Sora',sans-serif; background:#080D1A; color:#C4CFDF; min-height:100vh; overflow-x:hidden; }
  .dp-hero { position:relative; padding:100px 48px 72px; text-align:center; overflow:hidden; }
  @media(max-width:640px){ .dp-hero { padding:80px 24px 56px; } }
  .dp-hero-bg { position:absolute; inset:0; z-index:0; background: radial-gradient(ellipse 60% 50% at 50% -10%,rgba(232,160,32,.08),transparent 60%), #080D1A; }
  .dp-hero-inner { position:relative; z-index:1; max-width:640px; margin:0 auto; }
  .dp-label { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#F5C55A; background:rgba(232,160,32,.1); border:1px solid rgba(232,160,32,.25); padding:5px 14px; border-radius:100px; margin-bottom:24px; }
  .dp-headline { font-family:'Cormorant Garant',serif; font-size:clamp(38px,5.5vw,64px); font-weight:600; line-height:1.05; letter-spacing:-.02em; color:#F5EDD6; margin-bottom:16px; }
  .dp-headline em { font-style:italic; color:#E8A020; }
  .dp-sub { font-size:15px; font-weight:300; color:rgba(196,207,223,.6); line-height:1.7; }
  .dp-body { max-width:1140px; margin:0 auto; padding:0 48px 100px; }
  @media(max-width:760px){ .dp-body { padding:0 24px 72px; } }
  .dp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:960px){ .dp-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:580px){ .dp-grid { grid-template-columns:1fr; } }
  .dp-card { position:relative; background:#0E1729; border:1px solid rgba(245,237,214,.08); border-radius:18px; overflow:hidden; text-decoration:none; color:inherit; display:flex; flex-direction:column; transition:border-color .25s,transform .25s,box-shadow .25s; }
  .dp-card:hover { border-color:rgba(232,160,32,.3); transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,.4); }
  .dp-card-tint { height:110px; width:100%; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
  .dp-card-flag { font-size:52px; line-height:1; position:relative; z-index:1; filter:drop-shadow(0 4px 12px rgba(0,0,0,.4)); }
  .dp-card-body { padding:22px 22px 26px; flex:1; display:flex; flex-direction:column; }
  .dp-card-name { font-family:'Cormorant Garant',serif; font-size:22px; font-weight:600; color:#F5EDD6; margin-bottom:6px; }
  .dp-card-highlight { font-size:12px; font-weight:300; color:rgba(196,207,223,.55); line-height:1.5; margin-bottom:18px; flex:1; }
  .dp-card-stats { display:flex; gap:16px; margin-bottom:18px; }
  .dp-stat { }
  .dp-stat-val { font-family:'Cormorant Garant',serif; font-size:18px; font-weight:600; color:#E8A020; line-height:1; }
  .dp-stat-label { font-size:10px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:rgba(196,207,223,.35); margin-top:2px; }
  .dp-card-cta { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#E8A020; letter-spacing:.04em; transition:gap .2s; }
  .dp-card:hover .dp-card-cta { gap:10px; }
  .dp-cta-section { text-align:center; margin-top:56px; }
  .dp-cta-title { font-family:'Cormorant Garant',serif; font-size:28px; font-weight:600; color:#F5EDD6; margin-bottom:10px; }
  .dp-cta-sub { font-size:14px; font-weight:300; color:rgba(196,207,223,.55); margin-bottom:28px; }
  .dp-cta-btn { display:inline-flex; align-items:center; gap:8px; background:#E8A020; color:#080D1A; border:none; border-radius:10px; padding:13px 28px; font-family:'Sora',sans-serif; font-size:14px; font-weight:600; text-decoration:none; transition:background .2s,box-shadow .2s; }
  .dp-cta-btn:hover { background:#F5C55A; box-shadow:0 8px 24px rgba(232,160,32,.3); }
`;

export default function DestinationsPage() {
  return (
    <div className="dp-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section className="dp-hero">
        <div className="dp-hero-bg" />
        <div className="dp-hero-inner">
          <div className="dp-label">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Study Destinations
          </div>
          <h1 className="dp-headline">Your world,<br /><em>your campus</em></h1>
          <p className="dp-sub">Explore scholarship and university opportunities across our partner destinations. We&apos;ve helped students from 50+ African countries land places in each one.</p>
        </div>
      </section>

      <div className="dp-body">
        <div className="dp-grid">
          {COUNTRIES.map(c => (
            <Link key={c.slug} href={`/destinations/${c.slug}`} className="dp-card">
              <div className="dp-card-tint" style={{ background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${c.tint}, transparent 70%), rgba(14,23,41,.6)` }}>
                <span className="dp-card-flag">{c.flag}</span>
              </div>
              <div className="dp-card-body">
                <p className="dp-card-name">{c.name}</p>
                <p className="dp-card-highlight">{c.highlight}</p>
                <div className="dp-card-stats">
                  <div className="dp-stat">
                    <div className="dp-stat-val">{c.universities}</div>
                    <div className="dp-stat-label">Universities</div>
                  </div>
                  <div className="dp-stat">
                    <div className="dp-stat-val">{c.scholarships}</div>
                    <div className="dp-stat-label">Scholarships</div>
                  </div>
                  <div className="dp-stat">
                    <div className="dp-stat-val">{c.language.split("/")[0].trim()}</div>
                    <div className="dp-stat-label">Language</div>
                  </div>
                </div>
                <div className="dp-card-cta">
                  Explore
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="dp-cta-section">
          <p className="dp-cta-title">Not sure where to study?</p>
          <p className="dp-cta-sub">Our AI matches your profile, budget and goals to the right country and scholarship in minutes.</p>
          <Link href="/scholarships" className="dp-cta-btn">
            Find My Scholarship
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
