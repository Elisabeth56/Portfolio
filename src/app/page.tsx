import { Desk } from "@/components/desk/desk";
import { Dock } from "@/components/desk/dock";
import { Startup } from "@/components/desk/startup";
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
      <main data-ui="desk" className="min-h-dvh">
        <Startup />
        <Desk />
        <Dock />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
