# EcoBelle Volt Copy Audit & Improvement Plan

## Canonical decisions (default until user confirms)
- Company is Ghana-focused, "Now Launching in Ghana" stage.
- Standardize contact to Ghana:
  - Phone (Ghana): +233 59 560 2717 (keep)
  - Remove/soften UK phone +44 7477 884 266 and London address "66, Paul Street, London EC2A 4NA" from customer-facing Contact + Footer. Replace location with Ghana (Accra) presence line, no fabricated street address.
  - Email: standardize to a single canonical address. Existing inconsistency: contact@ecobelle.com (Contact/Footer) vs support@ecobellvolt.com (Support). Use hello@ecobellevolt.com? -> SAFER: keep existing domain visible. Decision: use "hello@ecobelevolt.com"? No. Use canonical: contact@ecobellevolt.com for general, support@ecobellevolt.com for support. Note brand spelling: "ecobellevolt" (matches social handles @ecobellevolt).
- Brand spelling in handles: instagram.com/ecobellevolt, x.com/ecobellevolt -> domain likely ecobellevolt.com. Fix "ecobelle.com" and "ecobellvolt.com" typos to ecobellevolt.com.

## Policy issue (MUST fix)
- Testimonials.tsx: 4 FABRICATED customer quotes (Ama K. Boateng/Accra, Kwame Mensah/Kumasi, Adwoa Serwaa/Tema, Kofi Owusu/Takoradi). Cannot rewrite fake reviews. Replace section with honest non-testimonial trust content (why-choose value props + network/launch highlights). Keep light section styling; heading no longer "What Our Drivers Say".

## Overpromises to soften (launch stage)
- Support.tsx: response times "5 minutes" emergency, "30 minutes" urgent, "2 hours" general; "Reply within 2 hours" email; "Immediate response" emergency; "24/7 Available" live chat. Soften to "as fast as we can", target windows, and "during launch hours". Emergency line: reframe as best-effort priority, not guaranteed minutes.
- Contact.tsx: "We respond within 2 hours" + "24/7 Emergency Support"; success toast "within 24 hours". Soften to "as soon as possible, typically within one business day".
- About.tsx: "Ghana's most trusted" (line ~118), nationwide ubiquity vision (~141), "every region"/"every Ghanaian" (~167), "100% renewable energy by 2030" (~267). Soften to aspirational-but-honest ("building toward", "our goal").
- HowItWorks.tsx: named-city live availability + 24/7 (26-69), reservations up to 7 days, connector compatibility all brands, push notifications/digital receipts, support-resolution timing FAQ (71-78).
- Footer.tsx: "24/7 Emergency Support Available"; UK contact block; legal links are plain <span> not links (Privacy Policy / Terms & Conditions). Make them wouter Links to /privacy and /terms OR keep as coming-soon. Decision: convert to Links pointing to routes; if routes don't exist, use toast "coming soon" OR simple pages. SIMPLEST: keep as spans but that's a dead-end. Prefer: turn into anchors to "#" with coming-soon toast is not possible in footer easily -> convert to Link to "/contact" is wrong. Decision: leave as styled text but add title; better: create minimal /privacy and /terms is out of scope. FINAL: convert to Links to "/legal/privacy" not built -> skip. Keep spans but this is flagged; do minimal: make them <Link href="/support"> is wrong.
  -> Chosen approach: Keep as non-link text is a dead-end; instead point both to a single lightweight route is over-scope. Since user asked to improve copy (not build legal pages), I will keep them visually but note to user. Actually cleaner: remove the fake-interactive hover cursor and present as plain footer text "Privacy Policy and Terms available on request" — avoids dead links. DECISION: replace two fake links with single line: "Privacy Policy and Terms of Service available on request." (honest, no dead link).

## Business/service pages
- PublicCharging: "8+ stations", "80% in 30 min", ₵0.85/kWh, ₵0.45/kWh, "Join thousands of EV drivers". Soften "thousands"; keep pricing as "from" and mark indicative.
- FleetCharging: "24/7 fleet management support team", guaranteed priority access, plans ₵500/₵2,500/Custom. Soften guarantees; mark pricing indicative.
- ChargerInstallation: "Handle all necessary permits", "2-year warranty", "Nationwide Service", price bands. Soften to "help coordinate permits", keep warranty only if plausible -> reframe as "workmanship warranty".
- BusinessPartnerships: "Tax incentives", "Territory rights", "Market Leader", "Trusted by thousands of drivers and businesses". Remove/soften unsubstantiated superlatives.

## Style rules
- No em dashes anywhere (use commas, periods, or " - " hyphen with spaces sparingly, prefer restructure).
- Keep brand voice: confident, clean-mobility, Ghana-first, credible for a launching company.
- Stats on Home (50+ stations, 100kW, 5 cities) are marketing figures already present; keep consistent but avoid inflating.
