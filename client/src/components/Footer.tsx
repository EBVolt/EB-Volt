/* ============================================================
   EcoBelle Volt — Footer
   Design: Dark surface with green accents, Ghana-focused
   ============================================================ */
import { Link } from "wouter";
import { Zap, Mail, Phone, MapPin, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "oklch(0.10 0.015 240)",
        borderTop: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/manus-storage/ecobelle_logo_e4538568.webp"
              alt="EB Volt"
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.62 0.01 240)" }}>
              Ghana's first smart EV charging network. Fast, reliable, and built for the future of clean mobility.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/ecobellevolt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: "oklch(1 0 0 / 6%)",
                  color: "oklch(0.72 0.18 145)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(1 0 0 / 6%)";
                }}
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://x.com/ecobellevolt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: "oklch(1 0 0 / 6%)",
                  color: "oklch(0.72 0.18 145)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(1 0 0 / 6%)";
                }}
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@ecobelle.volt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 font-bold text-xs"
                style={{
                  background: "oklch(1 0 0 / 6%)",
                  color: "oklch(0.72 0.18 145)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(1 0 0 / 6%)";
                }}
              >
                TK
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/find-charger", label: "Find a Charger" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span
                      className="text-sm transition-colors duration-200"
                      style={{ color: "oklch(0.62 0.01 240)" }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "oklch(0.62 0.01 240)";
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Public Charging",
                "Fleet Charging",
                "Business Partnerships",
                "Charger Installation",
                "24/7 Support",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} style={{ color: "oklch(0.55 0.18 145)", marginTop: 2 }} />
                <span className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                  +44 7477 884 266
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} style={{ color: "oklch(0.55 0.18 145)", marginTop: 2 }} />
                <a
                  href="mailto:contact@ecobelle.com"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "oklch(0.62 0.01 240)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.62 0.01 240)";
                  }}
                >
                  contact@ecobelle.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} style={{ color: "oklch(0.55 0.18 145)", marginTop: 2 }} />
                <span className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                  Accra, Ghana
                </span>
              </li>
            </ul>

            <div
              className="mt-6 p-3 rounded-lg flex items-center gap-2"
              style={{ background: "oklch(0.55 0.18 145 / 0.1)", border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}
            >
              <Zap size={14} style={{ color: "oklch(0.72 0.18 145)" }} />
              <span className="text-xs font-medium" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                24/7 Emergency Support Available
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs" style={{ color: "oklch(0.5 0.01 240)" }}>
            © 2026 EcoBelle Volt. All rights reserved. Launching in Ghana.
          </p>
          <div className="flex items-center gap-6">
            <span
              className="text-xs transition-colors duration-200 cursor-pointer"
              style={{ color: "oklch(0.5 0.01 240)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.5 0.01 240)";
              }}
            >
              Privacy Policy
            </span>
            <span
              className="text-xs transition-colors duration-200 cursor-pointer"
              style={{ color: "oklch(0.5 0.01 240)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.5 0.01 240)";
              }}
            >
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
