/* ============================================================
   EcoBelle Volt - Contact Page
   ============================================================ */
import { useState } from "react";
import { Mail, Phone, MapPin, Zap, Send, CheckCircle, Building, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const contactReasons = [
  { value: "general", label: "General Enquiry" },
  { value: "driver", label: "Driver Support" },
  { value: "fleet", label: "Fleet Account Enquiry" },
  { value: "partnership", label: "Site Partnership Enquiry" },
  { value: "investor", label: "Investor Enquiry" },
  { value: "media", label: "Press & Media" },
  { value: "installation", label: "Charger Installation Enquiry" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent. Our team will get back to you as soon as we can.");
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-32 pb-16"
        style={{ background: "linear-gradient(180deg, oklch(0.15 0.012 240) 0%, oklch(0.12 0.015 240) 100%)" }}
      >
        <div className="container">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                background: "oklch(0.55 0.18 145 / 0.12)",
                color: "oklch(0.72 0.18 145)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Get in Touch
            </div>
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)", lineHeight: 1.1 }}
            >
              Let's Talk{" "}
              <span style={{ color: "oklch(0.72 0.18 145)" }}>EV</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.01 240)" }}>
              Whether you're a driver, business owner, or fleet operator, we'd love to hear from you. Our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                >
                  Contact Information
                </h2>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: "Phone", value: "+233 59 560 2717", href: "tel:+233595602717" },
                    { icon: Mail, label: "Email", value: "hello@ebvolt.com", href: "mailto:hello@ebvolt.com" },
                    { icon: MapPin, label: "Location", value: "Accra, Ghana", href: null },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "oklch(0.55 0.18 145 / 0.12)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}
                        >
                          <Icon size={18} style={{ color: "oklch(0.72 0.18 145)" }} />
                        </div>
                        <div>
                          <div className="text-xs font-medium mb-0.5" style={{ color: "oklch(0.55 0.01 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
                            {item.label}
                          </div>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm transition-colors duration-200"
                              style={{ color: "oklch(0.85 0 0)" }}
                              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "oklch(0.72 0.18 145)"; }}
                              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "oklch(0.85 0 0)"; }}
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="text-sm" style={{ color: "oklch(0.85 0 0)" }}>{item.value}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Partnership cards */}
              <div className="space-y-4 pt-4">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Partnership Opportunities
                </h3>
                {[
                  { icon: Building, title: "Site Owners", desc: "Host an EB Volt charger at your property and earn revenue." },
                  { icon: Users, title: "Fleet Operators", desc: "Dedicated charging solutions for your EV fleet." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl"
                      style={{ background: "oklch(0.17 0.012 240)", border: "1px solid oklch(1 0 0 / 8%)" }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={18} style={{ color: "oklch(0.72 0.18 145)", marginTop: 2 }} />
                        <div>
                          <div className="text-sm font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                            {item.title}
                          </div>
                          <div className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Support hours */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "oklch(0.55 0.18 145 / 0.08)", border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} style={{ color: "oklch(0.72 0.18 145)" }} />
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Charging Support
                  </span>
                </div>
                <p className="text-xs" style={{ color: "oklch(0.62 0.01 240)" }}>
                  For urgent charging issues, call our support line and our team will help you as quickly as possible.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl p-8"
                style={{ background: "oklch(0.17 0.012 240)", border: "1px solid oklch(1 0 0 / 8%)" }}
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={56} style={{ color: "oklch(0.72 0.18 145)", margin: "0 auto 16px" }} />
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                    >
                      Message Sent!
                    </h3>
                    <p style={{ color: "oklch(0.62 0.01 240)" }}>
                      Thank you for reaching out. Our team will get back to you as soon as we can.
                    </p>
                    <button
                      className="btn-outline-green mt-8"
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", reason: "general", message: "" }); }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2
                      className="text-2xl font-bold mb-6"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}
                    >
                      Send Us a Message
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "oklch(0.12 0.015 240)",
                            border: "1px solid oklch(1 0 0 / 12%)",
                            color: "oklch(0.95 0 0)",
                          }}
                          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(0.55 0.18 145 / 0.5)"; }}
                          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(1 0 0 / 12%)"; }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "oklch(0.12 0.015 240)",
                            border: "1px solid oklch(1 0 0 / 12%)",
                            color: "oklch(0.95 0 0)",
                          }}
                          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(0.55 0.18 145 / 0.5)"; }}
                          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(1 0 0 / 12%)"; }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+233 ..."
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "oklch(0.12 0.015 240)",
                            border: "1px solid oklch(1 0 0 / 12%)",
                            color: "oklch(0.95 0 0)",
                          }}
                          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(0.55 0.18 145 / 0.5)"; }}
                          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(1 0 0 / 12%)"; }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          Reason for Contact
                        </label>
                        <select
                          value={form.reason}
                          onChange={(e) => setForm({ ...form, reason: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "oklch(0.12 0.015 240)",
                            border: "1px solid oklch(1 0 0 / 12%)",
                            color: "oklch(0.95 0 0)",
                          }}
                        >
                          {contactReasons.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Message *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                        style={{
                          background: "oklch(0.12 0.015 240)",
                          border: "1px solid oklch(1 0 0 / 12%)",
                          color: "oklch(0.95 0 0)",
                        }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(0.55 0.18 145 / 0.5)"; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "oklch(1 0 0 / 12%)"; }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
