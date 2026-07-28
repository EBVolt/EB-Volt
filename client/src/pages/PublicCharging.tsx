import { useEffect } from "react";
/*
   EB Volt - Public Charging Page
   ============================================================ */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Zap, MapPin, Clock, Shield, TrendingUp, Users, CreditCard } from "lucide-react";

export default function PublicCharging() {
  useEffect(() => { document.title = "Public Charging - EB Volt"; }, []);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Public Charging Network
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Fast, reliable, and accessible EV charging stations across Ghana. Charge with confidence as our network grows across the country.
            </p>
            <Link href="/find-charger">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
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
              { icon: Zap, title: "Fast Charging", desc: "DC Fast chargers deliver 80% charge in 30 minutes", img: "https://images.unsplash.com/photo-1673337188103-c196140adebd?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Electric car charging at a station" },
              { icon: MapPin, title: "Growing Coverage", desc: "Stations opening across major cities in Ghana", img: "https://images.unsplash.com/photo-1700411881984-971bc29083bd?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Electric car at a charging station" },
              { icon: Clock, title: "Convenient Access", desc: "24/7 availability — solar-powered so chargers keep running even when the grid goes down.", img: "https://images.unsplash.com/photo-1630770147528-3c38bc9e05a6?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Solar panels under a blue sky" },
              { icon: Shield, title: "Secure & Safe", desc: "CCTV monitored stations with professional support", img: "https://images.unsplash.com/photo-1560617577-ecd7ffd04b98?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "CCTV security camera" },
              { icon: TrendingUp, title: "Real-time Status", desc: "Live availability updates on the mobile app", img: "https://images.unsplash.com/photo-1745151348527-b5d3b68f5ace?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Hand holding a smartphone with app icons" },
              { icon: Users, title: "Community Driven", desc: "Part of Ghana's growing community of EV drivers", img: "https://images.unsplash.com/photo-1751355356724-7df0dda28b2b?fm=jpg&q=70&w=600&h=360&auto=format&fit=crop", alt: "Couple beside their electric car at a charger" },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden flex flex-col" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="relative">
                  <img src={feature.img} alt={feature.alt} loading="lazy" className="w-full object-cover" style={{ height: "160px" }} />
                  <div className="absolute bottom-0 left-0 right-0" style={{ height: "50%", background: "linear-gradient(to top, rgba(13,31,26,0.55), transparent)" }} />
                  <div className="absolute top-3 left-3 inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <feature.icon size={20} style={{ color: "oklch(0.52 0.18 145)" }} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{feature.desc}</p>
                </div>
              </div>
            ))}
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
