import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { BEFORE_PAINT } from "@/lib/theme";
import "./globals.css";

/**
 * Self-hosted rather than fetched from Google at build time: one less
 * build-time network dependency, no third-party request on page load, and the
 * subset is exactly what this site sets (latin only).
 */
const archivo = localFont({
  src: "../fonts/archivo-latin-wght-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const plexMono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

const instrument = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/* The redesign's faces. The four above go once the old shells are replaced. */
const geist = localFont({
  src: "../fonts/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "sans-serif"],
});

const caveat = localFont({
  src: "../fonts/caveat-latin-500-normal.woff2",
  variable: "--font-caveat",
  weight: "500",
  display: "swap",
  fallback: ["Bradley Hand", "cursive"],
});

const description =
  "Elisabeth Nnamani builds multi-agent orchestration, grounded retrieval and offline-capable inference. AI software engineer, working from Nigeria.";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: "elisynth",
  authors: [{ name: site.name, url: site.domain }],
  creator: site.name,
  keywords: [
    "AI software engineer",
    "multi-agent systems",
    "LLM engineering",
    "RAG",
    "Next.js",
    "FastAPI",
    "Nigeria",
    "Elisabeth Nnamani",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.domain,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
    creator: "@elisynthdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0eeeb" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1a19" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable} ${instrument.variable} ${geist.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
        {children}
      </body>
    </html>
  );
}
