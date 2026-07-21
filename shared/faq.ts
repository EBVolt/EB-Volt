/**
 * FAQ Database with pre-populated questions and automated responses
 * Used by the chatbot widget for instant FAQ answers
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'payment' | 'charging' | 'account' | 'general' | 'technical';
  keywords: string[]; // For matching user queries
}

export const FAQ_DATABASE: FAQItem[] = [
  // Payment FAQs
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer: 'We accept Mobile Money payments through MTN MoMo, Telecel Cash, and AirtelTigo Money. You can also use USSD if you prefer not to use the app. No bank account is required to charge your vehicle.',
    category: 'payment',
    keywords: ['payment', 'methods', 'momo', 'telecel', 'airtel', 'ussd', 'mobile money'],
  },
  {
    id: 'payment-security',
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are processed securely through our trusted payment partners. Your Mobile Money PIN is never stored on our servers. We use industry-standard encryption to protect your personal and financial information.',
    category: 'payment',
    keywords: ['secure', 'security', 'safe', 'encryption', 'privacy'],
  },
  {
    id: 'payment-failed',
    question: 'What should I do if my payment fails?',
    answer: 'If your payment fails, you won\'t be charged. Please check that you have sufficient balance in your Mobile Money wallet and try again. If the problem persists, contact our support team via WhatsApp at +233 595 602 717.',
    category: 'payment',
    keywords: ['failed', 'payment failed', 'error', 'declined', 'rejected'],
  },
  {
    id: 'refund-policy',
    question: 'What is your refund policy?',
    answer: 'If you don\'t complete a charging session, you can request a refund through your account dashboard. Refunds are typically processed within 24-48 hours back to your Mobile Money wallet. Visit your Account page and select "Refund Requests" to submit a claim.',
    category: 'payment',
    keywords: ['refund', 'money back', 'reimbursement', 'return'],
  },

  // Charging FAQs
  {
    id: 'charging-time',
    question: 'How long does it take to charge my vehicle?',
    answer: 'Charging time depends on your vehicle\'s battery capacity and the charger type. DC fast chargers typically take 30-60 minutes for an 80% charge, while AC chargers may take 4-8 hours. Check the charger details in our app for specific timing.',
    category: 'charging',
    keywords: ['charging time', 'how long', 'duration', 'fast charge'],
  },
  {
    id: 'charger-availability',
    question: 'How do I know if a charger is available?',
    answer: 'Use the "Find a Charger" feature in our app to see real-time availability of all charging stations. Green indicators show available chargers, while red indicates they\'re in use. You can also reserve a charger in advance.',
    category: 'charging',
    keywords: ['available', 'availability', 'free', 'occupied', 'in use'],
  },
  {
    id: 'charger-compatibility',
    question: 'Are all chargers compatible with my vehicle?',
    answer: 'Most modern EVs are compatible with our chargers. We offer both DC fast charging and AC charging options. Check your vehicle\'s manual or the charger details in our app to confirm compatibility. If you\'re unsure, contact support.',
    category: 'charging',
    keywords: ['compatible', 'compatibility', 'vehicle', 'car type'],
  },
  {
    id: 'pricing',
    question: 'What are your charging prices?',
    answer: 'Our pricing is ₵4.50 per kWh for DC fast charging and ₵2.50 per kWh for AC charging. Prices are displayed before you start charging, and you\'ll receive an itemized receipt after each session.',
    category: 'charging',
    keywords: ['price', 'cost', 'rate', 'fee', 'charge', 'cedi', 'gh₵'],
  },

  // Account FAQs
  {
    id: 'account-creation',
    question: 'How do I create an account?',
    answer: 'Click the "My Account" button in the top navigation and sign up with your email address. You\'ll receive a verification link to confirm your email. Once verified, you can start using EB Volt immediately.',
    category: 'account',
    keywords: ['account', 'signup', 'register', 'create account', 'join'],
  },
  {
    id: 'password-reset',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email. Follow the instructions to set a new password.',
    category: 'account',
    keywords: ['password', 'reset', 'forgot', 'change password'],
  },
  {
    id: 'account-history',
    question: 'Where can I see my charging history?',
    answer: 'Log into your account and go to "My Account" dashboard. You\'ll see your complete charging history with dates, locations, costs, and energy consumed. You can download receipts from here as well.',
    category: 'account',
    keywords: ['history', 'past', 'previous', 'transactions', 'receipts'],
  },
  {
    id: 'favorite-chargers',
    question: 'How do I save my favorite chargers?',
    answer: 'In the "Find a Charger" map view, click the heart icon on any charger card to add it to your favorites. Your favorite chargers will be saved to your account and you can access them quickly from the Favorites section.',
    category: 'account',
    keywords: ['favorite', 'save', 'bookmark', 'heart'],
  },

  // General FAQs
  {
    id: 'about-eb-volt',
    question: 'What is EB Volt?',
    answer: 'EB Volt is Ghana\'s first solar-powered rapid EV charging network. We make electric vehicle charging accessible, affordable, and convenient across Ghana. Our mission is to accelerate the adoption of clean energy transportation.',
    category: 'general',
    keywords: ['eb volt', 'about', 'who', 'what', 'company'],
  },
  {
    id: 'service-areas',
    question: 'Where can I charge my vehicle?',
    answer: 'We currently operate charging stations across Accra and are expanding to other regions in Ghana. Use the "Find a Charger" map to see all available locations near you. Check back regularly as we add new stations.',
    category: 'general',
    keywords: ['location', 'where', 'area', 'region', 'station'],
  },
  {
    id: 'environmental-impact',
    question: 'How does EB Volt help the environment?',
    answer: 'Our solar-powered charging stations reduce carbon emissions by using renewable energy. By supporting EV adoption in Ghana, we help reduce air pollution and combat climate change. Every charge with EB Volt is a step toward a cleaner future.',
    category: 'general',
    keywords: ['environment', 'solar', 'green', 'renewable', 'eco', 'clean'],
  },
  {
    id: 'contact-support',
    question: 'How can I contact support?',
    answer: 'You can reach our support team via WhatsApp at +233 595 602 717 or email us at support@ebvolt.com. We\'re here to help with any questions or issues you may have.',
    category: 'general',
    keywords: ['support', 'help', 'contact', 'whatsapp', 'email', 'assistance'],
  },

  // Technical FAQs
  {
    id: 'app-offline',
    question: 'Can I use EB Volt if I don\'t have internet?',
    answer: 'Our app is designed with offline-first capabilities. You can view charger locations and make payments even with poor connectivity. The app will sync your data once you\'re back online. For USSD payments, dial *165*1*1# on your phone.',
    category: 'technical',
    keywords: ['offline', 'internet', 'connection', 'network', 'ussd'],
  },
  {
    id: 'app-issues',
    question: 'What should I do if the app crashes?',
    answer: 'Try these steps: 1) Force close the app and restart it, 2) Clear the app cache (Settings > Apps > EB Volt > Storage > Clear Cache), 3) Update to the latest version from your app store. If the issue persists, contact support.',
    category: 'technical',
    keywords: ['crash', 'bug', 'error', 'issue', 'problem', 'app'],
  },
  {
    id: 'data-usage',
    question: 'How much data does the EB Volt app use?',
    answer: 'The EB Volt app uses minimal data. Typical usage is under 5MB per month for normal activity. The map feature uses more data when loading charger locations. Using WiFi when available can help reduce mobile data consumption.',
    category: 'technical',
    keywords: ['data', 'usage', 'mb', 'bandwidth', 'internet'],
  },
];

/**
 * Find FAQ items matching user query
 * Searches through question, answer, and keywords
 */
export function searchFAQ(query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return FAQ_DATABASE.filter(item => {
    const questionMatch = item.question.toLowerCase().includes(lowerQuery);
    const answerMatch = item.answer.toLowerCase().includes(lowerQuery);
    const keywordMatch = item.keywords.some(kw => kw.includes(lowerQuery));
    return questionMatch || answerMatch || keywordMatch;
  }).slice(0, 5); // Return top 5 matches
}

/**
 * Get FAQ items by category
 */
export function getFAQByCategory(category: FAQItem['category']): FAQItem[] {
  return FAQ_DATABASE.filter(item => item.category === category);
}
