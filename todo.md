# EcoBelle Volt - Project TODO

## Core Features (Completed)
- [x] Landing page with Ghana branding and light theme
- [x] Interactive Google Maps charger locator
- [x] Ghana digital address search support
- [x] Distance-based sorting for charging stations
- [x] Get Directions functionality
- [x] MTN Mobile Money (MoMo) payment integration
- [x] User Account Dashboard with reservation history
- [x] PDF receipt generation
- [x] Refund request system
- [x] Admin Dashboard for charger management
- [x] Refund management system for admins
- [x] Favorite chargers feature
- [x] Service pages (Public Charging, Fleet Charging, etc.)
- [x] Email service module created
- [x] Database schema with all required tables

## Completed Features
- [x] Implement live booking analytics dashboard
- [x] Implement SMS notification system for bookings and refunds
- [x] Create user testimonials section on homepage
- [x] Remove em dashes from website content
- [x] Replace logos in website images with EB Volt logo
- [x] Complete email integration in approveRefund endpoint
- [x] Complete email integration in rejectRefund endpoint
- [x] Implement Booking Analytics section in Admin Dashboard
- [x] Test full email workflow (booking -> payment -> receipt -> refund)
- [x] Add heart icon UI for favorite chargers on station cards
- [x] Implement favorite chargers toggle in FindCharger page
- [x] Complete booking confirmation email sending
- [x] Add payment receipt email sending to payment workflow
- [x] Implement refund notification emails
- [x] Create comprehensive admin analytics dashboard

## Final Deliverables
- [x] Email service module with booking, receipt, and refund notifications
- [x] Admin dashboard with charger management and refund processing
- [x] Analytics endpoints for revenue tracking and station performance
- [x] User account dashboard with reservation history and refund requests
- [x] Full-stack integration of MTN MoMo payments
- [x] Ghana digital address search support
- [x] Favorite chargers system with database persistence
- [x] Service pages for different charging types
- [x] Responsive light theme design matching EcoBelle Volt branding

## Notification System Enhancements (In Progress)
- [x] Add user profile settings page with notification preferences
- [x] Add notification logging schema
- [x] Add preference-checking helper functions
- [x] Update email functions to respect user preferences
- [x] Update SMS functions to respect user preferences
- [x] Implement email unsubscribe token system
- [x] Create unsubscribe endpoint and landing page
- [x] Build admin notification dashboard with delivery metrics
- [x] Add error/retry states to notification dashboard queries
- [x] Test all notification features (vitest integration suite: 7 passing)

## Notification System v1.1 Enhancements
- [x] Add admin "Run Now" test-send endpoint for sample email
- [x] Add admin "Run Now" test-send endpoint for sample SMS
- [x] Add Run Now buttons to NotificationDashboard UI
- [x] Add resubscribe (re-enable) capability to account unsubscribe endpoint
- [x] Surface one-click resubscribe on /unsubscribe page
- [x] Add date-range filter to notification logs endpoint and UI
- [x] Add CSV export to notification logs table
- [x] Test all v1.1 enhancements (7/7 vitest passing, admin dashboard verified in preview)

## Roadmap Notes (deferred, out of scope for v1.0)
- Multi-language support (Twi, Ga): English only for v1.0
- Telecel Cash direct API: covered by Paystack in v1.0

## Live Provider Integration (email + SMS)
> Status: BLOCKED - all items below require the user to choose providers and supply credentials (Resend/Hubtel recommended). No further action possible until then.
- [ ] (BLOCKED: awaiting user credentials) Confirm email provider (Resend/SendGrid/Mailgun) and collect API key + verified sender
- [ ] (BLOCKED: awaiting user credentials) Confirm SMS provider (Twilio/Hubtel/Arkesel) and collect credentials + sender ID
- [ ] (BLOCKED: awaiting user credentials) Implement per-recipient email delivery (replace notifyOwner for customer emails)
- [ ] (BLOCKED: awaiting user credentials) Implement real SMS dispatch in sendGenericSMS
- [ ] (BLOCKED: awaiting user credentials) Keep notifyOwner as fallback/owner-alert channel
- [ ] (BLOCKED: awaiting user credentials) Validate live delivery with test-send buttons using real credentials
- [ ] (BLOCKED: awaiting user credentials) Add/adjust vitest coverage for provider adapters (mocked)

## Website Copy Review & Improvement
- [x] Replace fabricated testimonials section with honest trust content (policy compliance)
- [x] Standardize contact details to Ghana-based, single canonical email
- [x] Soften overpromises (response-time guarantees, "most trusted", "trusted by thousands", 24/7/anytime, priority/dedicated support, refund timing)
- [x] Fix Footer legal links (Privacy Policy / Terms) to real routes
- [x] Create Privacy Policy page (/privacy)
- [x] Create Terms & Conditions page (/terms)
- [x] Rename "24/7 Support" nav/footer label to "Support"
- [x] Improve Home page hero, features, sections copy
- [x] Improve About page copy (mission, story, values)
- [x] Improve HowItWorks page copy
- [x] Improve Contact page copy
- [x] Improve Support page copy
- [x] Improve service pages (Public/Fleet/Installation/Partnerships) copy
- [x] Verify no em dashes remain and rendering is clean

## Favicon
- [x] Set site favicon to EB Volt logo (generate favicon.ico/png, reference in index.html)

## Offline-First Transaction Queue
- [x] Create client-side queue store (IndexedDB) for pending transactions
- [x] Detect online/offline status and surface a "pending sync" UI state
- [x] Queue payment/charging actions when offline; auto-sync when reconnected
- [x] Server sync endpoint with idempotency keys (no double-charge)
- [x] Persist synced transactions to DB; reconcile client + server state
- [x] Vitest coverage for sync endpoint + idempotency (7 tests passing)

## USSD Fallback Payment (backend + simulator)
- [x] Schema: ussd_sessions + payment_intents tables
- [x] USSD webhook handler (session start/continue/end) with menu state machine
- [x] Payment intent creation + reference generation for USSD flow
- [x] Reconciliation endpoint (aggregator payment callback) with idempotency
- [x] Admin visibility: list USSD sessions + payment intents
- [x] In-app USSD simulator page to test the flow end-to-end
- [x] Vitest coverage for USSD state machine + reconciliation (20 tests passing)
- [x] Document aggregator registration steps (Hubtel/Nsano) for real shortcode
