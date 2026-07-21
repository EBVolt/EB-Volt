/* ============================================================
   EB Volt - Footer
   Design: Dark surface with green accents, Ghana-focused
   ============================================================ */
import { Link } from "wouter";
import { Zap, Mail, Phone, MapPin, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "oklch(0.10 0.015 240)",
        borderTop: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="mb-4 inline-flex items-center">
                <span
                  className="flex h-14 items-center rounded-xl px-3"
                  style={{
                    background: "oklch(0.98 0.01 145 / 0.95)",
                    boxShadow: "0 10px 30px oklch(0 0 0 / 0.25)",
                  }}
                >
                  <img
                    src="/manus-storage/ecobelle_logo_e4538568.webp"
                    alt="EB Volt"
                    className="h-10 w-auto"
                  />
                </span>
              </div>
            </Link>
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
              <a
                href="https://wa.me/233595602717"
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
                <MessageCircle size={16} />
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

          {/* Company */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Investors", href: "/investors" },
                { label: "Careers", href: "/contact" },
                { label: "Press", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span className="text-sm hover:text-white transition-colors cursor-pointer inline-block" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {item.label}
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
                { label: "Public Charging", href: "/services/public-charging" },
                { label: "Fleet Charging", href: "/services/fleet-charging" },
                { label: "Business Partnerships", href: "/services/business-partnerships" },
                { label: "Charger Installation", href: "/services/charger-installation" },
                { label: "Support", href: "/services/support" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span className="text-sm hover:text-white transition-colors cursor-pointer inline-block" style={{ color: "oklch(0.62 0.01 240)" }}>
                      {item.label}
                    </span>
                  </Link>
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
                <div className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                  <p>+233 59 560 2717</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} style={{ color: "oklch(0.55 0.18 145)", marginTop: 2 }} />
                <a
                  href="mailto:hello@ebvolt.com"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "oklch(0.62 0.01 240)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.62 0.01 240)";
                  }}
                >
                  hello@ebvolt.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} style={{ color: "oklch(0.55 0.18 145)", marginTop: 2 }} />
                <div className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>
                  <p>Accra, Ghana</p>
                </div>
              </li>
            </ul>

            <div
              className="mt-6 p-3 rounded-lg flex items-center gap-2"
              style={{ background: "oklch(0.55 0.18 145 / 0.1)", border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}
            >
              <Zap size={14} style={{ color: "oklch(0.72 0.18 145)" }} />
              <span className="text-xs font-medium" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Charging Support Available
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <p className="text-xs" style={{ color: "oklch(0.5 0.01 240)" }}>
            © 2026 EB Volt. All rights reserved. Launching in Ghana.
          </p>
          <div className="flex gap-4">
            <a
              href="/privacy-policy"
              className="text-xs transition-colors duration-200"
              style={{ color: "oklch(0.5 0.01 240)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.5 0.01 240)";
              }}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-xs transition-colors duration-200"
              style={{ color: "oklch(0.5 0.01 240)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.5 0.01 240)";
              }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
