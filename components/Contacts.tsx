"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Github, label: "Github", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "E-mail", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
];

const footerLinks = [
  { label: "Main", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Articles", href: "#articles" },
];

export default function Contacts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer id="contacts" className="py-24 px-6 relative" ref={ref}>
      {/* Decorative circle */}
      <div className="decorative-circle w-[600px] h-[600px] -bottom-40 -right-40 opacity-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-end mb-12"
        >
          <span className="section-label">... /Contacts ...</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="mono-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-light leading-none">
                Elisabeth
              </h2>
              <h2 className="mono-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-light leading-none pl-8 md:pl-12">
                Nnamani
              </h2>
            </div>

            <p className="text-gray-muted">AI Full-Stack Engineer</p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="social-link"
                >
                  <social.icon size={16} />
                  <span>{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Navigation & Credits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-muted hover:text-gray-light transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Site Credits */}
            <div className="space-y-4 pt-8 border-t border-surface-light/30">
              <h4 className="font-mono text-sm text-gray-light">Site</h4>
              <div className="space-y-1 text-sm text-gray-muted">
                <p>
                  Designed & Built by{" "}
                  <span className="text-gray-light">Elisabeth Nnamani</span>
                </p>
                <p>
                  Powered by{" "}
                  <span className="text-gray-light">Next.js</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-surface-light/20 text-center"
        >
          <p className="text-sm text-gray-muted">
            © {new Date().getFullYear()} Elisabeth Nnamani. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
