"use client";
import { useState } from "react";

export default function ScholarshipToolkitPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pesapal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5,
          description: "Personalized Scholarship Toolkit",
          email: "user@email.com", // Replace with actual user email if available
          callback_url: `${window.location.origin}/scholarship-toolkit/after-payment`,
        }),
      });
      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setError("Failed to get payment link.");
      }
    } catch (e) {
      setError("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Your Personalized Scholarship Toolkit</h2>
      <p>Pay $5 to receive a custom PDF with scholarships, guides, and templates.</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay $5 with Pesapal"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
