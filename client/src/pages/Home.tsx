/* ============================================================
   EB Volt - Home Page
   Design: "Dark Charge" - deep navy + electric green
   Sections: Hero, Stats, How It Works, Map Preview, App, Sustainability, CTA
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Zap, MapPin, Clock, Shield, ChevronRight, ArrowRight, Battery, Leaf, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChargerIllustration } from "@/components/ChargerIllustration";
import { useAuth } from "@/_core/hooks/useAuth";
import TrustSection from "@/components/Testimonials";

// Intersection observer hook for scroll animations
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

// Animated counter
function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 50, suffix: "+", label: "Charging Stations", icon: Zap },
  { value: 24, suffix: "/7", label: "App Access", icon: Clock },
  { value: 100, suffix: "kW", label: "Max Charge Speed", icon: Battery },
  { value: 5, suffix: " Cities", label: "Across Ghana", icon: MapPin },
];

const features = [
  {
    icon: MapPin,
    title: "Real-Time Locator",
    desc: "Find the nearest EB Volt charger anywhere in Ghana with live availability updates.",
  },
  {
    icon: Clock,
    title: "Reserve Your Spot",
    desc: "Book a charging slot in advance so your charger is always ready when you arrive.",
  },
  {
    icon: Zap,
    title: "Ultra-Fast Charging",
    desc: "Up to 100kW DC fast charging gets you back on the road in under 30 minutes.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Station monitoring, contactless payment, and a support team ready to help when you need it.",
  },
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { ref: heroRef, inView: heroIn } = useInView(0.1);
  const { ref: statsRef, inView: statsIn } = useInView(0.2);
  const { ref: featRef, inView: featIn } = useInView(0.1);
  const { ref: mapRef, inView: mapIn } = useInView(0.1);
  const { ref: appRef, inView: appIn } = useInView(0.1);
  const { ref: sustainRef, inView: sustainIn } = useInView(0.1);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: "5rem" }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/manus-storage/hero_charging_f0301604.png"
            alt="EV Charging in Ghana"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, oklch(0.08 0.015 240 / 0.92) 0%, oklch(0.10 0.015 240 / 0.75) 50%, oklch(0.08 0.015 240 / 0.5) 100%)",
            }}
          />
        </div>

        <div className="container relative z-10 py-20">
          <div
            ref={heroRef}
            className="max-w-3xl"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: "oklch(0.55 0.18 145 / 0.15)",
                border: "1px solid oklch(0.55 0.18 145 / 0.35)",
                color: "oklch(0.72 0.18 145)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Zap size={14} />
              Now Launching in Ghana
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.97 0 0)",
                lineHeight: 1.05,
              }}
            >
              Charge Anywhere{" "}
              <span
                style={{
                  color: "oklch(0.72 0.18 145)",
                  textShadow: "0 0 30px oklch(0.55 0.18 145 / 0.5)",
                }}
              >
                in Ghana.
              </span>
              <br />
              Arrive Confident.
            </h1>

            <p
              className="text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl"
              style={{ color: "oklch(0.78 0.005 240)" }}
            >
              Ghana's first solar-powered rapid EV charging network. No bank account needed – pay instantly with MTN MoMo.
            </p>

            {/* Payment logos */}
            <div className="flex items-center gap-8 mb-10">
              {/* MTN MoMo */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "#FFC72C" }}
                >
                  <span className="font-bold text-sm" style={{ color: "#000" }}>MTN</span>
                </div>
                <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>MTN MoMo</span>
              </div>

              {/* Telecel Cash */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "#FF6B35" }}
                >
                  <span className="font-bold text-sm" style={{ color: "#FFF" }}>TC</span>
                </div>
                <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>Telecel Cash</span>
              </div>

              {/* AirtelTigo Money */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "#E60000" }}
                >
                  <span className="font-bold text-sm" style={{ color: "#FFF" }}>ATM</span>
                </div>
                <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>AirtelTigo Money</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/find-charger">
                <button className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  <MapPin size={18} />
                  Find a Charger
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="btn-outline-green flex items-center gap-2 text-base px-8 py-4">
                  How It Works
                  <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "80px", zIndex: 5 }}
        >
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,80 L1440,20 L1440,80 Z" fill="oklch(0.12 0.015 240)" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16" style={{ background: "oklch(0.12 0.015 240)" }}>
        <div className="container">
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="ev-card p-6 text-center"
                  style={{
                    opacity: statsIn ? 1 : 0,
                    transform: statsIn ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "oklch(0.55 0.18 145 / 0.12)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}
                  >
                    <Icon size={22} style={{ color: "oklch(0.72 0.18 145)" }} />
                  </div>
                  <div
                    className="text-4xl font-bold mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                  >
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container">
          <div
            ref={featRef}
            style={{
              opacity: featIn ? 1 : 0,
              transform: featIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="text-center mb-14">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                style={{
                  background: "oklch(0.55 0.18 145 / 0.12)",
                  color: "oklch(0.72 0.18 145)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Why EB Volt
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Built for Ghana's Roads
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "oklch(0.62 0.01 240)" }}>
                Every feature is designed around how Ghanaian EV drivers actually charge, from the daily commute to the long-haul trip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="ev-card p-6"
                    style={{
                      opacity: featIn ? 1 : 0,
                      transform: featIn ? "translateY(0)" : "translateY(24px)",
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
                      className="text-lg font-semibold mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CHARGER TYPES ── */}
      <section className="py-20" style={{ background: "oklch(0.12 0.015 240)" }}>
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
              Our Chargers
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Charging Technology
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.62 0.01 240)" }}>
              Choose the charging speed that fits your day. DC Fast for quick top-ups, or AC Level 2 for longer sessions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <ChargerIllustration type="dc-fast" size="large" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
                DC Fast Charging
              </h3>
              <p className="text-lg mb-6" style={{ color: "oklch(0.62 0.01 240)" }}>
                Get 80% charge in just 30 minutes. Perfect for highway stops and quick top-ups.
              </p>
              <ul className="space-y-3">
                {["Up to 100kW power", "30-minute fast charge", "Available at major hubs", "Perfect for long trips"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 145 / 0.2)" }}>
                      <Zap size={11} style={{ color: "oklch(0.72 0.18 145)" }} />
                    </div>
                    <span style={{ color: "oklch(0.78 0.005 240)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
                AC Level 2 Charging
              </h3>
              <p className="text-lg mb-6" style={{ color: "oklch(0.62 0.01 240)" }}>
                Convenient charging for shopping, dining, or overnight stays.
              </p>
              <ul className="space-y-3">
                {["Up to 50kW power", "2-4 hour full charge", "Available at all stations", "Perfect for daily use"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "oklch(0.55 0.18 145 / 0.2)" }}>
                      <Zap size={11} style={{ color: "oklch(0.72 0.18 145)" }} />
                    </div>
                    <span style={{ color: "oklch(0.78 0.005 240)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <ChargerIllustration type="ac-level2" size="large" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20" style={{ background: "oklch(0.12 0.015 240)" }}>
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
              Simple Process
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Charging is Easy
            </h2>
          </div>
          <div className="flex justify-center">
            <img
              src="/manus-storage/charging_steps_28dee001.png"
              alt="How to charge with EB Volt"
              className="w-full max-w-4xl rounded-2xl"
              style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
            />
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works">
              <button className="btn-primary flex items-center gap-2 mx-auto">
                Learn More
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAP PREVIEW ── */}
      <section className="py-20" style={{ background: "oklch(0.10 0.015 240)" }}>
        <div className="container">
          <div
            ref={mapRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            style={{
              opacity: mapIn ? 1 : 0,
              transform: mapIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                style={{
                  background: "oklch(0.55 0.18 145 / 0.12)",
                  color: "oklch(0.72 0.18 145)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Growing Coverage
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Find a Charger{" "}
                <span style={{ color: "oklch(0.72 0.18 145)" }}>Near You</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.62 0.01 240)" }}>
                Our interactive map shows EB Volt charging stations across Ghana in real time. Filter by speed, availability, and amenities to find the right spot for your charge.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Live availability, so you can see open chargers instantly",
                  "Filter by charging speed (AC / DC Fast)",
                  "Reserve a slot before you arrive",
                  "Get directions with one tap",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.55 0.18 145 / 0.2)" }}
                    >
                      <Zap size={11} style={{ color: "oklch(0.72 0.18 145)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "oklch(0.78 0.005 240)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/find-charger">
                <button className="btn-primary flex items-center gap-2">
                  <MapPin size={16} />
                  Open the Map
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="/manus-storage/hero_map_bg_85e4564f.png"
                alt="EB Volt stations across Ghana"
                className="w-full rounded-2xl"
                style={{ border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}
              />
              <div
                className="absolute -bottom-4 -right-4 px-5 py-4 rounded-xl"
                style={{
                  background: "oklch(0.17 0.012 240)",
                  border: "1px solid oklch(0.55 0.18 145 / 0.3)",
                  boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center animate-pulse-glow"
                    style={{ background: "oklch(0.55 0.18 145 / 0.2)" }}
                  >
                    <Zap size={18} style={{ color: "oklch(0.72 0.18 145)" }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>Stations Online</div>
                    <div className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.72 0.18 145)" }}>
                      50+
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APP SECTION ── */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container">
          <div
            ref={appRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            style={{
              opacity: appIn ? 1 : 0,
              transform: appIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="flex justify-center lg:justify-start">
              <img
                src="/manus-storage/app_mockup_b7c11162.png"
                alt="EB Volt Mobile App"
                className="w-64 lg:w-72 animate-float rounded-3xl"
                style={{ filter: "drop-shadow(0 24px 48px oklch(0 0 0 / 0.5))" }}
              />
            </div>
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                style={{
                  background: "oklch(0.55 0.18 145 / 0.12)",
                  color: "oklch(0.72 0.18 145)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Mobile App
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Your Charging{" "}
                <span style={{ color: "oklch(0.72 0.18 145)" }}>Command Centre</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.62 0.01 240)" }}>
                The EB Volt app puts Ghana's charging network in your pocket. Find chargers, reserve slots, track your charge, and manage payments, all in one place.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MapPin, label: "Live Map", desc: "Real-time charger locations" },
                  { icon: Clock, label: "Reservations", desc: "Book slots in advance" },
                  { icon: Battery, label: "Charge Tracker", desc: "Monitor your session" },
                  { icon: Shield, label: "Secure Pay", desc: "Mobile money & card" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl"
                      style={{ background: "oklch(0.12 0.015 240)", border: "1px solid oklch(1 0 0 / 8%)" }}
                    >
                      <Icon size={18} style={{ color: "oklch(0.72 0.18 145)", marginBottom: 8 }} />
                      <div className="text-sm font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                        {item.label}
                      </div>
                      <div className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                  style={{
                    background: "oklch(0.55 0.18 145 / 0.12)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.25)",
                    color: "oklch(0.72 0.18 145)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Coming Soon: App Store
                </div>
                <div
                  className="px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                  style={{
                    background: "oklch(0.55 0.18 145 / 0.12)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.25)",
                    color: "oklch(0.72 0.18 145)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Coming Soon: Google Play
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/sustainability_bg_8949fa1f.png"
            alt="Sustainable EV charging"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "oklch(0.08 0.015 240 / 0.82)" }}
          />
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
              Clean Energy
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Driving Ghana's{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>Green Future</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "oklch(0.82 0.005 240)" }}>
              We are integrating solar power into our charging stations to cut emissions while supporting Ghana's growing EV fleet. Every charge with EB Volt is a step toward a cleaner, greener Ghana.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: "100%", label: "Renewable Energy Goal" },
                { value: "0 kg", label: "CO₂ Per Charge" },
                { value: "2030", label: "Net Zero Ambition" },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.72 0.18 145)" }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.72 0.005 240)" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about">
              <button className="btn-outline-green flex items-center gap-2">
                Our Sustainability Mission
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24" style={{ background: "oklch(0.12 0.015 240)" }}>
        <div className="container">
          <div
            className="rounded-2xl p-12 lg:p-16 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.17 0.012 240) 0%, oklch(0.20 0.015 200) 100%)",
              border: "1px solid oklch(0.55 0.18 145 / 0.2)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: "oklch(0.55 0.18 145 / 0.15)" }}
            />
            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                style={{ background: "oklch(0.55 0.18 145 / 0.15)", border: "1px solid oklch(0.55 0.18 145 / 0.3)" }}
              >
                <Zap size={28} style={{ color: "oklch(0.72 0.18 145)" }} />
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Ready to Drive Green?
              </h2>
              <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "oklch(0.62 0.01 240)" }}>
                Find your nearest EB Volt charger and be part of Ghana's shift to clean, electric driving.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/find-charger">
                  <button className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                    <MapPin size={18} />
                    Find a Charger
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="btn-outline-green flex items-center gap-2 text-base px-8 py-4">
                    <Users size={18} />
                    Partner With Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose EB Volt (trust signals) */}
      <TrustSection />

      <Footer />
    </div>
  );
}
