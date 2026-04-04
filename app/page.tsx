"use client";

import {
  Header,
  Hero,
  ArticlesCarousel,
  AboutMe,
  WorkExperience,
  Projects,
  Articles,
  Contacts,
} from "@/components";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <ArticlesCarousel />
        <AboutMe />
        <WorkExperience />
        <Projects />
        <Articles />
        <Contacts />
      </div>
    </main>
  );
}
