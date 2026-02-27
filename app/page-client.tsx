"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, GraduationCap, Plane, PenLine, FileText, Target, CalendarDays, Building2 } from "lucide-react";

/* ─── Design Tokens ─────────────────────────────────────────────────────────
   Palette: Midnight Navy · Amber Gold · Terracotta · Cream · Ivory
   Typography: Cormorant Garant (display) + Sora (body)
   Aesthetic: Warm editorial — magazine meets African heritage
────────────────────────────────────────────────────────────────────────────── */

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
    --white: #FFFFFF;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ag-home {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 48px 80px;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 40%, rgba(232,160,32,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(196,90,42,0.12) 0%, transparent 55%),
      linear-gradient(160deg, #080D1A 0%, #0E1729 50%, #120A04 100%);
    z-index: 0;
  }

  .hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
    z-index: 1;
  }

  .hero-deco {
    position: absolute;
    top: -120px;
    right: -80px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border: 1px solid rgba(232,160,32,0.08);
    z-index: 1;
  }
  .hero-deco::after {
    content: '';
    position: absolute;
    inset: 40px;
    border-radius: 50%;
    border: 1px solid rgba(232,160,32,0.05);
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    max-width: 820px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(232,160,32,0.10);
    border: 1px solid rgba(232,160,32,0.25);
    color: var(--gold-light);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 32px;
    animation: fadeUp 0.8s ease both;
  }

  .hero-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .hero-headline {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 600;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--ivory);
    animation: fadeUp 0.8s 0.1s ease both;
  }

  .hero-headline em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    margin-top: 28px;
    font-size: 17px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--soft);
    max-width: 520px;
    animation: fadeUp 0.8s 0.2s ease both;
  }

  .hero-actions {
    margin-top: 44px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    animation: fadeUp 0.8s 0.3s ease both;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 16px 32px;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 0 0 rgba(232,160,32,0);
  }
  .btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(232,160,32,0.25);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 16px 32px;
    border-radius: 4px;
    border: 1px solid rgba(245,237,214,0.2);
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .btn-ghost:hover {
    border-color: rgba(245,237,214,0.5);
    background: rgba(245,237,214,0.05);
    transform: translateY(-2px);
  }

  .hero-stats {
    margin-top: 64px;
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
    animation: fadeUp 0.8s 0.4s ease both;
  }

  .hero-stat-divider {
    width: 1px;
    background: rgba(245,237,214,0.1);
    align-self: stretch;
  }

  .hero-stat-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--ivory);
    line-height: 1;
  }
  .hero-stat-num span { color: var(--gold); }

  .hero-stat-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--soft);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── HOW IT WORKS ── */
  .section {
    padding: 100px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(34px, 4vw, 54px);
    font-weight: 600;
    line-height: 1.1;
    color: var(--ivory);
  }

  .section-title em {
    font-style: italic;
    color: var(--gold);
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    margin-top: 56px;
    background: rgba(245,237,214,0.05);
    border-radius: 12px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .steps-grid { grid-template-columns: 1fr; }
    .hero { padding: 100px 24px 60px; }
    .section { padding: 72px 24px; }
    .hero-stats { gap: 32px; }
  }

  .step-card {
    background: var(--navy);
    padding: 48px 40px;
    position: relative;
    transition: background 0.3s;
  }
  .step-card:hover { background: var(--navy-light); }

  .step-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 80px;
    font-weight: 700;
    color: rgba(232,160,32,0.08);
    line-height: 1;
    position: absolute;
    top: 24px;
    right: 28px;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    background: rgba(232,160,32,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .step-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 12px;
  }

  .step-body {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--soft);
  }

  /* ── DESTINATIONS ── */
  .destinations-section {
    background: var(--navy);
    padding: 100px 48px;
  }

  .destinations-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .dest-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 56px;
  }

  @media (max-width: 900px) { .dest-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) {
    .dest-grid { grid-template-columns: 1fr; }
    .destinations-section { padding: 72px 24px; }
  }

  .dest-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: pointer;
    text-decoration: none;
    display: block;
  }

  .dest-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    filter: brightness(0.6) saturate(0.8);
  }
  .dest-card:hover img { transform: scale(1.06); }

  .dest-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,13,26,0.85) 0%, transparent 55%);
    transition: background 0.3s;
  }
  .dest-card:hover .dest-overlay {
    background: linear-gradient(to top, rgba(8,13,26,0.9) 0%, rgba(232,160,32,0.08) 100%);
  }

  .dest-flag {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 24px;
  }

  .dest-name {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
  }

  .dest-count {
    position: absolute;
    bottom: 20px;
    right: 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold-light);
    background: rgba(232,160,32,0.15);
    padding: 4px 10px;
    border-radius: 100px;
  }

  /* ── TESTIMONIALS ── */
  .testimonials-section {
    padding: 100px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media (max-width: 600px) { .testimonials-section { padding: 72px 24px; } }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 56px;
  }
  @media (max-width: 900px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .testimonials-grid { grid-template-columns: 1fr; } }

  .testi-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.06);
    border-radius: 12px;
    padding: 32px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .testi-card:hover {
    border-color: rgba(232,160,32,0.2);
    transform: translateY(-4px);
  }

  .testi-quote {
    font-family: 'Cormorant Garant', serif;
    font-size: 56px;
    color: var(--gold);
    opacity: 0.3;
    line-height: 0.6;
    margin-bottom: 16px;
  }

  .testi-body {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    margin-bottom: 28px;
  }

  .testi-avatar {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .testi-avatar-img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(232,160,32,0.3);
  }

  .testi-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ivory);
  }

  .testi-role {
    font-size: 12px;
    color: var(--soft);
    margin-top: 2px;
  }

  .testi-badge {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    color: var(--gold);
    background: rgba(232,160,32,0.1);
    padding: 4px 10px;
    border-radius: 100px;
    white-space: nowrap;
  }

  /* ── AI COPILOT ── */
  .copilot-section {
    background: var(--navy);
    padding: 0 48px;
  }
  .copilot-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  @media (max-width: 900px) {
    .copilot-inner { grid-template-columns: 1fr; gap: 48px; padding: 72px 0; }
    .copilot-section { padding: 0 24px; }
  }

  .copilot-saves {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 36px;
  }

  .copilot-feat {
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 8px;
    padding: 20px;
    transition: border-color 0.3s;
  }
  .copilot-feat:hover { border-color: rgba(232,160,32,0.2); }

  .copilot-feat-icon { display: flex; align-items: center; margin-bottom: 10px; }
  .copilot-feat-title { font-size: 13px; font-weight: 600; color: var(--ivory); margin-bottom: 4px; }
  .copilot-feat-desc { font-size: 12px; font-weight: 300; color: var(--soft); line-height: 1.5; }

  .copilot-visual {
    background: var(--midnight);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 16px;
    padding: 28px;
  }

  .copilot-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 24px;
  }
  .copilot-bar span { width: 10px; height: 10px; border-radius: 50%; }

  .copilot-typing {
    background: rgba(232,160,32,0.06);
    border: 1px solid rgba(232,160,32,0.12);
    border-radius: 8px;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--soft);
    margin-bottom: 16px;
    line-height: 1.6;
    font-family: 'Sora', sans-serif;
  }
  .copilot-typing strong { color: var(--gold-light); }

  .copilot-response {
    background: rgba(245,237,214,0.03);
    border-radius: 8px;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--cream);
    line-height: 1.7;
    font-family: 'Sora', sans-serif;
  }

  .copilot-cursor {
    display: inline-block;
    width: 2px; height: 14px;
    background: var(--gold);
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 1s step-start infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* ── FOR INSTITUTIONS ── */
  .institutions-section {
    background: var(--midnight);
    padding: 0 48px;
    border-top: 1px solid rgba(245,237,214,0.06);
    border-bottom: 1px solid rgba(245,237,214,0.06);
    overflow: hidden;
  }
  @media (max-width: 600px) { .institutions-section { padding: 0 24px; } }

  .institutions-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    align-items: stretch;
    min-height: 520px;
  }
  @media (max-width: 900px) {
    .institutions-inner { grid-template-columns: 1fr; min-height: auto; }
  }

  .institutions-img-panel {
    position: relative;
    overflow: hidden;
    margin-left: -48px;
  }
  @media (max-width: 900px) {
    .institutions-img-panel { height: 320px; margin-left: -24px; margin-right: -24px; }
  }

  .institutions-img-panel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.5) saturate(0.75);
    transition: transform 0.8s ease;
    display: block;
  }
  .institutions-img-panel:hover img { transform: scale(1.04); }

  .institutions-img-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, transparent 55%, var(--midnight) 100%),
      linear-gradient(to top, rgba(8,13,26,0.55) 0%, transparent 45%);
    pointer-events: none;
  }

  .institutions-img-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--gold), var(--terra));
    z-index: 2;
  }

  .institutions-img-label {
    position: absolute;
    bottom: 28px;
    left: 28px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(8,13,26,0.80);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 8px;
    padding: 12px 18px;
  }

  .institutions-img-label-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    animation: pulse 2s ease infinite;
  }

  .institutions-img-label-text {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold-light);
    font-family: 'Sora', sans-serif;
  }

  .institutions-content {
    padding: 80px 0 80px 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--midnight);
  }
  @media (max-width: 900px) { .institutions-content { padding: 56px 0; } }

  .institutions-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .institutions-eyebrow-icon {
    width: 36px;
    height: 36px;
    background: rgba(196,90,42,0.15);
    border: 1px solid rgba(196,90,42,0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .institutions-eyebrow-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--terra-light);
    font-family: 'Sora', sans-serif;
  }

  .institutions-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 3.2vw, 48px);
    font-weight: 600;
    line-height: 1.1;
    color: var(--ivory);
    margin-bottom: 20px;
  }
  .institutions-title em {
    font-style: italic;
    color: var(--gold);
  }

  .institutions-body {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--soft);
    max-width: 440px;
    margin-bottom: 36px;
  }

  .institutions-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .institutions-stat-pill {
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 100px;
    padding: 8px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: border-color 0.2s;
  }
  .institutions-stat-pill:hover { border-color: rgba(232,160,32,0.2); }

  .institutions-stat-pill-num {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--gold-light);
  }

  .institutions-stat-pill-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--soft);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .btn-terra {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--terra);
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 16px 32px;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    align-self: flex-start;
  }
  .btn-terra:hover {
    background: var(--terra-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(196,90,42,0.28);
  }

  /* ── SPONSOR ── */
  .sponsor-section {
    position: relative;
    padding: 100px 48px;
    overflow: hidden;
    text-align: center;
  }
  @media (max-width: 600px) { .sponsor-section { padding: 72px 24px; } }

  .sponsor-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1A0A04 0%, #2C1208 40%, #1A0D04 100%);
  }

  .sponsor-inner {
    position: relative;
    z-index: 2;
    max-width: 700px;
    margin: 0 auto;
  }

  .sponsor-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(30px, 4vw, 52px);
    font-weight: 600;
    color: var(--ivory);
    line-height: 1.1;
    margin-bottom: 20px;
  }
  .sponsor-title em { font-style: italic; color: var(--terra-light); }

  .sponsor-body {
    font-size: 16px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 36px;
  }

  /* ── CTA ── */
  .cta-section {
    background: var(--midnight);
    padding: 120px 48px;
    text-align: center;
  }
  @media (max-width: 600px) { .cta-section { padding: 72px 24px; } }

  .cta-inner { max-width: 640px; margin: 0 auto; }

  .cta-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(40px, 5vw, 68px);
    font-weight: 600;
    color: var(--ivory);
    line-height: 1.05;
    margin-bottom: 20px;
  }
  .cta-title em { font-style: italic; color: var(--gold); }

  .cta-body {
    font-size: 16px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.7;
    margin-bottom: 40px;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  /* ── FOOTER STRIP ── */
  .footer-strip {
    background: var(--navy);
    border-top: 1px solid rgba(245,237,214,0.06);
    padding: 20px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: var(--cream);
  }
  @media (max-width: 600px) { .footer-strip { padding: 20px 24px; } }
  .footer-strip a { color: var(--gold); text-decoration: none; }
  .footer-strip a:hover { color: var(--gold-light); }
`;

const DESTINATIONS = [
  { name: "United States", flag: "🇺🇸", count: "120+", slug: "united-states", img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&q=80" },
  { name: "United Kingdom", flag: "🇬🇧", count: "95+",  slug: "united-kingdom", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  { name: "Canada",         flag: "🇨🇦", count: "80+",  slug: "canada",         img: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=80" },
  { name: "Germany",        flag: "🇩🇪", count: "70+",  slug: "germany",        img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80" },
  { name: "Australia",      flag: "🇦🇺", count: "60+",  slug: "australia",      img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80" },
  { name: "Netherlands",    flag: "🇳🇱", count: "45+",  slug: "netherlands",    img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80" },
];

const TESTIMONIALS = [
  {
    quote: "Ailes Global helped me secure a full scholarship to study in the US. Their guidance was invaluable throughout the entire process.",
    name: "Patrick Nsamba", role: "Master's · Computer Science", badge: "Full Scholarship 🇺🇸",
    img: "/testimonials/LUTALO_MURSHID_VISA_PHOTO[1].jpg",
  },
  {
    quote: "The team's expertise and personalized support made my dream of studying in Canada a reality. Highly recommended!",
    name: "Nansamba Olivia", role: "MBA", badge: "Partial Scholarship 🇨🇦",
    img: "/testimonials/NAMATO_VALLY_VISA_PHOTO[1].jpg",
  },
  {
    quote: "From application to visa, Ailes Global was with me every step. I'm now pursuing my Bachelors in Germany!",
    name: "Akandwanaho Marvin", role: "BS · Engineering", badge: "Scholarship 🇩🇪",
    img: "/testimonials/SSEGONJA_SHAFICK_VISA_PHOTO[1].jpg",
  },
];

function CountUp({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const dur = 1400, step = 16;
        const inc = to / (dur / step);
        const timer = setInterval(() => {
          start = Math.min(start + inc, to);
          setVal(Math.floor(start));
          if (start >= to) clearInterval(timer);
        }, step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function HomeClient() {
  return (
    <div className="ag-home">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-deco" />

        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Africa&apos;s #1 Scholarship-First Platform
          </div>

          <h1 className="hero-headline">
            Find your <em>scholarship.</em>
            <br />Then your university.
          </h1>

          <p className="hero-sub">
            Hundreds of fully-funded scholarships from 50+ countries — free to search, free to apply.
            Real opportunities for African students ready to study abroad.
          </p>

          <div className="hero-actions">
            <Link href="/find-scholarships" className="btn-primary">
              Find My Scholarships
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/scholarships" className="btn-ghost">
              Browse All 500+
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num"><CountUp to={500} suffix="+" /></div>
              <div className="hero-stat-label">Scholarships Listed</div>
            </div>
            <div className="hero-stat-divider" />
            <div>
              <div className="hero-stat-num"><CountUp to={50} suffix="+" /></div>
              <div className="hero-stat-label">Countries</div>
            </div>
            <div className="hero-stat-divider" />
            <div>
              <div className="hero-stat-num"><CountUp to={1247} suffix="+" /></div>
              <div className="hero-stat-label">Students Joined</div>
            </div>
            <div className="hero-stat-divider" />
            <div>
              <div className="hero-stat-num" style={{ color: "var(--gold-light)" }}>Free</div>
              <div className="hero-stat-label">Always</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <p className="section-label">The Process</p>
        <h2 className="section-title">
          Three steps to studying<br /><em>anywhere in the world</em>
        </h2>

        <div className="steps-grid">
          {[
            { num: "01", Icon: Search,         title: "Find Scholarships", body: "Search 500+ opportunities or use AI matching to instantly surface scholarships that fit your academic profile and goals." },
            { num: "02", Icon: GraduationCap,  title: "Match Universities", body: "Get matched with universities that accept your scholarship. Funding comes first — university choice follows." },
            { num: "03", Icon: Plane,          title: "Apply & Fly",        body: "Use AI Copilot to generate applications, essays, and recommendation letters. Save 40+ hours per application cycle." },
          ].map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon"><s.Icon size={22} color="var(--gold)" /></div>
              <div className="step-title">{s.title}</div>
              <p className="step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="destinations-section">
        <div className="destinations-inner">
          <p className="section-label">Study Destinations</p>
          <h2 className="section-title">
            Scholarships in<br /><em>50+ countries</em>
          </h2>

          <div className="dest-grid">
            {DESTINATIONS.map((d) => (
              <Link href={`/destinations/${d.slug}`} className="dest-card" key={d.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.name} loading="lazy" />
                <div className="dest-overlay" />
                <span className="dest-flag">{d.flag}</span>
                <span className="dest-name">{d.name}</span>
                <span className="dest-count">{d.count} scholarships</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI COPILOT ── */}
      <section className="copilot-section">
        <div className="copilot-inner">
          <div>
            <p className="section-label">AI-Powered</p>
            <h2 className="section-title" style={{ fontSize: "clamp(30px,3.5vw,48px)" }}>
              Your AI Copilot<br />for <em>winning applications</em>
            </h2>
            <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--soft)", lineHeight: 1.7, marginTop: "16px" }}>
              Generate scholarship applications, motivation letters, and essays with AI.
              Save 40+ hours per application cycle and apply with confidence.
            </p>

            <div className="copilot-saves">
              {[
                { Icon: PenLine,    title: "Essays & SOPs",    desc: "Tailored personal statements in minutes" },
                { Icon: FileText,   title: "LOR Templates",    desc: "AI-crafted recommendation letters" },
                { Icon: Target,     title: "Smart Matching",   desc: "Scholarships ranked by your fit score" },
                { Icon: CalendarDays, title: "Deadline Tracker", desc: "Never miss a scholarship closing date" },
              ].map((f) => (
                <div className="copilot-feat" key={f.title}>
                  <div className="copilot-feat-icon"><f.Icon size={18} color="var(--gold)" /></div>
                  <div className="copilot-feat-title">{f.title}</div>
                  <div className="copilot-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "36px" }}>
              <Link href="/copilot/activate" className="btn-primary">
                Try AI Copilot Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Faux Terminal */}
          <div className="copilot-visual">
            <div className="copilot-bar">
              <span style={{ background: "#FF5F57" }} />
              <span style={{ background: "#FEBC2E" }} />
              <span style={{ background: "#28C840" }} />
              <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--soft)", fontFamily: "Sora, sans-serif" }}>
                AI Copilot — Essay Generator
              </span>
            </div>
            <div className="copilot-typing">
              <strong>Prompt:</strong> Write a motivation letter for the Chevening Scholarship.
              I am a Ugandan software engineer applying for an MSc in AI at Edinburgh.
            </div>
            <div className="copilot-response">
              Growing up in Kampala, access to quality technology education was a distant dream — one I was determined to turn into reality. Today, as a software engineer leading AI integrations at a Ugandan fintech startup, I see clearly how artificial intelligence can transform African economies...
              <span className="copilot-cursor" />
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Regenerate", "Make Formal", "Export PDF"].map((lbl) => (
                <span key={lbl} style={{ fontSize: "11px", padding: "5px 10px", border: "1px solid rgba(245,237,214,0.1)", borderRadius: "4px", color: "var(--soft)", cursor: "pointer", fontFamily: "Sora, sans-serif" }}>
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <p className="section-label">Success Stories</p>
        <h2 className="section-title">
          Students who changed<br />their lives with <em>Ailes</em>
        </h2>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="testi-quote">&ldquo;</div>
              <p className="testi-body">{t.quote}</p>
              <div className="testi-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="testi-avatar-img" loading="lazy" />
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
                <span className="testi-badge">{t.badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link href="/success-stories" className="btn-ghost">
            View All Success Stories →
          </Link>
        </div>
      </section>

      {/* ── FOR INSTITUTIONS ─────────────────────────────────────────────────
           NEW SECTION — placed between Testimonials and Sponsor.
           Layout: full-bleed image panel (left) + content (right)
           Matches the dark editorial aesthetic of the page.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="institutions-section">
        <div className="institutions-inner">

          {/* Left — image panel (bleeds to viewport edge) */}
          <div className="institutions-img-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80"
              alt="University campus — partner institutions"
              loading="lazy"
            />
            <div className="institutions-img-label">
              <span className="institutions-img-label-dot" />
              <span className="institutions-img-label-text">Partner Institutions</span>
            </div>
          </div>

          {/* Right — content */}
          <div className="institutions-content">
            <div className="institutions-eyebrow">
              <div className="institutions-eyebrow-icon"><Building2 size={16} color="var(--terra-light)" /></div>
              <span className="institutions-eyebrow-label">For Institutions</span>
            </div>

            <h2 className="institutions-title">
              Your partner for <em>digital,</em><br />
              direct and truly global<br />
              student recruitment
            </h2>

            <p className="institutions-body">
              Reach and enrol the most motivated, independent African students
              looking for the best university match globally. Realise your
              international student recruitment ambitions through a trusted,
              scholarship-first platform.
            </p>

            <div className="institutions-stats">
              <div className="institutions-stat-pill">
                <span className="institutions-stat-pill-num">1,200+</span>
                <span className="institutions-stat-pill-label">Active Students</span>
              </div>
              <div className="institutions-stat-pill">
                <span className="institutions-stat-pill-num">50+</span>
                <span className="institutions-stat-pill-label">Countries</span>
              </div>
              <div className="institutions-stat-pill">
                <span className="institutions-stat-pill-num">98%</span>
                <span className="institutions-stat-pill-label">Match Rate</span>
              </div>
            </div>

            <Link href="/institutions" className="btn-terra">
              Partner With Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

        </div>
      </section>

      {/* ── SPONSOR ── */}
      <section className="sponsor-section">
        <div className="sponsor-bg" />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/scholarships-banner.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08,
        }} />
        <div className="sponsor-inner">
          <p className="section-label" style={{ color: "var(--terra-light)" }}>Make a Difference</p>
          <h2 className="sponsor-title">
            Sponsor a student&apos;s<br /><em>journey abroad</em>
          </h2>
          <p className="sponsor-body">
            100% of your sponsorship goes directly to supporting an African student&apos;s education.
            Help change a life — and a community.
          </p>
          <Link href="/sponsor" className="btn-primary" style={{ background: "var(--terra-light)", display: "inline-flex" }}>
            Become a Sponsor
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">
            Your scholarship<br />is <em>waiting.</em>
          </h2>
          <p className="cta-body">
            Book a free consultation today and take the first step towards your global education dream.
            Expert guidance, zero cost to start.
          </p>
          <div className="cta-actions">
            <Link href="/contact" className="btn-primary">
              Book Free Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/university-matcher" className="btn-ghost">
              Match My University
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div className="footer-strip">
        <span>© 2026 Ailes Global. All rights reserved.</span>
        <span style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <a href="mailto:info@ailesglobal.com">info@ailesglobal.com</a>
          <a href="https://wa.me/256786367460">WhatsApp</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </span>
      </div>
    </div>
  );
}