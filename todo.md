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
- [ ] Test all v1.1 enhancements

## Roadmap Notes (deferred, out of scope for v1.0)
- Multi-language support (Twi, Ga): English only for v1.0
- Telecel Cash direct API: covered by Paystack in v1.0

## Live Provider Integration (email + SMS)
- [ ] Confirm email provider (Resend/SendGrid/Mailgun) and collect API key + verified sender
- [ ] Confirm SMS provider (Twilio/Hubtel/Arkesel) and collect credentials + sender ID
- [ ] Implement per-recipient email delivery (replace notifyOwner for customer emails)
- [ ] Implement real SMS dispatch in sendGenericSMS
- [ ] Keep notifyOwner as fallback/owner-alert channel
- [ ] Validate live delivery with test-send buttons using real credentials
- [ ] Add/adjust vitest coverage for provider adapters (mocked)

## Website Copy Review & Improvement
- [ ] Replace fabricated testimonials section with honest trust content (policy compliance)
- [ ] Standardize contact details to Ghana-based, single canonical email
- [ ] Soften overpromises (response-time guarantees, "most trusted", "trusted by thousands")
- [ ] Fix Footer legal links (Privacy Policy / Terms) to real routes or remove
- [ ] Improve Home page hero, features, sections copy
- [ ] Improve About page copy (mission, story, values)
- [ ] Improve HowItWorks page copy
- [ ] Improve Contact page copy
- [ ] Improve Support page copy
- [ ] Improve service pages (Public/Fleet/Installation/Partnerships) copy
- [ ] Verify no em dashes remain and rendering is clean
