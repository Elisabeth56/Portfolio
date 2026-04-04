"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";

const socialLinks = [
  { icon: Github, label: "Github", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export default function Hero() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden -mt-20 pt-20">
      {/* Full Background - extends behind header */}
      <div className="absolute inset-0 z-0 -top-20">
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        
        {/* Background image - shows if /public/images/hero-bg.jpg exists */}
        {!imageError && (
          <Image
            src="/images/hero.png"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={90}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Overlay gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="absolute inset-0 bg-background/20" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      {/* Decorative circles */}
      <div className="decorative-circle w-[300px] md:w-[600px] h-[300px] md:h-[600px] -top-20 md:-top-40 -right-20 md:-right-40 opacity-10 z-10" />
      <div className="decorative-circle w-[200px] md:w-[400px] h-[200px] md:h-[400px] bottom-10 md:bottom-20 -left-10 md:-left-20 opacity-5 z-10" />

      {/* Content */}
      <div className="relative z-20 pt-28 md:pt-32 pb-32 md:pb-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Main Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-1 md:space-y-2"
              >
                <h1 className="mono-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-light leading-none whitespace-nowrap">
                  AI Full-Stack
                </h1>
                <h1 className="mono-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-light leading-none pl-2 sm:pl-4 md:pl-8">
                  Engineer
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm md:text-base text-gray-muted max-w-md leading-relaxed"
              >
                My goal is to{" "}
                <span className="text-gray-light font-medium">
                  deliver end-to-end solutions from concept
                </span>{" "}
                and{" "}
                <span className="text-gray-light font-medium">
                  architecture to deployment
                </span>{" "}
                and optimization.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center gap-3 md:gap-4"
              >
                <a
                  href="#projects"
                  className="btn-primary flex items-center gap-2 md:gap-3 text-sm md:text-base group"
                >
                  <span>Projects</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="social-link text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
                  >
                    <social.icon size={14} className="md:w-4 md:h-4" />
                    <span>{social.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Projects Button (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex justify-end"
            >
              <a
                href="#projects"
                className="btn-primary flex items-center gap-3 group"
              >
                <span>Projects</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade for smooth transition to carousel */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
