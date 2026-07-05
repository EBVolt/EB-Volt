import { Phone, Mail, MessageSquare, Clock, Users, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0F6E56" }}>
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              We're Here to Help
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Questions about charging, payments, or your account? Our support team is ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Phone,
                title: "Call Us",
                desc: "Speak to our team directly",
                contact: "+233 59 560 2717",
                time: "During support hours",
              },
              {
                icon: Mail,
                title: "Email",
                desc: "Send us your inquiry",
                contact: "hello@ebvolt.com",
                time: "We aim to reply the same day",
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                desc: "Chat with support instantly",
                contact: "Available on website",
                time: "During support hours",
              },
              {
                icon: AlertCircle,
                title: "Urgent Issues",
                desc: "Charger faults or safety concerns",
                contact: "+233 59 560 2717",
                time: "Prioritised response",
              },
            ].map((method, idx) => (
              <div key={idx} className="p-6 rounded-xl text-center" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <method.icon size={32} style={{ color: "oklch(0.52 0.18 145)", margin: "0 auto 1rem" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {method.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: "oklch(0.45 0.05 240)" }}>
                  {method.desc}
                </p>
                <p className="font-semibold mb-2" style={{ color: "oklch(0.52 0.18 145)" }}>
                  {method.contact}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.65 0.18 50)" }}>
                  {method.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Support Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Technical Support",
                issues: ["Charger not working", "Connection issues", "Payment problems", "App troubleshooting"],
              },
              {
                title: "Account Support",
                issues: ["Password reset", "Account settings", "Billing inquiries", "Subscription changes"],
              },
              {
                title: "Reservation Support",
                issues: ["Booking issues", "Cancellations", "Refunds", "Schedule changes"],
              },
              {
                title: "Installation Support",
                issues: ["Installation scheduling", "Technical questions", "Maintenance requests", "Warranty claims"],
              },
            ].map((category, idx) => (
              <div key={idx} className="p-8 rounded-xl" style={{ background: "white", border: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.issues.map((issue, i) => (
                    <li key={i} style={{ color: "oklch(0.45 0.05 240)" }}>
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            {[
              {
                q: "What should I do if a charger is not working?",
                a: "Call our support line at +233 59 560 2717 and our team will work to resolve the issue as quickly as possible. You will not be charged for a failed charging session.",
              },
              {
                q: "How do I cancel a reservation?",
                a: "You can cancel from your Account dashboard. Cancellations made 2+ hours before your reservation receive a full refund.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept MTN Mobile Money, Telecel, and other mobile money providers for seamless payments.",
              },
              {
                q: "How long does installation take?",
                a: "Most installations are completed within 2-3 business days after site assessment and permitting.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
                <h3 className="font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {faq.q}
                </h3>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16" style={{ background: "oklch(0.96 0.01 240)" }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Our Response Times
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { type: "Urgent Issues", time: "Prioritised", desc: "Charger malfunction or safety concerns" },
              { type: "Urgent Support", time: "Same day", desc: "Payment issues or booking problems" },
              { type: "General Inquiries", time: "Within 1 business day", desc: "Account or technical questions" },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-xl text-center" style={{ background: "white", border: "2px solid oklch(0.52 0.18 145)" }}>
                <Clock size={32} style={{ color: "oklch(0.52 0.18 145)", margin: "0 auto 1rem" }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {item.type}
                </h3>
                <p className="text-3xl font-bold mb-2" style={{ color: "oklch(0.52 0.18 145)" }}>
                  {item.time}
                </p>
                <p style={{ color: "oklch(0.45 0.05 240)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Need Help Right Now?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233595602717" className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.52 0.18 145)", color: "white" }}>
              Call Support
            </a>
            <Link href="/contact">
              <a className="inline-block px-8 py-3 rounded-lg font-semibold transition-all" style={{ background: "oklch(0.88 0.02 240)", color: "oklch(0.52 0.18 145)", border: "1px solid oklch(0.52 0.18 145)" }}>
                Send Message
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
