/* ============================================================
   EB Volt - Navbar
   Design: Minimal bar (logo + icons + hamburger) at all sizes.
   All navigation lives inside the slide-in drawer.
   Transparent on hero, dark on scroll, sticky.
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Zap, HelpCircle, MapPin } from "lucide-react";

const navLinks = [
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Esc closes the drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const iconBtn =
    "p-2 rounded-md transition-all duration-200 flex items-center justify-center";
  const iconColor = "oklch(0.85 0 0)";
  const iconHover = (e: React.MouseEvent, on: boolean) => {
    (e.currentTarget as HTMLElement).style.color = on
      ? "oklch(0.95 0 0)"
      : iconColor;
    (e.currentTarget as HTMLElement).style.background = on
      ? "oklch(1 0 0 / 6%)"
      : "transparent";
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "oklch(0.20 0.015 240 / 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid oklch(1 0 0 / 8%)" : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 group">
                <img
                  src="/manus-storage/ecobelle_logo_e4538568.webp"
                  alt="EB Volt"
                  className="h-12 w-auto transition-transform duration-200 group-hover:scale-105 lg:h-14"
                />
              </div>
            </Link>

            {/* Right-side icons: help, find-charger, hamburger */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/services/support">
                <button
                  className={iconBtn}
                  style={{ color: iconColor }}
                  onMouseEnter={(e) => iconHover(e, true)}
                  onMouseLeave={(e) => iconHover(e, false)}
                  aria-label="Support"
                >
                  <HelpCircle size={22} />
                </button>
              </Link>

              <Link href="/find-charger">
                <button
                  className={iconBtn}
                  style={{ color: iconColor }}
                  onMouseEnter={(e) => iconHover(e, true)}
                  onMouseLeave={(e) => iconHover(e, false)}
                  aria-label="Find a charger"
                >
                  <MapPin size={22} />
                </button>
              </Link>

              <button
                className={iconBtn}
                style={{ color: iconColor }}
                onMouseEnter={(e) => iconHover(e, true)}
                onMouseLeave={(e) => iconHover(e, false)}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                aria-controls="main-nav-drawer"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-in drawer — holds ALL navigation at every breakpoint */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "oklch(0 0 0 / 0.7)" }}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="main-nav-drawer"
          className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] flex flex-col pt-20 pb-8 px-6 overflow-y-auto"
          style={{
            background: "oklch(0.23 0.012 240)",
            borderLeft: "1px solid oklch(1 0 0 / 10%)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Main links */}
          <nav className="flex flex-col gap-1 shrink-0">
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

          {/* Services section */}
          <div
            className="mt-6 pt-6 shrink-0"
            style={{ borderTop: "1px solid oklch(1 0 0 / 10%)" }}
          >
            <p
              className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider"
              style={{
                color: "oklch(0.60 0.01 240)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Services
            </p>
            <nav className="flex flex-col gap-1">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="block px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
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
          </div>

          {/* Primary CTA */}
          <div
            className="mt-6 pt-6 shrink-0"
            style={{ borderTop: "1px solid oklch(1 0 0 / 10%)" }}
          >
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
