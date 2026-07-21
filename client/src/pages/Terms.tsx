/* ============================================================
   EB Volt - Terms of Service
   Canonical legal terms. Covers charging network, app, and
   installation services. Served at /terms; /terms-of-service
   redirects here.
   ============================================================ */
import LegalPage, { LegalSection } from "@/components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "1. About These Terms",
    paragraphs: [
      "EB Volt is an electric vehicle charging network operating in Ghana. The service is provided by EB Volt Ghana Limited, a company registered in Ghana. Our operating team is based in Accra.",
      "These terms govern your use of the EB Volt website, mobile app, charging stations, and installation services. By creating an account, reserving a charger, using our stations, or engaging our installation services, you agree to these terms.",
    ],
  },
  {
    heading: "2. Using Our Services",
    paragraphs: [
      "You agree to use our chargers and app responsibly, follow on-site safety instructions, and provide accurate account information. You are responsible for keeping your account details secure.",
    ],
  },
  {
    heading: "3. Reservations",
    paragraphs: [
      "You can reserve a charging slot in advance through the app or website. Reservations are subject to charger availability and any posted time limits. We aim to keep availability accurate, but station status can change due to demand or maintenance.",
    ],
  },
  {
    heading: "4. Charging Sessions and Your Vehicle",
    paragraphs: [
      "Public charging is billed per kWh at the rate displayed on the charger screen at the time of your session. You are responsible for ensuring your vehicle is compatible with our connectors (CCS2 and CHAdeMO).",
      "Please do not leave your vehicle unattended for extended periods at a charging bay. EB Volt may end a session if a vehicle is occupying a bay without charging.",
    ],
  },
  {
    heading: "5. Payments",
    paragraphs: [
      "Charging is paid for through supported mobile money providers, including MTN MoMo, Telecel Cash, and AirtelTigo Money. Prices are shown before you confirm a session or reservation, and by starting a session you authorise the payment shown on screen.",
      "Installation services are quoted and billed separately, as agreed before work begins and as set out in your individual installation quote.",
    ],
  },
  {
    heading: "6. Cancellations and Refunds",
    paragraphs: [
      "Reservations: you can cancel a reservation from your account dashboard. Cancellations made at least two hours before your reserved time are eligible for a full refund of any amount paid to hold the slot.",
      "Charging sessions: once a session has delivered charge to your vehicle, it is not refundable. If a session fails to deliver charge because of a fault in our equipment, you will not be charged, and any amount already taken will be refunded.",
      "Approved refunds are returned to your mobile money account, usually within a few business days. You can request a refund from your account and our team will review it.",
      "Installation services: deposit and refund terms are those stated in your individual installation quote.",
    ],
  },
  {
    heading: "7. Installation Services",
    paragraphs: [
      "For home, commercial, and fleet installations, you are responsible for providing safe access to the installation site and accurate information about your electrical supply. All installations are carried out by certified technicians in line with Ghanaian electrical safety standards.",
      "You must not attempt to modify or relocate an installed charger yourself. Doing so may void your installation warranty and create a safety hazard.",
    ],
  },
  {
    heading: "8. Installation Warranty",
    paragraphs: [
      "EB Volt installation work is covered by a 12-month workmanship warranty from the date of installation. The warranty covers faults arising from our installation. It does not cover damage caused by misuse, unauthorised modification, electrical faults in your property outside our scope of work, or normal wear and tear.",
    ],
  },
  {
    heading: "9. Service Availability",
    paragraphs: [
      "We are launching and expanding our network across Ghana. Station coverage, features, and hours may change as we grow. We work to keep chargers running reliably, but we cannot promise uninterrupted service.",
    ],
  },
  {
    heading: "10. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by law, EB Volt is not liable for indirect or consequential losses arising from the use of our services, for damage to your vehicle arising from normal charging operations, or for pre-existing faults in your property's electrical system identified or affected during installation.",
      "Nothing in these terms limits any rights you have under applicable Ghanaian consumer law. If you experience an equipment malfunction or an installation issue, please contact our support team as soon as you can.",
    ],
  },
  {
    heading: "11. Governing Law",
    paragraphs: [
      "These terms are governed by the laws of the Republic of Ghana, where the service is provided.",
    ],
  },
  {
    heading: "12. Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time as our services develop. When we make significant changes, we will update the date on this page. Continued use of our services means you accept the updated terms.",
    ],
  },
  {
    heading: "13. Contact Us",
    paragraphs: [
      "If you have questions about these terms, contact us at hello@ebvolt.com or call +233 59 560 2717. Our team is based in Accra, Ghana.",
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The terms that apply when you use EB Volt charging and installation services."
      lastUpdated="July 2026"
      intro="These terms set out the rules for using EB Volt's charging network, app, website, and installation services. Please read them carefully so you understand your rights and responsibilities."
      sections={sections}
    />
  );
}
