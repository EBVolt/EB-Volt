/* ============================================================
   EB Volt - Guide / informational landing page
   How long does EV fast charging take?
   ============================================================ */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { SITE_URL } from "@/components/Seo";
import { ORG, PRICING, faqLd, breadcrumbLd } from "@/data/seoContent";

const PATH = "/guides/how-long-does-ev-fast-charging-take";

const FAQS = [
  { q: "How long does it take to fast charge an EV?", a: "On an EB Volt DC fast charger (up to 100kW), most EVs reach about 80% charge in roughly 30 minutes. The exact time depends on your car's maximum charging speed, the battery size and how full the battery already is." },
  { q: "Why does charging slow down after 80%?", a: "To protect the battery, EVs deliberately reduce charging speed as they approach full. That's why fast-charging times are usually quoted to 80% — the last 20% takes proportionally longer." },
  { q: "What's the difference between AC and DC charging speed?", a: "DC fast charging (up to 100kW) can add 80% in about 30 minutes, ideal when you're on the move. AC Level 2 charging (up to 50kW) is slower — around 2 to 3 hours for a full charge — and is best for overnight or between-shift top-ups." },
];

const FACTORS = [
  { title: "Charger power", desc: "A higher-kW charger delivers energy faster. EB Volt DC fast chargers supply up to 100kW." },
  { title: "Your car's max rate", desc: "Every EV has a maximum charging speed; the session runs at the lower of the car's and charger's limits." },
  { title: "Battery level", desc: "Charging is fastest when the battery is low and slows down as it fills, especially past 80%." },
  { title: "Temperature", desc: "Very hot or cold batteries charge more slowly while the car manages battery temperature." },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Long Does EV Fast Charging Take?",
  description: "How long EV fast charging takes in Ghana, what affects charging speed, and the difference between AC and DC charging.",
  mainEntityOfPage: `${SITE_URL}${PATH}`,
  author: { "@type": "Organization", name: ORG.name },
  publisher: {
    "@type": "Organization",
    name: ORG.name,
    logo: { "@type": "ImageObject", url: ORG.logo },
  },
};

export default function FastChargingTime() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Seo
        title="How Long Does EV Fast Charging Take? | EB Volt Ghana"
        description="EB Volt DC fast chargers add about 80% in 30 minutes. Learn what affects EV charging speed and how AC and DC charging times compare in Ghana."
        canonicalPath={PATH}
        type="article"
        jsonLd={[
          articleLd,
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides/how-long-does-ev-fast-charging-take" },
            { name: "Fast Charging Time", path: PATH },
          ]),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>Guide</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How Long Does EV Fast Charging Take?
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Fast charging can add most of your range in the time it takes for a coffee. Here's what to expect and what affects the speed.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-lg mb-5 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            On an EB Volt DC fast charger delivering {PRICING.dc.speed}, most electric vehicles reach around <strong>80% charge in about 30 minutes</strong>. That's usually enough to cover a full day of driving or get you comfortably to your destination.
          </p>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            AC Level 2 charging ({PRICING.ac.speed}) is slower — typically <strong>2 to 3 hours for a full charge</strong> — which makes it ideal for topping up overnight or while your car is parked for a while.
          </p>

          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            What affects charging speed?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FACTORS.map((f) => (
              <div key={f.title} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{f.title}</h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
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
          <div className="mt-10 flex flex-wrap gap-6">
            <Link href="/guides/cost-to-charge-ev-ghana">
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                Related: What does charging cost in Ghana? <ArrowRight size={16} />
              </a>
            </Link>
            <Link href="/find-charger">
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                Find a charger <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
