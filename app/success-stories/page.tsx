import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { getAllStories } from "@/lib/success-stories";
import Link from "next/link";

export const metadata: Metadata = generateSEO({
  title: "Success Stories - Students Who Achieved Their Study Abroad Dreams",
  description:
    "Real success stories from African students who secured scholarships and studied at top universities worldwide. Harvard, Oxford, Cambridge, MIT graduates share their journeys with Ailes Global.",
  keywords: ["scholarship success stories", "student testimonials", "study abroad reviews", "scholarship winners"],
  canonicalUrl: "/success-stories",
});

const STYLES = `
  * { box-sizing: border-box; }

  .ss-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ── HERO ── */
  .ss-hero {
    position: relative;
    padding: 80px 48px 64px;
    overflow: hidden;
    text-align: center;
  }
  @media (max-width: 640px) { .ss-hero { padding: 64px 24px 48px; } }

  .ss-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,160,32,0.09) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 90% 80%, rgba(196,90,42,0.08) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }
  .ss-hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3; z-index: 1;
  }
  .ss-hero-inner {
    position: relative; z-index: 2;
    max-width: 680px; margin: 0 auto;
  }
  .ss-hero-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold-light); margin-bottom: 16px;
  }
  .ss-hero-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(36px, 5.5vw, 72px);
    font-weight: 600; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--ivory);
    margin-bottom: 18px;
  }
  .ss-hero-title em { font-style: italic; color: var(--gold); }
  .ss-hero-sub {
    font-size: 15px; font-weight: 300;
    color: var(--soft); line-height: 1.7; max-width: 540px; margin: 0 auto 36px;
  }

  /* Stats row */
  .ss-stats {
    display: flex; justify-content: center;
    flex-wrap: wrap; gap: 0;
    max-width: 560px; margin: 0 auto;
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(14,23,41,0.6);
    backdrop-filter: blur(12px);
  }
  .ss-stat {
    flex: 1; min-width: 120px;
    padding: 20px 16px;
    text-align: center;
    border-right: 1px solid rgba(245,237,214,0.07);
  }
  .ss-stat:last-child { border-right: none; }
  .ss-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 32px; font-weight: 600;
    color: var(--gold); line-height: 1;
    margin-bottom: 4px;
  }
  .ss-stat-label {
    font-size: 11px; font-weight: 400;
    color: var(--soft); letter-spacing: 0.06em;
  }

  /* ── STORIES GRID ── */
  .ss-grid-wrap {
    max-width: 1200px; margin: 0 auto;
    padding: 64px 48px 100px;
  }
  @media (max-width: 640px) { .ss-grid-wrap { padding: 48px 24px 80px; } }

  .ss-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 960px)  { .ss-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .ss-grid { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .ss-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 14px;
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: border-color 0.3s, transform 0.3s;
  }
  .ss-card:hover {
    border-color: rgba(232,160,32,0.22);
    transform: translateY(-4px);
  }

  .ss-card-top {
    position: relative;
    padding: 28px 28px 0;
    display: flex; align-items: flex-start; gap: 16px;
  }
  .ss-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(232,160,32,0.3);
    flex-shrink: 0;
    background: var(--navy-light);
  }
  .ss-avatar-emoji {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(232,160,32,0.1);
    border: 2px solid rgba(232,160,32,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; flex-shrink: 0;
  }
  .ss-card-head { flex: 1; padding-top: 4px; }
  .ss-card-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px; font-weight: 600; color: var(--ivory);
    line-height: 1.2; margin-bottom: 2px;
  }
  .ss-card-country {
    font-size: 12px; font-weight: 300; color: var(--soft);
    display: flex; align-items: center; gap: 5px;
  }

  .ss-stars {
    position: absolute; top: 28px; right: 28px;
    color: var(--gold); font-size: 12px; letter-spacing: 1px;
  }

  .ss-card-body {
    padding: 20px 28px 0;
    display: flex; flex-direction: column; gap: 10px;
  }

  .ss-card-uni {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 500; color: var(--ivory);
  }
  .ss-card-uni-icon { color: var(--gold); flex-shrink: 0; }
  .ss-card-program {
    font-size: 12px; font-weight: 300; color: var(--soft);
    padding-left: 22px;
  }

  .ss-card-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 100px;
    padding: 5px 12px;
    font-size: 11px; font-weight: 600;
    color: var(--gold-light);
    align-self: flex-start;
    letter-spacing: 0.04em;
  }

  .ss-quote {
    background: rgba(245,237,214,0.03);
    border-left: 2px solid rgba(232,160,32,0.3);
    border-radius: 0 6px 6px 0;
    padding: 12px 14px;
    font-size: 12px; font-weight: 300;
    color: var(--soft); line-height: 1.65;
    font-style: italic;
    margin-bottom: 20px;
  }
  .ss-quote::before { content: '\\201C'; color: var(--gold); font-size: 20px; line-height: 0; vertical-align: -6px; margin-right: 3px; }

  /* Stats mini row */
  .ss-card-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgba(245,237,214,0.05);
    margin-top: auto;
  }
  .ss-card-stat {
    padding: 14px 12px;
    text-align: center;
    border-right: 1px solid rgba(245,237,214,0.05);
  }
  .ss-card-stat:last-child { border-right: none; }
  .ss-card-stat-val {
    font-size: 13px; font-weight: 600; color: var(--ivory);
    margin-bottom: 2px;
  }
  .ss-card-stat-key {
    font-size: 10px; font-weight: 300; color: var(--soft);
    opacity: 0.7; letter-spacing: 0.06em;
  }

  /* ── CTA ── */
  .ss-cta {
    background: var(--navy);
    border-top: 1px solid rgba(245,237,214,0.06);
    padding: 80px 48px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  @media (max-width: 640px) { .ss-cta { padding: 60px 24px; } }
  .ss-cta-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(232,160,32,0.07) 0%, transparent 65%), var(--navy);
  }
  .ss-cta-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
  .ss-cta-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 600; line-height: 1.1;
    color: var(--ivory); margin-bottom: 16px;
  }
  .ss-cta-title em { font-style: italic; color: var(--gold); }
  .ss-cta-sub {
    font-size: 15px; font-weight: 300;
    color: var(--soft); line-height: 1.7; margin-bottom: 36px;
  }
  .ss-cta-btns {
    display: flex; justify-content: center;
    flex-wrap: wrap; gap: 12px;
  }
  .ss-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
    padding: 16px 32px; border-radius: 6px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s;
  }
  .ss-btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
  .ss-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--cream);
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500;
    padding: 14px 28px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.2);
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .ss-btn-ghost:hover { border-color: rgba(245,237,214,0.45); background: rgba(245,237,214,0.04); transform: translateY(-2px); }
`;

export default function SuccessStoriesPage() {
  const stories = getAllStories();

  return (
    <div className="ss-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <section className="ss-hero">
        <div className="ss-hero-bg" />
        <div className="ss-hero-grain" />
        <div className="ss-hero-inner">
          <p className="ss-hero-label">Real Results</p>
          <h1 className="ss-hero-title">
            Students who <em>made it</em>
          </h1>
          <p className="ss-hero-sub">
            These are real African students who found scholarships, cleared admissions,
            and are now studying at world-class universities. Your story is next.
          </p>

          <div className="ss-stats">
            {[
              { num: "1,247+", label: "Students Placed" },
              { num: "50+",    label: "Countries" },
              { num: "4.9★",   label: "Avg. Rating" },
              { num: "98%",    label: "Visa Success" },
            ].map(s => (
              <div key={s.label} className="ss-stat">
                <div className="ss-stat-num">{s.num}</div>
                <div className="ss-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES GRID ── */}
      <div className="ss-grid-wrap">
        <div className="ss-grid">
          {stories.map((story, i) => {
            const isEmoji = story.image.startsWith("👩") || story.image.startsWith("👨");
            return (
              <div key={i} className="ss-card">
                <div className="ss-card-top">
                  {isEmoji ? (
                    <div className="ss-avatar-emoji">{story.image}</div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.image} alt={story.name} className="ss-avatar" />
                  )}
                  <div className="ss-card-head">
                    <div className="ss-card-name">{story.name}</div>
                    <div className="ss-card-country">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                      {story.country}
                    </div>
                  </div>
                  <div className="ss-stars">★★★★★</div>
                </div>

                <div className="ss-card-body">
                  {story.university ? (
                    <div>
                      <div className="ss-card-uni">
                        <svg className="ss-card-uni-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                        {story.university}
                      </div>
                      <div className="ss-card-program">{story.program}</div>
                    </div>
                  ) : (
                    <div className="ss-card-uni">
                      <svg className="ss-card-uni-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                      {story.program}
                    </div>
                  )}

                  <div className="ss-card-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {story.scholarship}
                  </div>

                  <div className="ss-quote">{story.testimonial}</div>
                </div>

                {story.stats && (
                  <div className="ss-card-stats">
                    <div className="ss-card-stat">
                      <div className="ss-card-stat-val">{story.stats.gpa || "—"}</div>
                      <div className="ss-card-stat-key">GPA</div>
                    </div>
                    <div className="ss-card-stat">
                      <div className="ss-card-stat-val">{story.stats.testScore || "—"}</div>
                      <div className="ss-card-stat-key">Test</div>
                    </div>
                    <div className="ss-card-stat">
                      <div className="ss-card-stat-val">{story.stats.duration || "—"}</div>
                      <div className="ss-card-stat-key">Duration</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="ss-cta">
        <div className="ss-cta-bg" />
        <div className="ss-cta-inner">
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: "16px" }}>
            Your Turn
          </p>
          <h2 className="ss-cta-title">
            Ready to write your <em>success story?</em>
          </h2>
          <p className="ss-cta-sub">
            Join 1,247+ students who found scholarships, got accepted, and are now
            studying across 50+ countries worldwide.
          </p>
          <div className="ss-cta-btns">
            <Link href="/scholarships" className="ss-btn-primary">Find Scholarships</Link>
            <Link href="/contact" className="ss-btn-ghost">Book Free Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}





