import { Truck, BarChart3, Zap, Lock, Users, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function FleetCharging() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Fleet Charging Solutions
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Optimize your fleet operations with dedicated charging infrastructure and fleet management tools.
            </p>
            <Link href="/contact">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
                Get a Quote
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Fleet Management Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Dedicated Chargers", desc: "Install chargers at your depot or facility" },
              { icon: BarChart3, title: "Fleet Analytics", desc: "Track charging costs and vehicle efficiency" },
              { icon: Zap, title: "Reserved Slots", desc: "Book charging slots ahead for your vehicles" },
              { icon: Lock, title: "Secure Access", desc: "RFID-based access control for your fleet" },
              { icon: Users, title: "Team Management", desc: "Manage multiple drivers and vehicles" },
              { icon: Headphones, title: "Fleet Support", desc: "A named point of contact for your fleet account" },
            ].map((benefit, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <benefit.icon size={32} style={{ color: "oklch(0.65 0.18 50)", marginBottom: "1rem" }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {benefit.title}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Fleet Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", vehicles: "5-10", price: "₵500", features: ["Basic analytics", "1 charger", "Email support"] },
              { name: "Professional", vehicles: "11-50", price: "₵2,500", features: ["Advanced analytics", "5 chargers", "Priority support"], highlight: true },
              { name: "Enterprise", vehicles: "50+", price: "Custom", features: ["Full analytics", "Unlimited chargers", "Dedicated account manager"] },
            ].map((plan, idx) => (
              <div key={idx} className="p-8 rounded-xl" style={{ background: plan.highlight ? "oklch(0.52 0.18 145)" : "white", border: plan.highlight ? "none" : "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: plan.highlight ? "white" : "oklch(0.25 0.08 240)" }}>
                  {plan.name}
                </h3>
                <p className="mb-4" style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "oklch(0.45 0.05 240)" }}>
                  {plan.vehicles} vehicles
                </p>
                <p className="text-3xl font-bold mb-6" style={{ color: plan.highlight ? "white" : "oklch(0.25 0.08 240)" }}>
                  {plan.price}
                </p>
                <ul className="space-y-2 mb-6" style={{ color: plan.highlight ? "rgba(255,255,255,0.9)" : "oklch(0.45 0.05 240)" }}>
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-lg font-semibold transition-all" style={{ background: plan.highlight ? "white" : "oklch(0.52 0.18 145)", color: plan.highlight ? "oklch(0.52 0.18 145)" : "white" }}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Transform Your Fleet Today
          </h2>
          <Link href="/contact">
            <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.65 0.18 50)", color: "white" }}>
              Schedule a Demo
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
