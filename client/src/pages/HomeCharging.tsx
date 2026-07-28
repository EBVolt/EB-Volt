import { useEffect } from "react";
import { Home, Zap, CheckCircle, Shield, Wrench, Calendar, Gauge, Plug } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const chargerTiers = [
  {
    icon: Plug,
    power: "7 kW",
    name: "Essential Home Charger",
    type: "Single-phase AC",
    desc: "Ideal for overnight home charging on a standard single-phase supply. A reliable, affordable way to wake up to a full battery.",
    range: "Adds ~40 km of range per hour",
    features: [
      "Single-phase, 32A",
      "Type 2 connector, all EV models",
      "Wall-mounted, weatherproof",
      "Best for daily home use",
    ],
  },
  {
    icon: Gauge,
    power: "11 kW",
    name: "Advanced Home Charger",
    type: "Three-phase AC",
    desc: "Faster charging for homes with a three-phase supply. A great balance of speed and cost for larger batteries.",
    range: "Adds ~60 km of range per hour",
    features: [
      "Three-phase, 16A",
      "Type 2 connector, all EV models",
      "Smart charging ready",
      "Best for larger EVs",
    ],
    highlighted: true,
  },
  {
    icon: Zap,
    power: "22 kW",
    name: "Performance Charger",
    type: "Three-phase AC",
    desc: "Our fastest AC charger, for homes and small businesses that need rapid top-ups on a three-phase supply.",
    range: "Adds ~120 km of range per hour",
    features: [
      "Three-phase, 32A",
      "Type 2 connector, all EV models",
      "Smart charging & load balancing",
      "Best for businesses & power users",
    ],
  },
];

const installSteps = [
  { step: "1", title: "Site Assessment", desc: "We evaluate your supply, parking spot, and cable route" },
  { step: "2", title: "Charger Selection", desc: "We recommend the right 7–22 kW unit for your EV and supply" },
  { step: "3", title: "Professional Install", desc: "Certified electricians mount and wire your charger safely" },
  { step: "4", title: "Testing & Handover", desc: "Full safety testing, then a walkthrough of your new charger" },
];

export default function HomeCharging() {
  useEffect(() => { document.title = "Home Charging - EB Volt"; }, []);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Home Charging
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Buy and install a home EV charger with EB Volt. We supply and fit 7 kW to 22 kW chargers,
              professionally installed by certified technicians across Ghana.
            </p>
            <Link href="/contact?reason=installation">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
                Request a Quote
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Charger Sales */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Chargers We Sell
          </h2>
          <p className="mb-12 max-w-2xl" style={{ color: "oklch(0.45 0.05 240)" }}>
            Choose from our range of home and small-business chargers, from 7 kW to 22 kW. Every charger comes
            supplied and installed, with a 12-month warranty.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chargerTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl flex flex-col"
                style={{
                  background: "white",
                  border: tier.highlighted ? "2px solid #1D9E75" : "1px solid oklch(0.88 0.02 240)",
                  boxShadow: tier.highlighted ? "0 10px 30px oklch(0.52 0.18 145 / 0.15)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <tier.icon size={32} style={{ color: "#1D9E75" }} />
                  {tier.highlighted && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "oklch(0.52 0.18 145 / 0.12)", color: "#1D9E75" }}>
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: "oklch(0.25 0.08 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {tier.power}
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {tier.name}
                </div>
                <div className="text-sm font-medium mb-4" style={{ color: "oklch(0.65 0.18 50)" }}>
                  {tier.type}
                </div>
                <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>{tier.desc}</p>
                <p className="text-sm font-semibold mb-4" style={{ color: "#1D9E75" }}>{tier.range}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                      <CheckCircle size={16} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact?reason=installation">
                  <a className="inline-block w-full text-center px-6 py-2 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
                    Request a Quote
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            How Installation Works
          </h2>
          <p className="mb-12 max-w-2xl" style={{ color: "oklch(0.45 0.05 240)" }}>
            From your first enquiry to a fully working charger, we handle everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {installSteps.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl text-center" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "oklch(0.65 0.18 50)", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{item.title}</h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why Buy & Install With EB Volt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: "Safety First", desc: "All installations meet international safety standards and local regulations" },
              { icon: Wrench, title: "Expert Technicians", desc: "Certified electricians supply and fit every charger" },
              { icon: Calendar, title: "Quick Turnaround", desc: "Most home installations completed within 1–2 weeks" },
              { icon: CheckCircle, title: "12-Month Warranty", desc: "Warranty on both the charger and the installation work" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <item.icon size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{item.title}</h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "#0D1F1A" }}>
        <div className="container text-center">
          <Home size={40} style={{ color: "#1D9E75", margin: "0 auto 1rem" }} />
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to charge at home?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Tell us your EV and where you'd like your charger, and we'll recommend the right 7–22 kW unit and give you a quote.
          </p>
          <Link href="/contact?reason=installation">
            <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
              Request a Quote
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
