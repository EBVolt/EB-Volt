/* ============================================================
   EB Volt - Use-case landing page
   EV charging for taxi & ride-hailing drivers in Ghana
   ============================================================ */
import { Link } from "wouter";
import { Zap, Clock, Wallet, TrendingUp, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { PRICING, PAYMENTS, faqLd, breadcrumbLd } from "@/data/seoContent";

const PATH = "/ev-charging-for-taxi-drivers";

const FAQS = [
  { q: "Is it cheaper to run an electric taxi in Ghana?", a: "Yes. Charging an EV with EB Volt costs from ₵2.50 per kWh, which typically works out far lower per kilometre than petrol, helping ride-hailing and taxi drivers keep more of their fare income." },
  { q: "How fast can I charge between trips?", a: "EB Volt DC fast chargers deliver up to 100kW, adding roughly 80% charge in about 30 minutes — enough to top up during a break between rides." },
  { q: "Can I pay for charging with mobile money?", a: "Yes. Every EB Volt station accepts MTN MoMo, Telecel Cash and AirtelTigo Money, so drivers can pay instantly without a bank account." },
];

const BENEFITS = [
  { icon: Wallet, title: "Lower running costs", desc: "From ₵2.50/kWh, electricity beats petrol on cost per kilometre — more take-home pay per shift." },
  { icon: Clock, title: "Fast top-ups between fares", desc: "Up to 100kW DC fast charging adds around 80% in about 30 minutes, so downtime stays short." },
  { icon: TrendingUp, title: "Predictable pricing", desc: "Transparent per-kWh rates make it easy to budget your daily charging spend." },
  { icon: Zap, title: "Always-on solar network", desc: "Solar-backed stations keep charging even when the grid is down, so you keep earning." },
];

export default function TaxiEVCharging() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Seo
        title="EV Charging for Taxi & Ride-Hailing Drivers | EB Volt Ghana"
        description="Drive an electric taxi or ride-hailing car in Ghana? EB Volt offers fast, low-cost charging from ₵2.50/kWh with mobile-money payments and short top-up times."
        canonicalPath={PATH}
        jsonLd={[
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "EV Charging for Taxi Drivers", path: PATH },
          ]),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>For drivers</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            EV Charging for Taxi & Ride-Hailing Drivers in Ghana
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Keep more of every fare. Fast, affordable charging built around the way you drive — with mobile-money payments and solar-powered reliability.
          </p>
          <Link href="/find-charger">
            <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold" style={{ background: "#1D9E75", color: "white" }}>
              <MapPin size={18} /> Find a Charger
            </a>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-lg mb-5 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            For taxi and ride-hailing drivers, fuel is one of the biggest costs of every shift. Switching to an electric vehicle and charging with EB Volt can dramatically cut that cost while keeping your car on the road and earning.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            Our network is designed for high-mileage drivers: fast chargers positioned around busy corridors, transparent per-kilowatt-hour pricing, and instant mobile-money payment so you never have to break your day at the bank.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why drivers choose EB Volt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="p-6 rounded-xl flex gap-4" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0" style={{ background: "oklch(0.52 0.18 145 / 0.12)" }}>
                  <b.icon size={22} style={{ color: "oklch(0.52 0.18 145)" }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{b.title}</h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
            Charging from {PRICING.ac.rate}/{PRICING.ac.unit} (AC) and {PRICING.dc.rate}/{PRICING.dc.unit} (DC fast). Pay with {PAYMENTS.join(", ")}.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q} className="pb-6" style={{ borderBottom: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{f.q}</h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/services/fleet-charging">
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                Running a fleet of vehicles? See Fleet Charging <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Start charging smarter
          </h2>
          <Link href="/find-charger">
            <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold" style={{ background: "oklch(0.52 0.18 145)", color: "white" }}>
              Find a Charger Now <ArrowRight size={16} />
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
