/*
   EcoBelle Volt - Find a Charger Page
   Features: Google Maps zoomed to Accra, waitlist signup card
   ============================================================ */
import { useState, useCallback, useRef } from "react";
import { Mail, Zap, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { AddressSearch } from "@/components/AddressSearch";
import { toast } from "sonner";

interface SearchLocation {
  lat: number;
  lng: number;
  address: string;
}

export default function FindCharger() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Zoom to Greater Accra with no pins
    map.setCenter({ lat: 5.6037, lng: -0.1870 });
    map.setZoom(11);
  }, []);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter an email or MoMo number");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success("You're on the waitlist! We'll notify you soon.");
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.98 0.01 240)" }}>
      <Navbar />

      <section className="pt-24 pb-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
              >
                Find Your Charger
              </h1>
              <p style={{ color: "oklch(0.45 0.05 240)" }}>Locate and reserve an EB Volt charging station near you</p>
            </div>
          </div>

          {/* Filter Bar - Search only */}
          <div
            className="rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
            style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}
          >
            <div className="flex-1 flex items-center gap-2" style={{ background: "oklch(0.92 0.02 240)", borderRadius: "8px", padding: "8px 12px" }}>
              <Mail size={18} style={{ color: "oklch(0.45 0.05 240)" }} />
              <input
                type="text"
                placeholder="Search by name or city..."
                disabled
                className="flex-1 bg-transparent outline-none text-sm opacity-50"
                style={{ color: "oklch(0.25 0.08 240)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map & Waitlist Card */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.88 0.02 240)", height: "600px" }}>
              <MapView initialCenter={{ lat: 5.6037, lng: -0.1870 }} initialZoom={11} onMapReady={handleMapReady} />
            </div>

            {/* Waitlist Card */}
            <div className="rounded-2xl p-8" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)", height: "600px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.52 0.18 145 / 0.15)" }}
                  >
                    <Zap size={32} style={{ color: "oklch(0.52 0.18 145)" }} />
                  </div>
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
                >
                  Stations Opening Soon in Accra
                </h3>

                <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.45 0.05 240)" }}>
                  EB Volt's first rapid charging stations are opening in Accra in the coming months. Join the waitlist and we'll notify you the moment your nearest station goes live.
                </p>

                {submitted ? (
                  <div className="py-4 px-4 rounded-lg" style={{ background: "oklch(0.52 0.18 145 / 0.1)" }}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle size={20} style={{ color: "oklch(0.52 0.18 145)" }} />
                      <span className="font-semibold text-sm" style={{ color: "oklch(0.52 0.18 145)" }}>
                        You're on the waitlist!
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "oklch(0.45 0.05 240)" }}>
                      Check your email for updates.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNotifyMe} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your email or MoMo number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{
                        background: "oklch(0.92 0.02 240)",
                        color: "oklch(0.25 0.08 240)",
                        border: "1px solid oklch(0.88 0.02 240)",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                      style={{
                        background: "oklch(0.52 0.18 145)",
                        color: "white",
                        opacity: loading ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) (e.currentTarget as HTMLElement).style.background = "oklch(0.42 0.18 145)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.52 0.18 145)";
                      }}
                    >
                      {loading ? "Joining..." : "Notify Me"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
