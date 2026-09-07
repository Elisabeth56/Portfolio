import type { Metadata } from "next";
import { DocumentView } from "@/components/document/DocumentView";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "The full portfolio as a single document: five AI systems, the decisions behind them, and the working method that produced them.",
  alternates: { canonical: "/read" },
};

export default function ReadPage() {
  return (
    <>
      <DocumentView />
      <script
        type="application/ld+json"
        // Structured data is static, authored here rather than user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            jobTitle: site.role,
            url: site.domain,
            email: `mailto:${site.links.email}`,
            sameAs: [site.links.github, site.links.linkedin, site.links.x],
            address: { "@type": "PostalAddress", addressCountry: "NG" },
          }),
        }}
      />
    </>
  );
}
