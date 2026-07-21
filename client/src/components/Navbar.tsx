/* ============================================================
   EB Volt - Navbar
   Design: Transparent on hero, dark on scroll, sticky
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find-charger", label: "Find a Charger" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "My Account" },
];

const serviceLinks = [
  { href: "/services/public-charging", label: "Public Charging" },
  { href: "/services/fleet-charging", label: "Fleet Charging" },
  { href: "/services/business-partnerships", label: "Business Partnerships" },
  { href: "/services/charger-installation", label: "Charger Installation" },
  { href: "/services/support", label: "Support" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "oklch(0.12 0.015 240 / 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid oklch(1 0 0 / 8%)" : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 group">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: "oklch(0.55 0.18 145)",
                    color: "oklch(0.08 0.015 240)",
                  }}
                  aria-hidden="true"
                >
                  <Zap size={22} strokeWidth={2.6} />
                </span>
                <span
                  className="text-xl font-bold tracking-normal"
                  style={{
                    color: "oklch(0.95 0 0)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  EB Volt
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    style={{
                      color:
                        location === link.href
                          ? "oklch(0.72 0.18 145)"
                          : "oklch(0.85 0 0)",
                      background:
                        location === link.href
                          ? "oklch(0.55 0.18 145 / 0.12)"
                          : "transparent",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (location !== link.href) {
                        (e.target as HTMLElement).style.color = "oklch(0.95 0 0)";
                        (e.target as HTMLElement).style.background = "oklch(1 0 0 / 5%)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location !== link.href) {
                        (e.target as HTMLElement).style.color = "oklch(0.85 0 0)";
                        (e.target as HTMLElement).style.background = "transparent";
                      }
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {/* Services Dropdown */}
              <div className="relative group">
                <span
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    color: "oklch(0.85 0 0)",
                    background: "transparent",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.95 0 0)";
                    (e.target as HTMLElement).style.background = "oklch(1 0 0 / 5%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "oklch(0.85 0 0)";
                    (e.target as HTMLElement).style.background = "transparent";
                  }}
                >
                  Services
                </span>
                <div
                  className="absolute left-0 mt-0 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2"
                  style={{
                    background: "oklch(0.12 0.015 240)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.2)",
                  }}
                >
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className="block px-4 py-2 text-sm hover:bg-opacity-50 transition-all"
                        style={{
                          color: "oklch(0.85 0 0)",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)";
                          (e.target as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = "oklch(0.85 0 0)";
                          (e.target as HTMLElement).style.background = "transparent";
                        }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/find-charger">
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <Zap size={16} />
                  Find a Charger
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: "oklch(0.85 0 0)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "oklch(0 0 0 / 0.7)" }}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-72 flex flex-col pt-20 pb-8 px-6"
          style={{
            background: "oklch(0.15 0.012 240)",
            borderLeft: "1px solid oklch(1 0 0 / 10%)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="block px-4 py-3 rounded-md text-base font-medium transition-all duration-200"
                  style={{
                    color:
                      location === link.href
                        ? "oklch(0.72 0.18 145)"
                        : "oklch(0.85 0 0)",
                    background:
                      location === link.href
                        ? "oklch(0.55 0.18 145 / 0.12)"
                        : "transparent",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid oklch(1 0 0 / 10%)" }}>
            <Link href="/find-charger">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Zap size={16} />
                Find a Charger
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
