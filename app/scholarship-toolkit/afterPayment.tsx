"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "ailes_toolkit_form";

type Status = "verifying" | "generating" | "done" | "error";

export default function AfterPaymentPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [pdfUrl, setPdfUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      // Pesapal appends OrderTrackingId and OrderMerchantReference to the callback URL
      const trackingId = searchParams?.get("OrderTrackingId");

      if (!trackingId) {
        setErrorMsg("Missing payment reference. Please contact support.");
        setStatus("error");
        return;
      }

      // 1. Verify payment status with Pesapal via your API
      try {
        const verifyRes = await fetch(`/api/pesapal/verify?tracking_id=${trackingId}`);
        const verifyData = await verifyRes.json();

        if (verifyData.payment_status_description !== "Completed") {
          setErrorMsg(
            `Payment not confirmed (status: ${verifyData.payment_status_description ?? "unknown"}). ` +
            "If you were charged, please contact support with your reference: " + trackingId
          );
          setStatus("error");
          return;
        }
      } catch (_err) {
        setErrorMsg("Could not verify payment. Please contact support with reference: " + trackingId);
        setStatus("error");
        return;
      }

      // 2. Retrieve form data from localStorage
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setErrorMsg(
          "Payment confirmed, but your form data was not found. " +
          "This can happen if you switched browsers. Please contact support."
        );
        setStatus("error");
        return;
      }

      const formData = JSON.parse(raw);

      // 3. Generate PDF
      setStatus("generating");
      try {
        const pdfRes = await fetch("/api/scholarship-toolkit/pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!pdfRes.ok) throw new Error("PDF generation failed");

        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setStatus("done");

        // Auto-download
        const a = document.createElement("a");
        a.href = url;
        a.download = "scholarship-toolkit.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up stored form data
        localStorage.removeItem(STORAGE_KEY);
      } catch (_err) {
        setErrorMsg(
          "Payment confirmed but PDF generation failed. " +
          "We'll send it to your email shortly, or contact support."
        );
        setStatus("error");
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        .ap-root {
          min-height: 100vh;
          background-color: #0d1117;
          background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(196, 150, 60, 0.12) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .ap-card {
          width: 100%;
          max-width: 480px;
          background: #13191f;
          border: 1px solid rgba(196, 150, 60, 0.2);
          border-radius: 4px;
          padding: 48px 44px;
          text-align: center;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .ap-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c4963c 0%, #e8c16a 50%, #c4963c 100%);
        }

        .ap-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .ap-icon-verifying { background: rgba(196, 150, 60, 0.1); }
        .ap-icon-generating { background: rgba(196, 150, 60, 0.1); }
        .ap-icon-done { background: rgba(34, 197, 94, 0.1); }
        .ap-icon-error { background: rgba(239, 68, 68, 0.1); }

        .ap-spinner {
          width: 28px;
          height: 28px;
          border: 2px solid rgba(196, 150, 60, 0.2);
          border-top-color: #c4963c;
          border-radius: 50%;
          animation: ap-spin 0.8s linear infinite;
        }

        @keyframes ap-spin { to { transform: rotate(360deg); } }

        .ap-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          font-weight: 600;
          color: #f0ead6;
          margin: 0 0 12px;
          line-height: 1.25;
        }

        .ap-body {
          font-size: 14px;
          color: #6b7685;
          line-height: 1.7;
          font-weight: 300;
          margin: 0 0 32px;
        }

        .ap-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, #c4963c, #e8c16a);
          border: none;
          border-radius: 3px;
          color: #0d1117;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }

        .ap-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ap-ref {
          margin-top: 20px;
          font-size: 11px;
          color: #3a4451;
          letter-spacing: 0.06em;
        }

        .ap-ref span { color: #5a6472; }

        @media (max-width: 480px) {
          .ap-card { padding: 36px 24px; }
        }
      `}</style>

      <div className="ap-root">
        <div className="ap-card">
          {status === "verifying" && (
            <>
              <div className="ap-icon ap-icon-verifying">
                <div className="ap-spinner" />
              </div>
              <h2 className="ap-title">Verifying Payment</h2>
              <p className="ap-body">Confirming your payment with Pesapal. This takes just a moment.</p>
            </>
          )}

          {status === "generating" && (
            <>
              <div className="ap-icon ap-icon-generating">
                <div className="ap-spinner" />
              </div>
              <h2 className="ap-title">Building Your Toolkit</h2>
              <p className="ap-body">Payment confirmed. We're generating your personalized scholarship PDF now.</p>
            </>
          )}

          {status === "done" && (
            <>
              <div className="ap-icon ap-icon-done">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-10" stroke="#86efac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="ap-title">Your Toolkit is Ready</h2>
              <p className="ap-body">
                Your download should have started automatically.
                If not, use the button below.
              </p>
              {pdfUrl && (
                <a className="ap-btn" href={pdfUrl} download="scholarship-toolkit.pdf">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8M4 6l3 3 3-3M1.5 12.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </a>
              )}
            </>
          )}

          {status === "error" && (
            <>
              <div className="ap-icon ap-icon-error">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 8v7M14 18v1" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="14" cy="14" r="12" stroke="#fca5a5" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 className="ap-title">Something Went Wrong</h2>
              <p className="ap-body">{errorMsg}</p>
              <p className="ap-ref">
                Need help? Email <span>support@ailesglobal.com</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}