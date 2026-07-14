/* ============================================================
   EB Volt - Legal Page Layout
   Shared shell for Privacy Policy and Terms & Conditions.
   Renders a dark-theme hero and a readable prose body.
   ============================================================ */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, subtitle, lastUpdated, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-32 pb-14"
        style={{ background: "linear-gradient(180deg, oklch(0.15 0.012 240) 0%, oklch(0.12 0.015 240) 100%)" }}
      >
        <div className="container">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                background: "oklch(0.55 0.18 145 / 0.12)",
                color: "oklch(0.72 0.18 145)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Legal
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              {title}
            </h1>
            <p className="text-lg leading-relaxed mb-3" style={{ color: "oklch(0.62 0.01 240)" }}>
              {subtitle}
            </p>
            <p className="text-xs" style={{ color: "oklch(0.5 0.01 240)" }}>
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-3xl space-y-8">
            {/* Disclaimer */}
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ background: "oklch(0.55 0.18 145 / 0.08)", border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}
            >
              <Info size={18} style={{ color: "oklch(0.72 0.18 145)", marginTop: 2, flexShrink: 0 }} />
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.7 0.01 240)" }}>
                This document is provided for general information as EB Volt prepares to launch in Ghana. It is not
                legal advice. We are finalising our policies with qualified counsel and may update this page. For any
                questions, contact us at hello@ebvolt.com.
              </p>
            </div>

            <p className="text-base leading-relaxed" style={{ color: "oklch(0.72 0.01 240)" }}>
              {intro}
            </p>

            {sections.map((section) => (
              <div key={section.heading}>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}
                >
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed mb-3" style={{ color: "oklch(0.68 0.01 240)" }}>
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 mt-2">
                    {section.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
                        <span style={{ color: "oklch(0.72 0.18 145)", marginTop: 2 }}>&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
