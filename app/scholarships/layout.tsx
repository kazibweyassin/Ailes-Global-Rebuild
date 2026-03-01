import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Find Scholarships - 500+ Fully Funded Opportunities for African Students",
  description:
    "Browse 500+ scholarships for African students to study in the UK, USA, Canada, Germany, Australia and more. Filter by country, degree level, field of study, and deadline. Find your perfect match today.",
  keywords: [
    "scholarships for African students",
    "fully funded scholarships",
    "study abroad scholarships",
    "UK scholarships Africa",
    "USA scholarships Africa",
    "Canada scholarships",
    "Germany scholarships",
    "women scholarships Africa",
    "scholarship finder",
    "international scholarships 2025",
  ],
  canonicalUrl: "/scholarships",
});

export default function ScholarshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Scholarships for African Students",
    description:
      "A curated list of 500+ scholarships for African students to study abroad.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships`,
    numberOfItems: 500,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Fully Funded UK Scholarships",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships?country=United+Kingdom&type=FULL`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "USA Scholarships for African Students",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships?country=United+States&type=FULL`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Women-Only Scholarships",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships?forWomen=true`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Canada Scholarships",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships?country=Canada`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Germany Scholarships",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships?country=Germany`,
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}` },
      { "@type": "ListItem", position: 2, name: "Scholarships", item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ailesglobal.com"}/scholarships` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
