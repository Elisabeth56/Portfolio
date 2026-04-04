import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elisabeth Nnamani | AI Full-Stack Engineer",
  description:
    "AI Full-Stack Engineer portfolio - Building intelligent, scalable web applications with integrated AI functionality, automation systems, and SaaS platforms.",
  keywords: [
    "AI Full-Stack Engineer",
    "React",
    "TypeScript",
    "Next.js",
    "LLMs",
    "Automation",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
