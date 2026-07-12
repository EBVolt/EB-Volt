import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const opportunities = [
  "First mover in a market with almost no public charging infrastructure",
  "Solar-powered stations that lower running costs and work through grid outages",
  "Mobile Money-native, removing the biggest barrier to adoption in a cash-and-MoMo economy",
  "Multiple revenue streams: public charging, fleet accounts, site partnerships, and installation services",
  "Scalable model proven internationally and adapted for African conditions",
];

export default function Investors() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="pt-32 pb-20"
        style={{ background: "linear-gradient(180deg, oklch(0.15 0.012 240) 0%, oklch(0.12 0.015 240) 100%)" }}
      >
        <div className="container">
          <div className="max-w-3xl">
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              Investing in Africa's{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>Electric Future</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
              EB Volt is building the charging infrastructure that will power Ghana's transition to electric vehicles, and we're inviting mission-aligned investors to be part of it.
            </p>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              The Opportunity
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
            <p>
              Ghana's electric vehicle market is at an inflection point. Import duties on EVs have been removed, the government has set ambitious electrification targets, and vehicles are arriving faster than the infrastructure to support them. Today there are fewer than 100 public chargers for a rapidly growing number of electric vehicles. That gap is the opportunity.
            </p>
            <p>
              EB Volt is closing it, with a solar-powered, Mobile Money-native charging network designed specifically for the Ghanaian market.
            </p>
          </div>
        </div>
      </section>

      {/* Why EB Volt */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Why EB Volt
            </h2>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg"
                style={{ background: "oklch(0.17 0.012 240)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "oklch(0.72 0.18 145)" }}
                >
                  <span style={{ color: "oklch(0.12 0.015 240)", fontSize: "12px", fontWeight: "bold" }}>✓</span>
                </div>
                <p style={{ color: "oklch(0.68 0.01 240)", lineHeight: "1.6" }}>
                  {opp}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Model */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl">
          <div className="text-center">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Our Model
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
              We install and operate charging stations on partner sites at no cost to the property owner, generate revenue from every charging session, and grow alongside Ghana's expanding electric vehicle fleet. As adoption rises, our network and our revenue rise with it.
            </p>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Get in Touch
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.68 0.01 240)" }}>
              We're building relationships with development finance institutions, climate-focused funds, and impact investors who share our vision for clean mobility in Africa. If that's you, we'd welcome a conversation.
            </p>
            <Link href="/contact">
              <button className="btn-green flex items-center gap-2 mx-auto mb-8">
                Contact Our Team
                <ArrowRight size={16} />
              </button>
            </Link>
            <p className="text-sm" style={{ color: "oklch(0.55 0.01 240)" }}>
              Full information, including our business plan and financial projections, is available to qualified investors on request.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
