/* ============================================================
   EB Volt - SEO content & structured-data source of truth
   Keeps landing-page copy and JSON-LD facts in one place.
   ============================================================ */
import { SITE_URL, SITE_NAME } from "@/components/Seo";

export const ORG = {
  name: SITE_NAME,
  legalName: "EB Volt (Ecobelle Volt)",
  url: SITE_URL,
  logo: `${SITE_URL}/manus-storage/ebvolt_favicon_180.png`,
  telephone: "+233595602717",
  telephoneDisplay: "+233 59 560 2717",
  email: "hello@ebvolt.com",
  city: "Accra",
  region: "Greater Accra",
  country: "GH",
  priceRange: "₵₵",
  sameAs: [
    "https://www.tiktok.com/@ecobelle.volt",
  ],
};

export const PRICING = {
  dc: { label: "DC Fast Charging", rate: "₵4.50", unit: "kWh", speed: "up to 100kW", note: "80% charge in about 30 minutes" },
  ac: { label: "AC Level 2 Charging", rate: "₵2.50", unit: "kWh", speed: "up to 50kW", note: "Full charge in 2-3 hours" },
};

export const PAYMENTS = ["MTN MoMo", "Telecel Cash", "AirtelTigo Money", "Card"];

export interface City {
  slug: string;
  name: string;
  region: string;
  /** ~155 char meta description */
  metaDescription: string;
  /** one-line hero subheading */
  tagline: string;
  /** 1-2 intro paragraphs, keyword rich */
  intro: string[];
  /** neighbourhoods / areas served */
  areas: string[];
  /** why-charge-here bullet reasons */
  highlights: { title: string; desc: string }[];
  /** page-specific FAQs */
  faqs: { q: string; a: string }[];
}

export const CITIES: City[] = [
  {
    slug: "accra",
    name: "Accra",
    region: "Greater Accra Region",
    metaDescription:
      "EV charging in Accra with EB Volt. Find solar-powered DC fast chargers across Greater Accra, pay with MTN MoMo, and charge 24/7. Locate a station today.",
    tagline: "Solar-powered fast charging across Ghana's capital.",
    intro: [
      "Accra is the heart of Ghana's electric-vehicle movement, and EB Volt is building the capital's most reliable public charging network. Whether you drive through East Legon, Airport City, Osu or out along the Spintex Road, you are never far from a fast, dependable EB Volt charger.",
      "Our Accra stations are solar-powered, so they keep running even when the grid goes down, and every charge can be paid for instantly with MTN MoMo, Telecel Cash or AirtelTigo Money — no bank account required.",
    ],
    areas: ["East Legon", "Airport City", "Cantonments", "Osu", "Spintex Road", "Tema Motorway", "Dzorwulu", "Labone"],
    highlights: [
      { title: "Fast charging where you drive", desc: "DC fast chargers sited around Accra's busiest corridors deliver an 80% charge in roughly 30 minutes." },
      { title: "Always on with solar", desc: "Solar-backed stations keep charging through dumsor and peak-load hours across Greater Accra." },
      { title: "Pay with mobile money", desc: "Tap and pay with MTN MoMo, Telecel Cash or AirtelTigo Money — the way Accra already pays." },
    ],
    faqs: [
      { q: "Where can I charge my EV in Accra?", a: "EB Volt operates public charging stations across Greater Accra, including areas around East Legon, Airport City, Osu, Cantonments and the Spintex Road. Open the EB Volt app or the Find a Charger page for live locations and availability." },
      { q: "How much does it cost to charge in Accra?", a: "DC fast charging is ₵4.50 per kWh and AC Level 2 charging is ₵2.50 per kWh. You only pay for the energy you use, with no subscription required." },
      { q: "Can I pay with mobile money in Accra?", a: "Yes. Every EB Volt station in Accra accepts MTN MoMo, Telecel Cash and AirtelTigo Money, so you can charge instantly without a bank card." },
    ],
  },
  {
    slug: "kumasi",
    name: "Kumasi",
    region: "Ashanti Region",
    metaDescription:
      "EV charging in Kumasi with EB Volt. Solar-powered DC fast chargers across the Ashanti Region's Garden City, mobile-money payments and 24/7 access.",
    tagline: "Reliable EV charging for the Garden City.",
    intro: [
      "As the Ashanti Region's commercial capital, Kumasi is fast becoming one of Ghana's key EV hubs. EB Volt is expanding fast charging across the Garden City so drivers around Adum, Asokwa, Ahodwo and KNUST can charge with confidence.",
      "Every EB Volt charger in Kumasi is solar-powered and payable with MTN MoMo, Telecel Cash or AirtelTigo Money, giving drivers dependable, cashless charging wherever the road takes them.",
    ],
    areas: ["Adum", "Asokwa", "Ahodwo", "KNUST / Ayeduase", "Bantama", "Suame", "Ejisu"],
    highlights: [
      { title: "Charging for a growing EV city", desc: "New DC fast chargers across Kumasi keep pace with the Ashanti Region's rising number of electric vehicles." },
      { title: "Solar-powered reliability", desc: "Solar backup means EB Volt chargers in Kumasi stay online even during power interruptions." },
      { title: "Cashless mobile-money payments", desc: "Pay for every charge with MTN MoMo, Telecel Cash or AirtelTigo Money." },
    ],
    faqs: [
      { q: "Where can I charge my EV in Kumasi?", a: "EB Volt is rolling out public charging stations across Kumasi, including areas near Adum, Asokwa, Ahodwo and KNUST. Check the EB Volt app or the Find a Charger page for the latest locations." },
      { q: "How much does EV charging cost in Kumasi?", a: "Charging is ₵4.50 per kWh for DC fast charging and ₵2.50 per kWh for AC Level 2 charging — you only pay for the energy you use." },
      { q: "Do Kumasi stations work during power cuts?", a: "Yes. EB Volt stations are solar-powered with battery backup, so they keep charging vehicles even when the grid is down." },
    ],
  },
  {
    slug: "tema",
    name: "Tema",
    region: "Greater Accra Region",
    metaDescription:
      "EV charging in Tema with EB Volt. Fast, solar-powered chargers for the port city and its fleets, with mobile-money payments and round-the-clock access.",
    tagline: "Fast charging for Ghana's industrial port city.",
    intro: [
      "Tema's port, industrial estates and busy motorway make it a natural home for electric fleets and commuters alike. EB Volt provides fast, solar-powered charging across the Tema communities and along the Accra–Tema Motorway so drivers and businesses keep moving.",
      "From Community 1 to the harbour and the industrial area, EB Volt chargers accept MTN MoMo, Telecel Cash and AirtelTigo Money, making it simple for individual drivers and fleet operators to power up.",
    ],
    areas: ["Community 1", "Community 25", "Tema Harbour", "Tema Industrial Area", "Sakumono", "Ashaiman", "Accra-Tema Motorway"],
    highlights: [
      { title: "Built for fleets", desc: "High-throughput DC fast charging suits Tema's delivery vans, taxis and commercial fleets." },
      { title: "On the motorway", desc: "Conveniently placed for drivers travelling the Accra–Tema Motorway corridor." },
      { title: "Solar-powered & cashless", desc: "Solar-backed uptime and instant mobile-money payments keep operations running." },
    ],
    faqs: [
      { q: "Where can I charge my EV in Tema?", a: "EB Volt serves the Tema communities, the harbour and industrial area, and the Accra–Tema Motorway. Use the EB Volt app or the Find a Charger page for live station locations." },
      { q: "Does EB Volt support fleet charging in Tema?", a: "Yes. EB Volt offers fast charging suited to taxis, delivery vans and commercial fleets operating around Tema's port and industrial estates. See our Fleet Charging page for details." },
      { q: "How do I pay for charging in Tema?", a: "Pay instantly with MTN MoMo, Telecel Cash, AirtelTigo Money or card at any EB Volt station in Tema." },
    ],
  },
  {
    slug: "takoradi",
    name: "Takoradi",
    region: "Western Region",
    metaDescription:
      "EV charging in Takoradi with EB Volt. Solar-powered fast chargers across the Sekondi-Takoradi twin city, mobile-money payments and 24/7 availability.",
    tagline: "Powering electric journeys in the Western Region.",
    intro: [
      "Takoradi, part of the Sekondi-Takoradi twin city and Ghana's oil and gas hub, is embracing electric mobility. EB Volt is bringing solar-powered fast charging to the Western Region so drivers around Market Circle, Airport Ridge and Anaji can charge quickly and reliably.",
      "EB Volt stations in Takoradi run on solar power and accept MTN MoMo, Telecel Cash and AirtelTigo Money, delivering cashless, dependable charging for the growing number of EV drivers in the west.",
    ],
    areas: ["Market Circle", "Airport Ridge", "Anaji", "Effia", "Sekondi", "Takoradi Harbour"],
    highlights: [
      { title: "Charging comes to the west", desc: "EB Volt extends Ghana's fast-charging network into the Western Region and Sekondi-Takoradi." },
      { title: "Solar-powered uptime", desc: "Solar backup keeps Takoradi chargers running through grid interruptions." },
      { title: "Simple mobile-money payments", desc: "Every charge is payable with MTN MoMo, Telecel Cash or AirtelTigo Money." },
    ],
    faqs: [
      { q: "Where can I charge my EV in Takoradi?", a: "EB Volt is expanding charging across Sekondi-Takoradi, including areas near Market Circle, Airport Ridge and Anaji. Check the EB Volt app or the Find a Charger page for current locations." },
      { q: "How much does charging cost in Takoradi?", a: "DC fast charging is ₵4.50 per kWh and AC Level 2 charging is ₵2.50 per kWh, billed by the energy you use." },
      { q: "Are Takoradi chargers available 24/7?", a: "Yes. EB Volt stations are solar-powered and open around the clock, so you can charge whenever you need to." },
    ],
  },
];

export function getCity(slug?: string): City | undefined {
  return CITIES.find((c) => c.slug === slug?.toLowerCase());
}

/* ---------- Static page SEO metadata ---------- */

export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    title: "EB Volt – Premier EV Charging Network",
    description:
      "EB Volt is Ghana's first solar-powered EV charging network. Find fast chargers, pay with MTN MoMo — no bank account needed — and drive green across Ghana.",
    canonicalPath: "/",
  },
  findCharger: {
    title: "Find an EV Charger Near You in Ghana | EB Volt",
    description:
      "Locate the nearest EB Volt EV charging station in Ghana with live availability. Fast, solar-powered chargers with instant mobile-money payment.",
    canonicalPath: "/find-charger",
  },
  howItWorks: {
    title: "How EB Volt EV Charging Works | EB Volt Ghana",
    description:
      "See how easy it is to charge with EB Volt: find a station, plug in, and pay with MTN MoMo, Telecel Cash or AirtelTigo Money. Charging in three simple steps.",
    canonicalPath: "/how-it-works",
  },
  about: {
    title: "About EB Volt – Solar EV Charging in Ghana",
    description:
      "Learn about EB Volt, Ghana's solar-powered electric-vehicle charging network on a mission to make clean, reliable charging accessible across the country.",
    canonicalPath: "/about",
  },
  contact: {
    title: "Contact EB Volt | EV Charging Support in Ghana",
    description:
      "Get in touch with EB Volt for EV charging support, partnerships and installation enquiries in Ghana. Call +233 59 560 2717 or email hello@ebvolt.com.",
    canonicalPath: "/contact",
  },
  publicCharging: {
    title: "Public EV Charging Network in Ghana | EB Volt",
    description:
      "EB Volt's public EV charging network offers solar-powered DC fast charging across Ghana, with transparent per-kWh pricing and mobile-money payments.",
    canonicalPath: "/services/public-charging",
  },
  fleetCharging: {
    title: "EV Fleet Charging Solutions in Ghana | EB Volt",
    description:
      "Power your electric fleet with EB Volt. Reliable, solar-backed fast charging and flexible plans for taxis, delivery vans and commercial fleets in Ghana.",
    canonicalPath: "/services/fleet-charging",
  },
  businessPartnerships: {
    title: "EV Charging Partnerships for Business | EB Volt",
    description:
      "Partner with EB Volt to host EV chargers at your business or property in Ghana. Attract EV drivers and earn from Ghana's growing charging network.",
    canonicalPath: "/services/business-partnerships",
  },
  chargerInstallation: {
    title: "EV Charger Installation in Ghana | EB Volt",
    description:
      "Professional EV charger installation for homes, estates and businesses across Ghana. EB Volt handles supply, installation and support end to end.",
    canonicalPath: "/services/charger-installation",
  },
  homeCharging: {
    title: "Home EV Charging in Ghana | EB Volt",
    description:
      "Charge your electric vehicle at home with EB Volt. Reliable home charger installation and solar-ready options for EV owners across Ghana.",
    canonicalPath: "/services/home-charging",
  },
  support: {
    title: "EV Charging Support & Help | EB Volt Ghana",
    description:
      "Need help with EB Volt charging, payments or your account? Find answers and reach our Ghana-based support team for fast, friendly assistance.",
    canonicalPath: "/services/support",
  },
  investors: {
    title: "Investors | EB Volt – EV Charging in Ghana",
    description:
      "Invest in Ghana's clean-mobility future with EB Volt, the solar-powered EV charging network scaling across the country. Explore the opportunity.",
    canonicalPath: "/investors",
  },
  privacy: {
    title: "Privacy Policy | EB Volt",
    description:
      "How EB Volt collects, uses and protects your personal information across our website, app and EV charging network in Ghana.",
    canonicalPath: "/privacy",
  },
  // Duplicate of /privacy — canonical points to the primary URL to avoid duplicate content.
  privacyPolicy: {
    title: "Privacy Policy | EB Volt",
    description:
      "How EB Volt collects, uses and protects your personal information across our website, app and EV charging network in Ghana.",
    canonicalPath: "/privacy",
  },
  terms: {
    title: "Terms of Service | EB Volt",
    description:
      "The terms that apply when you use EB Volt's EV charging network, app, website and installation services in Ghana.",
    canonicalPath: "/terms",
  },
};

/* ---------- Structured-data builders ---------- */

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    email: ORG.email,
    telephone: ORG.telephone,
    sameAs: ORG.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: ORG.city,
      addressRegion: ORG.region,
      addressCountry: ORG.country,
    },
  };
}

export function localBusinessLd(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/ev-charging/${city.slug}#business`,
    name: `${ORG.name} EV Charging – ${city.name}`,
    description: city.metaDescription,
    url: `${SITE_URL}/ev-charging/${city.slug}`,
    image: ORG.logo,
    telephone: ORG.telephone,
    email: ORG.email,
    priceRange: ORG.priceRange,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: { "@type": "City", name: city.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: ORG.country,
    },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
