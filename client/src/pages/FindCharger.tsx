/* ============================================================
   EcoBelle Volt - Find a Charger Page
   Features: Google Maps with charger pins, filter panel, reservation modal, distance sorting
   ============================================================ */
import { useState, useCallback, useRef } from "react";
import { createBoltMarkerSVG } from "@/components/BoltMarker";
import { MapPin, Zap, Clock, Filter, Search, Star, ChevronRight, X, Calendar, CheckCircle, ArrowUpDown, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { MoMoPaymentWidget } from "@/components/MoMoPaymentWidget";
import { AddressSearch } from "@/components/AddressSearch";
import { FavoritesFilter } from "@/components/FavoritesFilter";
import { calculateDistance, formatDistance } from "@/lib/distance";
import { openDirectionsInMaps } from "@/lib/directions";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

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
  distance?: number;
}

interface SearchLocation {
  lat: number;
  lng: number;
  address: string;
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
    available: { bg: "oklch(0.52 0.18 145 / 0.15)", color: "oklch(0.52 0.18 145)", border: "oklch(0.52 0.18 145 / 0.3)", label: `${available}/${total} Available` },
    busy: { bg: "oklch(0.65 0.18 50 / 0.15)", color: "oklch(0.65 0.18 50)", border: "oklch(0.65 0.18 50 / 0.3)", label: `${available}/${total} Available` },
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

export default function FindCharger() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [sortByDistance, setSortByDistance] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { user } = useAuth();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
  const favoriteStationIds = new Set<string>();

  // Calculate distances from search location
  const stationsWithDistance = STATIONS.map((s) => ({
    ...s,
    distance: searchLocation ? calculateDistance(searchLocation, { lat: s.lat, lng: s.lng }) : undefined,
  }));

  // Filter and sort stations
  const filtered = stationsWithDistance
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || s.status === filterStatus;
      const matchType = filterType === "all" || s.type === filterType;
      const matchFavorites = !showFavoritesOnly || favoriteStationIds.has(s.id);
      return matchSearch && matchStatus && matchType && matchFavorites;
    })
    .sort((a, b) => {
      if (sortByDistance && a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);

    map.setCenter({ lat: 7.9465, lng: -1.0232 });
    map.setZoom(7);

    STATIONS.forEach((station) => {
      const color = station.status === "available" ? "#22c55e" : station.status === "busy" ? "#f97316" : "#9ca3af";
      
      // Create custom marker with EB Volt logo
      const markerElement = document.createElement('div');
      markerElement.style.cssText = `
        width: 52px;
        height: 52px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid ${color};
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      // EB Volt bolt/lightning icon
      markerElement.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" fill="${color}" stroke="${color}" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
      
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: station.lat, lng: station.lng },
        map,
        title: station.name,
        content: markerElement,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:'Space Grotesk',sans-serif;padding:12px;min-width:220px;background:#f8f9fa;color:#1f2937;border-radius:8px;border:1px solid #e5e7eb;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#1f2937;">${station.name}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">${station.address}</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:12px;color:#22c55e;font-weight:600;">${station.maxKw}kW</span>
              <span style="font-size:12px;color:#6b7280;">${station.available}/${station.total} ports</span>
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

          {/* Filter Bar */}
          <div
            className="rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
            style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}
          >
            <div className="flex-1 flex items-center gap-2" style={{ background: "oklch(0.92 0.02 240)", borderRadius: "8px", padding: "8px 12px" }}>
              <Search size={18} style={{ color: "oklch(0.45 0.05 240)" }} />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "oklch(0.25 0.08 240)" }}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "oklch(0.92 0.02 240)", color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "oklch(0.92 0.02 240)", color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}
            >
              <option value="all">All Types</option>
              <option value="DC Fast">DC Fast</option>
              <option value="AC Level 2">AC Level 2</option>
            </select>
          </div>
        </div>
      </section>

      {/* Favorites Filter */}
      {user && (
        <section className="pb-6">
          <div className="container">
            <FavoritesFilter
              isActive={showFavoritesOnly}
              onToggle={setShowFavoritesOnly}
              favoriteCount={favoriteStationIds.size}
            />
          </div>
        </section>
      )}

      {/* Address Search */}
      <section className="pb-6">
        <div className="container">
          <AddressSearch
            onLocationSelect={(location) => {
              setSearchLocation(location);
              if (mapRef.current) {
                mapRef.current.setCenter({ lat: location.lat, lng: location.lng });
                mapRef.current.setZoom(14);
              }
              setSortByDistance(true);
              toast.success(`Centered on ${location.address} - sorted by distance`);
            }}
          />
        </div>
      </section>

      {/* Map & Sidebar */}
      <section className="pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.88 0.02 240)", height: "600px" }}>
              <MapView initialCenter={{ lat: 7.9465, lng: -1.0232 }} initialZoom={7} onMapReady={handleMapReady} />
            </div>

            {/* Sidebar */}
            <div className="rounded-2xl p-6" style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)", height: "600px", overflowY: "auto" }}>
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}
                >
                  Nearby Stations ({filtered.length})
                </h3>
                {searchLocation && (
                  <button
                    onClick={() => setSortByDistance(!sortByDistance)}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      background: sortByDistance ? "oklch(0.52 0.18 145 / 0.15)" : "oklch(0.92 0.02 240)",
                      color: sortByDistance ? "oklch(0.52 0.18 145)" : "oklch(0.45 0.05 240)",
                      border: sortByDistance ? "1px solid oklch(0.52 0.18 145)" : "1px solid oklch(0.88 0.02 240)",
                    }}
                    title={sortByDistance ? "Sorted by distance" : "Click to sort by distance"}
                  >
                    <ArrowUpDown size={16} />
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <p style={{ color: "oklch(0.45 0.05 240)" }}>No stations match your filters.</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((station) => (
                    <div
                      key={station.id}
                      onClick={() => flyToStation(station)}
                      className="p-3 rounded-lg cursor-pointer transition-all duration-200"
                      style={{
                        background: selectedStation?.id === station.id ? "oklch(0.52 0.18 145 / 0.1)" : "oklch(0.92 0.02 240)",
                        border: selectedStation?.id === station.id ? "1px solid oklch(0.52 0.18 145)" : "1px solid oklch(0.88 0.02 240)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: "oklch(0.25 0.08 240)" }}>
                            {station.name}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.05 240)" }}>
                            {station.address}
                          </p>
                          {station.distance !== undefined && (
                            <p className="text-xs mt-1 font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                              📍 {formatDistance(station.distance)} away
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} style={{ color: "oklch(0.65 0.18 50)", fill: "oklch(0.65 0.18 50)" }} />
                          <span className="text-xs font-semibold" style={{ color: "oklch(0.25 0.08 240)" }}>
                            {station.rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <StatusBadge status={station.status} available={station.available} total={station.total} />
                        <span className="text-xs font-semibold" style={{ color: "oklch(0.52 0.18 145)" }}>
                          {station.maxKw}kW
                        </span>
                      </div>

                      {selectedStation?.id === station.id && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setShowReservation(true)}
                            className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                            style={{ background: "oklch(0.52 0.18 145)", color: "white" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "oklch(0.42 0.18 145)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "oklch(0.52 0.18 145)";
                            }}
                          >
                            Reserve Now
                          </button>
                          {searchLocation && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDirectionsInMaps(searchLocation, { lat: station.lat, lng: station.lng });
                                toast.success("Opening directions...");
                              }}
                              className="px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1"
                              style={{ background: "oklch(0.92 0.02 240)", color: "oklch(0.52 0.18 145)", border: "1px solid oklch(0.52 0.18 145)" }}
                              title="Get directions to this station"
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "oklch(0.52 0.18 145 / 0.1)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "oklch(0.92 0.02 240)";
                              }}
                            >
                              <Navigation size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      {showReservation && selectedStation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowReservation(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "oklch(0.98 0.01 240)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
                Reserve Charger
              </h2>
              <button onClick={() => setShowReservation(false)} className="p-1">
                <X size={24} style={{ color: "oklch(0.45 0.05 240)" }} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.45 0.05 240)" }}>
                  Station
                </p>
                <p className="text-lg font-bold" style={{ color: "oklch(0.25 0.08 240)" }}>
                  {selectedStation.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <Calendar size={16} className="inline mr-2" />
                  Reservation Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.92 0.02 240)", color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.45 0.05 240)" }}>
                  <Clock size={16} className="inline mr-2" />
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  defaultValue="2"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.92 0.02 240)", color: "oklch(0.25 0.08 240)", border: "1px solid oklch(0.88 0.02 240)" }}
                />
              </div>

              <div className="p-3 rounded-lg" style={{ background: "oklch(0.52 0.18 145 / 0.1)", border: "1px solid oklch(0.52 0.18 145 / 0.3)" }}>
                <p className="text-sm" style={{ color: "oklch(0.45 0.05 240)" }}>
                  Estimated Cost
                </p>
                <p className="text-2xl font-bold" style={{ color: "oklch(0.52 0.18 145)" }}>
                  ₵{(selectedStation.maxKw * 15).toFixed(2)}
                </p>
              </div>
            </div>

            <MoMoPaymentWidget
              reservationId={1}
              amount={(selectedStation.maxKw * 15).toString()}
              estimatedCost={(selectedStation.maxKw * 15).toString()}
              onPaymentSuccess={() => {
                toast.success("Reservation confirmed!");
                setShowReservation(false);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
