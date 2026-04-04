"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { articles } from "@/data/articles";

export default function Articles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="articles" className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mono-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-light">
            Articles
          </h2>
        </motion.div>

        {/* Pagination Dots (Left side) */}
        <div className="flex gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center gap-3 pt-8"
          >
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-mono transition-all duration-300 ${
                  num === 1
                    ? "border-gray-light text-gray-light"
                    : "border-surface-light text-gray-muted hover:border-gray-light hover:text-gray-light"
                }`}
              >
                {num}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <div className="flex-1 grid md:grid-cols-2 gap-6">
            {articles.slice(0, 4).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Link href={`/articles/${article.slug}`} className="block h-full">
                  <div className="group bg-surface rounded-2xl p-6 border border-surface-light/30 hover:border-surface-light transition-all duration-300 card-hover h-full">
                    {/* Article preview gradient - matching hero */}
                    <div className="h-2 w-full rounded-full mb-4 bg-gradient-to-r from-purple-700/50 via-blue-600/40 to-cyan-500/50" />
                    
                    <div className="space-y-4">
                      <h3 className="mono-heading text-xl font-semibold text-gray-light leading-tight group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-muted leading-relaxed line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="px-4 py-2 border border-surface-light rounded-full text-sm text-gray-muted group-hover:border-gray-light group-hover:text-gray-light transition-colors">
                          Read more
                        </span>
                        <span className="btn-icon w-8 h-8 border-surface-light text-gray-muted group-hover:border-gray-light group-hover:text-gray-light">
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* View All Articles Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/articles"
            className="btn-primary flex items-center gap-3 group"
          >
            <span>View All Articles</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
