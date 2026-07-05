import { Wrench, CheckCircle, Zap, Shield, Truck, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ChargerInstallation() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0F6E56" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Charger Installation
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Professional installation services for residential, commercial, and fleet charging solutions.
            </p>
            <Link href="/contact">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "transparent", color: "white", border: "2px solid white" }}>
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
            {[
              {
                icon: Zap,
                title: "Home Charging",
                desc: "AC Level 2 chargers for residential use",
                price: "₵3,500 - ₵5,000",
              },
              {
                icon: Wrench,
                title: "Commercial Charging",
                desc: "DC Fast and AC Level 2 for businesses",
                price: "₵8,000 - ₵25,000",
              },
              {
                icon: Truck,
                title: "Fleet Charging",
                desc: "Multi-unit installations for fleet operators",
                price: "Custom Quote",
              },
              {
                icon: Shield,
                title: "Maintenance Plans",
                desc: "Annual maintenance and support contracts",
                price: "₵500 - ₵2,000/year",
              },
            ].map((service, idx) => (
              <div key={idx} className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <service.icon size={32} style={{ color: "oklch(0.52 0.18 145)", marginBottom: "1rem" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {service.title}
                </h3>
                <p className="mb-4" style={{ color: "oklch(0.45 0.05 240)" }}>
                  {service.desc}
                </p>
                <p className="text-lg font-semibold" style={{ color: "oklch(0.65 0.18 50)" }}>
                  {service.price}
                </p>
              </div>
            ))}
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
              { icon: CheckCircle, title: "Certified Technicians", desc: "Trained and certified installation professionals" },
              { icon: Calendar, title: "Quick Turnaround", desc: "Fast installation with minimal disruption" },
              { icon: Shield, title: "Warranty Coverage", desc: "2-year warranty on all installations" },
              { icon: Truck, title: "Nationwide Service", desc: "Service available across all major cities" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <item.icon size={32} style={{ color: "oklch(0.52 0.18 145)", flexShrink: 0 }} />
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Get Your Charger Installed Today
          </h2>
          <Link href="/contact">
            <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.65 0.18 50)", color: "white" }}>
              Schedule a Site Visit
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
