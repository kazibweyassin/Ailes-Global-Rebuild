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
    min-height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 48px 56px;
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

  /* ── HERO: centred full-width (Craydel-style) ── */
  .hero-centre {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Cycling word highlight */
  @keyframes wordIn {
    0%   { opacity: 0; transform: translateY(12px); }
    12%  { opacity: 1; transform: translateY(0); }
    88%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  .hero-cycle {
    display: inline-block;
    color: var(--gold);
    font-style: italic;
    animation: wordIn 3s ease infinite;
  }

  /* Search bar */
  .hero-search {
    display: flex;
    align-items: center;
    background: rgba(14,23,41,0.85);
    border: 1px solid rgba(232,160,32,0.28);
    border-radius: 8px;
    padding: 6px 6px 6px 20px;
    gap: 12px;
    width: 100%;
    max-width: 640px;
    margin-top: 28px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.35);
    animation: fadeUp 0.8s 0.3s ease both;
  }
  .hero-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--ivory);
    caret-color: var(--gold);
  }
  .hero-search-input::placeholder { color: rgba(196,207,223,0.5); }
  .hero-search-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: var(--midnight);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 12px 22px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .hero-search-btn:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
  }

  /* Suggestion chips */
  .hero-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 16px;
    animation: fadeUp 0.8s 0.4s ease both;
  }
  .hero-chip {
    font-size: 12px;
    font-weight: 400;
    color: var(--soft);
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 100px;
    padding: 4px 12px;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .hero-chip:hover { border-color: rgba(232,160,32,0.35); color: var(--gold-light); }
  .hero-chip-label { color: rgba(196,207,223,0.45); margin-right: 4px; }

  /* Social proof row */
  .hero-proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 28px;
    animation: fadeUp 0.8s 0.5s ease both;
  }
  .hero-proof-avatars {
    display: flex;
  }
  .hero-proof-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid var(--midnight);
    object-fit: cover;
    margin-left: -8px;
    background: var(--navy-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }
  .hero-proof-avatar:first-child { margin-left: 0; }
  .hero-proof-divider {
    width: 1px; height: 28px;
    background: rgba(245,237,214,0.12);
  }
  .hero-proof-text {
    font-size: 13px;
    font-weight: 300;
    color: var(--soft);
    line-height: 1.4;
  }
  .hero-proof-text strong { color: var(--ivory); font-weight: 600; }

  /* Scrolling trust strip */
  .hero-trust {
    width: 100vw;
    margin-top: 32px;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  }
  @keyframes trust-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .hero-trust-track {
    display: flex;
    gap: 0;
    animation: trust-scroll 28s linear infinite;
    width: max-content;
  }
  .hero-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 32px;
    border-right: 1px solid rgba(245,237,214,0.07);
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    color: rgba(196,207,223,0.5);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .hero-trust-item .ti-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold); opacity: 0.5; flex-shrink: 0;
  }

  /* Map strip below hero */
  .hero-map-strip {
    background: var(--navy);
    border-top: 1px solid rgba(245,237,214,0.06);
    border-bottom: 1px solid rgba(245,237,214,0.06);
    padding: 40px 48px;
  }
  @media(max-width:768px){ .hero-map-strip { padding: 32px 24px; } }
  .hero-map-strip-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 40px;
    align-items: center;
  }
  @media(max-width:900px){
    .hero-map-strip-inner { grid-template-columns: 1fr; gap: 24px; }
  }
  .hero-map-strip-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--gold-light);
    margin-bottom: 10px;
  }
  .hero-map-strip-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px; font-weight: 600; color: var(--ivory);
    line-height: 1.2; margin-bottom: 8px;
  }
  .hero-map-strip-sub {
    font-size: 12px; font-weight: 300; color: var(--soft); line-height: 1.5;
  }

  /* ── Map arc animations (reused in strip) ── */
  @keyframes dash-flow {
    0%   { stroke-dashoffset: 300; opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { stroke-dashoffset: 0;   opacity: 0; }
  }
  .map-arc {
    fill: none;
    stroke: var(--gold);
    stroke-width: 1.2;
    stroke-dasharray: 6 4;
    stroke-dashoffset: 300;
    stroke-linecap: round;
    animation: dash-flow 3.2s ease-in-out infinite;
    opacity: 0;
  }
  .map-arc.terra { stroke: var(--terra-light); }
  .map-arc.soft  { stroke: var(--soft); opacity:0; }

  @keyframes map-pulse {
    0%, 100% { r: 3; opacity: 0.9; }
    50%       { r: 5; opacity: 0.4; }
  }
  .map-dot-origin { fill: var(--terra-light); animation: map-pulse 2.4s ease infinite; }
  .map-dot-dest   { fill: var(--gold);        animation: map-pulse 2.4s 0.6s ease infinite; }
  .map-dot-static { fill: rgba(245,237,214,0.15); }
  .map-country-label { font-size: 7px; font-family:'Sora',sans-serif; font-weight:500; fill:var(--soft); pointer-events:none; }
  .map-dest-label    { font-size: 7px; font-family:'Sora',sans-serif; font-weight:600; fill:var(--gold-light); pointer-events:none; }
  .map-badge-bg   { fill:rgba(8,13,26,0.9); stroke:rgba(232,160,32,0.4); stroke-width:0.8; }
  .map-badge-text { font-size:9px; font-family:'Sora',sans-serif; font-weight:700; fill:var(--gold-light); text-anchor:middle; dominant-baseline:middle; }

  /* Map overlay system */
  .map-wrapper {
    position: relative;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    line-height: 0;
  }
  .map-base-img {
    width: 100%;
    height: auto;
    display: block;
    filter: grayscale(1) brightness(0.18) sepia(1) saturate(2) hue-rotate(190deg);
    opacity: 0.85;
  }
  .map-overlay-svg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
  }
  /* Arc hover groups */
  .map-arc-group { pointer-events: all; cursor: pointer; }
  .map-arc-hit   { fill: none; stroke: transparent; stroke-width: 20; }

  /* Country origin glow */
  @keyframes map-glow-pulse {
    0%, 100% { opacity: 0.65; transform: scale(1); }
    50%       { opacity: 0.18; transform: scale(1.75); }
  }
  .map-glow {
    transform-box: fill-box;
    transform-origin: center;
    animation: map-glow-pulse 3s ease infinite;
    pointer-events: none;
  }

  /* Hover tooltip */
  .map-tooltip {
    position: absolute;
    background: rgba(8,13,26,0.96);
    border: 1px solid rgba(232,160,32,0.38);
    color: var(--gold-light);
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 6px;
    pointer-events: none;
    white-space: nowrap;
    transform: translate(-50%, calc(-100% - 10px));
    box-shadow: 0 4px 24px rgba(0,0,0,0.55);
    z-index: 10;
  }

  @media(max-width:1080px) {
    .hero-layout { max-width: 820px; }
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
    font-size: clamp(38px, 5vw, 68px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ivory);
    animation: fadeUp 0.8s 0.1s ease both;
    text-align: center;
  }

  .hero-headline em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    margin-top: 14px;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--soft);
    max-width: 600px;
    animation: fadeUp 0.8s 0.2s ease both;
    text-align: center;
  }

  .hero-actions {
    display: none;
  }

  .hero-stats {
    display: none;
  }

  .hero-stat-divider { display: none; }
  .hero-stat-num { display: none; }
  .hero-stat-label { display: none; }

  /* ── Shared buttons (used by CTA / sponsor / institutions sections) ── */
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
    padding: 14px 28px;
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
    background: var(--midnight);
    padding: 100px 48px;
    border-top: 1px solid rgba(245,237,214,0.05);
  }
  @media (max-width: 640px) { .destinations-section { padding: 72px 24px; } }

  .destinations-inner { max-width: 1200px; margin: 0 auto; }

  .dest-header {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    margin-bottom: 48px;
  }
  .dest-explore-link {
    font-size: 13px; font-weight: 500;
    color: var(--gold-light); text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    border-bottom: 1px solid rgba(232,160,32,0.2);
    padding-bottom: 2px;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .dest-explore-link:hover { border-color: rgba(232,160,32,0.6); }

  .dest-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  @media (max-width: 900px) { .dest-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .dest-grid { grid-template-columns: 1fr; } }

  /* Editorial card */
  .dest-card {
    position: relative;
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    overflow: hidden;
    padding: 26px;
    display: flex;
    flex-direction: column;
    min-height: 264px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
  }
  .dest-card:hover {
    border-color: rgba(232,160,32,0.3);
    transform: translateY(-4px);
    background: var(--navy-light);
  }

  /* Colour tint */
  .dest-card-tint {
    position: absolute; inset: 0; z-index: 0;
    pointer-events: none; opacity: 0.55;
    transition: opacity 0.3s;
  }
  .dest-card:hover .dest-card-tint { opacity: 0.85; }

  /* Giant bg flag watermark */
  .dest-card-bg-flag {
    position: absolute; right: -8px; top: -8px;
    font-size: 110px; line-height: 1;
    opacity: 0.07; pointer-events: none; z-index: 0;
    transition: opacity 0.3s;
  }
  .dest-card:hover .dest-card-bg-flag { opacity: 0.13; }

  .dest-card-inner {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; height: 100%; gap: 12px;
  }

  .dest-card-top {
    display: flex; align-items: center;
    justify-content: space-between;
  }
  .dest-flag-sm { font-size: 26px; }
  .dest-count-pill {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold);
    background: rgba(232,160,32,0.1);
    border: 1px solid rgba(232,160,32,0.22);
    border-radius: 100px; padding: 4px 10px;
  }

  .dest-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 24px; font-weight: 600;
    color: var(--ivory); line-height: 1.1;
  }

  .dest-hook {
    font-size: 11px; font-weight: 500;
    color: var(--gold-light);
    display: flex; align-items: center; gap: 6px;
  }
  .dest-hook::before {
    content: ''; display: inline-block;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
  }

  .dest-top-scholarships {
    font-size: 10px; font-weight: 300;
    color: var(--soft); line-height: 1.5; opacity: 0.7;
  }

  .dest-from {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid rgba(245,237,214,0.06);
  }
  .dest-from-label {
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--soft); opacity: 0.45; margin-bottom: 7px;
  }
  .dest-from-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .dest-from-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 400; color: var(--soft);
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 100px; padding: 3px 8px;
  }

  .dest-arrow {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: var(--gold);
    margin-top: 10px;
    opacity: 0; transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
  }
  .dest-card:hover .dest-arrow { opacity: 1; transform: translateX(0); }

  /* More countries strip */
  .dest-more-strip {
    margin-top: 28px;
    display: flex; align-items: center; gap: 10px;
    overflow-x: auto; padding-bottom: 6px;
    scrollbar-width: none;
  }
  .dest-more-strip::-webkit-scrollbar { display: none; }
  .dest-more-label {
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--soft); opacity: 0.4;
    white-space: nowrap; flex-shrink: 0;
  }
  .dest-more-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 400; color: var(--soft);
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.08);
    border-radius: 100px; padding: 4px 11px;
    white-space: nowrap; flex-shrink: 0;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .dest-more-chip:hover { border-color: rgba(232,160,32,0.28); color: var(--cream); }
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

  /* ─── MOBILE FIXES ──────────────────────────────────────────────────────── */

  /* Hero search: shrink button so input isn't cramped at 375px */
  @media (max-width: 520px) {
    .hero-search { padding: 5px 5px 5px 14px; gap: 8px; margin-top: 20px; }
    .hero-search-btn { padding: 10px 14px; font-size: 12px; gap: 4px; }
    .hero-search-btn svg { display: none; }
    .search-btn-full { display: none; }
    .search-btn-short { display: inline; }
    .hero-chips { gap: 6px; }
    .hero-chip { font-size: 11px; padding: 4px 10px; }
  }
  @media (min-width: 521px) {
    .search-btn-full { display: inline; }
    .search-btn-short { display: none; }
  }

  /* Hero proof row: wrap + hide dividers so it doesn't overflow at 375px */
  @media (max-width: 600px) {
    .hero-proof { flex-wrap: wrap; justify-content: center; gap: 8px 14px; }
    .hero-proof-divider { display: none; }
    .hero-proof-text { font-size: 12px; }
  }

  /* Step card: reduce internal padding in single-column layout */
  @media (max-width: 640px) {
    .step-card { padding: 36px 24px; }
    .step-num { font-size: 60px; top: 16px; right: 20px; }
  }

  /* Copilot features: single column on mobile */
  @media (max-width: 640px) {
    .copilot-saves { grid-template-columns: 1fr; gap: 10px; }
    .copilot-visual { padding: 20px 16px; }
    .copilot-response { word-break: break-word; overflow-wrap: break-word; }
    .copilot-typing { font-size: 12px; }
  }

  /* Testimonial badge: remove auto left margin when avatar row wraps */
  @media (max-width: 500px) {
    .testi-card { padding: 24px 20px; }
    .testi-badge { margin-left: 0; margin-top: 8px; }
    .testi-avatar { flex-direction: column; align-items: flex-start; }
    .testi-avatar-img { width: 40px; height: 40px; }
  }

  /* CTA actions: stack vertically on small phones */
  @media (max-width: 480px) {
    .cta-actions { flex-direction: column; align-items: center; }
    .cta-actions a, .cta-actions span { width: 100%; max-width: 280px; justify-content: center; text-align: center; }
  }

  /* Institutions image: shorter on small phones */
  @media (max-width: 480px) {
    .institutions-img-panel { height: 220px; }
  }

  /* Destination cards: reduce internal padding on mobile */
  @media (max-width: 480px) {
    .dest-card { padding: 18px; min-height: 220px; }
    .dest-name { font-size: 20px; }
    .dest-card-bg-flag { font-size: 80px; }
  }

  /* Sponsor section: body text */
  @media (max-width: 480px) {
    .sponsor-body { font-size: 14px; }
  }

  /* Map strip: hide the left text panel on very small screens to give map more room */
  @media (max-width: 480px) {
    .hero-map-strip-inner > div:first-child { display: none; }
  }
`;

const DESTINATIONS = [
  {
    name: "United Kingdom", flag: "🇬🇧", count: "95+", slug: "united-kingdom",
    tint: "rgba(0,36,125,0.28)",
    hook: "Avg. £12k–£30k / yr",
    top: "Chevening · Gates Cambridge · Commonwealth",
    from: [{ flag:"🇳🇬", name:"Nigeria" },{ flag:"🇰🇪", name:"Kenya" },{ flag:"🇬🇭", name:"Ghana" }],
  },
  {
    name: "United States", flag: "🇺🇸", count: "120+", slug: "united-states",
    tint: "rgba(100,20,20,0.28)",
    hook: "Avg. $25k–$80k / yr",
    top: "Fulbright · MasterCard · Davis Peace",
    from: [{ flag:"�🇬", name:"Nigeria" },{ flag:"🇪🇹", name:"Ethiopia" },{ flag:"🇿🇦", name:"S. Africa" }],
  },
  {
    name: "Canada", flag: "🇨🇦", count: "80+", slug: "canada",
    tint: "rgba(140,0,0,0.24)",
    hook: "Avg. CAD 20k–$50k / yr",
    top: "Vanier · IDRC · Carleton GSSP",
    from: [{ flag:"�🇬", name:"Nigeria" },{ flag:"🇬🇭", name:"Ghana" },{ flag:"🇰🇪", name:"Kenya" }],
  },
  {
    name: "Germany", flag: "🇩🇪", count: "70+", slug: "germany",
    tint: "rgba(20,20,20,0.35)",
    hook: "Mostly tuition-free",
    top: "DAAD · Humboldt · Erasmus+",
    from: [{ flag:"�🇬", name:"Nigeria" },{ flag:"🇪🇬", name:"Egypt" },{ flag:"🇪🇹", name:"Ethiopia" }],
  },
  {
    name: "Australia", flag: "🇦🇺", count: "60+", slug: "australia",
    tint: "rgba(0,70,30,0.26)",
    hook: "Avg. AUD 25k–$45k / yr",
    top: "Australia Awards · ANU · Melbourne",
    from: [{ flag:"🇿🇦", name:"S. Africa" },{ flag:"🇿🇲", name:"Zimbabwe" },{ flag:"🇰🇪", name:"Kenya" }],
  },
  {
    name: "Netherlands", flag: "🇳🇱", count: "45+", slug: "netherlands",
    tint: "rgba(180,60,0,0.2)",
    hook: "Low tuition + grants",
    top: "Orange Knowledge · Holland Scholarship",
    from: [{ flag:"�🇬", name:"Nigeria" },{ flag:"🇬🇭", name:"Ghana" },{ flag:"🇲🇦", name:"Morocco" }],
  },
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

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
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

const MAP_ROUTES = [
  { d:"M494,279 Q440,60 474,133",  cls:"",     delay:"0s",   dur:"3.2s", label:"Nigeria \u2192 UK \u00b7 147 students placed" },
  { d:"M494,279 Q350,90 272,176",  cls:"terra", delay:"0.8s", dur:"3.4s", label:"Nigeria \u2192 USA \u00b7 89 students placed" },
  { d:"M572,315 Q520,70 474,133",  cls:"",     delay:"1.6s", dur:"3s",   label:"Kenya \u2192 UK \u00b7 203 students placed" },
  { d:"M572,315 Q545,70 510,129",  cls:"",     delay:"2.4s", dur:"3.5s", label:"Kenya \u2192 Germany \u00b7 62 students placed" },
  { d:"M474,291 Q340,100 265,154", cls:"terra", delay:"3.2s", dur:"3.2s", label:"Ghana \u2192 Canada \u00b7 62 students placed" },
  { d:"M577,279 Q510,60 474,133",  cls:"",     delay:"0.4s", dur:"3.6s", label:"Ethiopia \u2192 UK \u00b7 147 students placed" },
  { d:"M549,399 Q460,50 474,133",  cls:"soft", delay:"1.2s", dur:"4s",   label:"S. Africa \u2192 UK \u00b7 38 students placed" },
  { d:"M549,399 Q720,280 874,427", cls:"terra", delay:"2.8s", dur:"3.8s", label:"S. Africa \u2192 Australia \u00b7 38 students placed" },
  { d:"M557,207 Q530,100 510,129", cls:"soft", delay:"2s",   dur:"3s",   label:"Egypt \u2192 Germany \u00b7 62 students placed" },
];

function CyclingWord({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 3000);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span
      key={idx}
      className="hero-cycle"
      style={{ animationDuration: '3s', animationFillMode: 'both' }}
    >
      {words[idx]}
    </span>
  );
}

export default function HomeClient() {
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapTip, setMapTip] = useState<{x:number;y:number;label:string}|null>(null);
  const [mapViewBox, setMapViewBox] = useState("0 0 950 620");

  useEffect(() => {
    const update = () =>
      setMapViewBox(window.innerWidth < 768 ? "220 110 570 370" : "0 0 950 620");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="ag-home">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-deco" />

        <div className="hero-centre">
          {/* Badge */}
          <div className="hero-badge" style={{animation:'fadeUp 0.8s ease both'}}>
            <span className="hero-badge-dot" />
            You are 90% more likely to secure scholarships or admission with Ailes Global
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Find your <em>scholarship.</em><br />
            Study <CyclingWord words={['anywhere.','in the UK.','in the USA.','in Canada.','in Germany.']} />
          </h1>

          {/* Sub */}
          <p className="hero-sub">
            Hundreds of fully-funded scholarships from 50+ countries — matched to your profile in seconds.
            Free to search. Free to apply. Built for African students.
          </p>

          {/* Search bar */}
          <div className="hero-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'var(--soft)',flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              className="hero-search-input"
              type="text"
              placeholder="Search scholarships, universities, or countries…"
              onKeyDown={(e) => { if(e.key==='Enter') window.location.href='/scholarships?q='+(e.target as HTMLInputElement).value; }}
            />
            <Link href="/find-scholarships" className="hero-search-btn">
              <span className="search-btn-full">Find My Match</span>
              <span className="search-btn-short">Search</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Suggestion chips */}
          <div className="hero-chips">
            <span className="hero-chip-label">Try:</span>
            {['Full scholarship UK','Masters Germany','STEM Canada','Chevening 2026','DAAD Fellowship'].map(q => (
              <Link key={q} href={`/scholarships?q=${encodeURIComponent(q)}`} className="hero-chip">{q}</Link>
            ))}
          </div>

          {/* Social proof */}
          <div className="hero-proof">
            <div className="hero-proof-avatars">
              {['/students/grace.jpg','/students/Patrick.png','/students/phot.jpg'].map((src,i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="hero-proof-avatar" />
              ))}
              <div className="hero-proof-avatar" style={{background:'rgba(232,160,32,0.15)',fontSize:'11px',fontWeight:700,color:'var(--gold)',fontFamily:"'Sora',sans-serif"}}>+1k</div>
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-text">
              <strong>1,247+ students</strong> found scholarships this year
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-text">
              ⭐ <strong>4.9/5</strong> from 312 reviews
            </div>
          </div>
        </div>
      </section>

      {/* ── MIGRATION MAP STRIP ── */}
      <div className="hero-map-strip">
        <div className="hero-map-strip-inner">
          <div>
            <div className="hero-map-strip-label">Our Global Reach</div>
            <div className="hero-map-strip-title">African students placed across the world</div>
            <div className="hero-map-strip-sub">Routes we support across 6 African nations to top universities in the UK, USA, Canada, Germany and Australia. Numbers show students placed per route.</div>
          </div>
          <div className="map-wrapper" ref={mapWrapperRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/world-map.svg" alt="" className="map-base-img" />

            {/* Tooltip */}
            {mapTip && (
              <div className="map-tooltip" style={{ left: mapTip.x, top: mapTip.y }}>
                {mapTip.label}
              </div>
            )}

            <svg viewBox={mapViewBox} className="map-overlay-svg" aria-label="Map showing scholarship routes from African countries to Western universities">
              <defs>
                <radialGradient id="glow-origin" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="rgba(196,90,42,0.55)" />
                  <stop offset="100%" stopColor="rgba(196,90,42,0)" />
                </radialGradient>
              </defs>

              {/* ── Origin glows (Africa lights up) ── */}
              <circle cx="494" cy="279" r="30" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'0s'}} />
              <circle cx="572" cy="315" r="30" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'0.5s'}} />
              <circle cx="474" cy="291" r="30" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'1s'}} />
              <circle cx="577" cy="279" r="30" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'1.5s'}} />
              <circle cx="549" cy="399" r="30" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'2s'}} />
              <circle cx="557" cy="207" r="24" fill="url(#glow-origin)" className="map-glow" style={{animationDelay:'0.3s'}} />

              {/* ── Interactive arc groups ── */}
              {MAP_ROUTES.map((r, i) => (
                <g
                  key={i}
                  className="map-arc-group"
                  onMouseEnter={(e) => {
                    const rect = mapWrapperRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setMapTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label: r.label });
                  }}
                  onMouseMove={(e) => {
                    const rect = mapWrapperRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setMapTip(t => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                  }}
                  onMouseLeave={() => setMapTip(null)}
                >
                  <path d={r.d} className="map-arc-hit" />
                  <path
                    d={r.d}
                    className={`map-arc${r.cls ? ' ' + r.cls : ''}`}
                    style={{ animationDelay: r.delay, animationDuration: r.dur }}
                  />
                </g>
              ))}

              {/* ── Origin dots ── */}
              <circle cx="494" cy="279" r="5" className="map-dot-origin" style={{animationDelay:'0s'}} />
              <circle cx="572" cy="315" r="5" className="map-dot-origin" style={{animationDelay:'0.5s'}} />
              <circle cx="474" cy="291" r="5" className="map-dot-origin" style={{animationDelay:'1s'}} />
              <circle cx="577" cy="279" r="5" className="map-dot-origin" style={{animationDelay:'1.5s'}} />
              <circle cx="549" cy="399" r="5" className="map-dot-origin" style={{animationDelay:'2s'}} />
              <circle cx="557" cy="207" r="5" className="map-dot-origin" style={{animationDelay:'0.3s'}} />

              {/* ── Destination dots ── */}
              <circle cx="474" cy="133" r="6" className="map-dot-dest" style={{animationDelay:'0.2s'}} />
              <circle cx="272" cy="176" r="6" className="map-dot-dest" style={{animationDelay:'0.9s'}} />
              <circle cx="265" cy="154" r="6" className="map-dot-dest" style={{animationDelay:'1.4s'}} />
              <circle cx="510" cy="129" r="6" className="map-dot-dest" style={{animationDelay:'0.6s'}} />
              <circle cx="874" cy="427" r="6" className="map-dot-dest" style={{animationDelay:'2.2s'}} />

              {/* ── Country labels ── */}
              <text x="494" y="298" className="map-country-label" textAnchor="middle">Nigeria</text>
              <text x="572" y="334" className="map-country-label" textAnchor="middle">Kenya</text>
              <text x="458" y="308" className="map-country-label" textAnchor="middle">Ghana</text>
              <text x="592" y="298" className="map-country-label" textAnchor="middle">Ethiopia</text>
              <text x="549" y="418" className="map-country-label" textAnchor="middle">S. Africa</text>
              <text x="570" y="225" className="map-country-label" textAnchor="middle">Egypt</text>
              <text x="474" y="152" className="map-dest-label" textAnchor="middle">UK</text>
              <text x="272" y="194" className="map-dest-label" textAnchor="middle">USA</text>
              <text x="252" y="172" className="map-dest-label" textAnchor="middle">Canada</text>
              <text x="510" y="148" className="map-dest-label" textAnchor="middle">Germany</text>
              <text x="874" y="446" className="map-dest-label" textAnchor="middle">Australia</text>

              {/* ── Student count badges ── */}
              <rect x="451" y="136" width="32" height="16" rx="3" className="map-badge-bg" />
              <text x="467" y="148" className="map-badge-text">147</text>
              <rect x="353" y="144" width="32" height="16" rx="3" className="map-badge-bg" />
              <text x="369" y="156" className="map-badge-text">89</text>
              <rect x="527" y="136" width="32" height="16" rx="3" className="map-badge-bg" />
              <text x="543" y="148" className="map-badge-text">203</text>
              <rect x="385" y="183" width="32" height="16" rx="3" className="map-badge-bg" />
              <text x="401" y="195" className="map-badge-text">62</text>
              <rect x="700" y="330" width="32" height="16" rx="3" className="map-badge-bg" />
              <text x="716" y="342" className="map-badge-text">38</text>
            </svg>
          </div>
        </div>
      </div>

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
          <div className="dest-header">
            <div>
              <p className="section-label">Study Destinations</p>
              <h2 className="section-title">
                Where African students<br /><em>go to study</em>
              </h2>
            </div>
            <Link href="/scholarships" className="dest-explore-link">
              Browse all scholarships
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="dest-grid">
            {DESTINATIONS.map((d) => (
              <Link href={`/destinations/${d.slug}`} className="dest-card" key={d.slug}>
                {/* colour tint + big watermark flag */}
                <div className="dest-card-tint" style={{ background: d.tint }} />
                <div className="dest-card-bg-flag">{d.flag}</div>

                <div className="dest-card-inner">
                  <div className="dest-card-top">
                    <span className="dest-flag-sm">{d.flag}</span>
                    <span className="dest-count-pill">{d.count} scholarships</span>
                  </div>

                  <div className="dest-name">{d.name}</div>
                  <div className="dest-hook">{d.hook}</div>
                  <div className="dest-top-scholarships">{d.top}</div>

                  <div className="dest-from">
                    <div className="dest-from-label">Top origin countries</div>
                    <div className="dest-from-chips">
                      {d.from.map(o => (
                        <span key={o.name} className="dest-from-chip">
                          <span>{o.flag}</span>{o.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="dest-arrow">
                    Explore scholarships
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* More countries strip */}
          <div className="dest-more-strip">
            <span className="dest-more-label">Also available in</span>
            {[
              ["🇫🇷","France"],["🇸🇪","Sweden"],["🇳🇿","New Zealand"],["🇮🇪","Ireland"],
              ["🇯🇵","Japan"],["🇰🇷","South Korea"],["🇦🇪","UAE"],["🇳🇴","Norway"],
              ["🇫🇮","Finland"],["🇧🇪","Belgium"],["🇨🇭","Switzerland"],["🇦🇹","Austria"],
            ].map(([flag, name]) => (
              <Link key={name} href={`/scholarships?country=${encodeURIComponent(name)}`} className="dest-more-chip">
                {flag} {name}
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
                <span className="institutions-stat-pill-num">40+</span>
                <span className="institutions-stat-pill-label">Hours Saved / Student</span>
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
            <Link href="/university-matcher" style={{ color: "var(--soft)", fontSize: "14px", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", padding: "16px 8px" }}>
              Match my university →
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