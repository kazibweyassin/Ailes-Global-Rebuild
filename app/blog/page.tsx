import Link from "next/link";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import EmailCapturePopup from "@/components/email-capture-popup";

export const metadata: Metadata = generateSEO({
  title: "Study Abroad Blog & Resources - Scholarship Tips & University Guides",
  description: "Expert advice on scholarships, university applications, test prep, visa processes, and study abroad success. Free resources and guides for international students.",
  keywords: ["study abroad blog", "scholarship tips", "application guides", "IELTS prep", "visa guidance"],
  canonicalUrl: "/blog",
});

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
  .blog-page { font-family:'Sora',sans-serif; background:var(--midnight); color:var(--cream); min-height:100vh; overflow-x:hidden; }
  .blog-hero { position:relative; padding:100px 48px 72px; text-align:center; overflow:hidden; }
  @media(max-width:640px){ .blog-hero { padding:80px 24px 56px; } }
  .blog-hero-bg { position:absolute; inset:0; z-index:0; background: radial-gradient(ellipse 60% 50% at 50% -10%,rgba(232,160,32,.08),transparent 60%), var(--midnight); }
  .blog-hero-inner { position:relative; z-index:1; max-width:680px; margin:0 auto; }
  .blog-label { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-light); background:rgba(232,160,32,.1); border:1px solid rgba(232,160,32,.25); padding:5px 14px; border-radius:100px; margin-bottom:24px; }
  .blog-headline { font-family:'Cormorant Garant',serif; font-size:clamp(36px,5vw,60px); font-weight:600; line-height:1.05; letter-spacing:-.02em; color:var(--ivory); margin-bottom:16px; }
  .blog-headline em { font-style:italic; color:var(--gold); }
  .blog-sub { font-size:15px; font-weight:300; color:var(--soft); line-height:1.7; max-width:520px; margin:0 auto; }
  .blog-cats { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding:0 48px 48px; max-width:1200px; margin:0 auto; }
  @media(max-width:640px){ .blog-cats { padding:0 24px 36px; } }
  .blog-cat { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:500; color:rgba(196,207,223,.7); background:rgba(245,237,214,.04); border:1px solid rgba(245,237,214,.09); border-radius:100px; padding:6px 16px; text-decoration:none; transition:color .2s,border-color .2s,background .2s; white-space:nowrap; cursor:pointer; }
  .blog-cat:hover,.blog-cat.active { color:var(--gold); border-color:rgba(232,160,32,.35); background:rgba(232,160,32,.07); }
  .blog-inner { max-width:1200px; margin:0 auto; padding:0 48px 100px; }
  @media(max-width:640px){ .blog-inner { padding:0 24px 72px; } }
  .blog-featured-label { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; display:flex; align-items:center; gap:8px; }
  .blog-featured-label::before,.blog-featured-label::after { content:''; flex:1; height:1px; background:rgba(232,160,32,.15); }
  .blog-featured { display:grid; grid-template-columns:1fr 1fr; background:var(--navy); border:1px solid rgba(245,237,214,.08); border-radius:16px; overflow:hidden; margin-bottom:56px; text-decoration:none; color:inherit; transition:border-color .3s,transform .3s; }
  .blog-featured:hover { border-color:rgba(232,160,32,.3); transform:translateY(-3px); }
  @media(max-width:768px){ .blog-featured { grid-template-columns:1fr; } }
  .blog-featured-visual { position:relative; background:linear-gradient(135deg,rgba(232,160,32,.15),rgba(196,90,42,.12) 50%,rgba(14,23,41,.9)); min-height:260px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .blog-featured-cat-badge { position:absolute; top:20px; left:20px; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; background:var(--gold); color:var(--midnight); padding:4px 12px; border-radius:100px; }
  .blog-featured-body { padding:40px; display:flex; flex-direction:column; justify-content:center; gap:16px; }
  .blog-feat-meta { display:flex; gap:14px; align-items:center; font-size:11px; font-weight:500; color:var(--soft); opacity:.6; }
  .blog-feat-meta span { display:flex; align-items:center; gap:4px; }
  .blog-feat-title { font-family:'Cormorant Garant',serif; font-size:clamp(20px,2.5vw,28px); font-weight:600; line-height:1.2; color:var(--ivory); }
  .blog-feat-excerpt { font-size:13px; font-weight:300; color:var(--soft); line-height:1.7; opacity:.8; }
  .blog-feat-cta { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--gold); margin-top:4px; }
  .blog-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:900px){ .blog-grid { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:560px){ .blog-grid { grid-template-columns:1fr; } }
  .blog-card { background:var(--navy); border:1px solid rgba(245,237,214,.07); border-radius:14px; overflow:hidden; text-decoration:none; color:inherit; display:flex; flex-direction:column; transition:border-color .3s,transform .3s; }
  .blog-card:hover { border-color:rgba(232,160,32,.25); transform:translateY(-3px); }
  .blog-card-top { padding:24px 24px 0; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .blog-card-cat { font-size:9px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:4px 10px; border-radius:100px; }
  .cat-Scholarships { background:rgba(232,160,32,.12); color:var(--gold); border:1px solid rgba(232,160,32,.2); }
  .cat-Study-Abroad  { background:rgba(34,197,94,.08);  color:#86efac; border:1px solid rgba(34,197,94,.15); }
  .cat-Visa          { background:rgba(99,102,241,.1);  color:#a5b4fc; border:1px solid rgba(99,102,241,.2); }
  .cat-Application   { background:rgba(196,90,42,.1);   color:#fdba74; border:1px solid rgba(196,90,42,.2); }
  .cat-Tests         { background:rgba(236,72,153,.08); color:#f9a8d4; border:1px solid rgba(236,72,153,.15); }
  .cat-Finance       { background:rgba(14,165,233,.08); color:#7dd3fc; border:1px solid rgba(14,165,233,.15); }
  .blog-card-read { font-size:11px; color:rgba(196,207,223,.35); font-weight:300; }
  .blog-card-title { font-family:'Cormorant Garant',serif; font-size:18px; font-weight:600; line-height:1.3; color:var(--ivory); padding:0 24px; margin-bottom:10px; }
  .blog-card-excerpt { font-size:12px; font-weight:300; color:var(--soft); line-height:1.65; padding:0 24px; opacity:.7; margin-bottom:20px; flex:1; }
  .blog-card-footer { padding:16px 24px; border-top:1px solid rgba(245,237,214,.06); display:flex; align-items:center; justify-content:space-between; }
  .blog-card-date { font-size:11px; color:rgba(196,207,223,.4); font-weight:300; }
  .blog-card-arrow { font-size:11px; font-weight:600; color:var(--gold); display:flex; align-items:center; gap:4px; opacity:0; transform:translateX(-4px); transition:opacity .2s,transform .2s; }
  .blog-card:hover .blog-card-arrow { opacity:1; transform:translateX(0); }
`;

const ARTICLES = [
  { id:"top-20-scholarships-2026", title:"Top 20 Fully-Funded Scholarships for African Students in 2026", excerpt:"Discover the best fully-funded scholarship opportunities for African students in 2026. Complete list with amounts from $50K to $100K+, deadlines, and application requirements.", category:"Scholarships", date:"Feb 14, 2026", readTime:"12 min", slug:"top-20-scholarships-2026" },
  { id:"commonwealth-scholarship-guide", title:"Commonwealth Scholarship 2026: Complete Application Guide", excerpt:"Everything you need to know about Commonwealth Scholarships for African students. Eligibility, deadlines, amounts, and expert application tips.", category:"Scholarships", date:"Feb 9, 2026", readTime:"15 min", slug:"commonwealth-scholarship-guide" },
  { id:"chevening-scholarship-guide", title:"Chevening Scholarship 2026: How to Win the UK's Most Prestigious Award", excerpt:"Master the Chevening application with our complete guide covering the 4 essays, deadlines, and insider tips from alumni.", category:"Scholarships", date:"Feb 4, 2026", readTime:"18 min", slug:"chevening-scholarship-guide" },
  { id:"study-germany-free-guide", title:"Study in Germany for FREE: Complete Guide 2026", excerpt:"How to study at world-class German universities without paying tuition fees. Living costs, visa process, and top universities.", category:"Study Abroad", date:"Jan 28, 2026", readTime:"16 min", slug:"study-germany-free-guide" },
  { id:"mastercard-foundation-scholarship-guide", title:"Mastercard Foundation Scholars Program 2026: Complete Guide", excerpt:"Join 35,000+ scholars transforming Africa. Learn about partner universities, application process, and what makes this program unique.", category:"Scholarships", date:"Jan 22, 2026", readTime:"17 min", slug:"mastercard-foundation-scholarship-guide" },
  { id:"study-in-canada", title:"How to Study in Canada: Complete Guide for African Students", excerpt:"Everything you need to know about studying in Canada, from application requirements to visa processes and living costs.", category:"Study Abroad", date:"Jan 15, 2026", readTime:"8 min", slug:"study-in-canada" },
  { id:"germany-visa-guide", title:"Visa Requirements for Germany: Step-by-Step Guide", excerpt:"Navigate the German student visa process with our detailed guide covering documents, timelines, and interview tips.", category:"Visa", date:"Jan 5, 2026", readTime:"10 min", slug:"germany-visa-guide" },
  { id:"write-perfect-sop", title:"How to Write a Perfect Statement of Purpose (SOP)", excerpt:"Master the art of writing a compelling SOP that stands out to admissions committees. Includes examples and templates.", category:"Application", date:"Dec 28, 2025", readTime:"15 min", slug:"write-perfect-sop" },
  { id:"ielts-vs-toefl", title:"Understanding IELTS vs TOEFL: Which Test Should You Take?", excerpt:"Compare IELTS and TOEFL to determine which English proficiency test is right for your study abroad goals.", category:"Tests", date:"Dec 20, 2025", readTime:"7 min", slug:"ielts-vs-toefl" },
  { id:"cost-of-living-comparison", title:"Cost of Living: Studying in the US vs UK vs Canada", excerpt:"Compare living costs across top study destinations to help you plan your budget and choose the right country.", category:"Finance", date:"Dec 15, 2025", readTime:"9 min", slug:"cost-of-living-comparison" },
];

const CATEGORIES = ["Scholarships", "Study Abroad", "Visa", "Application", "Tests", "Finance"];

export default function BlogPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <div className="blog-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <section className="blog-hero">
        <div className="blog-hero-bg" />
        <div className="blog-hero-inner">
          <div className="blog-label">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Resources &amp; Blog
          </div>
          <h1 className="blog-headline">Guides that get<br /><em>African students</em> abroad</h1>
          <p className="blog-sub">Expert advice on scholarships, applications, visas, and everything in between â€” written for students from the African continent.</p>
        </div>
      </section>
      <div className="blog-cats">
        <span className="blog-cat active">All</span>
        {CATEGORIES.map(cat => (
          <Link key={cat} href={`/blog?category=${cat.toLowerCase().replace(/ /g,"-")}`} className="blog-cat">{cat}</Link>
        ))}
      </div>
      <div className="blog-inner">
        <div className="blog-featured-label">Featured Article</div>
        <Link href={`/blog/${featured.slug}`} className="blog-featured">
          <div className="blog-featured-visual">
            <span className="blog-featured-cat-badge">{featured.category}</span>
          </div>
          <div className="blog-featured-body">
            <div className="blog-feat-meta">
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{featured.date}</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{featured.readTime} read</span>
            </div>
            <h2 className="blog-feat-title">{featured.title}</h2>
            <p className="blog-feat-excerpt">{featured.excerpt}</p>
            <span className="blog-feat-cta">Read article <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
          </div>
        </Link>
        <div className="blog-grid">
          {rest.map(article => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="blog-card">
              <div className="blog-card-top">
                <span className={`blog-card-cat cat-${article.category.replace(/ /g,"-")}`}>{article.category}</span>
                <span className="blog-card-read">{article.readTime} read</span>
              </div>
              <h3 className="blog-card-title">{article.title}</h3>
              <p className="blog-card-excerpt">{article.excerpt}</p>
              <div className="blog-card-footer">
                <span className="blog-card-date">{article.date}</span>
                <span className="blog-card-arrow">Read <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <EmailCapturePopup />
    </div>
  );
}
