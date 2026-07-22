/* ============================================================
   TrustSection Component
   Honest, non-testimonial trust signals for the homepage.
   NOTE: This intentionally does NOT contain customer reviews or
   quotes. Fabricated testimonials are not permitted. When real,
   verified customer feedback is available, add a genuine reviews
   section sourced from an authenticated review system.
   ============================================================ */

import { MapPin, ShieldCheck, Smartphone, Leaf, Clock, CreditCard } from "lucide-react";

interface TrustPoint {
  icon: typeof MapPin;
  title: string;
  desc: string;
}

const trustPoints: TrustPoint[] = [
  {
    icon: MapPin,
    title: "Charging where you drive",
    desc: "Stations are sited around real driving patterns in Ghana's major cities, with live availability so you never guess.",
  },
  {
    icon: Clock,
    title: "Reserve before you arrive",
    desc: "Book a slot in advance and pull up to a charger that is ready and waiting for you.",
  },
  {
    icon: CreditCard,
    title: "Pay the way you already do",
    desc: "Checkout works with mobile money and card, so paying for a charge is quick and familiar.",
  },
  {
    icon: ShieldCheck,
    title: "Monitored and supported",
    desc: "Stations are monitored for uptime, and our support team is on hand when you need help.",
  },
  {
    icon: Smartphone,
    title: "Everything in one app",
    desc: "Find chargers, reserve slots, track your session, and manage payments from a single place.",
  },
  {
    icon: Leaf,
    title: "Cleaner by design",
    desc: "We are integrating solar power into our network to lower the footprint of every charge.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20" style={{ background: "oklch(0.22 0.012 240)" }}>
      <div className="container">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{
              background: "oklch(0.55 0.18 145 / 0.12)",
              color: "oklch(0.72 0.18 145)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Why Choose EB Volt
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
          >
            Built to Earn Your Trust
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.62 0.01 240)" }}>
            We are just getting started in Ghana, and we are building the network to be reliable, transparent, and easy to use from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="ev-card p-6"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "oklch(0.55 0.18 145 / 0.12)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.25)",
                  }}
                >
                  <Icon size={22} style={{ color: "oklch(0.72 0.18 145)" }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                >
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
