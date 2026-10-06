import { Desk } from "@/components/desk/desk";
import { Dock } from "@/components/desk/dock";
import { Startup } from "@/components/desk/startup";
import { ProjectChapter } from "@/components/trace/project-chapter";
import { projects } from "@/content/projects";
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
        <ProjectChapter project={projects[0]} aside="they have to disagree" />
        <Dock />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
