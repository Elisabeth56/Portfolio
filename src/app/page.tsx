import { Desk } from "@/components/desk/desk";
import { Dock } from "@/components/desk/dock";
import { ProjectWindowProvider } from "@/components/desk/project-window";
import { Startup } from "@/components/desk/startup";
import { SystemCards } from "@/components/desk/system-cards";
import { ProjectChapter } from "@/components/trace/project-chapter";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const [lead, ...others] = projects;

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
        <ProjectWindowProvider>
          <Startup />
          <Desk />
          <ProjectChapter project={lead} aside="they have to disagree" />
          <SystemCards projects={others} />
          <Dock />
        </ProjectWindowProvider>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
