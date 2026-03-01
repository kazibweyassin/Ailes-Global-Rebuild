import StudentIntakeForm from '@/components/student-intake-form';

const STYLES = `
  .si-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ── HERO ── */
  .si-hero {
    position: relative;
    padding: 96px 48px 64px;
    text-align: center;
    overflow: hidden;
  }
  @media (max-width: 640px) { .si-hero { padding: 72px 24px 48px; } }

  .si-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 15% 80%, rgba(196,90,42,0.07) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }

  .si-hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3; z-index: 1;
  }

  /* Decorative concentric rings top-right */
  .si-hero-deco {
    position: absolute;
    top: -100px; right: -100px;
    width: 480px; height: 480px;
    border-radius: 50%;
    border: 1px solid rgba(232,160,32,0.06);
    z-index: 1; pointer-events: none;
  }
  .si-hero-deco::after {
    content: '';
    position: absolute; inset: 48px;
    border-radius: 50%;
    border: 1px solid rgba(232,160,32,0.04);
  }

  .si-hero-inner {
    position: relative; z-index: 2;
    max-width: 680px; margin: 0 auto;
  }

  .si-hero-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 16px;
  }

  .si-hero-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 600; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--ivory);
    margin-bottom: 18px;
  }
  .si-hero-title em { font-style: italic; color: var(--gold); }

  .si-hero-sub {
    font-size: 15px; font-weight: 300;
    line-height: 1.75; color: var(--soft);
    max-width: 520px; margin: 0 auto;
  }

  /* ── FORM WRAPPER ── */
  .si-form-wrap {
    max-width: 880px; margin: 0 auto;
    padding: 0 48px 80px;
  }
  @media (max-width: 640px) { .si-form-wrap { padding: 0 24px 60px; } }

  /* ── FOOTER NOTE ── */
  .si-footer-note {
    text-align: center;
    padding: 0 48px 64px;
    font-size: 12px; font-weight: 300;
    color: var(--soft); opacity: 0.5;
    letter-spacing: 0.03em;
    max-width: 480px; margin: 0 auto;
    line-height: 1.6;
  }
  @media (max-width: 640px) { .si-footer-note { padding: 0 24px 48px; } }
`;

export default function StudentIntakePage() {
  return (
    <div className="si-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <div className="si-hero">
        <div className="si-hero-bg" />
        <div className="si-hero-grain" />
        <div className="si-hero-deco" />
        <div className="si-hero-inner">
          <p className="si-hero-label">Get Started</p>
          <h1 className="si-hero-title">
            Your path to a<br /><em>scholarship abroad</em><br />starts here
          </h1>
          <p className="si-hero-sub">
            Complete this form so we can understand your background and goals.
            We'll use it to match you with the best scholarship opportunities and
            provide personalised guidance.
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="si-form-wrap">
        <StudentIntakeForm />
      </div>

      {/* ── FOOTER NOTE ── */}
      <p className="si-footer-note">
        All information provided is kept confidential and used solely for
        educational consultation purposes.
      </p>
    </div>
  );
}