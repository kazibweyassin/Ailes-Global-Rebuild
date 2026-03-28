import ScholarshipToolkitPayment from "./ScholarshipToolkitPayment";
import ScholarshipToolkitForm from "./ScholarshipToolkitForm";

export default function ScholarshipToolkitPage() {
  // In production, use state or query params to show form only after payment
  // For demo, show both
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      {/* <ScholarshipToolkitPayment /> */}
      <hr />
      <ScholarshipToolkitForm />
    </div>
  );
}
