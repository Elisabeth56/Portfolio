import { AdaptiveShell, WS_BOOTSTRAP } from "@/components/AdaptiveShell";
import { DocumentView } from "@/components/document/DocumentView";
import { site } from "@/content/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.domain,
  email: `mailto:${site.links.email}`,
  description: site.intro,
  sameAs: [site.links.github, site.links.linkedin, site.links.x],
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  knowsAbout: [
    "Multi-agent systems",
    "LLM orchestration",
    "Retrieval-augmented generation",
    "Full-stack engineering",
  ],
};

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: WS_BOOTSTRAP }} />
      <AdaptiveShell>
        <DocumentView />
      </AdaptiveShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
