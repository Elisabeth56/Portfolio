"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  features?: string[];
}

const projects: Project[] = [
  {
    id: "ai-finance-dashboard",
    title: "AI Finance Dashboard",
    description:
      "A comprehensive system that analyzes financial statements, categorizes spending patterns, and enables users to query their financial data using natural language processing.",
    tags: ["Next.js", "TypeScript", "Supabase", "LangChain", "GPT-4"],
    features: [
      "Natural language queries for financial insights",
      "Automated spending categorization using AI",
      "Real-time dashboard with interactive visualizations",
    ],
  },
  {
    id: "ai-productivity-system",
    title: "AI Productivity System",
    description:
      "A SaaS application that intelligently organizes tasks and notes, then generates personalized daily and weekly plans using AI-powered reasoning and prioritization.",
    tags: ["React", "FastAPI", "PostgreSQL", "LLaMA 3", "Groq API"],
    features: [
      "AI-generated daily and weekly planning",
      "Smart task prioritization and scheduling",
      "Context-aware note organization",
    ],
  },
  {
    id: "automation-dashboards",
    title: "Automation Dashboards",
    description:
      "Internal tools built for businesses to streamline workflows, automate repetitive processes, track operational data, and significantly reduce manual operations.",
    tags: ["Next.js", "Supabase", "Mistral", "LlamaIndex", "Redis"],
    features: [
      "Workflow automation with AI decision-making",
      "Real-time operational metrics tracking",
      "Automated report generation and insights",
    ],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6 relative" ref={ref}>
      {/* Decorative circles */}
      <div className="decorative-circle w-[400px] h-[400px] -top-20 -left-20 opacity-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">... /Projects ...</span>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Project Info */}
              <div
                className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="space-y-4">
                  <h3 className="mono-heading text-3xl md:text-4xl font-bold text-gray-light">
                    {project.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-muted leading-relaxed">
                    {project.description}
                  </p>

                  {project.features && (
                    <ul className="space-y-2">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-muted text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 group"
                >
                  <span className="btn-icon bg-surface">
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </motion.button>
              </div>

              {/* Project Images - Matching hero gradient */}
              <div
                className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Main image */}
                  <div className="col-span-2 aspect-video rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-blue-600/30 to-cyan-500/40" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    
                    {/* Project icon/badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                      <span className="text-xs font-mono text-gray-light">{project.id}</span>
                    </div>
                  </div>

                  {/* Secondary images */}
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-blue-700/25 to-cyan-600/30" />
                    <div className="absolute inset-0 grid-pattern opacity-40" />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-700/30 via-blue-600/25 to-purple-700/30" />
                    <div className="absolute inset-0 grid-pattern opacity-40" />
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -z-10 -bottom-8 -right-8 w-48 h-48 rounded-full border border-surface-light/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
