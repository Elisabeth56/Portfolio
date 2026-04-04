"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { articles } from "@/data/articles";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-6">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="decorative-circle w-[400px] h-[400px] -top-20 -right-20 opacity-10" />
        <div className="decorative-circle w-[300px] h-[300px] bottom-20 -left-20 opacity-10" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-muted hover:text-gray-light transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label block mb-4">... /Articles ...</span>
          <h1 className="mono-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-light">
            Articles
          </h1>
          <p className="mt-4 text-gray-muted max-w-xl">
            Thoughts, tutorials, and insights on AI-native development,
            automation, and building intelligent systems at scale.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/articles/${article.slug}`}>
                <div className="group bg-surface rounded-2xl p-6 md:p-8 border border-surface-light/30 hover:border-surface-light transition-all duration-300 card-hover">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Article Image - Matching hero gradient */}
                    <div className="w-full md:w-48 h-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-blue-600/30 to-cyan-500/40" />
                      <div className="absolute inset-0 grid-pattern opacity-40" />
                    </div>

                    {/* Article Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-muted">
                        <time>{article.date}</time>
                        <span className="w-1 h-1 rounded-full bg-gray-muted" />
                        <span>{article.readTime}</span>
                      </div>

                      <h2 className="mono-heading text-xl md:text-2xl font-semibold text-gray-light group-hover:text-white transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-gray-muted leading-relaxed line-clamp-2">
                        {article.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {article.tags.map((tag) => (
                          <span key={tag} className="tech-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 pt-2 text-gray-muted group-hover:text-gray-light transition-colors">
                        <span className="text-sm">Read article</span>
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
