"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface SkillCategory {
  title: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Front-end",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "React Query",
    ],
  },
  {
    title: "Back-end",
    skills: [
      "Node.js",
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "Redis",
      "REST APIs",
    ],
  },
  {
    title: "AI & ML",
    skills: [
      "LangChain",
      "LlamaIndex",
      "OpenAI API",
      "Groq API",
      "LLaMA 3",
      "Mistral",
      "RAG Pipelines",
    ],
  },
  {
    title: "DevOps",
    skills: ["Vercel", "Docker", "CI/CD", "Git", "GitHub Actions"],
  },
];

export default function AboutMe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6 relative" ref={ref}>
      {/* Decorative circle */}
      <div className="decorative-circle w-[500px] h-[500px] top-0 right-0 opacity-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label">... /About me ...</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Intro & Skills */}
          <div className="space-y-10">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-xl text-gray-muted leading-relaxed">
                Hello! I&apos;m Elisabeth, an{" "}
                <span className="text-gray-light font-semibold">
                  AI Full-Stack Engineer
                </span>
                .
                <br />
                More than{" "}
                <span className="text-gray-light font-semibold underline decoration-cyan-500 underline-offset-4">
                  3 years
                </span>{" "}
                experience building intelligent systems.
              </p>
            </motion.div>

            {/* Skills Grid */}
            <div className="space-y-6">
              {skillCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
                  className="group"
                >
                  <div className="bg-surface rounded-2xl p-6 border border-surface-light/50 hover:border-surface-light transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-mono text-lg font-semibold text-gray-light">
                        {category.title}
                      </h3>
                      {categoryIndex === 2 && (
                        <button className="btn-icon w-8 h-8">
                          <ArrowUpRight size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-muted leading-relaxed">
                      {category.skills.join(" / ")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Favorite Technologies Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-gray-muted"
            >
              Passionate about{" "}
              <span className="text-gray-light font-medium">
                building AI-powered applications
              </span>{" "}
              that solve real problems
            </motion.p>
          </div>

          {/* Right Column - Profile Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              {/* Gradient matching hero colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-blue-600/30 to-cyan-500/40" />
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/70 via-gray-900/30 to-transparent" />
              <div className="absolute inset-0 grid-pattern opacity-30" />
              
              {/* Placeholder text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-muted/50 font-mono text-sm">Profile Image</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-cyan-500/30 rounded-full opacity-50" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-purple-500/30 rounded-full opacity-40" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
