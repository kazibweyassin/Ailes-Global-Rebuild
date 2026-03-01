"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Calendar, DollarSign, MapPin, ArrowRight, Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Inline styles ── */
const STYLES = `
  .sf-feed {
    font-family: 'Sora', sans-serif;
    color: var(--cream);
  }

  /* ── SECTION HEADER ── */
  .sf-feed-header { margin-bottom: 40px; }

  .sf-feed-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 10px;
  }

  .sf-feed-title {
    font-family: 'Cormorant Garant', serif;
    font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 600; line-height: 1.1;
    color: var(--ivory); margin-bottom: 8px;
  }
  .sf-feed-title em { font-style: italic; color: var(--gold); }

  .sf-feed-sub {
    font-size: 14px; font-weight: 300;
    color: var(--soft); line-height: 1.6;
  }

  /* ── GRID ── */
  .sf-feed-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1000px) { .sf-feed-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .sf-feed-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .sf-feed-card {
    background: var(--navy);
    border: 1px solid rgba(245,237,214,0.07);
    border-radius: 12px;
    padding: 28px;
    display: flex; flex-direction: column;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    height: 100%;
  }
  .sf-feed-card:hover {
    border-color: rgba(232,160,32,0.22);
    background: var(--navy-light);
    transform: translateY(-3px);
  }

  .sf-feed-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
    margin-bottom: 6px;
  }

  .sf-feed-card-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.18);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
  }

  .sf-feed-card-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 19px; font-weight: 600;
    color: var(--ivory); line-height: 1.2;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sf-feed-card-provider {
    font-size: 12px; font-weight: 300;
    color: var(--soft); margin-bottom: 18px;
  }

  .sf-feed-card-meta {
    display: flex; flex-direction: column;
    gap: 9px; flex: 1; margin-bottom: 20px;
  }

  .sf-feed-meta-row {
    display: flex; align-items: center;
    gap: 8px; font-size: 13px;
  }
  .sf-feed-meta-row svg { flex-shrink: 0; }

  .sf-feed-amount {
    font-weight: 600; color: var(--success);
  }

  .sf-feed-location {
    font-weight: 300; color: var(--soft);
  }

  .sf-feed-deadline {
    font-weight: 300; color: var(--soft);
  }

  .sf-feed-urgent {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--danger);
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    padding: 2px 8px; border-radius: 100px;
    margin-left: 4px;
  }

  .sf-feed-desc {
    font-size: 12px; font-weight: 300;
    color: var(--soft); line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── CTA BUTTON ── */
  .sf-feed-cta {
    display: flex; align-items: center;
    gap: 6px;
    font-size: 12px; font-weight: 600;
    color: var(--gold-light);
    padding-top: 16px;
    border-top: 1px solid rgba(245,237,214,0.06);
    text-decoration: none;
    transition: color 0.2s;
  }
  .sf-feed-cta:hover { color: var(--gold); }

  /* ── VIEW ALL ── */
  .sf-feed-view-all {
    margin-top: 36px; text-align: center;
  }

  .btn-outline-feed {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--cream);
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
    padding: 14px 28px; border-radius: 6px;
    border: 1px solid rgba(245,237,214,0.15);
    text-decoration: none; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-outline-feed:hover {
    border-color: rgba(245,237,214,0.4);
    background: rgba(245,237,214,0.04);
  }

  /* ── STATES ── */
  .sf-feed-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 64px 0; color: var(--gold);
  }

  .sf-feed-error {
    text-align: center; padding: 48px 0;
    font-size: 14px; font-weight: 300; color: var(--danger);
  }

  .sf-feed-empty {
    text-align: center; padding: 48px 0;
    font-size: 14px; font-weight: 300; color: var(--soft); opacity: 0.6;
  }
`;

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  country: string | null;
  amount: number | null;
  currency: string;
  deadline: string | null;
  description: string | null;
  applicationLink: string | null;
  daysUntilDeadline: number | null;
  isUrgent: boolean;
  type: string;
}

interface ScholarshipFeedProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function ScholarshipFeed({
  limit = 6,
  showTitle = true,
  className = "",
}: ScholarshipFeedProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marketSegment, setMarketSegment] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };
    setMarketSegment(getCookie("market_segment") || "international");
  }, []);

  useEffect(() => {
    if (!marketSegment) return;
    async function fetchScholarships() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ limit: limit.toString(), page: "1" });
        const response = await fetch(`/api/scholarships/feed?${params}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marketSegment }),
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setScholarships(data.scholarships || []);
      } catch {
        setError("Failed to load scholarships. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, [marketSegment, limit]);

  const formatCurrency = (amount: number | null, currency: string) => {
    if (!amount) return "Amount varies";
    if (amount >= 1_000_000) return `${currency} ${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1_000)     return `${currency} ${(amount / 1e3).toFixed(0)}K`;
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: currency || "USD",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "Rolling deadline";
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  /* ── Render states ── */
  if (loading) return (
    <div className={`sf-feed-loading ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
    </div>
  );

  if (error) return (
    <div className={`sf-feed-error ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {error}
    </div>
  );

  if (!scholarships.length) return (
    <div className={`sf-feed-empty ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      No scholarships available at the moment.
    </div>
  );

  const isDomestic = marketSegment === "domestic";

  return (
    <div className={`sf-feed ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {showTitle && (
        <div className="sf-feed-header">
          <p className="sf-feed-label">
            {isDomestic ? "For US Students" : "International"}
          </p>
          <h2 className="sf-feed-title">
            {isDomestic
              ? <>Scholarships for <em>US students</em></>
              : <>Global scholarship <em>opportunities</em></>
            }
          </h2>
          <p className="sf-feed-sub">
            {isDomestic
              ? "Curated opportunities for students in the United States"
              : "Global opportunities for international students"}
          </p>
        </div>
      )}

      <div className="sf-feed-grid">
        {scholarships.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            style={{ height: "100%" }}
          >
            <div className="sf-feed-card">
              <div className="sf-feed-card-top">
                <div style={{ flex: 1 }}>
                  <div className="sf-feed-card-name">{s.name}</div>
                  <div className="sf-feed-card-provider">{s.provider}</div>
                </div>
                <div className="sf-feed-card-icon">
                  <Award size={16} />
                </div>
              </div>

              <div className="sf-feed-card-meta">
                {s.amount && (
                  <div className="sf-feed-meta-row">
                    <DollarSign size={13} color="var(--success)" />
                    <span className="sf-feed-amount">
                      {formatCurrency(s.amount, s.currency)}
                    </span>
                  </div>
                )}
                {s.country && (
                  <div className="sf-feed-meta-row">
                    <MapPin size={13} color="var(--soft)" style={{ opacity: 0.6 }} />
                    <span className="sf-feed-location">{s.country}</span>
                  </div>
                )}
                <div className="sf-feed-meta-row">
                  <Calendar size={13}
                    color={s.isUrgent ? "var(--danger)" : "var(--soft)"}
                    style={{ opacity: s.isUrgent ? 1 : 0.6 }} />
                  <span className="sf-feed-deadline"
                    style={s.isUrgent ? { color: "var(--danger)", fontWeight: 500 } : {}}>
                    {s.deadline ? `Deadline: ${formatDeadline(s.deadline)}` : "Rolling deadline"}
                  </span>
                  {s.isUrgent && <span className="sf-feed-urgent">Urgent</span>}
                </div>
                {s.description && (
                  <p className="sf-feed-desc">{s.description}</p>
                )}
              </div>

              <Link href={`/scholarships/${s.id}`} className="sf-feed-cta">
                View Details <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {scholarships.length >= limit && (
        <div className="sf-feed-view-all">
          <Link href="/scholarships" className="btn-outline-feed">
            <Globe size={15} />
            View All Scholarships
          </Link>
        </div>
      )}
    </div>
  );
}