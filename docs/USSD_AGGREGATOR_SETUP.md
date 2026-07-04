# USSD Aggregator Registration Guide

This document explains how to take the EB Volt USSD payment system live by registering a shortcode with a Ghanaian USSD aggregator.

## Overview

The USSD backend is fully built and tested. It exposes a webhook at:

```
POST https://ebvolt.com/api/ussd/callback
```

To make it dialable on real phones, you need to:

1. Choose an aggregator
2. Register a shortcode
3. Point the shortcode's webhook URL at your endpoint
4. Test with a real phone

## Recommended Aggregators (Ghana)

| Provider | Website | Shortcode Type | Typical Timeline |
|----------|---------|----------------|------------------|
| **Hubtel** (recommended) | hubtel.com | Shared or dedicated | 2-4 weeks |
| **Nsano** | nsano.com | Shared or dedicated | 2-4 weeks |
| **Africa's Talking** | africastalking.com | Shared (sandbox available) | 1-2 weeks (sandbox instant) |
| **Arkesel** | arkesel.com | Shared | 2-3 weeks |

**Recommendation:** Start with **Hubtel** if you are already using them for MoMo collections, as they offer both USSD and payment APIs in one platform. Otherwise, **Africa's Talking** has the fastest sandbox setup for testing.

## Step-by-Step: Hubtel

1. **Create an account** at [hubtel.com](https://hubtel.com) and verify your business.
2. **Apply for a USSD shortcode** via the Hubtel developer dashboard. Choose:
   - **Shared shortcode** (e.g. `*713*XXX#`) - cheaper, faster approval
   - **Dedicated shortcode** (e.g. `*384#`) - more expensive, requires NCA approval
3. **Configure the webhook URL** in the Hubtel dashboard:
   ```
   https://ebvolt.com/api/ussd/callback
   ```
4. **Set the HTTP method** to `POST` and content type to `application/json`.
5. **Map the request fields** (Hubtel uses slightly different field names):
   - `SessionId` -> `sessionId`
   - `Mobile` -> `phoneNumber`
   - `Message` -> `text`
   - `ServiceCode` -> `serviceCode`

   If Hubtel's field names differ from the standard, add a small adapter in `server/ussd/routes.ts`.

6. **Test** by dialling the shortcode from a real phone.

## Step-by-Step: Africa's Talking

1. **Create an account** at [africastalking.com](https://africastalking.com).
2. **Get a sandbox shortcode** instantly (free, for testing only).
3. **Create a USSD channel** in the dashboard and set the callback URL:
   ```
   https://ebvolt.com/api/ussd/callback
   ```
4. Africa's Talking uses the exact request format our backend expects:
   - `sessionId`, `phoneNumber`, `text`, `serviceCode`
5. **Test with the AT simulator** or install the AT sandbox app on Android.
6. For production, apply for a live shortcode (requires business verification).

## Webhook Request Format (Expected)

```json
{
  "sessionId": "ATUid_abc123...",
  "phoneNumber": "+233501234567",
  "text": "",
  "serviceCode": "*384*100#"
}
```

- First request: `text` is empty (new session)
- Subsequent requests: `text` contains the full input chain separated by `*` (e.g. `"1*3*50*1"`)

## Webhook Response Format (Returned)

```
CON Welcome to EB Volt - EV Charging\n\n1. Pay for Charging\n2. Check Balance/Status\n3. Help
```

- `CON` prefix: session continues (show menu, wait for input)
- `END` prefix: session terminates (show final message, hang up)

## Payment Reconciliation

When a USSD payment is confirmed, the system creates a payment intent with a reference code (e.g. `EBV-ABC123`). To complete the payment:

1. Your MoMo collection API (Hubtel/MTN) should be triggered server-side when the intent is created.
2. When the collection succeeds, call the reconciliation endpoint:

```
POST https://ebvolt.com/api/ussd/reconcile
Content-Type: application/json

{
  "referenceCode": "EBV-ABC123",
  "transactionId": "hubtel_txn_456",
  "status": "COMPLETED"
}
```

This updates the payment intent status and can trigger downstream actions (e.g. activating the charger).

## Security Considerations

- **IP whitelisting:** Restrict `/api/ussd/callback` and `/api/ussd/reconcile` to your aggregator's IP range in production.
- **Request signing:** Some aggregators (Hubtel) support HMAC signatures. Verify these in middleware.
- **Rate limiting:** Add rate limiting to prevent abuse of the USSD endpoint.
- **Session timeout:** Sessions auto-expire after the aggregator's timeout (typically 30-60 seconds of inactivity).

## Testing Without an Aggregator

Use the built-in USSD Simulator at:

```
https://ebvolt.com/ussd-simulator
```

This calls the same `/api/ussd/callback` endpoint and creates real database records (sessions, payment intents) for verification.

## Cost Estimates

| Item | Typical Cost |
|------|-------------|
| Shared shortcode (monthly) | GHS 200-500 |
| Dedicated shortcode (monthly) | GHS 1,000-3,000 |
| Per-session charge | GHS 0.01-0.05 |
| NCA registration (one-time) | GHS 500-2,000 |

Costs vary by provider and negotiation. Start with a shared shortcode to validate demand.

## Next Steps

1. Choose Hubtel or Africa's Talking based on your existing payment provider
2. Register and verify your business account
3. Apply for a shortcode
4. Configure the webhook URL
5. Test with real phones
6. (Optional) Add IP whitelisting and request signature verification
