import { Handshake, TrendingUp, Globe, Award, Zap, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function BusinessPartnerships() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0F6E56" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Business Partnerships
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Partner with EB Volt to expand your business and tap into the growing EV market in Ghana.
            </p>
            <Link href="/contact">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "transparent", color: "white", border: "2px solid white" }}>
                Become a Partner
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Partnership Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Retail Partners",
                desc: "Install chargers at your retail location to attract EV drivers",
                benefits: ["Foot traffic increase", "Revenue share", "Co-branding"],
              },
              {
                title: "Hospitality Partners",
                desc: "Offer charging to guests at hotels and resorts",
                benefits: ["Guest satisfaction", "Competitive advantage", "Revenue stream"],
              },
              {
                title: "Corporate Partners",
                desc: "Provide employee charging at your workplace",
                benefits: ["Employee benefits", "CSR initiatives", "Tax incentives"],
              },
              {
                title: "Distributor Partners",
                desc: "Become an authorized EB Volt distributor",
                benefits: ["Wholesale pricing", "Territory rights", "Marketing support"],
              },
            ].map((partner, idx) => (
              <div key={idx} className="p-8 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {partner.title}
                </h3>
                <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
                  {partner.desc}
                </p>
                <ul className="space-y-2" style={{ color: "oklch(0.52 0.18 145)", fontWeight: 500 }}>
                  {partner.benefits.map((b, i) => (
                    <li key={i}>✓ {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why Partner with EB Volt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Growing Market", desc: "EV adoption in Ghana is accelerating rapidly" },
              { icon: Globe, title: "Ghana-Focused", desc: "A charging network built specifically for Ghana" },
              { icon: Award, title: "Reliable Technology", desc: "Purpose-built charging hardware and local support" },
              { icon: Zap, title: "Latest Technology", desc: "State-of-the-art charging infrastructure" },
              { icon: Users, title: "Support Team", desc: "Dedicated partnership support and training" },
              { icon: Handshake, title: "Fair Terms", desc: "Transparent, mutually beneficial agreements" },
            ].map((reason, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <reason.icon size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {reason.title}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)", fontSize: "0.9rem" }}>{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Ready to Partner?
          </h2>
          <p className="text-lg mb-8" style={{ color: "oklch(0.45 0.05 240)" }}>
            Contact our partnerships team to discuss opportunities tailored to your business.
          </p>
          <Link href="/contact">
            <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.52 0.18 145)", color: "white" }}>
              Get in Touch
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
