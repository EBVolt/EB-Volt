/* ============================================================
   EcoBelle Volt — About Page
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

const values = [
  { icon: Leaf, title: "Sustainability", desc: "Every station we build moves Ghana closer to a zero-emission future. We integrate renewable energy wherever possible." },
  { icon: Zap, title: "Reliability", desc: "Our network is monitored 24/7. When you need to charge, we're there — no surprises, no excuses." },
  { icon: Users, title: "Accessibility", desc: "EV charging should be for everyone. We're building in cities, towns, and along major highways across Ghana." },
  { icon: Globe, title: "Innovation", desc: "We're pioneering smart charging technology tailored for African infrastructure and the unique needs of Ghanaian drivers." },
];

export default function About() {
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
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                background: "oklch(0.55 0.18 145 / 0.12)",
                color: "oklch(0.72 0.18 145)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Our Story
            </div>
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              Powering Ghana's{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>Electric Future</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
              EcoBelle Volt was founded with a single mission: to make electric vehicle charging as easy, reliable, and accessible as filling up with petrol — and far cleaner.
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
                To build Ghana's most trusted, reliable, and accessible EV charging network — enabling every Ghanaian driver to make the switch to electric with confidence.
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
                A Ghana where clean, electric mobility is the norm — where every major road, shopping centre, and business district has an EB Volt charger, powered by renewable energy.
              </p>
            </div>
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
              Why We Started
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed" style={{ color: "oklch(0.68 0.01 240)" }}>
            <p>
              EcoBelle Volt was born from a simple observation: Ghana's roads are ready for electric vehicles, but the infrastructure isn't. As EV adoption accelerates globally, Ghanaian drivers face a critical barrier — the fear of running out of charge with nowhere to plug in.
            </p>
            <p>
              Our founders set out to solve this problem by building a smart, reliable charging network from the ground up — designed specifically for Ghana's cities, climate, and culture. We partnered with leading charging technology providers and worked closely with local businesses to site our stations where drivers actually need them.
            </p>
            <p>
              Today, EB Volt is launching across Ghana's major cities, with ambitious plans to expand to every region. We believe that clean mobility shouldn't be a privilege — it should be available to every Ghanaian who wants to drive electric.
            </p>
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

      {/* Sustainability */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/sustainability_bg_8949fa1f.png"
            alt="Sustainable charging"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "oklch(0.08 0.015 240 / 0.85)" }} />
        </div>
        <div className="container relative z-10">
          <div
            ref={sustainRef}
            className="max-w-2xl"
            style={{
              opacity: sustainIn ? 1 : 0,
              transform: sustainIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                background: "oklch(0.55 0.18 145 / 0.15)",
                border: "1px solid oklch(0.55 0.18 145 / 0.35)",
                color: "oklch(0.72 0.18 145)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Leaf size={12} />
              Sustainability
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Solar-Powered. Carbon-Conscious.
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.82 0.005 240)" }}>
              Our charging stations are designed with solar canopies to harness Ghana's abundant sunshine. We're committed to powering our network with 100% renewable energy by 2030.
            </p>
            <Link href="/contact">
              <button className="btn-outline-green flex items-center gap-2">
                Partner With Us
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
