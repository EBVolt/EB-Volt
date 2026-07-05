/*
   EcoBelle Volt - Public Charging Page
   ============================================================ */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Zap, MapPin, Clock, Shield, TrendingUp, Users, CreditCard } from "lucide-react";

export default function PublicCharging() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0F6E56" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Public Charging Network
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Fast, reliable, and accessible EV charging stations across Ghana. Charge with confidence as our network grows across the country.
            </p>
            <Link href="/find-charger">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "transparent", color: "white", border: "2px solid white" }}>
                Find a Station
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why Choose EB Volt Public Charging?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Charging", desc: "DC Fast chargers deliver 80% charge in 30 minutes" },
              { icon: MapPin, title: "Growing Coverage", desc: "Stations opening across major cities in Ghana" },
              { icon: Clock, title: "Convenient Access", desc: "24/7 availability — solar-powered so chargers keep running even when the grid goes down." },
              { icon: Shield, title: "Secure & Safe", desc: "CCTV monitored stations with professional support" },
              { icon: TrendingUp, title: "Real-time Status", desc: "Live availability updates on the mobile app" },
              { icon: Users, title: "Community Driven", desc: "Part of Ghana's growing community of EV drivers" },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <feature.icon size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {feature.title}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{feature.desc}</p>
              </div>
            ))}
            {/* Pay with Mobile Money Card */}
            <div className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "#FFC72C" }}>
                <span className="font-bold text-sm" style={{ color: "#000" }}>MTN</span>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                Pay with Mobile Money
              </h3>
              <p style={{ color: "oklch(0.45 0.05 240)" }}>No bank card or app required. Pay instantly with MTN MoMo, Telecel Cash, or AirtelTigo at the charger screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl" style={{ background: "white", border: "2px solid oklch(0.52 0.18 145)" }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "oklch(0.52 0.18 145)" }}>
                DC Fast Charging
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                ₵4.50 <span className="text-lg">/kWh</span>
              </p>
              <ul className="space-y-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                <li>✓ 100kW charging speed</li>
                <li>✓ 30 mins to 80% charge</li>
                <li>✓ Premium amenities included</li>
              </ul>
            </div>
            <div className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                AC Level 2 Charging
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                ₵2.50 <span className="text-lg">/kWh</span>
              </p>
              <ul className="space-y-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                <li>✓ 50kW charging speed</li>
                <li>✓ 2-3 hours full charge</li>
                <li>✓ Budget-friendly option</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Ready to Charge?
          </h2>
          <p className="text-lg mb-8" style={{ color: "oklch(0.45 0.05 240)" }}>
            Download the EB Volt app or visit our website to find and reserve your nearest charging station.
          </p>
          <Link href="/find-charger">
            <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.52 0.18 145)", color: "white" }}>
              Find a Charger Now
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
