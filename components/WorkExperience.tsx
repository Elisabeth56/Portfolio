"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectHighlight {
  title: string;
  description: string;
}

interface WorkExperience {
  period: string;
  duration: string;
  company: string;
  type: string;
  role: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  projects?: ProjectHighlight[];
}

const experience: WorkExperience = {
  period: "2022 – Present",
  duration: "3+ years",
  company: "Self-Employed",
  type: "Remote",
  role: "Freelance AI Full-Stack Engineer",
  description:
    "Design and develop full-stack web applications with integrated AI functionality, focusing on automation systems, SaaS platforms, and internal business tools. Deliver end-to-end solutions from concept and architecture to deployment and optimization.",
  responsibilities: [
    "Built AI-powered web applications using modern full-stack technologies, integrating LLM APIs for chat, data analysis, and automation",
    "Developed internal dashboards and workflow systems that automate repetitive business processes and improve operational efficiency",
    "Designed and implemented scalable backend architectures, including APIs, database schemas, and data pipelines",
    "Created AI-driven features such as document parsing, natural language querying, and intelligent recommendations",
    "Delivered SaaS-style applications with authentication, real-time updates, and user-focused interfaces",
    "Optimized AI performance (latency, cost, response quality) for production environments",
    "Managed full deployment lifecycle using platforms like Vercel and backend services like Supabase",
  ],
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
    "FastAPI",
    "Groq API",
    "LLaMA 3",
    "Mistral",
    "LangChain",
    "LlamaIndex",
  ],
  projects: [
    {
      title: "AI Finance Dashboard",
      description:
        "Built a system that analyzes financial statements, categorizes spending, and allows users to query their data using natural language",
    },
    {
      title: "AI Productivity System",
      description:
        "Developed a SaaS app that organizes tasks/notes and generates daily and weekly plans using AI reasoning",
    },
    {
      title: "Automation Dashboards",
      description:
        "Created internal tools for businesses to streamline workflows, track data, and reduce manual operations",
    },
  ],
};

export default function WorkExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 relative" ref={ref}>
      {/* Decorative elements */}
      <div className="decorative-circle w-[400px] h-[400px] -top-20 -right-20 opacity-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-start mb-16"
        >
          <h2 className="mono-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-light">
            Work
          </h2>
        </motion.div>

        {/* Main Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-surface rounded-3xl p-8 md:p-10 border border-surface-light/30"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h3 className="mono-heading text-2xl md:text-3xl font-bold text-gray-light mb-2">
                {experience.role}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-gray-muted">
                <span className="font-medium text-gray-light">
                  {experience.company}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-muted" />
                <span>{experience.type}</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="font-mono text-gray-light font-medium">
                {experience.period}
              </span>
              <span className="text-sm text-gray-muted">
                {experience.duration}
              </span>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-muted leading-relaxed mb-8 max-w-3xl"
          >
            {experience.description}
          </motion.p>

          {/* Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <h4 className="font-mono text-sm text-gray-muted uppercase tracking-wider mb-4">
              Key Responsibilities
            </h4>
            <ul className="space-y-3">
              {experience.responsibilities.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 text-gray-muted"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-light mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <h4 className="font-mono text-sm text-gray-muted uppercase tracking-wider mb-4">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                  className="px-3 py-1.5 bg-background border border-surface-light rounded-full text-sm text-gray-light font-mono"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Project Highlights */}
          {experience.projects && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h4 className="font-mono text-sm text-gray-muted uppercase tracking-wider mb-6">
                Selected Project Highlights
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {experience.projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="group bg-background rounded-xl p-5 border border-surface-light/50 hover:border-surface-light transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-mono text-gray-light font-semibold">
                        {project.title}
                      </h5>
                      <ArrowUpRight
                        size={16}
                        className="text-gray-muted group-hover:text-gray-light transition-colors"
                      />
                    </div>
                    <p className="text-sm text-gray-muted leading-relaxed">
                      {project.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Total Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-end mt-8"
        >
          <div className="text-right">
            <p className="text-sm text-gray-muted">Total Experience</p>
            <p className="font-mono text-lg text-gray-light font-semibold">
              3+ years in AI & Full-Stack
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
