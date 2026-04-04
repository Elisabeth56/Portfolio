"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#contacts", label: "Contacts" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-surface-light/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="font-mono text-lg font-semibold text-gray-light">
            Elisabeth
          </span>
          <span className="font-mono text-lg font-semibold text-gray-light">
            Nnamani
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="text-gray-muted hover:text-gray-light transition-colors duration-300 text-sm"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <button className="text-gray-light text-sm font-medium">En</button>
          <span className="text-gray-muted">/</span>
          <button className="text-gray-muted text-sm hover:text-gray-light transition-colors">
            De
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-light p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md"
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-muted hover:text-gray-light transition-colors duration-300 text-sm py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-surface-light">
            <button className="text-gray-light text-sm font-medium">En</button>
            <span className="text-gray-muted">/</span>
            <button className="text-gray-muted text-sm hover:text-gray-light transition-colors">
              De
            </button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
