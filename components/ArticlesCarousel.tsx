"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { articles } from "@/data/articles";

export default function ArticlesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselArticles = articles.slice(0, 3);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselArticles.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === carouselArticles.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative py-8 md:py-16 px-4 md:px-6 -mt-16 md:-mt-24 z-30">
      {/* Background that blends with hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="section-label">Latest Articles</span>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 z-20 btn-icon bg-surface border-surface-light hover:bg-surface-light"
            aria-label="Previous article"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 z-20 btn-icon bg-surface border-surface-light hover:bg-surface-light"
            aria-label="Next article"
          >
            <ArrowRight size={18} />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden mx-8 md:mx-0">
            <motion.div
              className="flex gap-4 md:gap-6"
              animate={{
                x: `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {carouselArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <Link href={`/articles/${article.slug}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden bg-surface border border-surface-light/30 hover:border-surface-light transition-all duration-300">
                      {/* Article Image - Matching hero gradient colors */}
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 via-blue-600/20 to-cyan-500/30" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 via-transparent to-transparent" />
                        <div className="absolute inset-0 grid-pattern opacity-20" />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        
                        {/* Gradient overlay for text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                      </div>

                      {/* Article Content */}
                      <div className="p-5 md:p-6 -mt-16 relative z-10">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs font-mono bg-background/50 border border-surface-light/50 rounded-full text-gray-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-mono text-base md:text-lg font-semibold text-gray-light mb-2 line-clamp-2 group-hover:text-white transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-sm text-gray-muted line-clamp-2 mb-4">
                          {article.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-muted">
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-muted group-hover:text-gray-light transition-colors">
                            Read
                            <ArrowRight
                              size={14}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {carouselArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gray-light w-8"
                    : "bg-surface-light w-2 hover:bg-gray-muted"
                }`}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <Link
            href="/articles"
            className="text-sm text-gray-muted hover:text-gray-light transition-colors flex items-center gap-2 group"
          >
            View all articles
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
