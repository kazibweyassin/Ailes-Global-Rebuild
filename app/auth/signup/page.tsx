"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";

// Client-side validation schema (matches server-side)
// Base schema without refine for field-level validation
const signUpBaseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

// Full schema with password match validation
const signUpSchema = signUpBaseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  country?: string;
  _form?: string; // For general form errors
};

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  // Validate single field
  const validateField = (name: keyof typeof formData, value: string) => {
    try {
      // Use base schema for individual field validation (without refine)
      if (name === "name") {
        signUpBaseSchema.shape.name.parse(value);
      } else if (name === "email") {
        signUpBaseSchema.shape.email.parse(value);
      } else if (name === "password") {
        signUpBaseSchema.shape.password.parse(value);
        // Also validate confirmPassword if it exists
        if (formData.confirmPassword) {
          signUpSchema.parse({ ...formData, password: value, confirmPassword: formData.confirmPassword });
        }
      } else if (name === "confirmPassword") {
        signUpSchema.parse({ ...formData, confirmPassword: value });
      }
      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path.includes(name));
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldError.message,
          }));
        }
      }
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          if (path) {
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      country: true,
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let res: Response;
      try {
        res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
          }),
          signal: controller.signal,
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Handle network errors
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out. Please check your connection and try again.");
        }
        if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('NetworkError')) {
          throw new Error("Network error. Please check your internet connection and try again.");
        }
        throw new Error("Failed to connect to server. Please try again later.");
      }
      clearTimeout(timeoutId);

      // Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      let data: any;
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (jsonError) {
          throw new Error("Invalid response from server. Please try again.");
        }
      } else {
        // Server returned non-JSON (HTML error page, etc.)
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server error (${res.status}). Please try again later.`);
      }

      if (!res.ok) {
        console.error('Signup error response:', data);
        
        // Map server-side Zod errors to form fields
        if (data.details && Array.isArray(data.details)) {
          const fieldErrors: FormErrors = {};
          data.details.forEach((detail: any) => {
            const field = detail.path?.[0] as keyof FormErrors;
            if (field && field !== "_form") {
              fieldErrors[field] = detail.message || `${field} is invalid`;
            }
          });
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setLoading(false);
            return;
          }
        }
        
        // General error
        const errorMsg = data.error || "Failed to create account";
        setErrors({ _form: errorMsg });
        setLoading(false);
        return;
      }

      // Show success message briefly before redirect
      setErrors({}); // Clear any previous errors
      
      // Auto sign in after signup with error handling
      try {
        await router.push("/auth/signin?registered=true");
      } catch (redirectError) {
        // If redirect fails, show success message and manual link
        console.error('Redirect error:', redirectError);
        setErrors({ _form: "Account created successfully! Please sign in manually." });
        // Still allow user to navigate manually
        setTimeout(() => {
          window.location.href = "/auth/signin?registered=true";
        }, 2000);
      }
    } catch (err: any) {
      // Provide user-friendly error messages
      const errorMessage = err.message || "An unexpected error occurred. Please try again.";
      setErrors({ _form: errorMessage });
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;1,400&family=Sora:wght@300;400;500;600&display=swap');
        .auth-shell { font-family:'Sora',sans-serif; min-height:100vh; background:#080D1A; display:flex; align-items:center; justify-content:center; padding:24px 24px 48px; position:relative; overflow:hidden; }
        .auth-shell-bg { position:absolute; inset:0; z-index:0; background: radial-gradient(ellipse 60% 50% at 30% 0%,rgba(232,160,32,.07),transparent 60%), radial-gradient(ellipse 40% 50% at 80% 100%,rgba(196,90,42,.07),transparent 55%); }
        .auth-card { position:relative; z-index:1; width:100%; max-width:460px; background:#0E1729; border:1px solid rgba(245,237,214,.08); border-radius:20px; padding:40px; box-shadow:0 40px 100px rgba(0,0,0,.5); }
        .auth-logo { text-align:center; margin-bottom:28px; }
        .auth-logo-name { font-family:'Cormorant Garant',serif; font-size:26px; font-weight:600; color:#F5EDD6; letter-spacing:-.01em; }
        .auth-logo-name em { font-style:italic; color:#E8A020; }
        .auth-logo-sub { font-size:12px; font-weight:300; color:rgba(196,207,223,.5); margin-top:4px; }
        .auth-heading { font-family:'Cormorant Garant',serif; font-size:26px; font-weight:600; color:#F5EDD6; margin-bottom:4px; }
        .auth-sub { font-size:13px; font-weight:300; color:rgba(196,207,223,.6); margin-bottom:24px; }
        .auth-label { display:block; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(196,207,223,.6); margin-bottom:6px; }
        .auth-field-wrap { position:relative; margin-bottom:16px; }
        .auth-field-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(196,207,223,.35); pointer-events:none; }
        .auth-input { width:100%; height:44px; background:rgba(8,13,26,.6); border:1px solid rgba(245,237,214,.1); border-radius:10px; padding:0 14px 0 42px; font-family:'Sora',sans-serif; font-size:14px; font-weight:300; color:#F5EDD6; outline:none; transition:border-color .2s,box-shadow .2s; box-sizing:border-box; }
        .auth-input::placeholder { color:rgba(196,207,223,.3); }
        .auth-input:focus { border-color:rgba(232,160,32,.45); box-shadow:0 0 0 3px rgba(232,160,32,.08); }
        .auth-input.error { border-color:rgba(239,68,68,.5); }
        .auth-select { width:100%; height:44px; background:rgba(8,13,26,.6); border:1px solid rgba(245,237,214,.1); border-radius:10px; padding:0 14px; font-family:'Sora',sans-serif; font-size:14px; font-weight:300; color:#F5EDD6; outline:none; transition:border-color .2s; box-sizing:border-box; -webkit-appearance:none; cursor:pointer; }
        .auth-select:focus { border-color:rgba(232,160,32,.45); box-shadow:0 0 0 3px rgba(232,160,32,.08); }
        .auth-select option { background:#0E1729; }
        .auth-error-inline { font-size:11px; color:#f87171; margin-top:-10px; margin-bottom:12px; display:flex; align-items:center; gap:4px; }
        .auth-banner { border-radius:10px; padding:12px 14px; font-size:13px; display:flex; align-items:flex-start; gap:8px; margin-bottom:18px; }
        .auth-banner.error { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2); color:#fca5a5; }
        .auth-strength { display:flex; gap:4px; margin-top:6px; margin-bottom:4px; }
        .auth-strength-bar { height:3px; flex:1; border-radius:2px; background:rgba(245,237,214,.08); transition:background .3s; }
        .auth-strength-text { font-size:11px; color:rgba(196,207,223,.5); }
        .auth-check-row { display:flex; align-items:flex-start; gap:10px; margin:14px 0 18px; }
        .auth-check-row input[type=checkbox] { margin-top:2px; accent-color:#E8A020; }
        .auth-check-row label { font-size:12px; font-weight:300; color:rgba(196,207,223,.6); line-height:1.5; }
        .auth-check-row a { color:#E8A020; text-decoration:none; }
        .auth-check-row a:hover { color:#F5C55A; }
        .auth-btn-primary { width:100%; height:48px; background:#E8A020; border:none; border-radius:10px; font-family:'Sora',sans-serif; font-size:14px; font-weight:600; color:#080D1A; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .2s,transform .15s,box-shadow .2s; margin-bottom:16px; }
        .auth-btn-primary:hover { background:#F5C55A; box-shadow:0 8px 24px rgba(232,160,32,.25); transform:translateY(-1px); }
        .auth-btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .auth-divider { display:flex; align-items:center; gap:12px; margin:4px 0 16px; }
        .auth-divider-line { flex:1; height:1px; background:rgba(245,237,214,.07); }
        .auth-divider-text { font-size:11px; color:rgba(196,207,223,.35); letter-spacing:.08em; text-transform:uppercase; }
        .auth-btn-google { width:100%; height:46px; background:rgba(245,237,214,.04); border:1px solid rgba(245,237,214,.1); border-radius:10px; font-family:'Sora',sans-serif; font-size:13px; font-weight:400; color:rgba(196,207,223,.8); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:background .2s,border-color .2s,color .2s; margin-bottom:16px; }
        .auth-btn-google:hover { background:rgba(245,237,214,.07); border-color:rgba(245,237,214,.18); color:#F5EDD6; }
        .auth-footer-link { text-align:center; font-size:13px; color:rgba(196,207,223,.5); margin-top:4px; }
        .auth-footer-link a { color:#E8A020; font-weight:500; text-decoration:none; }
        .auth-footer-link a:hover { color:#F5C55A; }
        .auth-back { text-align:center; margin-top:24px; font-size:12px; color:rgba(196,207,223,.35); text-decoration:none; display:block; transition:color .2s; }
        .auth-back:hover { color:rgba(196,207,223,.65); }
        @keyframes auth-spin { to { transform:rotate(360deg); } }
        .auth-spin { animation:auth-spin .8s linear infinite; }
        @media(max-width:480px){ .auth-card { padding:28px 20px; } }
      ` }} />
      <div className="auth-shell">
        <div className="auth-shell-bg" />
        <div className="auth-card">
          <div className="auth-logo">
            <Link href="/">
              <div className="auth-logo-name">Ailes <em>Global</em></div>
            </Link>
            <p className="auth-logo-sub">Start your journey to study abroad</p>
          </div>

          <h1 className="auth-heading">Create Account</h1>
          <p className="auth-sub">Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            {errors._form && (
              <div className="auth-banner error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {errors._form}
              </div>
            )}

            <label className="auth-label" htmlFor="name">Full Name</label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input id="name" type="text" placeholder="Your full name" className={`auth-input${errors.name ? ' error' : ''}`}
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); if (touched.name) validateField('name', e.target.value); }}
                onBlur={() => { setTouched(p => ({...p, name:true})); validateField('name', formData.name); }}
                required />
            </div>
            {errors.name && touched.name && <p className="auth-error-inline">{errors.name}</p>}

            <label className="auth-label" htmlFor="email">Email Address</label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input id="email" type="email" placeholder="you@example.com" className={`auth-input${errors.email ? ' error' : ''}`}
                value={formData.email}
                onChange={(e) => { setFormData({...formData, email: e.target.value}); if (touched.email) validateField('email', e.target.value); }}
                onBlur={() => { setTouched(p => ({...p, email:true})); validateField('email', formData.email); }}
                required />
            </div>
            {errors.email && touched.email && <p className="auth-error-inline">{errors.email}</p>}

            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="password" type="password" placeholder="••••••••" className={`auth-input${errors.password ? ' error' : ''}`}
                value={formData.password}
                onChange={(e) => { setFormData({...formData, password: e.target.value}); checkPasswordStrength(e.target.value); if (touched.password) validateField('password', e.target.value); }}
                onBlur={() => { setTouched(p => ({...p, password:true})); validateField('password', formData.password); }}
                required />
            </div>
            {formData.password && (
              <div style={{ marginTop:'-10px', marginBottom:'12px' }}>
                <div className="auth-strength">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="auth-strength-bar" style={{ background: i <= passwordStrength ? (passwordStrength === 1 ? '#ef4444' : passwordStrength === 2 ? '#f97316' : passwordStrength === 3 ? '#eab308' : '#22c55e') : undefined }} />
                  ))}
                </div>
                {passwordStrength > 0 && <p className="auth-strength-text">{getPasswordStrengthText()}</p>}
              </div>
            )}
            {errors.password && touched.password && <p className="auth-error-inline">{errors.password}</p>}

            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="confirmPassword" type="password" placeholder="••••••••" className={`auth-input${errors.confirmPassword ? ' error' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); if (touched.confirmPassword) validateField('confirmPassword', e.target.value); }}
                onBlur={() => { setTouched(p => ({...p, confirmPassword:true})); validateField('confirmPassword', formData.confirmPassword); }}
                required />
            </div>
            {errors.confirmPassword && touched.confirmPassword && <p className="auth-error-inline">{errors.confirmPassword}</p>}

            <label className="auth-label" htmlFor="phone">Phone <span style={{ textTransform:'none', opacity:.5 }}>(optional)</span></label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.26v-.34z"/></svg>
              <input id="phone" type="tel" placeholder="+254 700 000 000" className="auth-input"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>

            <label className="auth-label" htmlFor="country">Country <span style={{ textTransform:'none', opacity:.5 }}>(optional)</span></label>
            <div className="auth-field-wrap">
              <svg className="auth-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <input id="country" type="text" placeholder="Kenya" className="auth-input"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})} />
            </div>

            <div className="auth-check-row">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link></label>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <svg className="auth-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : null}
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            <button type="button" className="auth-btn-google" onClick={() => signIn("google", { callbackUrl:"/dashboard" })}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="auth-footer-link">Already have an account? <Link href="/auth/signin">Sign in</Link></p>
          <Link href="/" className="auth-back">← Back to home</Link>
        </div>
      </div>
    </>
  );
}
