/* ============================================================
   EB Volt - About Page
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Leaf, Zap, Users, Globe, ArrowRight, Target, Eye } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const differences = [
  "Solar-powered stations that work through power cuts",
  "Pay with MTN MoMo, Telecel Cash, or AirtelTigo, no bank account needed",
  "No app, no membership, no sign-up required to charge",
  "Built in Ghana, for Ghana's roads, climate, and drivers",
];

const values = [
  { icon: Leaf, title: "Sustainability", desc: "Every station we build moves Ghana closer to a zero-emission future. We integrate renewable energy wherever possible." },
  { icon: Zap, title: "Reliability", desc: "We monitor our stations for uptime and design for dependable charging, so you can plan your day with confidence." },
  { icon: Users, title: "Accessibility", desc: "EV charging should be for everyone. We are expanding across Ghana's cities and key routes, one station at a time." },
  { icon: Globe, title: "Innovation", desc: "We build smart charging technology suited to local infrastructure and the everyday needs of Ghanaian drivers." },
];

export default function About() {
  useEffect(() => { document.title = "About Us - EB Volt"; }, []);
  const { ref: heroRef, inView: heroIn } = useInView(0.1);
  const { ref: missionRef, inView: missionIn } = useInView(0.1);
  const { ref: valuesRef, inView: valuesIn } = useInView(0.1);
  const { ref: sustainRef, inView: sustainIn } = useInView(0.1);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-32 pb-20"
        style={{ background: "linear-gradient(180deg, oklch(0.15 0.012 240) 0%, oklch(0.12 0.015 240) 100%)" }}
      >
        <div className="container">
          <div
            ref={heroRef}
            className="max-w-3xl"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              Powering Ghana's{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>Electric Future</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
              EB Volt is building Ghana's first solar-powered network of public electric vehicle charging stations. We make charging as simple as it should be: scan, pay with Mobile Money, and go. No apps to download, no bank account required, no membership.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Our Story
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
            <p>
              Ghana is at the start of an electric revolution. The government has removed import duties on electric vehicles and set a target for a third of all vehicles to be electric by 2035. Electric cars are arriving fast, but the infrastructure to charge them has not kept pace. Drivers face a simple, frustrating problem: nowhere reliable to charge.
            </p>
            <p>
              We started EB Volt to solve that. Our stations are built for Ghana specifically. Each one is powered by its own solar panels and battery storage, so charging keeps working even when the grid goes down, and stays affordable. And because we built our payment system around Mobile Money, anyone with a phone can charge in seconds, without needing a bank card.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div
            ref={missionRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            style={{
              opacity: missionIn ? 1 : 0,
              transform: missionIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "oklch(0.17 0.012 240)",
                border: "1px solid oklch(0.55 0.18 145 / 0.2)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
                style={{ background: "oklch(0.55 0.18 145 / 0.08)" }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "oklch(0.55 0.18 145 / 0.15)", border: "1px solid oklch(0.55 0.18 145 / 0.3)" }}
              >
                <Target size={22} style={{ color: "oklch(0.72 0.18 145)" }} />
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Our Mission
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
                To build a reliable, accessible, and clean charging network across Ghana, giving every driver the confidence to go electric.
              </p>
            </div>
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "oklch(0.17 0.012 240)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "oklch(0.55 0.18 145 / 0.15)", border: "1px solid oklch(0.55 0.18 145 / 0.3)" }}
              >
                <Eye size={22} style={{ color: "oklch(0.72 0.18 145)" }} />
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Our Vision
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
                A Ghana where electric mobility is the norm, powered by the sun, accessible to everyone, and available everywhere people drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              What Makes Us Different
            </h2>
          </div>
          <div className="space-y-4">
            {differences.map((diff, idx) => (
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
                  {diff}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container">
          <div
            ref={valuesRef}
            style={{
              opacity: valuesIn ? 1 : 0,
              transform: valuesIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                What We Stand For
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, i) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="ev-card p-6"
                    style={{
                      opacity: valuesIn ? 1 : 0,
                      transform: valuesIn ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 100}ms`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: "oklch(0.55 0.18 145 / 0.12)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}
                    >
                      <Icon size={22} style={{ color: "oklch(0.72 0.18 145)" }} />
                    </div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                    >
                      {val.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl text-center">
          <p className="text-xl leading-relaxed mb-8" style={{ color: "oklch(0.68 0.01 240)" }}>
            We're just getting started, and we'd love for you to be part of the journey.
          </p>
          <Link href="/contact">
            <button className="btn-green flex items-center gap-2 mx-auto">
              Get in Touch
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
