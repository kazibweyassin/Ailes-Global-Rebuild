"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, Calendar, DollarSign, Globe, GraduationCap, Heart, MapPin,
  Search, Filter, ArrowRight, Loader2, ArrowUpDown, Download, Share2,
  ChevronLeft, ChevronRight, AlertCircle, X, SlidersHorizontal,
} from "lucide-react";
import EmailCapturePopup from "@/components/email-capture-popup";

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const STYLES = `
  * { box-sizing: border-box; }

  .sp-page {
    font-family: 'Sora', sans-serif;
    background: var(--midnight);
    color: var(--cream);
    min-height: 100vh;
  }

  /* ── HERO ── */
  .sp-hero {
    position: relative;
    padding: 80px 48px 56px;
    overflow: hidden;
  }
  @media (max-width: 640px) { .sp-hero { padding: 64px 24px 40px; } }

  .sp-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,160,32,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 90% 80%, rgba(196,90,42,0.07) 0%, transparent 50%),
      var(--midnight);
    z-index: 0;
  }
  .sp-hero-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3; z-index: 1;
  }
  .sp-hero-inner {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto;
  }

  .sp-hero-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 12px;
  }
  .sp-hero-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(32px, 5vw, 64px);
    font-weight: 600; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--ivory);
    margin-bottom: 14px;
  }
  .sp-hero-title em { font-style: italic; color: var(--gold); }
  .sp-hero-sub {
    font-size: 15px; font-weight: 300;
    color: var(--soft); margin-bottom: 32px; max-width: 480px;
  }

  /* Search bar */
  .sp-search-wrap {
    position: relative; max-width: 600px;
  }
  .sp-search-icon {
    position: absolute; left: 16px; top: 50%;
    transform: translateY(-50%);
    color: var(--soft); pointer-events: none; opacity: 0.5;
  }
  .sp-search-input {
    width: 100%;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.12);
    border-radius: 8px;
    padding: 16px 48px 16px 48px;
    font-size: 14px; font-weight: 300;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .sp-search-input::placeholder { color: var(--soft); opacity: 0.4; }
  .sp-search-input:focus {
    border-color: rgba(232,160,32,0.35);
    background: rgba(232,160,32,0.03);
  }
  .sp-search-clear {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--soft); opacity: 0.5;
    display: flex; align-items: center;
  }
  .sp-search-clear:hover { opacity: 1; }

  /* ── LAYOUT ── */
  .sp-main {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 48px 100px;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .sp-main { grid-template-columns: 1fr; padding: 32px 24px 80px; }
  }

  /* ── SIDEBAR ── */
  .sp-sidebar {
    position: sticky; top: 24px;
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    overflow: hidden;
  }
  @media (max-width: 1024px) { .sp-sidebar { position: static; } }

  .sp-sidebar-head {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(245,237,214,0.06);
    display: flex; align-items: center; justify-content: space-between;
    position: relative;
  }
  .sp-sidebar-head::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--terra));
  }

  .sp-sidebar-title {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ivory);
    display: flex; align-items: center; gap: 8px;
  }

  .sp-filter-badge {
    font-size: 10px; font-weight: 700;
    background: var(--gold); color: var(--midnight);
    padding: 2px 7px; border-radius: 100px;
  }

  .btn-reset {
    font-size: 11px; font-weight: 500;
    color: var(--soft); background: none; border: none;
    cursor: pointer; letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .btn-reset:hover { color: var(--terra-light); }

  .sp-sidebar-body {
    padding: 20px 24px 24px;
    display: flex; flex-direction: column; gap: 18px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
  .sp-sidebar-body::-webkit-scrollbar { width: 4px; }
  .sp-sidebar-body::-webkit-scrollbar-track { background: transparent; }
  .sp-sidebar-body::-webkit-scrollbar-thumb { background: rgba(245,237,214,0.1); border-radius: 4px; }

  /* Filter field */
  .sp-filter-group {}
  .sp-filter-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--soft); margin-bottom: 8px; opacity: 0.7;
  }
  .sp-filter-label svg { color: var(--gold); opacity: 0.7; }

  .sp-select-wrap { position: relative; }
  .sp-select {
    width: 100%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.09);
    border-radius: 6px;
    padding: 10px 32px 10px 12px;
    font-size: 13px; font-weight: 300;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none; appearance: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .sp-select:focus { border-color: rgba(232,160,32,0.3); }
  .sp-select option { background: var(--navy); color: var(--ivory); }
  .sp-select-caret {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none; color: var(--soft); opacity: 0.5;
  }

  /* Amount inputs */
  .sp-amount-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .sp-amount-input {
    width: 100%;
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.09);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 13px; font-weight: 300;
    color: var(--ivory);
    font-family: 'Sora', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .sp-amount-input::placeholder { color: var(--soft); opacity: 0.4; }
  .sp-amount-input:focus { border-color: rgba(232,160,32,0.3); }

  /* Divider */
  .sp-filter-divider {
    border: none;
    border-top: 1px solid rgba(245,237,214,0.06);
    margin: 0;
  }

  .sp-filter-section-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--soft); opacity: 0.5; margin-bottom: 10px;
  }

  /* Checkboxes */
  .sp-check-list { display: flex; flex-direction: column; gap: 8px; }

  .sp-check-item {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer;
  }
  .sp-check-item input[type="checkbox"] {
    appearance: none;
    width: 16px; height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(245,237,214,0.15);
    background: rgba(245,237,214,0.03);
    cursor: pointer; flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
    position: relative;
  }
  .sp-check-item input[type="checkbox"]:checked {
    background: var(--gold);
    border-color: var(--gold);
  }
  .sp-check-item input[type="checkbox"]:checked::after {
    content: '';
    position: absolute; top: 2px; left: 5px;
    width: 4px; height: 8px;
    border: 2px solid var(--midnight);
    border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .sp-check-label {
    font-size: 13px; font-weight: 300; color: var(--cream);
    user-select: none;
  }

  /* Mobile filter toggle */
  .sp-mobile-toggle {
    display: none;
  }
  @media (max-width: 1024px) {
    .sp-mobile-toggle { display: flex; }
  }

  .btn-filter-toggle {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; gap: 10px;
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 8px;
    padding: 12px 18px;
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 500;
    color: var(--cream); cursor: pointer;
    transition: border-color 0.2s;
    margin-bottom: 12px;
  }
  .btn-filter-toggle:hover { border-color: rgba(232,160,32,0.25); }

  /* ── MAIN CONTENT ── */
  .sp-content {}

  /* Top bar */
  .sp-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
    margin-bottom: 20px;
  }

  .sp-count-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px; font-weight: 600; color: var(--ivory);
  }
  .sp-count-title em { font-style: italic; color: var(--gold); }
  .sp-count-sub {
    font-size: 12px; font-weight: 300; color: var(--soft);
    margin-top: 2px; opacity: 0.7;
  }

  .sp-topbar-right {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }

  .sp-sort-wrap { position: relative; }
  .sp-sort-select {
    background: rgba(245,237,214,0.03);
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 6px;
    padding: 9px 32px 9px 12px;
    font-size: 12px; font-weight: 400;
    color: var(--cream);
    font-family: 'Sora', sans-serif;
    outline: none; appearance: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .sp-sort-select:focus { border-color: rgba(232,160,32,0.3); }
  .sp-sort-select option { background: var(--navy); }
  .sp-sort-caret {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none; color: var(--soft); opacity: 0.5;
  }

  /* Action buttons */
  .sp-action-bar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 24px; flex-wrap: wrap;
  }

  .btn-action {
    display: inline-flex; align-items: center; gap: 6px;
    background: transparent;
    border: 1px solid rgba(245,237,214,0.1);
    border-radius: 6px;
    padding: 8px 14px;
    font-family: 'Sora', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--soft); cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    text-decoration: none;
  }
  .btn-action:hover {
    border-color: rgba(245,237,214,0.3); color: var(--cream);
  }
  .btn-action-gold {
    background: rgba(232,160,32,0.08);
    border-color: rgba(232,160,32,0.2);
    color: var(--gold-light);
  }
  .btn-action-gold:hover {
    background: rgba(232,160,32,0.12);
    border-color: rgba(232,160,32,0.35);
    color: var(--gold-light);
  }

  /* Error banner */
  .sp-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 20px;
    font-size: 13px; color: var(--danger);
  }

  /* ── SCHOLARSHIP GRID ── */
  .sp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 40px;
  }
  @media (max-width: 720px) { .sp-grid { grid-template-columns: 1fr; } }

  /* Card */
  .sp-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    padding: 26px;
    display: flex; flex-direction: column;
    height: 100%;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    position: relative; overflow: hidden;
  }
  .sp-card:hover {
    border-color: rgba(232,160,32,0.2);
    background: var(--navy-light);
    transform: translateY(-3px);
  }

  .sp-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px;
    margin-bottom: 4px;
  }

  .sp-card-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 18px; font-weight: 600;
    color: var(--ivory); line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sp-card-featured {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold);
    background: rgba(232,160,32,0.1);
    border: 1px solid rgba(232,160,32,0.2);
    padding: 3px 8px; border-radius: 100px;
    white-space: nowrap; flex-shrink: 0;
  }

  .sp-card-provider {
    font-size: 12px; font-weight: 300; color: var(--soft);
    margin-bottom: 12px;
  }

  /* Tags */
  .sp-card-tags {
    display: flex; flex-wrap: wrap; gap: 5px;
    margin-bottom: 14px;
  }
  .sp-tag {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 100px;
  }
  .sp-tag-women {
    color: #F9A8D4;
    background: rgba(249,168,212,0.1);
    border: 1px solid rgba(249,168,212,0.2);
  }
  .sp-tag-african {
    color: var(--gold-light);
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.2);
  }
  .sp-tag-type {
    color: var(--soft);
    background: rgba(196,207,223,0.07);
    border: 1px solid rgba(196,207,223,0.12);
  }

  .sp-card-desc {
    font-size: 12px; font-weight: 300;
    color: var(--soft); line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 14px;
  }

  .sp-card-meta {
    display: flex; flex-direction: column;
    gap: 7px; flex: 1; margin-bottom: 16px;
  }
  .sp-card-meta-row {
    display: flex; align-items: center;
    gap: 8px; font-size: 12px;
  }
  .sp-card-meta-row svg { flex-shrink: 0; }

  .sp-meta-amount { font-weight: 600; color: var(--success); }
  .sp-meta-location { font-weight: 300; color: var(--soft); }
  .sp-meta-deadline { font-weight: 300; }
  .sp-meta-deadline.urgent { color: var(--danger); font-weight: 500; }
  .sp-meta-deadline.warning { color: var(--warning); }
  .sp-meta-deadline.ok { color: var(--soft); }
  .sp-meta-awards { font-weight: 300; color: var(--soft); }

  /* Card actions */
  .sp-card-actions {
    display: flex; gap: 8px;
    padding-top: 14px;
    border-top: 1px solid rgba(245,237,214,0.06);
    margin-top: auto;
  }

  .btn-save {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    flex: 1; padding: 9px 12px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.12);
    background: transparent; color: var(--soft);
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .btn-save:hover { border-color: rgba(249,168,212,0.4); color: #F9A8D4; }
  .btn-save.saved {
    border-color: rgba(249,168,212,0.35);
    background: rgba(249,168,212,0.06);
    color: #F9A8D4;
  }
  .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-view {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    flex: 1; padding: 9px 12px; border-radius: 6px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
    text-decoration: none; border: none;
    transition: background 0.2s;
  }
  .btn-view:hover { background: var(--gold-light); }

  /* ── LOADING / EMPTY / ERROR states ── */
  .sp-state-center {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center;
  }
  .sp-state-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: rgba(245,237,214,0.04);
    border: 1px solid rgba(245,237,214,0.08);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px; color: var(--soft); opacity: 0.5;
  }
  .sp-state-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 28px; font-weight: 600;
    color: var(--ivory); margin-bottom: 8px;
  }
  .sp-state-body { font-size: 13px; font-weight: 300; color: var(--soft); }

  /* ── SKELETON SHIMMER ── */
  @keyframes sp-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .sp-skel {
    background: linear-gradient(90deg,
      rgba(245,237,214,.04) 25%,
      rgba(245,237,214,.09) 50%,
      rgba(245,237,214,.04) 75%
    );
    background-size: 1200px 100%;
    animation: sp-shimmer 1.8s ease infinite;
    border-radius: 5px;
  }
  .sp-skel-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,.07);
    border-radius: 12px;
    padding: 26px;
    display: flex; flex-direction: column; gap: 10px;
  }

  /* ── PAGINATION ── */
  .sp-pagination {
    display: flex; align-items: center;
    justify-content: center; gap: 6px;
    flex-wrap: wrap;
  }

  .btn-page {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    min-width: 36px; height: 36px; padding: 0 10px;
    border-radius: 6px; font-size: 13px; font-weight: 500;
    font-family: 'Sora', sans-serif; cursor: pointer;
    border: 1px solid rgba(245,237,214,0.1);
    background: transparent; color: var(--soft);
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .btn-page:hover:not(:disabled) {
    border-color: rgba(245,237,214,0.3); color: var(--cream);
  }
  .btn-page.active {
    background: var(--gold); border-color: var(--gold);
    color: var(--midnight); font-weight: 600;
  }
  .btn-page:disabled { opacity: 0.3; cursor: not-allowed; }

  .sp-page-info {
    font-size: 11px; font-weight: 300; color: var(--soft);
    opacity: 0.6; margin-left: 8px;
    letter-spacing: 0.06em;
  }

  /* ── BOTTOM CTA ── */
  .sp-cta {
    background: var(--navy);
    border-top: 1px solid rgba(245,237,214,0.06);
    padding: 72px 48px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  @media (max-width: 640px) { .sp-cta { padding: 56px 24px; } }

  .sp-cta-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,160,32,0.06) 0%, transparent 65%),
      var(--navy);
  }

  .sp-cta-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }

  .sp-cta-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 600; line-height: 1.1;
    color: var(--ivory); margin-bottom: 14px;
  }
  .sp-cta-title em { font-style: italic; color: var(--gold); }

  .sp-cta-body {
    font-size: 15px; font-weight: 300;
    color: var(--soft); line-height: 1.7; margin-bottom: 32px;
  }

  .btn-gold-cta {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--midnight);
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
    padding: 16px 32px; border-radius: 6px;
    text-decoration: none; border: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .btn-gold-cta:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(232,160,32,0.22);
  }

  /* ── QUICK FILTER CHIPS ── */
  .sp-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  .sp-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Sora', sans-serif;
    font-size: 12px; font-weight: 500;
    padding: 6px 14px;
    border-radius: 100px;
    border: 1px solid rgba(245,237,214,0.12);
    background: transparent;
    color: var(--soft);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .sp-chip:hover {
    border-color: rgba(232,160,32,0.3);
    color: var(--cream);
    transform: translateY(-1px);
  }
  .sp-chip.active {
    background: rgba(232,160,32,0.12);
    border-color: rgba(232,160,32,0.4);
    color: var(--gold-light);
  }
  .sp-chip-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* ChevronDown utility */
  .sp-chevron { display: inline-block; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearch, setRawSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [forWomenOnly, setForWomenOnly] = useState(false);
  const [forAfricanOnly, setForAfricanOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState("all");
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState("all");
  const [coversTuition, setCoversTuition] = useState(false);
  const [coversLiving, setCoversLiving] = useState(false);
  const [noTestRequired, setNoTestRequired] = useState(false);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("deadline");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [allCountries, setAllCountries] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/saved/scholarships");
        if (res.ok) {
          const data = await res.json();
          setSavedScholarshipIds(new Set(data.scholarships?.map((s: any) => s.id) || []));
        }
      } catch { /* silent */ }
    }
    async function fetchCountries() {
      try {
        const res = await fetch("/api/scholarships?limit=1000");
        if (res.ok) {
          const data = await res.json();
          const countries = Array.from(
            new Set((data.scholarships || []).map((s: any) => s.country).filter(Boolean))
          ) as string[];
          setAllCountries(countries.sort());
        }
      } catch { /* silent */ }
    }
    fetchSaved();
    fetchCountries();
  }, []);

  // Debounce raw search input → debounced searchTerm (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(rawSearch), 300);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedType, forWomenOnly, forAfricanOnly,
      selectedFieldOfStudy, selectedDegreeLevel, minAmount, maxAmount,
      selectedDeadline, coversTuition, coversLiving, noTestRequired]);

  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (searchTerm) p.append("search", searchTerm);
        if (selectedCountry !== "all") p.append("country", selectedCountry);
        if (selectedType !== "all") p.append("type", selectedType);
        if (forWomenOnly) p.append("forWomen", "true");
        if (forAfricanOnly) p.append("forAfrican", "true");
        if (selectedFieldOfStudy !== "all") p.append("fieldOfStudy", selectedFieldOfStudy);
        if (selectedDegreeLevel !== "all") p.append("degreeLevel", selectedDegreeLevel);
        if (minAmount) p.append("minAmount", minAmount);
        if (maxAmount) p.append("maxAmount", maxAmount);
        if (selectedDeadline !== "all") p.append("deadline", selectedDeadline);
        if (coversTuition) p.append("coversTuition", "true");
        if (coversLiving) p.append("coversLiving", "true");
        if (noTestRequired) p.append("noTestRequired", "true");
        p.append("page", currentPage.toString());
        p.append("limit", "12");
        const res = await fetch(`/api/scholarships?${p}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setScholarships(data.scholarships || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalResults(data.pagination?.total || 0);
        setError("");
      } catch {
        setError("Failed to load scholarships. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, [searchTerm, selectedCountry, selectedType, forWomenOnly, forAfricanOnly,
      selectedFieldOfStudy, selectedDegreeLevel, minAmount, maxAmount,
      selectedDeadline, coversTuition, coversLiving, noTestRequired, currentPage]);

  const toggleSave = async (id: string) => {
    try {
      setSavingId(id);
      const isSaved = savedScholarshipIds.has(id);
      const res = await fetch("/api/saved/scholarships", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId: id }),
      });
      if (!res.ok) {
        if (res.status === 401) { window.location.href = "/auth/signin?callbackUrl=/scholarships"; return; }
        throw new Error();
      }
      const next = new Set(savedScholarshipIds);
      isSaved ? next.delete(id) : next.add(id);
      setSavedScholarshipIds(next);
    } catch { /* silent */ }
    finally { setSavingId(null); }
  };

  const sortedScholarships = [...scholarships].sort((a, b) => {
    if (sortBy === "amount")   return (b.amount || 0) - (a.amount || 0);
    if (sortBy === "name")     return a.name.localeCompare(b.name);
    if (sortBy === "views")    return (b.views || 0) - (a.views || 0);
    const aDays = a.daysUntilDeadline ?? Infinity;
    const bDays = b.daysUntilDeadline ?? Infinity;
    return aDays - bDays;
  });

  const exportToCSV = () => {
    const headers = ["Name","Provider","Amount","Currency","Country","Deadline","Type","Link"];
    const rows = sortedScholarships.map(s => [
      s.name, s.provider, s.amount, s.currency, s.country,
      s.deadline ? new Date(s.deadline).toLocaleDateString() : "",
      s.type,
      `${typeof window !== "undefined" ? window.location.origin : ""}/scholarships/${s.id}`,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scholarships-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "Scholarships on AILES Global", text: `Found ${totalResults} scholarships!`, url }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const activeFiltersCount = [
    selectedCountry !== "all", selectedType !== "all",
    selectedDegreeLevel !== "all", selectedFieldOfStudy !== "all",
    selectedDeadline !== "all", forWomenOnly, forAfricanOnly,
    coversTuition, coversLiving, noTestRequired,
    Boolean(minAmount), Boolean(maxAmount),
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCountry("all"); setSelectedType("all");
    setSelectedDegreeLevel("all"); setSelectedFieldOfStudy("all");
    setSelectedDeadline("all"); setForWomenOnly(false);
    setForAfricanOnly(false); setCoversTuition(false);
    setCoversLiving(false); setNoTestRequired(false);
    setMinAmount(""); setMaxAmount(""); setRawSearch(""); setSearchTerm("");
  };

  const getDeadlineMeta = (days: number) => {
    if (days <= 30)  return { cls: "urgent",  color: "var(--danger)"  };
    if (days <= 60)  return { cls: "warning", color: "var(--warning)" };
    return             { cls: "ok",      color: "var(--soft)"    };
  };

  /* ── Sidebar (shared between desktop sticky + mobile drawer) ── */
  const Sidebar = () => (
    <div className="sp-sidebar">
      <div className="sp-sidebar-head">
        <span className="sp-sidebar-title">
          <SlidersHorizontal size={13} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="sp-filter-badge">{activeFiltersCount}</span>
          )}
        </span>
        {activeFiltersCount > 0 && (
          <button className="btn-reset" onClick={resetFilters}>Reset</button>
        )}
      </div>
      <div className="sp-sidebar-body">

        {/* Country */}
        <div className="sp-filter-group">
          <label className="sp-filter-label"><MapPin size={12} />Country</label>
          <div className="sp-select-wrap">
            <select className="sp-select" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option value="all">All Countries</option>
              {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="sp-select-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
          </div>
        </div>

        {/* Type */}
        <div className="sp-filter-group">
          <label className="sp-filter-label"><Award size={12} />Type</label>
          <div className="sp-select-wrap">
            <select className="sp-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="FULL">Full Scholarship</option>
              <option value="PARTIAL">Partial Scholarship</option>
            </select>
            <span className="sp-select-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
          </div>
        </div>

        {/* Degree Level */}
        <div className="sp-filter-group">
          <label className="sp-filter-label"><GraduationCap size={12} />Degree Level</label>
          <div className="sp-select-wrap">
            <select className="sp-select" value={selectedDegreeLevel} onChange={e => setSelectedDegreeLevel(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="BACHELOR">Bachelor's</option>
              <option value="MASTER">Master's</option>
              <option value="PHD">PhD</option>
              <option value="DIPLOMA">Diploma</option>
            </select>
            <span className="sp-select-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
          </div>
        </div>

        {/* Field of Study */}
        <div className="sp-filter-group">
          <label className="sp-filter-label">Field of Study</label>
          <div className="sp-select-wrap">
            <select className="sp-select" value={selectedFieldOfStudy} onChange={e => setSelectedFieldOfStudy(e.target.value)}>
              <option value="all">All Fields</option>
              {["Engineering","Medicine","Business","Computer Science","Law","Arts","Agriculture","Education","Science"].map(f =>
                <option key={f} value={f}>{f}</option>
              )}
            </select>
            <span className="sp-select-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
          </div>
        </div>

        {/* Deadline */}
        <div className="sp-filter-group">
          <label className="sp-filter-label"><Calendar size={12} />Deadline</label>
          <div className="sp-select-wrap">
            <select className="sp-select" value={selectedDeadline} onChange={e => setSelectedDeadline(e.target.value)}>
              <option value="all">All Deadlines</option>
              <option value="upcoming">Upcoming (Open)</option>
              <option value="thisMonth">This Month</option>
              <option value="nextMonth">Next Month</option>
            </select>
            <span className="sp-select-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
          </div>
        </div>

        {/* Amount Range */}
        <div className="sp-filter-group">
          <label className="sp-filter-label"><DollarSign size={12} />Amount (USD)</label>
          <div className="sp-amount-row">
            <input className="sp-amount-input" type="number" placeholder="Min"
              value={minAmount} onChange={e => setMinAmount(e.target.value)} />
            <input className="sp-amount-input" type="number" placeholder="Max"
              value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
          </div>
        </div>

        <hr className="sp-filter-divider" />

        {/* Special filters */}
        <div>
          <div className="sp-filter-section-label">Target & Coverage</div>
          <div className="sp-check-list">
            {[
              ["For Women Only",       forWomenOnly,    setForWomenOnly],
              ["For Africans Only",    forAfricanOnly,  setForAfricanOnly],
              ["Covers Tuition",       coversTuition,   setCoversTuition],
              ["Covers Living Costs",  coversLiving,    setCoversLiving],
              ["No IELTS/TOEFL/GRE",  noTestRequired,  setNoTestRequired],
            ].map(([label, val, setter]: any) => (
              <label key={label as string} className="sp-check-item">
                <input type="checkbox" checked={val}
                  onChange={e => setter(e.target.checked)} />
                <span className="sp-check-label">{label as string}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  /* ── Pagination helper ── */
  const pageNums = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5)               return i + 1;
    if (currentPage <= 3)              return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <div className="sp-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── HERO ── */}
      <div className="sp-hero">
        <div className="sp-hero-bg" />
        <div className="sp-hero-grain" />
        <div className="sp-hero-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="sp-hero-label">Scholarship Database</p>
            <h1 className="sp-hero-title">
              Browse <em>800+ scholarships</em><br />for African students
            </h1>
            <p className="sp-hero-sub">
              Find fully-funded opportunities for your study abroad journey
            </p>
            <div className="sp-search-wrap">
              <Search size={16} className="sp-search-icon" />
              <input
                className="sp-search-input"
                placeholder="Search by scholarship name or provider…"
                value={rawSearch}
                onChange={e => setRawSearch(e.target.value)}
              />
              {rawSearch && (
                <button className="sp-search-clear" onClick={() => { setRawSearch(""); setSearchTerm(""); }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="sp-main">

        {/* Desktop sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block"
          style={{ display: "block" }}
        >
          <div className="hidden-mobile">
            <Sidebar />
          </div>
        </motion.div>

        {/* Content */}
        <div className="sp-content">

          {/* Mobile filter toggle */}
          <div className="sp-mobile-toggle" style={{ marginBottom: 0 }}>
            <button className="btn-filter-toggle" onClick={() => setShowFilters(p => !p)}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={13} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="sp-filter-badge">{activeFiltersCount}</span>
                )}
              </span>
              <span style={{ fontSize: 11, color: "var(--soft)", opacity: 0.6 }}>
                {showFilters ? "Hide" : "Show"}
              </span>
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginBottom: 20 }}
                >
                  <Sidebar />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <div className="sp-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Top bar */}
          <div className="sp-topbar">
            <div>
              <div className="sp-count-title">
                <em>{totalResults}</em> scholarships found
              </div>
              <div className="sp-count-sub">
                {loading ? "Loading…" : "Ready to explore"}
              </div>
            </div>
            <div className="sp-topbar-right">
              <div className="sp-sort-wrap">
                <ArrowUpDown size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--soft)", opacity: 0.5, pointerEvents: "none" }} />
                <select
                  className="sp-sort-select"
                  style={{ paddingLeft: 28 }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="deadline">By Deadline</option>
                  <option value="amount">By Amount</option>
                  <option value="name">By Name</option>
                  <option value="views">By Popularity</option>
                </select>
                <span className="sp-sort-caret"><ChevronLeft size={12} style={{ transform: "rotate(-90deg)" }} /></span>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="sp-action-bar">
            <button className="btn-action" onClick={exportToCSV}>
              <Download size={13} /> Export CSV
            </button>
            <button className="btn-action" onClick={shareResults}>
              <Share2 size={13} /> Share
            </button>
            <Link href="/scholarships/match" className="btn-action btn-action-gold">
              <Award size={13} /> AI Match
            </Link>
          </div>

          {/* ── Quick filter chips ── */}
          <div className="sp-chips">
            {[
              { label: "Closing Soon",     active: selectedDeadline === "30",   onClick: () => setSelectedDeadline(selectedDeadline === "30" ? "all" : "30"),     dot: "var(--danger)" },
              { label: "Full Scholarship",  active: selectedType === "FULL",      onClick: () => setSelectedType(selectedType === "FULL" ? "all" : "FULL"),         dot: "var(--gold)" },
              { label: "Women Only",        active: forWomenOnly,                 onClick: () => setForWomenOnly(v => !v),                                           dot: "#F9A8D4" },
              { label: "No Test Required",  active: noTestRequired,              onClick: () => setNoTestRequired(v => !v),                                         dot: "var(--soft)" },
              { label: "Africa Targeted",   active: forAfricanOnly,              onClick: () => setForAfricanOnly(v => !v),                                         dot: "var(--terra-light)" },
            ].map(chip => (
              <button
                key={chip.label}
                className={`sp-chip${chip.active ? " active" : ""}`}
                onClick={chip.onClick}
                style={chip.active ? { color: chip.dot } : {}}
              >
                <span className="sp-chip-dot" style={{ background: chip.dot, opacity: chip.active ? 1 : 0.4 }} />
                {chip.label}
              </button>
            ))}
          </div>

          {/* Grid / States */}
          {loading ? (
            <div className="sp-grid">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="sp-skel-card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'10px'}}>
                    <div className="sp-skel" style={{height:'20px',width:'68%'}} />
                    <div className="sp-skel" style={{height:'20px',width:'54px',borderRadius:'100px'}} />
                  </div>
                  <div className="sp-skel" style={{height:'12px',width:'44%'}} />
                  <div style={{display:'flex',gap:'6px'}}>
                    <div className="sp-skel" style={{height:'20px',width:'54px',borderRadius:'100px'}} />
                    <div className="sp-skel" style={{height:'20px',width:'68px',borderRadius:'100px'}} />
                  </div>
                  <div style={{display:'flex',gap:'12px',marginTop:'4px'}}>
                    <div className="sp-skel" style={{height:'11px',width:'76px'}} />
                    <div className="sp-skel" style={{height:'11px',width:'58px'}} />
                    <div className="sp-skel" style={{height:'11px',width:'68px'}} />
                  </div>
                  <div style={{marginTop:'auto',paddingTop:'14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div className="sp-skel" style={{height:'30px',width:'88px',borderRadius:'4px'}} />
                    <div className="sp-skel" style={{height:'30px',width:'30px',borderRadius:'8px'}} />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedScholarships.length === 0 ? (
            <div className="sp-state-center">
              <div className="sp-state-icon"><AlertCircle size={24} /></div>
              <div className="sp-state-title">No results found</div>
              <p className="sp-state-body">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="sp-grid">
                {sortedScholarships.map((s, i) => {
                  const days = s.daysUntilDeadline ?? null;
                  const dm = days !== null ? getDeadlineMeta(days) : null;
                  const saved = savedScholarshipIds.has(s.id);
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      style={{ height: "100%" }}
                    >
                      <div className="sp-card">
                        <div className="sp-card-top">
                          <div className="sp-card-name">{s.name}</div>
                          {s.featured && <span className="sp-card-featured">Featured</span>}
                        </div>
                        <div className="sp-card-provider">{s.provider}</div>

                        {(s.forWomen || s.forAfrican || s.type) && (
                          <div className="sp-card-tags">
                            {s.forWomen   && <span className="sp-tag sp-tag-women">Women</span>}
                            {s.forAfrican && <span className="sp-tag sp-tag-african">African</span>}
                            {s.type       && <span className="sp-tag sp-tag-type">{s.type}</span>}
                          </div>
                        )}

                        {s.description && (
                          <div className="sp-card-desc">{s.description}</div>
                        )}

                        <div className="sp-card-meta">
                          <div className="sp-card-meta-row">
                            <DollarSign size={13} color="var(--success)" />
                            <span className="sp-meta-amount">
                              {s.amount ? `${s.currency} ${s.amount.toLocaleString()}` : "Amount varies"}
                            </span>
                          </div>
                          {s.country && (
                            <div className="sp-card-meta-row">
                              <MapPin size={13} color="var(--soft)" style={{ opacity: 0.6 }} />
                              <span className="sp-meta-location">{s.country}</span>
                            </div>
                          )}
                          {days !== null && (
                            <div className="sp-card-meta-row">
                              <Calendar size={13} color={dm!.color} />
                              <span className={`sp-meta-deadline ${dm!.cls}`}>
                                {days} days left
                              </span>
                            </div>
                          )}
                          {(s.numberOfAwards || s.degreeLevel?.length > 0) && (
                            <div className="sp-card-meta-row">
                              <Award size={12} color="var(--gold)" style={{ opacity: 0.6 }} />
                              <span className="sp-meta-awards">
                                {s.numberOfAwards || "Multiple"} awards
                                {s.degreeLevel?.length > 0 && ` · ${s.degreeLevel.slice(0, 2).join(", ")}`}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="sp-card-actions">
                          <button
                            className={`btn-save${saved ? " saved" : ""}`}
                            onClick={() => toggleSave(s.id)}
                            disabled={savingId === s.id}
                          >
                            <Heart size={12}
                              style={{ fill: saved ? "currentColor" : "none" }} />
                            {saved ? "Saved" : "Save"}
                          </button>
                          <Link href={`/scholarships/${s.id}`} className="btn-view">
                            View <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="sp-pagination">
                  <button
                    className="btn-page"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>
                  {pageNums.map(n => (
                    <button
                      key={n}
                      className={`btn-page${currentPage === n ? " active" : ""}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="btn-page"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight size={13} />
                  </button>
                  <span className="sp-page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="sp-cta">
        <div className="sp-cta-bg" />
        <div className="sp-cta-inner">
          <h2 className="sp-cta-title">
            Let AI find your <em>best matches</em>
          </h2>
          <p className="sp-cta-body">
            Our AI analyses your profile and matches you with scholarships you're most likely to win.
          </p>
          <Link href="/scholarships/match" className="btn-gold-cta">
            <Award size={16} />
            Get AI-Matched Scholarships
          </Link>
        </div>
      </div>

      <EmailCapturePopup />
    </div>
  );
}