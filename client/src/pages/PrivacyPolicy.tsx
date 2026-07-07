import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90">
              Last updated: July 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 flex-grow">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {/* Who we are */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                Who we are
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                EcoBelle Volt Ltd is an EV charging network operator registered in the United Kingdom and operating in Ghana. Our website is ebvolt.com.
              </p>
            </div>

            {/* What data we collect */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                What data we collect
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                We collect your name, email address, phone number, and MoMo number when you register, contact us, or book a charging slot. We collect usage data when you charge with us including session duration, energy consumed, and payment amount.
              </p>
            </div>

            {/* How we use your data */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                How we use your data
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                We use your data to operate the charging service, process payments via MTN MoMo and Paystack, send session receipts by SMS, notify you of station availability, and respond to your enquiries.
              </p>
            </div>

            {/* Who we share it with */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                Who we share it with
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                We share payment data with Paystack Ghana (our payment processor) and MTN Ghana (for MoMo transactions). We do not sell your data to third parties.
              </p>
            </div>

            {/* Your rights */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                Your rights
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                You have the right to access, correct, or delete your personal data at any time. Contact us at hello@ebvolt.com to make a request.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                Contact
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.45 0.05 240)" }}>
                For privacy enquiries contact hello@ebvolt.com or write to EcoBelle Volt Ltd, United Kingdom.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
