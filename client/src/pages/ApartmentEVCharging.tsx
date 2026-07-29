/* ============================================================
   EB Volt - Use-case landing page
   EV charging for apartment & estate residents in Ghana
   ============================================================ */
import { Link } from "wouter";
import { Building2, MapPin, Sun, Smartphone, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { PRICING, PAYMENTS, faqLd, breadcrumbLd } from "@/data/seoContent";

const PATH = "/ev-charging-for-apartments";

const FAQS = [
  { q: "How can I charge an EV if I live in an apartment?", a: "If you cannot install a home charger, EB Volt's public fast-charging network lets apartment and estate residents charge nearby. You can also speak to your estate management about installing an EB Volt charger on site." },
  { q: "Can EB Volt install a charger at my apartment complex or estate?", a: "Yes. EB Volt works with estate managers, landlords and residents' associations to install shared charging for apartment complexes and gated communities. Visit our Charger Installation page to enquire." },
  { q: "How do residents pay for charging?", a: "Residents pay per charge with MTN MoMo, Telecel Cash, AirtelTigo Money or card — from ₵2.50 per kWh — with no need for individual home wiring." },
];

const POINTS = [
  { icon: MapPin, title: "Public chargers nearby", desc: "Fast, reliable EB Volt stations near residential areas mean you can charge without a private driveway." },
  { icon: Building2, title: "On-site installation", desc: "We partner with estates and landlords to install shared chargers in car parks and gated communities." },
  { icon: Sun, title: "Solar-powered & always on", desc: "Solar-backed charging keeps working during grid outages, so residents are never left stranded." },
  { icon: Smartphone, title: "Pay-per-use with mobile money", desc: "No home meter changes — residents simply tap and pay with mobile money for the energy they use." },
];

export default function ApartmentEVCharging() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Seo
        title="EV Charging for Apartments & Estates in Ghana | EB Volt"
        description="No driveway? EB Volt makes EV charging easy for apartment and estate residents in Ghana with nearby public fast chargers and on-site installation options."
        canonicalPath={PATH}
        jsonLd={[
          faqLd(FAQS),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "EV Charging for Apartments", path: PATH },
          ]),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>For residents</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            EV Charging for Apartments & Estates in Ghana
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Living without a private driveway shouldn't stop you going electric. EB Volt brings dependable charging close to home — and directly to your estate.
          </p>
          <Link href="/find-charger">
            <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold" style={{ background: "#1D9E75", color: "white" }}>
              <MapPin size={18} /> Find a Charger Near You
            </a>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-lg mb-5 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            Many EV drivers in Ghana live in apartments or gated estates where installing a personal home charger isn't practical. EB Volt closes that gap with a growing network of public fast chargers near residential neighbourhoods, plus shared charging built directly into estates and apartment car parks.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
            Whether you top up at a nearby station or use a charger installed at your complex, you pay only for the energy you use with mobile money — no complicated wiring or private meter required.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Charging that fits apartment living
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {POINTS.map((p) => (
              <div key={p.title} className="p-6 rounded-xl flex gap-4" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0" style={{ background: "oklch(0.52 0.18 145 / 0.12)" }}>
                  <p.icon size={22} style={{ color: "oklch(0.52 0.18 145)" }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{p.title}</h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
            From {PRICING.ac.rate}/{PRICING.ac.unit}. Pay with {PAYMENTS.join(", ")}.
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
            <Link href="/services/charger-installation">
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                Manage an estate or apartment block? See Charger Installation <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Go electric, wherever you live
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
