"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Heart, LayoutDashboard, Shield, LogIn, LogOut, ArrowRight, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const STYLES = `
  /* ── Navbar shell ── */
  .nav-root {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    font-family: 'Sora', sans-serif;
    transition: background .3s, backdrop-filter .3s, border-color .3s;
  }

  .nav-root.scrolled {
    background: rgba(8,13,26,.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(245,237,214,.07);
  }

  /* when the page loads we no longer want the nav to blend into the white
     page background, so give it the same dark, slightly translucent backdrop used
     when the user has scrolled. */
  .nav-root.top {
    background: rgba(8,13,26,.92);
    border-bottom: 1px solid rgba(245,237,214,.07);
  }

  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  @media(max-width:768px){ .nav-inner { padding: 0 20px; } }

  /* ── Logo ── */
  .nav-logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  /* ── Desktop links ── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }
  @media(max-width:900px){ .nav-links { display: none; } }

  .nav-link {
    font-size: 13px;
    font-weight: 500;
    color: rgba(245,237,214,.65);
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 6px;
    transition: color .2s, background .2s;
    white-space: nowrap;
  }
  .nav-link:hover { color: var(--ivory); background: rgba(245,237,214,.06); }

  /* ── Dropdown ── */
  .nav-dropdown-wrap {
    position: relative;
  }

  .nav-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(245,237,214,.65);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 14px;
    border-radius: 6px;
    transition: color .2s, background .2s;
    font-family: 'Sora', sans-serif;
  }
  .nav-dropdown-trigger:hover { color: var(--ivory); background: rgba(245,237,214,.06); }

  .nav-dropdown-chevron {
    transition: transform .2s;
  }
  .nav-dropdown-chevron.open { transform: rotate(180deg); }

  .nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    min-width: 220px;
    background: var(--navy);
    border: 1px solid rgba(245,237,214,.09);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 24px 60px rgba(0,0,0,.5);
    animation: dropIn .15s ease both;
    z-index: 100;
  }

  @keyframes dropIn {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .nav-dropdown-item {
    display: block;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 400;
    color: var(--soft);
    text-decoration: none;
    border-radius: 8px;
    transition: color .15s, background .15s;
  }
  .nav-dropdown-item:hover { color: var(--ivory); background: rgba(245,237,214,.06); }

  .nav-dropdown-sep {
    height: 1px;
    background: rgba(245,237,214,.07);
    margin: 6px 8px;
  }

  /* ── Right actions ── */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  @media(max-width:900px){ .nav-actions .nav-desktop-only { display: none; } }

  .nav-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--soft);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    text-decoration: none;
    transition: color .2s, background .2s;
    white-space: nowrap;
  }
  .nav-btn-ghost:hover { color: var(--ivory); background: rgba(245,237,214,.06); }

  .nav-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--terra-light);
    background: none;
    border: 1px solid rgba(224,120,72,.3);
    border-radius: 6px;
    padding: 8px 14px;
    text-decoration: none;
    cursor: pointer;
    transition: background .2s, border-color .2s;
    white-space: nowrap;
  }
  .nav-btn-outline:hover { background: rgba(224,120,72,.08); border-color: rgba(224,120,72,.55); }

  .nav-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--midnight);
    background: var(--gold);
    border: none;
    border-radius: 6px;
    padding: 9px 18px;
    text-decoration: none;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    white-space: nowrap;
  }
  .nav-btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(232,160,32,.25);
  }

  /* ── Hamburger ── */
  .nav-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--soft);
    padding: 6px;
    border-radius: 6px;
    transition: color .2s, background .2s;
  }
  .nav-hamburger:hover { color: var(--ivory); background: rgba(245,237,214,.06); }
  @media(max-width:900px){ .nav-hamburger { display: flex; align-items: center; } }

  /* ── Mobile drawer ── */
  .nav-mobile {
    display: none;
    flex-direction: column;
    background: var(--navy);
    border-top: 1px solid rgba(245,237,214,.07);
    padding: 16px 20px 24px;
    gap: 4px;
  }
  .nav-mobile.open { display: flex; }

  .nav-mobile-link {
    display: block;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 500;
    color: var(--soft);
    text-decoration: none;
    border-radius: 8px;
    transition: color .15s, background .15s;
  }
  .nav-mobile-link:hover { color: var(--ivory); background: rgba(245,237,214,.05); }

  .nav-mobile-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 500;
    color: var(--soft);
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: color .15s, background .15s;
  }
  .nav-mobile-trigger:hover { color: var(--ivory); background: rgba(245,237,214,.05); }

  .nav-mobile-sub {
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
  }

  .nav-mobile-sep {
    height: 1px;
    background: rgba(245,237,214,.07);
    margin: 10px 0;
  }

  .nav-mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }

  .nav-mobile-btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 14px;
    border-radius: 8px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    width: 100%;
    transition: background .2s;
  }
  .nav-mobile-btn-primary:hover { background: var(--gold-light); }

  .nav-mobile-btn-outline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--terra-light);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 13px;
    border-radius: 8px;
    border: 1px solid rgba(224,120,72,.3);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    transition: background .2s;
  }
  .nav-mobile-btn-outline:hover { background: rgba(224,120,72,.07); }

  .nav-mobile-btn-ghost {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--soft);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 13px;
    border-radius: 8px;
    border: 1px solid rgba(245,237,214,.1);
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    transition: color .2s, background .2s;
  }
  .nav-mobile-btn-ghost:hover { color: var(--ivory); background: rgba(245,237,214,.05); }
`;

const NAV_ITEMS = [
  { href: "/",                  label: "Home" },
  { href: "/scholarships",      label: "Scholarships" },
  { href: "/university-matcher",label: "Study Abroad" },
  { href: "/about",             label: "About" },
];

const SERVICES_DROPDOWN = [
  { href: "/services",            label: "All Services" },
  { href: "/pricing",             label: "Packages & Pricing" },
  { href: "/university-matcher",  label: "University Matching" },
  { href: "/find-scholarships",   label: "Scholarship Search" },
  { href: "/copilot/activate",    label: "AI Copilot" },
  { href: "/consulting",          label: "Expert Consulting" },
];

export function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mSvcOpen,     setMSvcOpen]     = useState(false);
  // start with the actual scroll position so the nav won't flash white on first
  // render; this is safe because the hook below only runs in the browser.
  const [scrolled,     setScrolled]     = useState(
    typeof window !== "undefined" ? window.scrollY > 12 : false
  );

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin    = session?.user?.role === "ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAll = () => { setMobileOpen(false); setMSvcOpen(false); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <nav className={`nav-root ${scrolled ? "scrolled" : "top"}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo" onClick={closeAll}>
            <Image
              src="/Logo.png"
              alt="Ailes Global"
              width={140}
              height={36}
              style={{ height: 36, width: "auto", filter: "brightness(0) invert(1)" }}
              priority
            />
          </Link>

          {/* Desktop centre links */}
          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="nav-dropdown-trigger">
                Services
                <ChevronDown
                  size={14}
                  className={`nav-dropdown-chevron ${servicesOpen ? "open" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div className="nav-dropdown-menu">
                  {SERVICES_DROPDOWN.slice(0, 2).map((item) => (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      {item.label}
                    </Link>
                  ))}
                  <div className="nav-dropdown-sep" />
                  {SERVICES_DROPDOWN.slice(2).map((item) => (
                    <Link key={item.href} href={item.href} className="nav-dropdown-item">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop right actions */}
          <div className="nav-actions">
            {/* Sponsor — desktop only */}
            <Link href="/sponsor" className="nav-btn-outline nav-desktop-only">
              <Heart size={13} />
              Sponsor
            </Link>

            {/* Admin / Dashboard — desktop only */}
            {isAdmin && (
              <Link href="/admin" className="nav-btn-ghost nav-desktop-only">
                <Shield size={13} />
                Admin
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard" className="nav-btn-ghost nav-desktop-only">
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
            )}

            {/* Auth — desktop only */}
            {isLoggedIn ? (
              <button
                className="nav-btn-ghost nav-desktop-only"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            ) : (
              <Link href="/auth/signin" className="nav-btn-ghost nav-desktop-only">
                <LogIn size={13} />
                Sign In
              </Link>
            )}

            {/* Primary CTA — always visible */}
            <Link href="/find-scholarships" className="nav-btn-primary">
              <ArrowRight size={13} />
              Find Scholarships
            </Link>

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={closeAll}>
              {item.label}
            </Link>
          ))}

          {/* Services accordion */}
          <button className="nav-mobile-trigger" onClick={() => setMSvcOpen((v) => !v)}>
            Services
            <ChevronDown
              size={15}
              style={{ transition: "transform .2s", transform: mSvcOpen ? "rotate(180deg)" : "none" }}
            />
          </button>
          {mSvcOpen && (
            <div className="nav-mobile-sub">
              {SERVICES_DROPDOWN.map((item) => (
                <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="nav-mobile-sep" />

          <div className="nav-mobile-actions">
            <Link href="/find-scholarships" className="nav-mobile-btn-primary" onClick={closeAll}>
              <ArrowRight size={15} />
              Find Scholarships
            </Link>

            <Link href="/sponsor" className="nav-mobile-btn-outline" onClick={closeAll}>
              <Heart size={15} />
              Sponsor a Scholar
            </Link>

            {isAdmin && (
              <Link href="/admin" className="nav-mobile-btn-ghost" onClick={closeAll}>
                <Shield size={15} />
                Admin Panel
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard" className="nav-mobile-btn-ghost" onClick={closeAll}>
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <button
                className="nav-mobile-btn-ghost"
                onClick={() => { closeAll(); signOut({ callbackUrl: "/" }); }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/auth/signup" className="nav-mobile-btn-ghost" onClick={closeAll}>
                  Get Started
                </Link>
                <Link href="/auth/signin" className="nav-mobile-btn-ghost" onClick={closeAll}>
                  <LogIn size={15} />
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer so page content isn't hidden under fixed nav */}
      <div style={{ height: 68 }} aria-hidden />
    </>
  );
}