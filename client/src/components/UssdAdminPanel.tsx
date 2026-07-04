/**
 * UssdAdminPanel
 *
 * Admin panel section showing USSD sessions and payment intents.
 * Fetches data from /api/ussd/sessions and /api/ussd/intents.
 */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, Phone, CreditCard, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface UssdSession {
  id: number;
  sessionId: string;
  msisdn: string;
  menuState: string;
  status: string;
  createdAt: string;
}

interface UssdPaymentIntent {
  id: number;
  referenceCode: string;
  msisdn: string;
  amount: string;
  stationName: string | null;
  status: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    active: { bg: "oklch(0.52 0.18 145 / 0.1)", text: "oklch(0.52 0.18 145)", icon: <Clock className="w-3 h-3" /> },
    completed: { bg: "oklch(0.52 0.18 145 / 0.1)", text: "oklch(0.52 0.18 145)", icon: <CheckCircle2 className="w-3 h-3" /> },
    pending: { bg: "oklch(0.7 0.15 70 / 0.1)", text: "oklch(0.55 0.15 70)", icon: <Clock className="w-3 h-3" /> },
    failed: { bg: "oklch(0.6 0.2 25 / 0.1)", text: "oklch(0.55 0.2 25)", icon: <XCircle className="w-3 h-3" /> },
    timeout: { bg: "oklch(0.7 0.1 50 / 0.1)", text: "oklch(0.5 0.1 50)", icon: <AlertTriangle className="w-3 h-3" /> },
    error: { bg: "oklch(0.6 0.2 25 / 0.1)", text: "oklch(0.55 0.2 25)", icon: <XCircle className="w-3 h-3" /> },
  };
  const s = styles[status] || styles.active;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.text }}>
      {s.icon} {status}
    </span>
  );
}

export default function UssdAdminPanel() {
  const [sessions, setSessions] = useState<UssdSession[]>([]);
  const [intents, setIntents] = useState<UssdPaymentIntent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"sessions" | "intents">("intents");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessRes, intRes] = await Promise.all([
        fetch("/api/ussd/sessions"),
        fetch("/api/ussd/intents"),
      ]);
      if (sessRes.ok) {
        const data = await sessRes.json();
        setSessions(data.sessions || []);
      }
      if (intRes.ok) {
        const data = await intRes.json();
        setIntents(data.intents || []);
      }
    } catch (err) {
      console.error("Failed to fetch USSD data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="border-0 shadow-sm" style={{ background: "white" }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5" style={{ color: "oklch(0.52 0.18 145)" }} />
            <CardTitle className="text-lg" style={{ color: "oklch(0.25 0.08 240)" }}>
              USSD Payment System
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {/* Tab switcher */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab("intents")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "intents" ? "text-white" : ""
            }`}
            style={activeTab === "intents"
              ? { background: "oklch(0.52 0.18 145)", color: "white" }
              : { color: "oklch(0.45 0.05 240)" }
            }
          >
            <CreditCard className="w-3.5 h-3.5 inline mr-1" />
            Payment Intents ({intents.length})
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "sessions" ? "text-white" : ""
            }`}
            style={activeTab === "sessions"
              ? { background: "oklch(0.52 0.18 145)", color: "white" }
              : { color: "oklch(0.45 0.05 240)" }
            }
          >
            <Phone className="w-3.5 h-3.5 inline mr-1" />
            Sessions ({sessions.length})
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === "intents" && (
          <div className="overflow-x-auto">
            {intents.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "oklch(0.5 0.03 240)" }}>
                No USSD payment intents yet. Use the USSD Simulator to test.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid oklch(0.92 0.02 240)" }}>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Ref</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Phone</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Amount</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Station</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Status</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {intents.map((intent) => (
                    <tr key={intent.id} style={{ borderBottom: "1px solid oklch(0.95 0.01 240)" }}>
                      <td className="py-2 px-2 font-mono text-xs font-semibold" style={{ color: "oklch(0.35 0.08 240)" }}>
                        {intent.referenceCode}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs" style={{ color: "oklch(0.4 0.03 240)" }}>
                        {intent.msisdn}
                      </td>
                      <td className="py-2 px-2 font-semibold" style={{ color: "oklch(0.25 0.08 240)" }}>
                        GHS {intent.amount}
                      </td>
                      <td className="py-2 px-2 text-xs" style={{ color: "oklch(0.45 0.05 240)" }}>
                        {intent.stationName || "-"}
                      </td>
                      <td className="py-2 px-2">
                        <StatusBadge status={intent.status} />
                      </td>
                      <td className="py-2 px-2 text-xs" style={{ color: "oklch(0.5 0.03 240)" }}>
                        {new Date(intent.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="overflow-x-auto">
            {sessions.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "oklch(0.5 0.03 240)" }}>
                No USSD sessions recorded yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid oklch(0.92 0.02 240)" }}>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Session ID</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Phone</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>State</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Status</th>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: "oklch(0.45 0.05 240)" }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} style={{ borderBottom: "1px solid oklch(0.95 0.01 240)" }}>
                      <td className="py-2 px-2 font-mono text-xs" style={{ color: "oklch(0.4 0.03 240)" }}>
                        {session.sessionId.substring(0, 16)}...
                      </td>
                      <td className="py-2 px-2 font-mono text-xs" style={{ color: "oklch(0.4 0.03 240)" }}>
                        {session.msisdn}
                      </td>
                      <td className="py-2 px-2 text-xs" style={{ color: "oklch(0.45 0.05 240)" }}>
                        {session.menuState}
                      </td>
                      <td className="py-2 px-2">
                        <StatusBadge status={session.status} />
                      </td>
                      <td className="py-2 px-2 text-xs" style={{ color: "oklch(0.5 0.03 240)" }}>
                        {new Date(session.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
