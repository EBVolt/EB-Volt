/* ============================================================
   EcoBelle Volt - Privacy Policy
   ============================================================ */
import LegalPage, { LegalSection } from "@/components/LegalPage";

const sections: LegalSection[] = [
  {
    heading: "1. Who We Are",
    paragraphs: [
      "EcoBelle Volt (EB Volt) operates an electric vehicle charging network in Ghana, along with a website and mobile app that let you find chargers, reserve slots, pay for charging, and manage your account. This policy explains what personal information we collect and how we use it.",
    ],
  },
  {
    heading: "2. Information We Collect",
    paragraphs: ["We collect information you give us and information generated when you use our services, including:"],
    bullets: [
      "Account details such as your name, email address, and phone number.",
      "Booking and charging records, including stations used, dates, times, and session details.",
      "Payment information processed through our mobile money partners (for example MTN Mobile Money). We do not store full payment credentials on our servers.",
      "Communication preferences, including your email and SMS notification settings.",
      "Technical data such as device type, app version, and approximate location when you search for nearby chargers.",
    ],
  },
  {
    heading: "3. How We Use Your Information",
    paragraphs: ["We use your information to:"],
    bullets: [
      "Provide charging services, process reservations, and complete payments.",
      "Send booking confirmations, payment receipts, and refund updates.",
      "Send account and service notifications you have opted into.",
      "Improve our network, plan new station locations, and troubleshoot issues.",
      "Meet legal, tax, and regulatory obligations in Ghana.",
    ],
  },
  {
    heading: "4. Notifications and Your Choices",
    paragraphs: [
      "You control which notifications you receive. You can update your email and SMS preferences from your account settings at any time, and every marketing email includes a one-click unsubscribe link. Some transactional messages, such as payment receipts, are needed to deliver the service and may still be sent.",
    ],
  },
  {
    heading: "5. Sharing Your Information",
    paragraphs: [
      "We do not sell your personal information. We share it only with service providers who help us operate, such as payment processors and messaging providers, and only to the extent needed to deliver our services. We may also disclose information where required by law.",
    ],
  },
  {
    heading: "6. Data Retention",
    paragraphs: [
      "We keep your information for as long as your account is active and for a reasonable period afterwards to meet legal, accounting, and operational requirements. When information is no longer needed, we take steps to remove or anonymise it.",
    ],
  },
  {
    heading: "7. Your Rights",
    paragraphs: [
      "You may request access to the personal information we hold about you, ask us to correct it, or request deletion where appropriate. To make a request, contact us at hello@ebvolt.com and we will respond as soon as we reasonably can.",
    ],
  },
  {
    heading: "8. Contact Us",
    paragraphs: [
      "If you have questions about this policy or how we handle your data, contact us at hello@ebvolt.com or call +233 59 560 2717. Our team is based in Accra, Ghana.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How EB Volt collects, uses, and protects your personal information."
      lastUpdated="July 2026"
      intro="Your privacy matters to us. This policy describes the information we collect when you use the EB Volt website, app, and charging network, and the choices you have about that information."
      sections={sections}
    />
  );
}
