"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 md:px-6">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="decorative-circle w-[400px] h-[400px] top-20 -right-20 opacity-10" />
        <div className="decorative-circle w-[300px] h-[300px] -bottom-20 -left-20 opacity-10" />
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <FileQuestion size={80} className="mx-auto text-gray-muted" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mono-heading text-6xl md:text-8xl font-bold text-gray-light mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-muted mb-8"
        >
          Article not found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-muted mb-8 max-w-md mx-auto"
        >
          The article you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/articles"
            className="btn-primary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
          <Link
            href="/"
            className="text-gray-muted hover:text-gray-light transition-colors"
          >
            Go to Homepage
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
