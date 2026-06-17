/* ============================================================
   EcoBelle Volt — Find a Charger Page
   Features: Google Maps with charger pins, filter panel, reservation modal
   ============================================================ */
import { useState, useCallback, useRef } from "react";
import { MapPin, Zap, Clock, Filter, Search, Star, ChevronRight, X, Calendar, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { toast } from "sonner";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  maxKw: number;
  type: "DC Fast" | "AC Level 2";
  status: "available" | "busy" | "offline";
  amenities: string[];
  rating: number;
}

const STATIONS: Station[] = [
  { id: "s1", name: "EB Volt Accra East", address: "Lashibi, Accra", city: "Accra", lat: 5.5502, lng: -0.1234, available: 3, total: 4, maxKw: 100, type: "DC Fast", status: "available", amenities: ["WiFi", "Café", "Restroom"], rating: 4.8 },
  { id: "s2", name: "EB Volt Airport City", address: "Airport City, Accra", city: "Accra", lat: 5.6037, lng: -0.1870, available: 1, total: 6, maxKw: 50, type: "DC Fast", status: "busy", amenities: ["WiFi", "Parking"], rating: 4.6 },
  { id: "s3", name: "EB Volt Kumasi Central", address: "Adum, Kumasi", city: "Kumasi", lat: 6.6885, lng: -1.6244, available: 4, total: 4, maxKw: 100, type: "DC Fast", status: "available", amenities: ["WiFi", "Café", "Restroom", "Shopping"], rating: 4.9 },
  { id: "s4", name: "EB Volt Takoradi Hub", address: "Market Circle, Takoradi", city: "Takoradi", lat: 4.8845, lng: -1.7554, available: 2, total: 3, maxKw: 50, type: "DC Fast", status: "available", amenities: ["Parking", "Restroom"], rating: 4.5 },
  { id: "s5", name: "EB Volt Tamale North", address: "Tamale, Northern Region", city: "Tamale", lat: 9.4075, lng: -0.8533, available: 0, total: 2, maxKw: 50, type: "AC Level 2", status: "offline", amenities: ["Parking"], rating: 4.2 },
  { id: "s6", name: "EB Volt East Legon", address: "East Legon, Accra", city: "Accra", lat: 5.6360, lng: -0.1540, available: 5, total: 6, maxKw: 100, type: "DC Fast", status: "available", amenities: ["WiFi", "Café", "Restroom", "Parking"], rating: 4.9 },
  { id: "s7", name: "EB Volt Tema Port", address: "Tema, Greater Accra", city: "Tema", lat: 5.6698, lng: 0.0166, available: 2, total: 4, maxKw: 50, type: "DC Fast", status: "available", amenities: ["Parking", "Restroom"], rating: 4.4 },
  { id: "s8", name: "EB Volt Koforidua", address: "Koforidua, Eastern Region", city: "Koforidua", lat: 6.0940, lng: -0.2600, available: 3, total: 4, maxKw: 50, type: "AC Level 2", status: "available", amenities: ["WiFi", "Parking"], rating: 4.3 },
];

function StatusBadge({ status, available, total }: { status: string; available: number; total: number }) {
  const styles = {
    available: { bg: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)", label: `${available}/${total} Available` },
    busy: { bg: "oklch(0.65 0.18 50 / 0.15)", color: "oklch(0.75 0.18 50)", border: "oklch(0.65 0.18 50 / 0.3)", label: `${available}/${total} Available` },
    offline: { bg: "oklch(0.5 0 0 / 0.15)", color: "oklch(0.65 0 0)", border: "oklch(0.5 0 0 / 0.3)", label: "Offline" },
  };
  const s = styles[status as keyof typeof styles] || styles.offline;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  );
}

function ReservationModal({ station, onClose }: { station: Station; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");

  const handleReserve = () => {
    if (!date || !time) { toast.error("Please select a date and time."); return; }
    setStep("confirm");
  };

  const handleConfirm = () => {
    toast.success(`Reservation confirmed at ${station.name}!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "oklch(0.17 0.012 240)",
          border: "1px solid oklch(1 0 0 / 10%)",
          boxShadow: "0 24px 64px oklch(0 0 0 / 0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
            {step === "form" ? "Reserve a Charger" : "Confirm Reservation"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "oklch(0.62 0.01 240)" }}>
            <X size={20} />
          </button>
        </div>

        <div
          className="p-4 rounded-xl mb-6"
          style={{ background: "oklch(0.12 0.015 240)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 145 / 0.15)" }}>
              <Zap size={18} style={{ color: "oklch(0.72 0.18 145)" }} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                {station.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "oklch(0.62 0.01 240)" }}>
                {station.address} · {station.maxKw}kW {station.type}
              </div>
            </div>
          </div>
        </div>

        {step === "form" ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "oklch(0.12 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  color: "oklch(0.95 0 0)",
                  colorScheme: "dark",
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "oklch(0.12 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  color: "oklch(0.95 0 0)",
                  colorScheme: "dark",
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "oklch(0.12 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  color: "oklch(0.95 0 0)",
                }}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <button onClick={handleReserve} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              <Calendar size={16} />
              Reserve Slot
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <CheckCircle size={48} style={{ color: "oklch(0.72 0.18 145)", margin: "0 auto 12px" }} />
              <p className="text-sm" style={{ color: "oklch(0.78 0.005 240)" }}>
                Your reservation details:
              </p>
            </div>
            {[
              { label: "Date", value: date },
              { label: "Time", value: time },
              { label: "Duration", value: `${duration} minutes` },
              { label: "Charger", value: `${station.maxKw}kW ${station.type}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}>
                <span className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: "oklch(0.95 0 0)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</span>
              </div>
            ))}
            <button onClick={handleConfirm} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              <CheckCircle size={16} />
              Confirm Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FindCharger() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [reserveStation, setReserveStation] = useState<Station | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "busy" | "offline">("all");
  const [filterType, setFilterType] = useState<"all" | "DC Fast" | "AC Level 2">("all");
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const filtered = STATIONS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchType = filterType === "all" || s.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);

    map.setCenter({ lat: 7.9465, lng: -1.0232 });
    map.setZoom(7);

    STATIONS.forEach((station) => {
      const color = station.status === "available" ? "#22c55e" : station.status === "busy" ? "#f97316" : "#6b7280";
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map,
        title: station.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:'Space Grotesk',sans-serif;padding:8px;min-width:200px;background:#1a2035;color:#f5f5f5;border-radius:8px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${station.name}</div>
            <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">${station.address}</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:12px;color:#22c55e;font-weight:600;">${station.maxKw}kW</span>
              <span style="font-size:12px;color:#9ca3af;">${station.available}/${station.total} ports</span>
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        setSelectedStation(station);
      });

      markersRef.current.push(marker);
    });
  }, []);

  const flyToStation = (station: Station) => {
    setSelectedStation(station);
    if (mapRef.current) {
      mapRef.current.setCenter({ lat: station.lat, lng: station.lng });
      mapRef.current.setZoom(14);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.015 240)" }}>
      <Navbar />
      {reserveStation && (
        <ReservationModal station={reserveStation} onClose={() => setReserveStation(null)} />
      )}

      <div style={{ paddingTop: "5rem" }} className="h-screen flex flex-col">
        {/* Page header */}
        <div
          className="px-6 py-4 flex items-center gap-4 flex-wrap"
          style={{ background: "oklch(0.15 0.012 240)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0 0)" }}>
            Find a Charger
          </h1>
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.55 0.01 240)" }} />
              <input
                type="text"
                placeholder="Search city or station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "oklch(0.12 0.015 240)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  color: "oklch(0.95 0 0)",
                }}
              />
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-1.5">
              <Filter size={14} style={{ color: "oklch(0.62 0.01 240)" }} />
              {(["all", "available", "busy", "offline"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{
                    background: filterStatus === f ? "oklch(0.55 0.18 145 / 0.2)" : "oklch(0.12 0.015 240)",
                    color: filterStatus === f ? "oklch(0.72 0.18 145)" : "oklch(0.62 0.01 240)",
                    border: `1px solid ${filterStatus === f ? "oklch(0.55 0.18 145 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Type filter */}
            <div className="flex items-center gap-1.5">
              {(["all", "DC Fast", "AC Level 2"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filterType === f ? "oklch(0.55 0.18 145 / 0.2)" : "oklch(0.12 0.015 240)",
                    color: filterType === f ? "oklch(0.72 0.18 145)" : "oklch(0.62 0.01 240)",
                    border: `1px solid ${filterType === f ? "oklch(0.55 0.18 145 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Station List */}
          <div
            className="w-80 flex-shrink-0 overflow-y-auto"
            style={{ background: "oklch(0.14 0.012 240)", borderRight: "1px solid oklch(1 0 0 / 8%)" }}
          >
            <div className="p-3">
              <div className="text-xs font-medium mb-3" style={{ color: "oklch(0.55 0.01 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
                {filtered.length} station{filtered.length !== 1 ? "s" : ""} found
              </div>
              <div className="space-y-2">
                {filtered.map((station) => (
                  <div
                    key={station.id}
                    className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: selectedStation?.id === station.id ? "oklch(0.55 0.18 145 / 0.1)" : "oklch(0.17 0.012 240)",
                      border: `1px solid ${selectedStation?.id === station.id ? "oklch(0.55 0.18 145 / 0.4)" : "oklch(1 0 0 / 8%)"}`,
                    }}
                    onClick={() => flyToStation(station)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="text-sm font-semibold truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0 0)" }}>
                          {station.name}
                        </div>
                        <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "oklch(0.55 0.01 240)" }}>
                          <MapPin size={10} />
                          {station.address}
                        </div>
                      </div>
                      <StatusBadge status={station.status} available={station.available} total={station.total} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium" style={{ color: "oklch(0.72 0.18 145)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {station.maxKw}kW
                      </span>
                      <span className="text-xs" style={{ color: "oklch(0.55 0.01 240)" }}>{station.type}</span>
                      <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "oklch(0.75 0.15 80)" }}>
                        <Star size={10} fill="currentColor" />
                        {station.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {station.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(1 0 0 / 5%)", color: "oklch(0.62 0.01 240)" }}>
                          {a}
                        </span>
                      ))}
                    </div>
                    {station.status !== "offline" && (
                      <button
                        className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        style={{
                          background: "oklch(0.55 0.18 145 / 0.15)",
                          color: "oklch(0.72 0.18 145)",
                          border: "1px solid oklch(0.55 0.18 145 / 0.25)",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        onClick={(e) => { e.stopPropagation(); setReserveStation(station); }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.25)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.18 145 / 0.15)"; }}
                      >
                        <Calendar size={12} />
                        Reserve Slot
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin size={32} style={{ color: "oklch(0.35 0.01 240)", margin: "0 auto 12px" }} />
                    <p className="text-sm" style={{ color: "oklch(0.55 0.01 240)" }}>No stations match your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <MapView
              onMapReady={handleMapReady}
              className="w-full h-full"
              initialCenter={{ lat: 7.9465, lng: -1.0232 }}
              initialZoom={7}
            />
            {!mapReady && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "oklch(0.12 0.015 240)" }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: "oklch(0.55 0.18 145)" }} />
                  <p className="text-sm" style={{ color: "oklch(0.62 0.01 240)" }}>Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
