import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  const sections = [
    {
      title: "About us",
      content: "EB Volt is an electric vehicle charging network operating in Ghana. The service is provided by EB Volt Ghana Limited, a company registered in Ghana and a subsidiary of EB Volt Ltd, registered in the United Kingdom. These terms govern your use of our charging stations, installation services, and website.",
    },
    {
      title: "Acceptance",
      content: "By using EB Volt charging stations, installation services, or this website you agree to these terms.",
    },
    {
      title: "The service",
      content: "EB Volt provides public EV charging stations and EV charger installation services (residential, commercial, and fleet) in Ghana. Public charging is billed per kWh at the rate displayed on the charger screen at the time of your session. Installation services are quoted and billed separately as agreed before work begins.",
    },
    {
      title: "Payment",
      content: "Public charging payment is processed via MTN MoMo, Telecel Cash, or AirtelTigo Money. By initiating a session you authorise the payment shown on screen. All charging sales are final. Refunds for charging are issued only where a session fails to deliver charge due to a fault on our equipment. Installation services are paid as set out in your individual installation quote, including any deposit and refund terms stated in that quote.",
    },
    {
      title: "Your responsibilities (charging)",
      content: "You are responsible for ensuring your vehicle is compatible with our connectors (CCS2 and CHAdeMO). Do not leave your vehicle unattended for extended periods at a charging bay. EB Volt reserves the right to end a session if a vehicle is occupying a bay without charging.",
    },
    {
      title: "Your responsibilities (installation)",
      content: "For home and commercial installations, you are responsible for providing safe access to the installation site and accurate information about your electrical supply. All installations are carried out by certified technicians in line with Ghanaian electrical safety standards. You must not attempt to modify or relocate an installed charger yourself, as this may void your installation warranty and create a safety hazard.",
    },
    {
      title: "Installation warranty",
      content: "EB Volt installation work is covered by a 12-month workmanship warranty from the date of installation. The warranty covers faults arising from our installation but does not cover damage caused by misuse, unauthorised modification, electrical faults in your property outside our scope of work, or normal wear and tear.",
    },
    {
      title: "Liability",
      content: "EB Volt is not liable for damage to your vehicle arising from normal charging operations, or for pre-existing faults in your property's electrical system identified or affected during installation. In the event of equipment malfunction or an installation issue, contact our support line immediately.",
    },
    {
      title: "Governing law",
      content: "These terms are governed by the laws of the Republic of Ghana, where the service is provided.",
    },
    {
      title: "Changes",
      content: "We may update these terms at any time. Continued use of the service following an update constitutes acceptance of the new terms.",
    },
    {
      title: "Contact",
      content: "For terms enquiries contact hello@ebvolt.com.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ background: "#0D1F1A" }}>
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Terms of Service
            </h1>
            <p className="text-lg text-white/80">
              Last updated: July 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: "oklch(0.25 0.08 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {idx + 1}. {section.title}
                  </h2>
                  <p style={{ color: "oklch(0.45 0.05 240)", lineHeight: "1.8" }}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
