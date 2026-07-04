/**
 * USSD State Machine
 *
 * Implements the menu flow for feature-phone users:
 *
 * main_menu → select_station → select_amount → confirm_payment → payment_result
 *
 * Each state handler returns a UssdResponse with the text to display
 * and whether the session should continue (CON) or end (END).
 */

export interface UssdResponse {
  /** Text to display to the user. */
  text: string;
  /** Whether the session continues (CON) or ends (END). */
  type: "CON" | "END";
}

export interface SessionData {
  stationId?: number;
  stationName?: string;
  amount?: string;
  referenceCode?: string;
}

// Available stations (same as in FindCharger, simplified for USSD)
const STATIONS = [
  { id: 1, name: "Accra East (Lashibi)", kw: 100 },
  { id: 2, name: "Airport City", kw: 50 },
  { id: 3, name: "Kumasi Central", kw: 100 },
  { id: 4, name: "Takoradi Hub", kw: 50 },
  { id: 5, name: "East Legon", kw: 100 },
  { id: 6, name: "Tema Port", kw: 50 },
];

// Preset amounts
const AMOUNTS = ["10", "20", "50", "100", "200"];

/**
 * Process a USSD input for a given menu state and return the next state + response.
 */
export function processUssdInput(
  currentState: string,
  input: string,
  sessionData: SessionData
): { nextState: string; response: UssdResponse; updatedData: SessionData } {
  switch (currentState) {
    case "main_menu":
      return handleMainMenu(input, sessionData);
    case "select_station":
      return handleSelectStation(input, sessionData);
    case "select_amount":
      return handleSelectAmount(input, sessionData);
    case "confirm_payment":
      return handleConfirmPayment(input, sessionData);
    default:
      return {
        nextState: "main_menu",
        response: { text: "Invalid state. Please try again.\n" + getMainMenuText(), type: "CON" },
        updatedData: {},
      };
  }
}

function getMainMenuText(): string {
  return [
    "Welcome to EB Volt - EV Charging",
    "",
    "1. Pay for Charging",
    "2. Check Balance/Status",
    "3. Help",
  ].join("\n");
}

function handleMainMenu(input: string, _data: SessionData) {
  switch (input) {
    case "1":
      return {
        nextState: "select_station",
        response: {
          text: [
            "Select charging station:",
            "",
            ...STATIONS.map((s, i) => `${i + 1}. ${s.name} (${s.kw}kW)`),
          ].join("\n"),
          type: "CON" as const,
        },
        updatedData: {},
      };
    case "2":
      return {
        nextState: "main_menu",
        response: {
          text: "Your EB Volt account is active.\nDial again to make a payment.\n\nThank you for choosing EB Volt!",
          type: "END" as const,
        },
        updatedData: {},
      };
    case "3":
      return {
        nextState: "main_menu",
        response: {
          text: "EB Volt Help:\n- Dial *XXX# to pay for EV charging\n- Visit ebvolt.com for support\n- Call +233 30 000 0000\n\nThank you!",
          type: "END" as const,
        },
        updatedData: {},
      };
    default:
      return {
        nextState: "main_menu",
        response: { text: "Invalid option.\n\n" + getMainMenuText(), type: "CON" as const },
        updatedData: {},
      };
  }
}

function handleSelectStation(input: string, _data: SessionData) {
  const idx = parseInt(input) - 1;
  if (isNaN(idx) || idx < 0 || idx >= STATIONS.length) {
    return {
      nextState: "select_station",
      response: {
        text: "Invalid station. Please select 1-" + STATIONS.length + ":\n\n" +
          STATIONS.map((s, i) => `${i + 1}. ${s.name}`).join("\n"),
        type: "CON" as const,
      },
      updatedData: {},
    };
  }

  const station = STATIONS[idx];
  return {
    nextState: "select_amount",
    response: {
      text: [
        `Station: ${station.name}`,
        "",
        "Select amount (GHS):",
        "",
        ...AMOUNTS.map((a, i) => `${i + 1}. GHS ${a}`),
        `${AMOUNTS.length + 1}. Enter custom amount`,
      ].join("\n"),
      type: "CON" as const,
    },
    updatedData: { stationId: station.id, stationName: station.name },
  };
}

function handleSelectAmount(input: string, data: SessionData) {
  const idx = parseInt(input) - 1;

  // Custom amount option
  if (idx === AMOUNTS.length) {
    // For simplicity in USSD, we'll ask them to enter the amount directly
    return {
      nextState: "select_amount",
      response: {
        text: "Enter amount in GHS (e.g. 75):",
        type: "CON" as const,
      },
      updatedData: data,
    };
  }

  let amount: string;
  if (idx >= 0 && idx < AMOUNTS.length) {
    amount = AMOUNTS[idx];
  } else {
    // Treat as custom amount entry
    const parsed = parseFloat(input);
    if (isNaN(parsed) || parsed < 1 || parsed > 1000) {
      return {
        nextState: "select_amount",
        response: {
          text: "Invalid amount. Enter 1-1000 GHS or select:\n\n" +
            AMOUNTS.map((a, i) => `${i + 1}. GHS ${a}`).join("\n"),
          type: "CON" as const,
        },
        updatedData: data,
      };
    }
    amount = parsed.toFixed(2);
  }

  return {
    nextState: "confirm_payment",
    response: {
      text: [
        "Confirm Payment:",
        "",
        `Station: ${data.stationName || "Unknown"}`,
        `Amount: GHS ${amount}`,
        "",
        "1. Confirm & Pay",
        "2. Cancel",
      ].join("\n"),
      type: "CON" as const,
    },
    updatedData: { ...data, amount },
  };
}

function handleConfirmPayment(input: string, data: SessionData) {
  if (input === "1") {
    // Generate a reference code (will be set by the route handler)
    return {
      nextState: "payment_confirmed",
      response: {
        text: [
          "Payment initiated!",
          "",
          `Amount: GHS ${data.amount}`,
          `Station: ${data.stationName}`,
          `Ref: ${data.referenceCode || "PENDING"}`,
          "",
          "You will receive an MoMo prompt shortly.",
          "Present this reference at the station.",
          "",
          "Thank you for choosing EB Volt!",
        ].join("\n"),
        type: "END" as const,
      },
      updatedData: data,
    };
  }

  // Cancel
  return {
    nextState: "main_menu",
    response: {
      text: "Payment cancelled.\n\nThank you for using EB Volt!",
      type: "END" as const,
    },
    updatedData: {},
  };
}

/** Get the initial menu response for a new session. */
export function getInitialResponse(): UssdResponse {
  return {
    text: getMainMenuText(),
    type: "CON",
  };
}
