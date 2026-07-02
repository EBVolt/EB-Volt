/* ============================================================
   EcoBelle Volt - How It Works Page
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { CreditCard, Plug, Smartphone, MapPin, Calendar, CheckCircle, Zap, ArrowRight } from "lucide-react";
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

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Find a Charger",
    desc: "Use the EB Volt app or website to locate the nearest charging station. Our interactive map shows real-time availability across Ghana, filtered by speed, location, or amenities.",
    detail: "Chargers accessible around the clock across Accra, Kumasi, Takoradi, Tamale, and more cities.",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Reserve Your Slot",
    desc: "Book a charging slot in advance to reserve your spot. Choose your date, time, and duration, and your charger will be ready and waiting when you arrive.",
    detail: "Reservations can be made up to 7 days in advance.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Tap to Start",
    desc: "Arrive at the station and tap your contactless card or use the EB Volt app to start your session. No membership required, just tap and charge.",
    detail: "Accepts Visa, Mastercard, and mobile money (MTN, Telecel, AirtelTigo).",
  },
  {
    number: "04",
    icon: Plug,
    title: "Plug In",
    desc: "Connect the charging cable to your vehicle. Our DC fast chargers support CCS, CHAdeMO, and Type 2 connectors for maximum compatibility.",
    detail: "Compatible with all major EV brands.",
  },
  {
    number: "05",
    icon: Smartphone,
    title: "Track Your Charge",
    desc: "Monitor your charging session in real time through the EB Volt app. See battery level, energy delivered, time remaining, and cost, all in one place.",
    detail: "Push notifications when your charge is complete.",
  },
  {
    number: "06",
    icon: CheckCircle,
    title: "Unplug & Go",
    desc: "When your session is complete, simply unplug and go. Your receipt is automatically sent to your app. No fuss, no queues.",
    detail: "Digital receipts for easy expense tracking.",
  },
];

const faqs = [
  { q: "Do I need a membership to use EB Volt chargers?", a: "No membership is required. You can pay with any contactless card or mobile money. However, registering for the free EB Volt account gives you access to reservations, session history, and exclusive rates." },
  { q: "What connectors are available?", a: "Our DC fast chargers support CCS (Combined Charging System), CHAdeMO, and Type 2 AC connectors. This covers all major EV brands including Tesla (with adapter), Hyundai, Kia, Nissan, BMW, and more." },
  { q: "How fast will my car charge?", a: "Charging speed depends on your vehicle's onboard charger and our station's output. Our DC fast chargers deliver up to 100kW, which can add roughly 100km of range in about 15 to 20 minutes for compatible vehicles." },
  { q: "What if a charger is faulty?", a: "Our stations are monitored for uptime. If you encounter a fault, use the app to report it or call our support line, and our team will work to resolve it as quickly as possible. You are not charged for a failed session." },
  { q: "Can I charge any electric vehicle?", a: "Yes. EB Volt chargers are compatible with all standard EVs sold in Ghana. If you're unsure about your vehicle's compatibility, contact our support team." },
  { q: "How do I pay?", a: "We accept Visa, Mastercard, MTN Mobile Money, Telecel Cash, and AirtelTigo Money. Payment is processed automatically at the end of your session." },
];

export default function HowItWorks() {
  const { ref: heroRef, inView: heroIn } = useInView(0.1);
  const { ref: stepsRef, inView: stepsIn } = useInView(0.1);
  const { ref: faqRef, inView: faqIn } = useInView(0.1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            className="max-w-2xl"
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
              Simple Process
            </div>
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              Charging is{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>Easy</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
              From finding a charger to driving away, the entire EB Volt experience is designed to be fast, simple, and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div ref={stepsRef}>
            {/* Visual steps image */}
            <div className="flex justify-center mb-16">
              <img
                src="/manus-storage/charging_steps_28dee001.png"
                alt="How to charge with EB Volt"
                className="w-full max-w-4xl rounded-2xl"
                style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="ev-card p-6 relative overflow-hidden"
                    style={{
                      opacity: stepsIn ? 1 : 0,
                      transform: stepsIn ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
                    }}
                  >
                    {/* Step number watermark */}
                    <div
                      className="absolute top-4 right-4 text-6xl font-bold"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.55 0.18 145 / 0.08)",
                        lineHeight: 1,
                      }}
                    >
                      {step.number}
                    </div>
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
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {step.desc}
                    </p>
                    <div
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{ background: "oklch(0.55 0.18 145 / 0.08)", color: "oklch(0.65 0.12 145)" }}
                    >
                      {step.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: "oklch(0.14 0.012 240)" }}>
        <div className="container max-w-3xl">
          <div
            ref={faqRef}
            style={{
              opacity: faqIn ? 1 : 0,
              transform: faqIn ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
              >
                Frequently Asked Questions
              </h2>
              <p style={{ color: "oklch(0.62 0.01 240)" }}>
                Everything you need to know about charging with EB Volt.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "oklch(0.17 0.012 240)",
                    border: `1px solid ${openFaq === i ? "oklch(0.55 0.18 145 / 0.35)" : "oklch(1 0 0 / 8%)"}`,
                  }}
                >
                  <button
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span
                      className="font-medium text-sm"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}
                    >
                      {faq.q}
                    </span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        background: openFaq === i ? "oklch(0.55 0.18 145 / 0.2)" : "oklch(1 0 0 / 5%)",
                        color: openFaq === i ? "oklch(0.72 0.18 145)" : "oklch(0.55 0.01 240)",
                        transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      <ArrowRight size={12} />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "oklch(0.12 0.015 240)" }}>
        <div className="container text-center">
          <Zap size={40} style={{ color: "oklch(0.72 0.18 145)", margin: "0 auto 16px" }} />
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
          >
            Ready to Charge?
          </h2>
          <p className="text-lg mb-8" style={{ color: "oklch(0.62 0.01 240)" }}>
            Find your nearest EB Volt station and start your green journey today.
          </p>
          <Link href="/find-charger">
            <button className="btn-primary flex items-center gap-2 mx-auto text-base px-8 py-4">
              <MapPin size={18} />
              Find a Charger
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
