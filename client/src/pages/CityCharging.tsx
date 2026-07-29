/* ============================================================
   EB Volt - City / location landing page (dynamic)
   Route: /ev-charging/:city  (accra | kumasi | tema | takoradi)
   ============================================================ */
import { Link, useRoute, Redirect } from "wouter";
import { Zap, MapPin, Clock, Sun, Smartphone, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import {
  getCity,
  CITIES,
  PRICING,
  PAYMENTS,
  localBusinessLd,
  faqLd,
  breadcrumbLd,
} from "@/data/seoContent";

const HIGHLIGHT_ICONS = [Zap, Sun, Smartphone];

export default function CityCharging() {
  const [, params] = useRoute("/ev-charging/:city");
  const city = getCity(params?.city);

  if (!city) return <Redirect to="/404" />;

  const path = `/ev-charging/${city.slug}`;
  const title = `EV Charging in ${city.name}, Ghana | EB Volt`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Seo
        title={title}
        description={city.metaDescription}
        canonicalPath={path}
        jsonLd={[
          localBusinessLd(city),
          faqLd(city.faqs),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "EV Charging", path: "/find-charger" },
            { name: city.name, path },
          ]),
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#4ade80" }}>
            {city.region}
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            EV Charging in {city.name}, Ghana
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">{city.tagline}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/find-charger">
              <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold" style={{ background: "#1D9E75", color: "white" }}>
                <MapPin size={18} /> Find a Charger in {city.name}
              </a>
            </Link>
            <Link href="/how-it-works">
              <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white" style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}>
                How It Works <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container max-w-3xl">
          {city.intro.map((p, i) => (
            <p key={i} className="text-lg mb-5 leading-relaxed" style={{ color: "oklch(0.35 0.04 240)" }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Why charge with EB Volt in {city.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {city.highlights.map((h, idx) => {
              const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
              return (
                <div key={idx} className="p-6 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: "oklch(0.52 0.18 145 / 0.12)" }}>
                    <Icon size={22} style={{ color: "oklch(0.52 0.18 145)" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{h.title}</h3>
                  <p style={{ color: "oklch(0.45 0.05 240)" }}>{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Areas served */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Charging across {city.name}
          </h2>
          <p className="text-lg mb-8 max-w-2xl" style={{ color: "oklch(0.45 0.05 240)" }}>
            EB Volt is growing its fast-charging network in and around these {city.name} areas:
          </p>
          <div className="flex flex-wrap gap-3">
            {city.areas.map((a) => (
              <span key={a} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: "oklch(0.52 0.18 145 / 0.10)", color: "oklch(0.30 0.10 150)" }}>
                <MapPin size={14} /> {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Transparent {city.name} charging prices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[PRICING.dc, PRICING.ac].map((tier, i) => (
              <div key={tier.label} className="p-8 rounded-xl" style={{ background: "white", border: i === 0 ? "2px solid oklch(0.52 0.18 145)" : "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: i === 0 ? "oklch(0.52 0.18 145)" : "oklch(0.25 0.08 240)" }}>{tier.label}</h3>
                <p className="text-4xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {tier.rate} <span className="text-lg">/{tier.unit}</span>
                </p>
                <ul className="space-y-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <li className="flex items-center gap-2"><Check size={16} style={{ color: "oklch(0.52 0.18 145)" }} /> {tier.speed}</li>
                  <li className="flex items-center gap-2"><Check size={16} style={{ color: "oklch(0.52 0.18 145)" }} /> {tier.note}</li>
                  <li className="flex items-center gap-2"><Check size={16} style={{ color: "oklch(0.52 0.18 145)" }} /> Pay only for the energy you use</li>
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
            Accepted payment methods in {city.name}: {PAYMENTS.join(", ")}.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            EV charging in {city.name}: FAQs
          </h2>
          <div className="space-y-6">
            {city.faqs.map((f) => (
              <div key={f.q} className="pb-6" style={{ borderBottom: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>{f.q}</h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other cities (internal links) */}
      <section className="py-12" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            EV charging in other Ghanaian cities
          </h2>
          <div className="flex flex-wrap gap-4">
            {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
              <Link key={c.slug} href={`/ev-charging/${c.slug}`}>
                <a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)", color: "oklch(0.30 0.10 150)" }}>
                  EV Charging in {c.name} <ArrowRight size={15} />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Ready to charge in {city.name}?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "oklch(0.45 0.05 240)" }}>
            Find your nearest EB Volt charger and pay instantly with mobile money.
          </p>
          <Link href="/find-charger">
            <a className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold" style={{ background: "oklch(0.52 0.18 145)", color: "white" }}>
              <Clock size={18} /> Find a Charger Now
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
