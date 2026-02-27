import Link from "next/link";
import Image from "next/image";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,600;0,700;1,600&family=Sora:wght@300;400;500;600&display=swap');

  .ag-footer {
    font-family: 'Sora', sans-serif;
    background: #060B16;
    border-top: 1px solid rgba(245,237,214,.06);
    color: #C4CFDF;
  }

  /* ── top band ── */
  .ag-footer-top {
    padding: 72px 64px 60px;
    display: grid;
    grid-template-columns: 1.6fr repeat(5, 1fr);
    gap: 48px;
    max-width: 1280px;
    margin: 0 auto;
  }
  @media(max-width:1100px){
    .ag-footer-top { grid-template-columns: 1fr 1fr 1fr; gap: 36px; padding: 60px 40px; }
    .ag-footer-brand { grid-column: 1 / -1; max-width: 420px; }
  }
  @media(max-width:640px){
    .ag-footer-top { grid-template-columns: 1fr 1fr; padding: 48px 24px; gap: 28px; }
    .ag-footer-brand { grid-column: 1 / -1; }
  }

  /* brand column */
  .ag-footer-brand {}

  .ag-footer-logo {
    display: block;
    margin-bottom: 18px;
    filter: brightness(0) invert(1);
    opacity: .9;
  }

  .ag-footer-tagline {
    font-size: 13px; font-weight: 300; line-height: 1.7;
    color: #8A97AA;
    margin-bottom: 24px;
    max-width: 260px;
  }

  /* contact items */
  .ag-footer-contacts {
    display: flex; flex-direction: column; gap: 10px;
  }

  .ag-footer-contact-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #C4CFDF; text-decoration: none;
    transition: color .2s;
  }
  .ag-footer-contact-row:hover { color: #F5C55A; }

  .ag-contact-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(232,160,32,.10);
    border: 1px solid rgba(232,160,32,.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }

  /* nav columns */
  .ag-footer-col h4 {
    font-family: 'Sora', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: #F5C55A;
    margin-bottom: 18px;
  }

  .ag-footer-col ul {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 10px;
  }

  .ag-footer-col ul li a {
    font-size: 13px; font-weight: 300; color: #8A97AA;
    text-decoration: none;
    transition: color .2s, padding-left .2s;
    display: inline-block;
  }
  .ag-footer-col ul li a:hover {
    color: #F5EDD6;
    padding-left: 4px;
  }

  /* ── divider ── */
  .ag-footer-divider {
    height: 1px;
    background: rgba(245,237,214,.06);
    margin: 0 64px;
  }
  @media(max-width:768px){ .ag-footer-divider { margin: 0 24px; } }

  /* ── bottom band ── */
  .ag-footer-bottom {
    padding: 28px 64px;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  @media(max-width:768px){ .ag-footer-bottom { padding: 24px; flex-direction: column; align-items: flex-start; gap: 20px; } }

  .ag-footer-copy {
    font-size: 12px; color: #4E5C72;
  }
  .ag-footer-copy span { color: #8A97AA; }

  /* social icons */
  .ag-footer-socials {
    display: flex; gap: 10px;
  }

  .ag-social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(245,237,214,.04);
    border: 1px solid rgba(245,237,214,.08);
    display: flex; align-items: center; justify-content: center;
    color: #8A97AA; font-size: 14px;
    text-decoration: none;
    transition: background .2s, border-color .2s, color .2s, transform .15s;
  }
  .ag-social-btn:hover {
    background: rgba(232,160,32,.1);
    border-color: rgba(232,160,32,.3);
    color: #F5C55A;
    transform: translateY(-2px);
  }

  /* legal links */
  .ag-footer-legal {
    display: flex; gap: 20px; flex-wrap: wrap;
  }
  .ag-footer-legal a {
    font-size: 12px; color: #4E5C72; text-decoration: none;
    transition: color .2s;
  }
  .ag-footer-legal a:hover { color: #C4CFDF; }

  /* gold accent line at very top */
  .ag-footer-accent {
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(232,160,32,.5) 30%, rgba(232,160,32,.5) 70%, transparent);
  }
`;

const NAV_COLS = [
  {
    title: "Offerings",
    links: [
      { label: "AI University Finder",       href: "/university-matcher" },
      { label: "Study Abroad Consulting",    href: "/pricing" },
      { label: "Scholarship Hub",            href: "/find-scholarships" },
      { label: "Visa & Immigration Support", href: "/services" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Study in UK",          href: "/destinations/uk" },
      { label: "Study in USA",         href: "/destinations/usa" },
      { label: "Study in Canada",      href: "/destinations/canada" },
      { label: "Study in Germany",     href: "/destinations/germany" },
      { label: "Study in Australia",   href: "/destinations/australia" },
      { label: "Study in Ireland",     href: "/destinations/ireland" },
      { label: "Study in France",      href: "/destinations/france" },
      { label: "Study in New Zealand", href: "/destinations/new-zealand" },
    ],
  },
  {
    title: "Test Prep",
    links: [
      { label: "IELTS",  href: "/blog" },
      { label: "TOEFL",  href: "/blog" },
      { label: "GRE",    href: "/blog" },
      { label: "GMAT",   href: "/blog" },
      { label: "SAT",    href: "/blog" },
      { label: "PTE",    href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",       href: "/about" },
      { label: "Success Stories",href: "/success-stories" },
      { label: "Work with Us",   href: "/contact" },
      { label: "For Universities",href: "/sponsor" },
      { label: "Blog",           href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Statement of Purpose", href: "/blog" },
      { label: "Letter of Recommendation", href: "/blog" },
      { label: "Privacy Policy",  href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy",   href: "/refund-policy" },
    ],
  },
];

const SOCIALS = [
  { icon: "f", label: "Facebook",  href: "#" },
  { icon: "𝕏", label: "Twitter",   href: "#" },
  { icon: "in", label: "Instagram", href: "#" },
  { icon: "li", label: "LinkedIn",  href: "#" },
];

const LEGAL = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms",            href: "/terms" },
  { label: "Refund Policy",    href: "/refund-policy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ag-footer">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* gold accent top line */}
      <div className="ag-footer-accent" />

      {/* ── main grid ── */}
      <div className="ag-footer-top">

        {/* Brand column */}
        <div className="ag-footer-brand">
          <Link href="/" className="ag-footer-logo" style={{ display:"inline-block" }}>
            <Image
              src="/Logo.png"
              alt="Ailes Global"
              width={120}
              height={32}
              style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)", opacity: .9 }}
            />
          </Link>

          <p className="ag-footer-tagline">
            Africa's #1 scholarship-first platform. Empowering African students —
            especially women — to access world-class education globally.
          </p>

          <div className="ag-footer-contacts">
            <a href="mailto:info@ailesglobal.com" className="ag-footer-contact-row">
              <span className="ag-contact-icon">✉</span>
              info@ailesglobal.com
            </a>
            <a href="tel:+256786367460" className="ag-footer-contact-row">
              <span className="ag-contact-icon">✆</span>
              +256 786 367 460
            </a>
            <a
              href="https://www.vizzarjobs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ag-footer-contact-row"
            >
              <span className="ag-contact-icon">↗</span>
              VizzarJobs — Visa-Sponsored Jobs
            </a>
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLS.map((col) => (
          <div className="ag-footer-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("http") ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ) : (
                    <Link href={l.href}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div className="ag-footer-divider" />

      {/* ── bottom bar ── */}
      <div className="ag-footer-bottom">
        <p className="ag-footer-copy">
          © {year} Ailes Global.{" "}
          <span>All rights reserved.</span>
        </p>

        <div className="ag-footer-legal">
          {LEGAL.map((l) => (
            <Link href={l.href} key={l.label}>{l.label}</Link>
          ))}
        </div>

        <div className="ag-footer-socials">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="ag-social-btn"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}