/* ============================================================
   EcoBelle Volt - Terms & Conditions
   ============================================================ */
import LegalPage, { LegalSection } from "@/components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "1. About These Terms",
    paragraphs: [
      "These terms govern your use of the EcoBelle Volt (EB Volt) website, mobile app, and charging network in Ghana. By creating an account, reserving a charger, or using our stations, you agree to these terms.",
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
    heading: "4. Payments",
    paragraphs: [
      "Charging is paid for through supported mobile money providers, including MTN Mobile Money. Prices are shown before you confirm a session or reservation. You agree to pay the charges shown for the services you use.",
    ],
  },
  {
    heading: "5. Cancellations and Refunds",
    paragraphs: [
      "You can cancel a reservation from your account dashboard. Cancellations made at least two hours before your reserved time are eligible for a full refund. If a charging session fails due to a station fault, you will not be charged for that session.",
      "Approved refunds are returned to your mobile money account, usually within a few business days. You can request a refund from your account, and our team will review it.",
    ],
  },
  {
    heading: "6. Service Availability",
    paragraphs: [
      "We are launching and expanding our network across Ghana. Station coverage, features, and hours may change as we grow. We work to keep chargers running reliably, but we cannot promise uninterrupted service.",
    ],
  },
  {
    heading: "7. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by law, EB Volt is not liable for indirect or consequential losses arising from the use of our services. Nothing in these terms limits any rights you have under applicable Ghanaian consumer law.",
    ],
  },
  {
    heading: "8. Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time as our services develop. When we make significant changes, we will update the date on this page. Continued use of our services means you accept the updated terms.",
    ],
  },
  {
    heading: "9. Contact Us",
    paragraphs: [
      "If you have questions about these terms, contact us at hello@ebvolt.com or call +233 59 560 2717. Our team is based in Accra, Ghana.",
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="The terms that apply when you use EB Volt charging services."
      lastUpdated="July 2026"
      intro="These terms set out the rules for using EB Volt's charging network, app, and website. Please read them carefully so you understand your rights and responsibilities."
      sections={sections}
    />
  );
}
