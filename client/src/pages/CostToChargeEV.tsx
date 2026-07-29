/* ============================================================
   EB Volt - Guide / informational landing page
   How much does it cost to charge an EV in Ghana?
   ============================================================ */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { SITE_URL } from "@/components/Seo";
import { ORG, PRICING, PAYMENTS, faqLd, breadcrumbLd } from "@/data/seoContent";

const PATH = "/guides/cost-to-charge-ev-ghana";

const FAQS = [
  { q: "How much does it cost to charge an electric car in Ghana?", a: "With EB Volt, DC fast charging is ₵4.50 per kWh and AC Level 2 charging is ₵2.50 per kWh. A typical 50 kWh battery therefore costs roughly ₵125 to fully charge on AC or about ₵225 on DC fast charging — and you only pay for the energy you use." },
  { q: "Is charging an EV cheaper than buying petrol?", a: "In most cases yes. Because you pay per kilowatt-hour rather than per litre, the cost per kilometre for an EV is generally well below that of a comparable petrol car, especially when charging on AC." },
  { q: "How do I pay for EV charging in Ghana?", a: "EB Volt accepts MTN MoMo, Telecel Cash, AirtelTigo Money and card, so you can pay instantly at any station without a bank account." },
];

const EXAMPLES = [
  { battery: "40 kWh (small EV)", ac: "₵100", dc: "₵180" },
  { battery: "50 kWh (typical EV)", ac: "₵125", dc: "₵225" },
  { battery: "64 kWh (mid-size EV)", ac: "₵160", dc: "₵288" },
  { battery: "77 kWh (large EV)", ac: "₵192.50", dc: "₵346.50" },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Much Does It Cost to Charge an EV in Ghana?",
  description: "A clear breakdown of EV charging costs in Ghana, with per-kWh pricing and worked examples for common battery sizes.",
  mainEntityOfPage: `${SITE_URL}${PATH}`,
  author: { "@type": "Organization", name: ORG.name },
  publisher: {
    "@type": "Organization",
    name: ORG.name,
    logo: { "@type": "ImageObject", url: ORG.logo },
  },
};

export default function CostToChargeEV() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Seo
        title="How Much Does It Cost to Charge an EV in Ghana? | EB Volt"
        description="How much does EV charging cost in Ghana? EB Volt charges from ₵2.50/kWh. See worked examples by battery size and how it compares to petrol."
        canonicalPath={PATH}
        type="article"
        jsonLd={[
          articleLd,
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides/cost-to-charge-ev-ghana" },
            { name: "Cost to Charge an EV", path: PATH },
          ]),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>Guide</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How Much Does It Cost to Charge an EV in Ghana?
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            A simple breakdown of what you'll actually pay to charge an electric vehicle — and how it compares to petrol.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-lg mb-5 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            EV charging in Ghana is priced per kilowatt-hour (kWh) — the unit of energy your car's battery stores. With EB Volt you pay <strong>{PRICING.ac.rate} per kWh</strong> for AC Level 2 charging and <strong>{PRICING.dc.rate} per kWh</strong> for DC fast charging. There's no subscription; you simply pay for the energy you use.
          </p>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            To estimate a full charge, multiply your battery size (in kWh) by the rate. A common 50 kWh EV costs about <strong>₵125</strong> to fill on AC, or <strong>₵225</strong> on DC fast charging.
          </p>

          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Cost by battery size
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "oklch(0.96 0.01 240)" }}>
                  <th className="p-3 font-semibold" style={{ color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}>Battery size</th>
                  <th className="p-3 font-semibold" style={{ color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}>AC ({PRICING.ac.rate}/kWh)</th>
                  <th className="p-3 font-semibold" style={{ color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}>DC fast ({PRICING.dc.rate}/kWh)</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((r) => (
                  <tr key={r.battery}>
                    <td className="p-3" style={{ color: "oklch(0.35 0.04 240)", border: "1px solid oklch(0.88 0.02 240)" }}>{r.battery}</td>
                    <td className="p-3" style={{ color: "oklch(0.35 0.04 240)", border: "1px solid oklch(0.88 0.02 240)" }}>{r.ac}</td>
                    <td className="p-3" style={{ color: "oklch(0.35 0.04 240)", border: "1px solid oklch(0.88 0.02 240)" }}>{r.dc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm mb-8" style={{ color: "oklch(0.45 0.05 240)" }}>
            Figures assume a full 0–100% charge for illustration; in practice most drivers top up partially. Pay with {PAYMENTS.join(", ")}.
          </p>

          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            EV charging vs. petrol
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            Because you're buying electricity by the kilowatt-hour rather than fuel by the litre, the cost to travel each kilometre in an EV is usually well below that of a petrol car. Charging on AC overnight or between shifts is the most economical option, while DC fast charging trades a slightly higher rate for speed when you're on the move.
          </p>
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
            <Link href="/guides/how-long-does-ev-fast-charging-take">
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                Next: How long does fast charging take? <ArrowRight size={16} />
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
