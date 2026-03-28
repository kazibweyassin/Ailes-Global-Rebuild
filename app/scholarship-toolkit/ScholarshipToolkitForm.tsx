"use client";
import { useState } from "react";

const STORAGE_KEY = "ailes_toolkit_form";

export default function ScholarshipToolkitForm() {
  const [form, setForm] = useState({
    country: "",
    course: "",
    academicLevel: "",
    email: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Persist form data so the after-payment page can generate the PDF
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));

      const res = await fetch("/api/pesapal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5,
          description: "Personalized Scholarship Toolkit",
          email: form.email,
          callback_url: `${window.location.origin}/scholarship-toolkit/after-payment`,
        }),
      });

      const data = await res.json();

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setError("Could not get a payment link. Please try again.");
      }
    } catch (_err) {
      localStorage.removeItem(STORAGE_KEY);
      setError("Payment initiation failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const academicLevels = [
    "Undergraduate",
    "Postgraduate / Masters",
    "PhD / Doctorate",
    "Diploma / Certificate",
    "High School",
  ];

  const isValid =
    form.country.trim() &&
    form.course.trim() &&
    form.academicLevel &&
    form.email.trim();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .stf-root {
          min-height: 100vh;
          background-color: #0d1117;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(196, 150, 60, 0.12) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4963c' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .stf-card {
          width: 100%;
          max-width: 560px;
          background: #13191f;
          border: 1px solid rgba(196, 150, 60, 0.2);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
        }

        .stf-header {
          padding: 40px 44px 32px;
          border-bottom: 1px solid rgba(196, 150, 60, 0.12);
          position: relative;
        }

        .stf-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c4963c 0%, #e8c16a 50%, #c4963c 100%);
        }

        .stf-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c4963c;
          margin-bottom: 12px;
        }

        .stf-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px, 4vw, 30px);
          font-weight: 600;
          color: #f0ead6;
          line-height: 1.2;
          margin: 0 0 10px;
        }

        .stf-subtitle {
          font-size: 14px;
          color: #6b7685;
          line-height: 1.6;
          font-weight: 300;
          margin: 0;
        }

        .stf-price-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding: 6px 12px;
          background: rgba(196, 150, 60, 0.1);
          border: 1px solid rgba(196, 150, 60, 0.25);
          border-radius: 2px;
          font-size: 12px;
          color: #c4963c;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .stf-body {
          padding: 36px 44px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stf-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stf-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a95a3;
        }

        .stf-input,
        .stf-select {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 3px;
          padding: 12px 16px;
          color: #e8e2d4;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }

        .stf-input::placeholder { color: #3a4451; }

        .stf-input:focus,
        .stf-select:focus {
          border-color: rgba(196, 150, 60, 0.5);
          box-shadow: 0 0 0 3px rgba(196, 150, 60, 0.08);
        }

        .stf-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c4963c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
          cursor: pointer;
        }

        .stf-select option { background: #13191f; color: #e8e2d4; }

        .stf-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 4px 0;
        }

        .stf-optional-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8a95a3;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stf-optional-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .stf-btn {
          margin-top: 8px;
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #c4963c 0%, #e8c16a 50%, #c4963c 100%);
          background-size: 200% 100%;
          background-position: 100% 0;
          border: none;
          border-radius: 3px;
          color: #0d1117;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-position 0.4s ease, transform 0.15s ease, opacity 0.2s;
        }

        .stf-btn:hover:not(:disabled) {
          background-position: 0% 0;
          transform: translateY(-1px);
        }

        .stf-btn:active:not(:disabled) { transform: translateY(0); }

        .stf-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .stf-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .stf-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(13,17,23,0.3);
          border-top-color: #0d1117;
          border-radius: 50%;
          animation: stf-spin 0.7s linear infinite;
        }

        @keyframes stf-spin { to { transform: rotate(360deg); } }

        .stf-error {
          padding: 14px 18px;
          background: rgba(239, 68, 68, 0.07);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 3px;
          font-size: 13px;
          color: #fca5a5;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stf-footer {
          padding: 16px 44px 24px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .stf-trust {
          font-size: 11px;
          color: #3a4451;
          text-align: center;
          letter-spacing: 0.04em;
          line-height: 1.7;
        }

        .stf-trust span { color: #5a6472; }

        @media (max-width: 480px) {
          .stf-header, .stf-body, .stf-footer { padding-left: 24px; padding-right: 24px; }
          .stf-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="stf-root">
        <div className="stf-card">
          <div className="stf-header">
            <p className="stf-eyebrow">Ailes Global · Scholarship Toolkit</p>
            <h2 className="stf-title">Your Personalized<br />Scholarship Guide</h2>
            <p className="stf-subtitle">
              Tell us about yourself. We'll build a tailored PDF with curated
              opportunities, deadlines, and application strategies.
            </p>
            <div className="stf-price-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6l-2.5 1.4.5-2.9-2-2 2.7-.5L6 1z" fill="#c4963c"/>
              </svg>
              One-time payment · $5
            </div>
          </div>

          <div className="stf-body">
            <div className="stf-row">
              <div className="stf-field">
                <label className="stf-label">Country</label>
                <input
                  className="stf-input"
                  name="country"
                  placeholder="e.g. Uganda"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
              <div className="stf-field">
                <label className="stf-label">Academic Level</label>
                <select
                  className="stf-select"
                  name="academicLevel"
                  value={form.academicLevel}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select level</option>
                  {academicLevels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="stf-field">
              <label className="stf-label">Course of Study</label>
              <input
                className="stf-input"
                name="course"
                placeholder="e.g. Computer Science, Public Health"
                value={form.course}
                onChange={handleChange}
              />
            </div>

            <div className="stf-field">
              <label className="stf-label">Email Address</label>
              <input
                className="stf-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="stf-divider" />
            <p className="stf-optional-label">Optional</p>

            <div className="stf-field">
              <label className="stf-label">WhatsApp Number</label>
              <input
                className="stf-input"
                name="whatsapp"
                placeholder="+256 700 000 000"
                value={form.whatsapp}
                onChange={handleChange}
              />
            </div>

            <button
              className="stf-btn"
              type="button"
              disabled={loading || !isValid}
              onClick={handleSubmit}
            >
              <span className="stf-btn-inner">
                {loading ? (
                  <>
                    <span className="stf-spinner" />
                    Redirecting to payment…
                  </>
                ) : (
                  <>
                    Pay $5 & Get My Toolkit
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </span>
            </button>

            {error && (
              <div className="stf-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink: 0}}>
                  <circle cx="8" cy="8" r="7" stroke="#fca5a5" strokeWidth="1.2"/>
                  <path d="M8 4.5v4M8 10.5v1" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="stf-footer">
            <p className="stf-trust">
              Secured by Pesapal. <span>Your data personalises your toolkit only.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}