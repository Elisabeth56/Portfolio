"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-blue-600/30 to-cyan-500/40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 via-transparent to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Actual image */}
      {!imageError && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover z-10"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

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
                  <div className="group bg-surface rounded-2xl overflow-hidden border border-surface-light/30 hover:border-surface-light transition-all duration-300 card-hover h-full">
                    {/* Article Image */}
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <ArticleImage
                        src={article.image}
                        alt={article.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="mono-heading text-xl font-semibold text-gray-light leading-tight group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-muted leading-relaxed line-clamp-2">
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
