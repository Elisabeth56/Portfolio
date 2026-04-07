"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getArticleBySlug, articles } from "@/data/articles";
import { notFound } from "next/navigation";

function ArticleImage({ 
  src, 
  alt, 
  priority = false 
}: { 
  src: string; 
  alt: string; 
  priority?: boolean;
}) {
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
          priority={priority}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Find related articles (excluding current)
  const relatedArticles = articles
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  // Convert markdown-like content to HTML-safe format
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, index) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="mono-heading text-2xl md:text-3xl font-bold text-gray-light mt-12 mb-6"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }

        // Code blocks
        if (line.startsWith("```")) {
          return null; // Handle separately
        }

        // Bold text and inline code
        if (line.includes("**") || line.includes("`")) {
          const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
          return (
            <p key={index} className="text-gray-muted leading-relaxed mb-4">
              {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong key={i} className="text-gray-light font-semibold">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith("`") && part.endsWith("`")) {
                  return (
                    <code
                      key={i}
                      className="px-1.5 py-0.5 bg-surface-light rounded text-sm font-mono text-gray-light"
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              })}
            </p>
          );
        }

        // List items
        if (line.startsWith("- ")) {
          return (
            <li
              key={index}
              className="text-gray-muted ml-6 mb-2 list-disc leading-relaxed"
            >
              {line.replace("- ", "")}
            </li>
          );
        }

        // Regular paragraphs
        if (line.trim() && !line.startsWith("```")) {
          return (
            <p key={index} className="text-gray-muted leading-relaxed mb-4">
              {line}
            </p>
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  // Extract code blocks
  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string; index: number }[] = [];
    let match;
    let index = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || "text",
        code: match[2].trim(),
        index: index++,
      });
    }

    return blocks;
  };

  const codeBlocks = extractCodeBlocks(article.content);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-6">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <article className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-gray-muted hover:text-gray-light transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="mono-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-light leading-tight mb-6">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-muted">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <time>{article.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime}</span>
            </div>
            <button className="flex items-center gap-2 hover:text-gray-light transition-colors ml-auto">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="aspect-video rounded-2xl overflow-hidden mb-12 relative"
        >
          <ArticleImage
            src={article.image}
            alt={article.title}
            priority
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          {/* Description */}
          <p className="text-xl text-gray-muted leading-relaxed mb-8 border-l-4 border-cyan-500/50 pl-6">
            {article.description}
          </p>

          {/* Content with code blocks interspersed */}
          {article.content.split(/```[\w]*\n[\s\S]*?```/g).map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {formatContent(section)}
              {codeBlocks[sectionIndex] && (
                <div className="my-8">
                  <div className="flex items-center justify-between bg-surface-light rounded-t-lg px-4 py-2">
                    <span className="text-sm font-mono text-gray-muted">
                      {codeBlocks[sectionIndex].language}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          codeBlocks[sectionIndex].code
                        )
                      }
                      className="text-xs text-gray-muted hover:text-gray-light transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="bg-surface rounded-b-lg p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-gray-light">
                      {codeBlocks[sectionIndex].code}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-6 md:p-8 bg-surface rounded-2xl border border-surface-light/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400" />
            <div>
              <h3 className="font-mono text-lg font-semibold text-gray-light">
                Elisabeth Nnamani
              </h3>
              <p className="text-gray-muted text-sm">
                AI Full-Stack Engineer with 3+ years of experience
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="mono-heading text-2xl font-bold text-gray-light mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/articles/${related.slug}`}>
                  <div className="group bg-surface rounded-xl overflow-hidden border border-surface-light/30 hover:border-surface-light transition-all duration-300 card-hover h-full">
                    {/* Related Article Image */}
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <ArticleImage
                        src={related.image}
                        alt={related.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
                    </div>

                    <div className="p-6">
                      <h3 className="mono-heading text-lg font-semibold text-gray-light group-hover:text-white transition-colors mb-3">
                        {related.title}
                      </h3>
                      <p className="text-gray-muted text-sm line-clamp-2 mb-4">
                        {related.description}
                      </p>
                      <div className="flex items-center gap-2 text-gray-muted group-hover:text-gray-light transition-colors">
                        <span className="text-sm">Read more</span>
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to Articles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </Link>
        </motion.div>
      </article>
    </main>
  );
}
