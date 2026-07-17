/*
   EB Volt - How It Works Page
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { QrCode, CreditCard, Plug, CheckCircle, Zap, ArrowRight } from "lucide-react";
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
    title: "SCAN",
    desc: "Scan the QR code on the charger screen. No app or bank card required.",
    graphic: "qr",
  },
  {
    number: "02",
    title: "PAY",
    desc: "A payment prompt is sent to your MTN MoMo, Telecel Cash, or AirtelTigo number. Enter your PIN to confirm. Payment completes in under 5 seconds.",
    graphic: "payment",
  },
  {
    number: "03",
    title: "CHARGE",
    desc: "The charger unlocks automatically. Plug in and charging begins. Unplug when done — your session closes and a receipt is sent by SMS.",
    graphic: "charging",
  },
];

const faqs = [
  { q: "Do I need a membership to use EB Volt chargers?", a: "No membership is required. You can pay with any mobile money service. However, registering for the free EB Volt account gives you access to session history and support." },
  { q: "What connectors are available?", a: "Our DC fast chargers support CCS (Combined Charging System), CHAdeMO, and Type 2 AC connectors. This covers all major EV brands including Tesla (with adapter), Hyundai, Kia, Nissan, BMW, and more." },
  { q: "How fast will my car charge?", a: "Charging speed depends on your vehicle's onboard charger and our station's output. Our DC fast chargers deliver up to 100kW, which can add roughly 100km of range in about 15 to 20 minutes for compatible vehicles." },
  { q: "What if a charger is faulty?", a: "Our stations are monitored for uptime. If you encounter a fault, use the app to report it or call our support line, and our team will work to resolve it as quickly as possible. You are not charged for a failed session." },
  { q: "Can I charge any electric vehicle?", a: "Yes. EB Volt chargers are compatible with all standard EVs sold in Ghana. If you're unsure about your vehicle's compatibility, contact our support team." },
  { q: "How do I pay?", a: "We accept MTN Mobile Money, Telecel Cash, and AirtelTigo Money. Payment is processed instantly — no bank account needed." },
];

// QR Code Graphic Component
function QrCodeGraphic() {
  return (
    <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.18 145)" }}>
      <div className="flex flex-col items-center gap-4">
        <QrCode size={64} style={{ color: "white" }} />
        <p className="text-sm font-medium" style={{ color: "white" }}>Scan to Start</p>
      </div>
    </div>
  );
}

// Payment Screen Graphic Component
function PaymentGraphic() {
  return (
    <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.2 0.01 240)" }}>
      <div className="flex flex-col items-center gap-4 px-6">
        <CreditCard size={48} style={{ color: "oklch(0.72 0.18 145)" }} />
        <p className="text-sm font-medium text-center" style={{ color: "oklch(0.78 0.005 240)" }}>
          Payment Prompt<br />Enter PIN
        </p>
        <div className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>
          Completes in &lt;5 seconds
        </div>
      </div>
    </div>
  );
}

// Charging Progress Graphic Component
function ChargingGraphic() {
  return (
    <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.15 0.012 240)" }}>
      <div className="flex flex-col items-center gap-6 px-6">
        <div className="text-center">
          <p className="text-xs font-semibold mb-2" style={{ color: "oklch(0.72 0.18 145)" }}>EB VOLT</p>
          <p className="text-sm" style={{ color: "oklch(0.78 0.005 240)" }}>Charging...</p>
        </div>
        <div className="w-32 h-2 rounded-full" style={{ background: "oklch(0.25 0.01 240)" }}>
          <div
            className="h-full rounded-full"
            style={{ background: "oklch(0.72 0.18 145)", width: "65%" }}
          />
        </div>
        <p className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>65% • 12 min remaining</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  useEffect(() => { document.title = "How It Works - EB Volt"; }, []);
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
              Three simple steps: scan, pay, charge. No app download, no bank account, no complications.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div ref={stepsRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {steps.map((step, i) => {
                return (
                  <div
                    key={step.number}
                    style={{
                      opacity: stepsIn ? 1 : 0,
                      transform: stepsIn ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms`,
                    }}
                  >
                    {/* Graphic */}
                    {step.graphic === "qr" && <QrCodeGraphic />}
                    {step.graphic === "payment" && <PaymentGraphic />}
                    {step.graphic === "charging" && <ChargingGraphic />}

                    {/* Step content */}
                    <div className="mt-6">
                      <div
                        className="text-sm font-semibold mb-2"
                        style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Step {step.number} — {step.title}
                      </div>
                      <p className="text-base leading-relaxed" style={{ color: "oklch(0.78 0.005 240)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment methods footer */}
            <div className="border-t" style={{ borderColor: "oklch(0.25 0.01 240)" }}>
              <div className="pt-12 text-center">
                <p className="text-sm font-semibold mb-6" style={{ color: "oklch(0.72 0.18 145)" }}>
                  Accepted payment methods — no bank account needed
                </p>
                <div className="flex justify-center items-center gap-8">
                  {/* MTN MoMo */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: "#FFC72C" }}
                    >
                      <span className="font-bold text-xs" style={{ color: "#000" }}>MTN</span>
                    </div>
                    <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>MTN MoMo</span>
                  </div>

                  {/* Telecel Cash */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: "#FF6B35" }}
                    >
                      <span className="font-bold text-xs" style={{ color: "#FFF" }}>TC</span>
                    </div>
                    <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>Telecel Cash</span>
                  </div>

                  {/* AirtelTigo Money */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: "#E60000" }}
                    >
                      <span className="font-bold text-xs" style={{ color: "#FFF" }}>ATM</span>
                    </div>
                    <span className="text-xs" style={{ color: "oklch(0.65 0.01 240)" }}>AirtelTigo Money</span>
                  </div>
                </div>
              </div>
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
            <h2
              className="text-4xl font-bold mb-12 text-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="ev-card overflow-hidden"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-6 flex items-start justify-between gap-4">
                    <h3
                      className="font-semibold text-base"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                    >
                      {faq.q}
                    </h3>
                    <div
                      style={{
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        color: "oklch(0.72 0.18 145)",
                        flexShrink: 0,
                      }}
                    >
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  {openFaq === i && (
                    <div
                      className="px-6 pb-6 border-t"
                      style={{ borderColor: "oklch(0.25 0.01 240)", color: "oklch(0.62 0.01 240)" }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
          >
            Ready to Charge?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "oklch(0.62 0.01 240)" }}>
            Find your nearest EB Volt charger and start charging today.
          </p>
          <Link href="/find-charger">
            <button className="btn-primary flex items-center gap-2 text-base px-8 py-4 mx-auto">
              <Zap size={18} />
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
