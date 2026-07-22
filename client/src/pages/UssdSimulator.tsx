/**
 * USSD Simulator
 *
 * An in-app page that simulates a feature phone USSD session against
 * the /api/ussd/callback endpoint. Useful for testing the full flow
 * without a real aggregator or shortcode.
 */
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, RotateCcw, Send, Hash } from "lucide-react";
import { nanoid } from "nanoid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  type: "system" | "user";
  text: string;
}

export default function UssdSimulator() {
  useEffect(() => { document.title = "USSD Simulator - EB Volt"; }, []);
  const [phoneNumber, setPhoneNumber] = useState("233501234567");
  const [sessionId, setSessionId] = useState("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [fullText, setFullText] = useState(""); // Accumulated text chain
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = async () => {
    const newSessionId = `sim_${nanoid(12)}`;
    setSessionId(newSessionId);
    setFullText("");
    setMessages([]);
    setSessionActive(true);
    setLoading(true);

    try {
      const res = await fetch("/api/ussd/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: newSessionId,
          phoneNumber,
          text: "",
          serviceCode: "*384*100#",
        }),
      });
      const responseText = await res.text();
      const type = responseText.startsWith("CON") ? "CON" : "END";
      const displayText = responseText.replace(/^(CON|END)\s*/, "");

      setMessages([{ type: "system", text: displayText }]);

      if (type === "END") {
        setSessionActive(false);
      }
    } catch (err) {
      setMessages([{ type: "system", text: "Error: Could not connect to USSD service" }]);
      setSessionActive(false);
    } finally {
      setLoading(false);
    }
  };

  const sendInput = async () => {
    if (!inputText.trim() || !sessionActive) return;

    const userInput = inputText.trim();
    setInputText("");

    // Build the full text chain (Africa's Talking style)
    const newFullText = fullText ? `${fullText}*${userInput}` : userInput;
    setFullText(newFullText);

    setMessages((prev) => [...prev, { type: "user", text: userInput }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ussd/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          phoneNumber,
          text: newFullText,
          serviceCode: "*384*100#",
        }),
      });
      const responseText = await res.text();
      const type = responseText.startsWith("CON") ? "CON" : "END";
      const displayText = responseText.replace(/^(CON|END)\s*/, "");

      setMessages((prev) => [...prev, { type: "system", text: displayText }]);

      if (type === "END") {
        setSessionActive(false);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "system", text: "Error: Connection failed" },
      ]);
      setSessionActive(false);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setSessionId("");
    setFullText("");
    setMessages([]);
    setSessionActive(false);
    setInputText("");
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.01 240)" }}>
      <Navbar />

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
            style={{ background: "oklch(0.52 0.18 145 / 0.1)", color: "oklch(0.52 0.18 145)" }}>
            <Hash className="w-4 h-4" />
            USSD Simulator
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>
            Test USSD Payment Flow
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.5 0.03 240)" }}>
            Simulates dialling *384*100# on a feature phone. This tests the real backend without needing a shortcode.
          </p>
        </div>

        <Card className="border-0 shadow-xl" style={{ background: "white" }}>
          <CardHeader className="pb-3 border-b" style={{ borderColor: "oklch(0.92 0.02 240)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: "oklch(0.52 0.18 145)" }} />
                <CardTitle className="text-base" style={{ color: "oklch(0.25 0.08 240)" }}>
                  Feature Phone Display
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {sessionActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "oklch(0.52 0.18 145 / 0.1)", color: "oklch(0.52 0.18 145)" }}>
                    Session Active
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={resetSession}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Phone screen area */}
            <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 font-mono text-sm"
              style={{ background: "oklch(0.23 0.02 240)", color: "oklch(0.85 0.02 145)" }}>
              {messages.length === 0 && !sessionActive && (
                <div className="text-center py-16 opacity-60">
                  <Phone className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Enter phone number and dial to start</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.type === "user" ? "text-right" : ""}`}>
                  {msg.type === "user" ? (
                    <span className="inline-block px-2 py-1 rounded text-xs"
                      style={{ background: "oklch(0.52 0.18 145 / 0.3)" }}>
                      Input: {msg.text}
                    </span>
                  ) : (
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed">{msg.text}</pre>
                  )}
                </div>
              ))}

              {loading && (
                <div className="animate-pulse text-xs opacity-60">Processing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t" style={{ borderColor: "oklch(0.92 0.02 240)" }}>
              {!sessionActive ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.45 0.05 240)" }}>
                      Phone Number (MSISDN)
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="233501234567"
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button
                    onClick={startSession}
                    disabled={!phoneNumber.trim() || loading}
                    className="w-full font-semibold"
                    style={{ background: "oklch(0.52 0.18 145)", color: "white" }}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    Dial *384*100#
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendInput()}
                    placeholder="Enter option number..."
                    disabled={loading}
                    className="font-mono text-sm"
                    autoFocus
                  />
                  <Button
                    onClick={sendInput}
                    disabled={!inputText.trim() || loading}
                    style={{ background: "oklch(0.52 0.18 145)", color: "white" }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info panel */}
        <div className="mt-6 p-4 rounded-lg text-sm" style={{ background: "oklch(0.52 0.18 145 / 0.05)", border: "1px solid oklch(0.52 0.18 145 / 0.2)" }}>
          <h3 className="font-semibold mb-2" style={{ color: "oklch(0.25 0.08 240)" }}>How it works</h3>
          <ul className="space-y-1" style={{ color: "oklch(0.45 0.05 240)" }}>
            <li>This simulator calls the same <code>/api/ussd/callback</code> endpoint that a real aggregator would.</li>
            <li>Sessions, payment intents, and reference codes are all created in the real database.</li>
            <li>In production, users dial a shortcode (e.g. *384*100#) on any phone to reach this flow.</li>
            <li>To go live, register a shortcode with Hubtel or Nsano and point it at your webhook URL.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
