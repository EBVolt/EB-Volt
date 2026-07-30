import { useEffect } from "react";
import Seo from "@/components/Seo";
import { PAGE_SEO } from "@/data/seoContent";
import { Truck, BarChart3, Zap, Lock, Users, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function FleetCharging() {
  useEffect(() => { document.title = "Fleet Charging - EB Volt"; }, []);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />
      <Seo {...PAGE_SEO.fleetCharging} />

      {/* Hero Section */}
      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
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
              { icon: Truck, title: "Dedicated Chargers", desc: "Install chargers at your depot or facility", img: "https://images.unsplash.com/photo-1760539068164-e7186a197d09?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Wall-mounted EV charger" },
              { icon: BarChart3, title: "Fleet Analytics", desc: "Track charging costs and vehicle efficiency", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Analytics graphs on a laptop screen" },
              { icon: Zap, title: "Reserved Slots", desc: "Book charging slots ahead for your vehicles", img: "https://images.unsplash.com/photo-1700411881984-971bc29083bd?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Electric car at a charging bay" },
              { icon: Lock, title: "Secure Access", desc: "RFID-based access control for your fleet", img: "https://images.unsplash.com/photo-1746682975155-ae1cce0853a3?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Hand with keys accessing a door" },
              { icon: Users, title: "Team Management", desc: "Manage multiple drivers and vehicles", img: "https://images.unsplash.com/photo-1758873268663-5a362616b5a7?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "A team of colleagues together" },
              { icon: Headphones, title: "Fleet Support", desc: "A named point of contact for your fleet account", img: "https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Support agent wearing a headset" },
            ].map((benefit, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden flex flex-col" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="relative">
                  <img src={benefit.img} alt={benefit.alt} loading="lazy" className="w-full object-cover" style={{ height: "160px" }} />
                  <div className="absolute bottom-0 left-0 right-0" style={{ height: "50%", background: "linear-gradient(to top, rgba(13,31,26,0.55), transparent)" }} />
                  <div className="absolute top-3 left-3 inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <benefit.icon size={20} style={{ color: "oklch(0.65 0.18 50)" }} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                    {benefit.title}
                  </h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{benefit.desc}</p>
                </div>
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
              { name: "Starter", vehicles: "5-10", price: "₵600/month", description: "Billed monthly via MTN MoMo. Includes 1 RFID card per driver.", features: ["Basic analytics", "1 charger", "Email support"] },
              { name: "Professional", vehicles: "11-50", price: "₵3,200/month", description: "Billed monthly via MTN MoMo. Includes RFID cards per driver and a web portal with per-card usage reports.", features: ["Advanced analytics", "5 chargers", "Priority support"], highlight: true },
              { name: "Enterprise", vehicles: "50+", price: "Custom", description: "Billed monthly via MTN MoMo or bank transfer. Dedicated account manager and custom RFID card allocation.", features: ["Full analytics", "Unlimited chargers", "Dedicated account manager"] },
            ].map((plan, idx) => (
              <div key={idx} className="p-8 rounded-xl" style={{ background: plan.highlight ? "oklch(0.52 0.18 145)" : "white", border: plan.highlight ? "none" : "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: plan.highlight ? "white" : "oklch(0.25 0.08 240)" }}>
                  {plan.name}
                </h3>
                <p className="mb-4" style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "oklch(0.45 0.05 240)" }}>
                  {plan.vehicles} vehicles
                </p>
                <p className="text-3xl font-bold mb-2" style={{ color: plan.highlight ? "white" : "oklch(0.25 0.08 240)" }}>
                  {plan.price}
                </p>
                <p className="mb-6" style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "oklch(0.45 0.05 240)", fontSize: "0.875rem" }}>
                  {plan.description}
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
