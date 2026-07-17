import { useEffect } from "react";
import { Wrench, CheckCircle, Zap, Shield, Truck, Calendar, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ChargerInstallation() {
  useEffect(() => { document.title = "Charger Installation - EB Volt"; }, []);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Charger Installation
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Professional installation services for residential, commercial, and fleet charging solutions across Ghana.
            </p>
            <Link href="/contact">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
                Request Installation
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Our Installation Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Site Assessment",
                desc: "We evaluate your location and electrical requirements",
              },
              {
                step: "2",
                title: "Permitting",
                desc: "Handle all necessary permits and approvals",
              },
              {
                step: "3",
                title: "Installation",
                desc: "Professional installation by certified technicians",
              },
              {
                step: "4",
                title: "Testing",
                desc: "Comprehensive testing and quality assurance",
              },
              {
                step: "5",
                title: "Training",
                desc: "User training and documentation provided",
              },
              {
                step: "6",
                title: "Support",
                desc: "Ongoing maintenance and technical support",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl text-center" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "oklch(0.65 0.18 50)", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Installation Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Home Charging Card */}
            <div className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
              <Home size={32} style={{ color: "#1D9E75", marginBottom: "1rem" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                Home Charging
              </h3>
              <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
                AC Level 2 charger installation for private residences. Charge your EV safely and affordably at home, with professional installation by certified technicians.
              </p>
              <p className="text-lg font-semibold mb-4" style={{ color: "oklch(0.65 0.18 50)" }}>
                ₵3,500 – ₵5,000
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <CheckCircle size={16} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                  <span>Certified electrician installation</span>
                </li>
                <li className="flex items-start gap-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <CheckCircle size={16} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                  <span>Safety inspection included</span>
                </li>
                <li className="flex items-start gap-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <CheckCircle size={16} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                  <span>Works with all EV models</span>
                </li>
                <li className="flex items-start gap-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <CheckCircle size={16} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                  <span>12-month installation warranty</span>
                </li>
              </ul>
              <Link href="/contact?reason=installation">
                <a className="inline-block w-full text-center px-6 py-2 rounded-lg font-semibold transition-all" style={{ background: "#1D9E75", color: "white", border: "none" }}>
                  Request Home Installation
                </a>
              </Link>
            </div>

            {/* Commercial Charging Card */}
            <div className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
              <Wrench size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                Commercial Charging
              </h3>
              <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
                DC Fast and AC Level 2 for businesses
              </p>
              <p className="text-lg font-semibold" style={{ color: "oklch(0.65 0.18 50)" }}>
                ₵8,000 - ₵25,000
              </p>
            </div>

            {/* Fleet Charging Card */}
            <div className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
              <Truck size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                Fleet Charging
              </h3>
              <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
                Multi-unit installations for fleet operators
              </p>
              <p className="text-lg font-semibold" style={{ color: "oklch(0.65 0.18 50)" }}>
                Custom Quote
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why Choose EB Volt Installation?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "Safety First",
                desc: "All installations meet international safety standards and local regulations",
              },
              {
                icon: Zap,
                title: "Expert Technicians",
                desc: "Certified and experienced electricians handle every installation",
              },
              {
                icon: Calendar,
                title: "Quick Turnaround",
                desc: "Most installations completed within 2-4 weeks",
              },
              {
                icon: CheckCircle,
                title: "Warranty Coverage",
                desc: "12-month warranty on all installation work and equipment",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <item.icon size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
