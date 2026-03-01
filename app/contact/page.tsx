"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
  .ct-page { font-family:'Sora',sans-serif; background:var(--midnight); color:var(--cream); min-height:100vh; overflow-x:hidden; }
  .ct-hero { position:relative; padding:100px 48px 72px; text-align:center; overflow:hidden; }
  @media(max-width:640px){ .ct-hero { padding:80px 24px 56px; } }
  .ct-hero-bg { position:absolute; inset:0; z-index:0; background: radial-gradient(ellipse 60% 50% at 50% -10%,rgba(232,160,32,.07),transparent 60%), var(--midnight); }
  .ct-hero-inner { position:relative; z-index:1; max-width:600px; margin:0 auto; }
  .ct-label { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-light); background:rgba(232,160,32,.1); border:1px solid rgba(232,160,32,.25); padding:5px 14px; border-radius:100px; margin-bottom:24px; }
  .ct-headline { font-family:'Cormorant Garant',serif; font-size:clamp(36px,5vw,58px); font-weight:600; line-height:1.05; letter-spacing:-.02em; color:var(--ivory); margin-bottom:16px; }
  .ct-headline em { font-style:italic; color:var(--gold); }
  .ct-sub { font-size:15px; font-weight:300; color:var(--soft); line-height:1.7; max-width:480px; margin:0 auto; }
  .ct-inner { max-width:1100px; margin:0 auto; padding:0 48px 100px; display:grid; grid-template-columns:1fr 1.7fr; gap:32px; }
  @media(max-width:900px){ .ct-inner { grid-template-columns:1fr; padding:0 24px 72px; } }
  .ct-info { display:flex; flex-direction:column; gap:16px; }
  .ct-info-card { background:var(--navy); border:1px solid rgba(245,237,214,.08); border-radius:14px; padding:24px; }
  .ct-info-title { font-family:'Cormorant Garant',serif; font-size:18px; font-weight:600; color:var(--ivory); margin-bottom:16px; }
  .ct-contact-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; }
  .ct-contact-row:last-child { margin-bottom:0; }
  .ct-contact-icon { width:34px; height:34px; border-radius:8px; background:rgba(232,160,32,.1); border:1px solid rgba(232,160,32,.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ct-contact-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(196,207,223,.5); margin-bottom:3px; }
  .ct-contact-val { font-size:13px; font-weight:300; color:var(--soft); text-decoration:none; display:block; transition:color .2s; }
  .ct-contact-val:hover { color:var(--gold); }
  .ct-consult-card { background:linear-gradient(135deg,rgba(232,160,32,.12),rgba(196,90,42,.1)); border:1px solid rgba(232,160,32,.2); border-radius:14px; padding:24px; }
  .ct-consult-title { font-family:'Cormorant Garant',serif; font-size:20px; font-weight:600; color:var(--ivory); margin-bottom:8px; }
  .ct-consult-sub { font-size:13px; font-weight:300; color:var(--soft); margin-bottom:20px; opacity:.8; line-height:1.6; }
  .ct-consult-btn { display:inline-flex; align-items:center; gap:7px; background:var(--gold); color:var(--midnight); border:none; border-radius:8px; padding:10px 20px; font-family:'Sora',sans-serif; font-size:13px; font-weight:600; cursor:pointer; text-decoration:none; transition:background .2s; }
  .ct-consult-btn:hover { background:var(--gold-light); }
  .ct-form-card { background:var(--navy); border:1px solid rgba(245,237,214,.08); border-radius:14px; padding:36px; }
  .ct-form-title { font-family:'Cormorant Garant',serif; font-size:22px; font-weight:600; color:var(--ivory); margin-bottom:6px; }
  .ct-form-sub { font-size:13px; font-weight:300; color:var(--soft); opacity:.7; margin-bottom:28px; }
  .ct-form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:600px){ .ct-form-row { grid-template-columns:1fr; } }
  .ct-field { margin-bottom:18px; }
  .ct-field-label { display:block; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(196,207,223,.55); margin-bottom:7px; }
  .ct-input,.ct-select,.ct-textarea { width:100%; background:rgba(8,13,26,.6); border:1px solid rgba(245,237,214,.1); border-radius:10px; padding:12px 14px; font-family:'Sora',sans-serif; font-size:14px; font-weight:300; color:var(--ivory); outline:none; transition:border-color .2s,box-shadow .2s; box-sizing:border-box; }
  .ct-input::placeholder,.ct-textarea::placeholder { color:rgba(196,207,223,.3); }
  .ct-input:focus,.ct-select:focus,.ct-textarea:focus { border-color:rgba(232,160,32,.45); box-shadow:0 0 0 3px rgba(232,160,32,.08); }
  .ct-select { -webkit-appearance:none; cursor:pointer; }
  .ct-select option { background:#0E1729; }
  .ct-textarea { resize:vertical; min-height:130px; }
  .ct-submit { width:100%; height:50px; background:var(--gold); border:none; border-radius:10px; font-family:'Sora',sans-serif; font-size:14px; font-weight:600; color:var(--midnight); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .2s,transform .15s,box-shadow .2s; margin-top:6px; }
  .ct-submit:hover { background:var(--gold-light); box-shadow:0 8px 24px rgba(232,160,32,.25); transform:translateY(-1px); }
  .ct-submit:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .ct-success { background:rgba(34,197,94,.08); border:1px solid rgba(34,197,94,.2); border-radius:12px; padding:20px 24px; text-align:center; margin-top:20px; }
  .ct-success-title { font-family:'Cormorant Garant',serif; font-size:20px; font-weight:600; color:#86efac; margin-bottom:6px; }
  .ct-success-sub { font-size:13px; font-weight:300; color:rgba(134,239,172,.7); }
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (replace with real API call when ready)
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    setFormData({ name:"", email:"", phone:"", subject:"", message:"" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="ct-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section className="ct-hero">
        <div className="ct-hero-bg" />
        <div className="ct-hero-inner">
          <div className="ct-label">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Contact
          </div>
          <h1 className="ct-headline">Let&apos;s start your<br /><em>journey</em> together</h1>
          <p className="ct-sub">Have questions about scholarships, applications, or our services? We respond within 24 hours.</p>
        </div>
      </section>

      <div className="ct-inner">
        {/* â”€â”€ Left column â”€â”€ */}
        <div className="ct-info">
          <div className="ct-info-card">
            <p className="ct-info-title">Contact Information</p>
            {[
              { Icon: Mail,           label:"Email",      val:"info@ailesglobal.com",  href:"mailto:info@ailesglobal.com" },
              { Icon: Phone,          label:"Phone",      val:"+256 786 367 460",       href:"tel:+256786367460" },
              { Icon: Phone,          label:"",           val:"+256 704 833 021",       href:"tel:+256704833021" },
              { Icon: MessageCircle,  label:"WhatsApp",   val:"+256 786 367 460",       href:"https://wa.me/256786367460" },
            ].map(({ Icon, label, val, href }, i) => (
              <div className="ct-contact-row" key={i}>
                <div className="ct-contact-icon"><Icon size={15} color="var(--gold)" /></div>
                <div>
                  {label && <p className="ct-contact-label">{label}</p>}
                  <a href={href} className="ct-contact-val">{val}</a>
                </div>
              </div>
            ))}
            <div className="ct-contact-row">
              <div className="ct-contact-icon"><MapPin size={15} color="var(--gold)" /></div>
              <div>
                <p className="ct-contact-label">Uganda Office</p>
                <span className="ct-contact-val">Access Building, Rubaga Road<br />Kampala, Uganda</span>
              </div>
            </div>
            <div className="ct-contact-row">
              <div className="ct-contact-icon"><MapPin size={15} color="var(--gold)" /></div>
              <div>
                <p className="ct-contact-label">South Africa</p>
                <span className="ct-contact-val">Corner Jan Smuts &amp; Bolton Rd<br />Rosebank, Johannesburg</span>
              </div>
            </div>
          </div>

          <div className="ct-consult-card">
            <p className="ct-consult-title">Free Consultation</p>
            <p className="ct-consult-sub">Book a one-on-one session with our expert consultants â€” no commitment required.</p>
            <Link href="/pricing" className="ct-consult-btn">
              Schedule Now
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* â”€â”€ Right column: form â”€â”€ */}
        <div className="ct-form-card">
          <p className="ct-form-title">Send Us a Message</p>
          <p className="ct-form-sub">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

          {sent ? (
            <div className="ct-success">
              <p className="ct-success-title">Message received âœ”</p>
              <p className="ct-success-sub">We&apos;ll get back to you within 24 hours. Check your inbox!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ct-form-row">
                <div className="ct-field">
                  <label className="ct-field-label">Full Name *</label>
                  <input type="text" name="name" className="ct-input" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="ct-field">
                  <label className="ct-field-label">Email *</label>
                  <input type="email" name="email" className="ct-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="ct-field">
                <label className="ct-field-label">Phone</label>
                <input type="tel" name="phone" className="ct-input" placeholder="+234 XXX XXX XXXX" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="ct-field">
                <label className="ct-field-label">Subject *</label>
                <select name="subject" className="ct-select" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select a subject</option>
                  <option value="consultation">Book Consultation</option>
                  <option value="scholarship">Scholarship Inquiry</option>
                  <option value="application">Application Support</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="ct-field">
                <label className="ct-field-label">Message *</label>
                <textarea name="message" className="ct-textarea" placeholder="Tell us how we can help youâ€¦" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? (
                  <svg style={{ animation:"spin .8s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : <Send size={16} />}
                {loading ? "Sendingâ€¦" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
