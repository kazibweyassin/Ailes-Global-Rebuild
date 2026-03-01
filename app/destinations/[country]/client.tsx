"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CountryPageClient({ country }: { country: string }) {
  const [countryData, setCountryData] = useState<any>(null);

  useEffect(() => {
    const countryName = country.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    
    const data = {
      "United States": {
        flag: "🇺🇸",
        name: "United States",
        universities: "150+",
        scholarships: "200+",
        avgCost: "$30,000 - $60,000/year",
        language: "English",
        description: "The United States offers world-class education with diverse programs and cutting-edge research opportunities.",
      },
      "United Kingdom": {
        flag: "🇬🇧",
        name: "United Kingdom",
        universities: "80+",
        scholarships: "150+",
        avgCost: "£15,000 - £35,000/year",
        language: "English",
        description: "The UK is home to some of the world's oldest and most prestigious universities with rich academic traditions.",
      },
      "Canada": {
        flag: "🇨🇦",
        name: "Canada",
        universities: "100+",
        scholarships: "180+",
        avgCost: "CAD 20,000 - 35,000/year",
        language: "English/French",
        description: "Canada offers high-quality education in a multicultural environment with excellent post-study work opportunities.",
      },
      "Germany": {
        flag: "🇩🇪",
        name: "Germany",
        universities: "60+",
        scholarships: "120+",
        avgCost: "€0 - €20,000/year",
        language: "German/English",
        description: "Germany offers tuition-free or low-cost education at world-renowned universities with strong research focus.",
      },
      "Australia": {
        flag: "🇦🇺",
        name: "Australia",
        universities: "50+",
        scholarships: "100+",
        avgCost: "AUD 25,000 - 45,000/year",
        language: "English",
        description: "Australia combines quality education with an excellent quality of life and diverse cultural experiences.",
      },
      "Netherlands": {
        flag: "🇳🇱",
        name: "Netherlands",
        universities: "40+",
        scholarships: "80+",
        avgCost: "€8,000 - €20,000/year",
        language: "Dutch/English",
        description: "The Netherlands offers innovative, student-centered education with many English-taught programs.",
      },
    };

    setCountryData(data[countryName as keyof typeof data] || {
      flag: "🌍",
      name: countryName,
      universities: "Available",
      scholarships: "Available",
      avgCost: "Varies",
      language: "Varies",
      description: `Explore educational opportunities in ${countryName}.`,
    });
  }, [country]);

  if (!countryData) return null;

  const TINT: Record<string, string> = {
    "United States": "rgba(59,130,246,.15)",
    "United Kingdom": "rgba(220,38,38,.12)",
    "Canada":         "rgba(239,68,68,.12)",
    "Germany":        "rgba(234,179,8,.1)",
    "Australia":      "rgba(22,163,74,.1)",
    "Netherlands":    "rgba(249,115,22,.12)",
  };
  const tint = TINT[countryData.name] || "rgba(232,160,32,.08)";

  return (
    <main style={{ fontFamily:"'Sora',sans-serif", background:"#080D1A", color:"#C4CFDF", minHeight:"100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
        .cd-hero { position:relative; padding:96px 48px 64px; overflow:hidden; }
        @media(max-width:640px){ .cd-hero { padding:80px 24px 48px; } }
        .cd-hero-bg { position:absolute; inset:0; z-index:0; }
        .cd-hero-inner { position:relative; z-index:1; max-width:900px; margin:0 auto; }
        .cd-back { display:inline-flex; align-items:center; gap:7px; font-size:13px; color:rgba(196,207,223,.5); text-decoration:none; margin-bottom:32px; transition:color .2s; }
        .cd-back:hover { color:#E8A020; }
        .cd-flag { font-size:56px; line-height:1; margin-bottom:16px; }
        .cd-headline { font-family:'Cormorant Garant',serif; font-size:clamp(36px,5vw,60px); font-weight:600; line-height:1.05; color:#F5EDD6; margin-bottom:12px; }
        .cd-headline em { font-style:italic; color:#E8A020; }
        .cd-desc { font-size:15px; font-weight:300; color:rgba(196,207,223,.65); line-height:1.7; max-width:600px; }
        .cd-body { max-width:900px; margin:0 auto; padding:0 48px 80px; }
        @media(max-width:640px){ .cd-body { padding:0 24px 60px; } }
        .cd-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
        @media(max-width:760px){ .cd-stats { grid-template-columns:1fr 1fr; } }
        .cd-stat { background:#0E1729; border:1px solid rgba(245,237,214,.08); border-radius:14px; padding:22px 20px; }
        .cd-stat-icon { font-size:22px; margin-bottom:10px; }
        .cd-stat-val { font-family:'Cormorant Garant',serif; font-size:24px; font-weight:600; color:#F5EDD6; margin-bottom:4px; }
        .cd-stat-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(196,207,223,.4); }
        .cd-cta-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:620px){ .cd-cta-grid { grid-template-columns:1fr; } }
        .cd-cta-card { background:#0E1729; border:1px solid rgba(245,237,214,.08); border-radius:14px; padding:28px; }
        .cd-cta-title { font-family:'Cormorant Garant',serif; font-size:22px; font-weight:600; color:#F5EDD6; margin-bottom:8px; }
        .cd-cta-text { font-size:13px; font-weight:300; color:rgba(196,207,223,.6); line-height:1.6; margin-bottom:20px; }
        .cd-btn-gold { display:inline-flex; align-items:center; gap:7px; background:#E8A020; color:#080D1A; border:none; border-radius:9px; padding:11px 22px; font-family:'Sora',sans-serif; font-size:13px; font-weight:600; text-decoration:none; transition:background .2s; }
        .cd-btn-gold:hover { background:#F5C55A; }
        .cd-btn-ghost { display:inline-flex; align-items:center; gap:7px; background:rgba(245,237,214,.04); color:rgba(196,207,223,.7); border:1px solid rgba(245,237,214,.1); border-radius:9px; padding:10px 20px; font-family:'Sora',sans-serif; font-size:13px; font-weight:400; text-decoration:none; transition:border-color .2s,color .2s; }
        .cd-btn-ghost:hover { border-color:rgba(245,237,214,.22); color:#F5EDD6; }
      ` }} />

      {/* Hero */}
      <section className="cd-hero">
        <div className="cd-hero-bg" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${tint}, transparent 65%), #080D1A` }} />
        <div className="cd-hero-inner">
          <Link href="/destinations" className="cd-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Destinations
          </Link>
          <div className="cd-flag">{countryData.flag}</div>
          <h1 className="cd-headline">Study in <em>{countryData.name}</em></h1>
          <p className="cd-desc">{countryData.description}</p>
        </div>
      </section>

      {/* Stats + CTAs */}
      <div className="cd-body">
        <div className="cd-stats">
          {[
            { icon:"🎓", val:countryData.universities, label:"Universities" },
            { icon:"🏆", val:countryData.scholarships, label:"Scholarships" },
            { icon:"💰", val:countryData.avgCost,       label:"Avg. Cost / yr" },
            { icon:"🌐", val:countryData.language,      label:"Language" },
          ].map(({ icon, val, label }) => (
            <div className="cd-stat" key={label}>
              <div className="cd-stat-icon">{icon}</div>
              <div className="cd-stat-val">{val}</div>
              <div className="cd-stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="cd-cta-grid">
          <div className="cd-cta-card">
            <p className="cd-cta-title">Available Scholarships</p>
            <p className="cd-cta-text">Discover scholarship opportunities in {countryData.name} tailored to your profile and background.</p>
            <Link href={`/scholarships?country=${countryData.name}`} className="cd-btn-gold">
              Browse Scholarships
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="cd-cta-card">
            <p className="cd-cta-title">Find Your Perfect Match</p>
            <p className="cd-cta-text">Use our intelligent matching system to find scholarships and universities that fit your profile.</p>
            <Link href="/university-matcher" className="cd-btn-ghost">
              Try University Matcher
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}




































