/* ============================================================
   EB Volt - Address Search Component
   Features: Ghana Digital Addresses, Google Places, Geocoding
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface AddressSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  placeholder?: string;
}

// Ghana Digital Address coordinates mapping (sample data)
const GHANA_DIGITAL_ADDRESSES: Record<string, { lat: number; lng: number; description: string }> = {
  "GA-001-001": { lat: 5.5502, lng: -0.1234, description: "EB Volt Accra East - GA-001-001" },
  "GA-002-002": { lat: 5.6037, lng: -0.1870, description: "EB Volt Airport City - GA-002-002" },
  "GA-003-003": { lat: 6.6885, lng: -1.6244, description: "EB Volt Kumasi Central - GA-003-003" },
  "GA-004-004": { lat: 4.8845, lng: -1.7554, description: "EB Volt Takoradi Hub - GA-004-004" },
  "GA-005-005": { lat: 9.4075, lng: -0.8533, description: "EB Volt Tamale North - GA-005-005" },
  "GA-006-006": { lat: 5.6360, lng: -0.1540, description: "EB Volt East Legon - GA-006-006" },
  "GA-007-007": { lat: 5.6698, lng: 0.0166, description: "EB Volt Tema Port - GA-007-007" },
  "GA-008-008": { lat: 6.0940, lng: -0.2600, description: "EB Volt Koforidua - GA-008-008" },
};

interface SearchPrediction {
  id: string;
  mainText: string;
  secondaryText: string;
  type: "digital" | "address" | "postcode";
  placeId?: string;
}

export function AddressSearch({ onLocationSelect, placeholder = "Search by digital address, location, or postcode..." }: AddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const [predictions, setPredictions] = useState<SearchPrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Initialize Google Places services when component mounts
    if (window.google && window.google.maps) {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, []);

  const searchDigitalAddresses = (query: string): SearchPrediction[] => {
    const upperQuery = query.toUpperCase();
    return Object.entries(GHANA_DIGITAL_ADDRESSES)
      .filter(([code, _]) => code.includes(upperQuery))
      .map(([code, location]) => ({
        id: code,
        mainText: code,
        secondaryText: location.description,
        type: "digital",
      }));
  };

  const handleInputChange = async (value: string) => {
    setSearchValue(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    const allPredictions: SearchPrediction[] = [];

    // Search Ghana Digital Addresses
    const digitalResults = searchDigitalAddresses(value);
    allPredictions.push(...digitalResults);

    // Search Google Places for traditional addresses
    if (autocompleteRef.current && value.length > 2) {
      try {
        const response = await autocompleteRef.current.getPlacePredictions({
          input: value,
          componentRestrictions: { country: "gh" },
          types: ["geocode"],
        });

        if (response.predictions) {
          response.predictions.forEach((pred) => {
            allPredictions.push({
              id: pred.place_id,
              mainText: pred.structured_formatting?.main_text || pred.description,
              secondaryText: pred.structured_formatting?.secondary_text || "",
              type: value.match(/^\d{5}$/) ? "postcode" : "address",
              placeId: pred.place_id,
            });
          });
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      }
    }

    setPredictions(allPredictions);
    setShowPredictions(true);
  };

  const handleSelectDigitalAddress = (code: string) => {
    const location = GHANA_DIGITAL_ADDRESSES[code];
    if (location) {
      setSearchValue(code);
      setShowPredictions(false);
      onLocationSelect({
        lat: location.lat,
        lng: location.lng,
        address: `${code} - ${location.description}`,
      });
    }
  };

  const handleSelectPrediction = async (prediction: SearchPrediction) => {
    if (prediction.type === "digital") {
      handleSelectDigitalAddress(prediction.id);
      return;
    }

    setIsLoading(true);
    setSearchValue(prediction.mainText);
    setShowPredictions(false);

    if (!geocoderRef.current || !prediction.placeId) return;

    try {
      const results = await geocoderRef.current.geocode({
        placeId: prediction.placeId,
      });

      if (results && (results as any).length > 0) {
        const location = (results as any)[0].geometry.location;
        onLocationSelect({
          lat: location.lat(),
          lng: location.lng(),
          address: prediction.mainText,
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setPredictions([]);
    setShowPredictions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <MapPin size={18} className="absolute left-3" style={{ color: "oklch(0.45 0.05 240)" }} />
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => searchValue && setShowPredictions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg outline-none text-sm transition-all duration-200"
          style={{
            background: "oklch(0.92 0.02 240)",
            color: "oklch(0.25 0.08 240)",
            border: "1px solid oklch(0.88 0.02 240)",
          }}
        />
        {isLoading ? (
          <Loader2 size={18} className="absolute right-3 animate-spin" style={{ color: "oklch(0.52 0.18 145)" }} />
        ) : searchValue ? (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 p-1 rounded hover:bg-gray-200 transition-colors"
            style={{ color: "oklch(0.45 0.05 240)" }}
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}
        >
          {predictions.map((prediction) => (
            <button
              key={prediction.id}
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b last:border-b-0"
              style={{
                borderColor: "oklch(0.88 0.02 240)",
                color: "oklch(0.25 0.08 240)",
              }}
            >
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.52 0.18 145)" }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {prediction.mainText}
                    {prediction.type === "digital" && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.52 0.18 145 / 0.15)", color: "oklch(0.52 0.18 145)" }}>
                        Digital Address
                      </span>
                    )}
                  </div>
                  {prediction.secondaryText && (
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.45 0.05 240)" }}>
                      {prediction.secondaryText}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showPredictions && searchValue && predictions.length === 0 && !isLoading && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg p-4 text-center text-sm"
          style={{ background: "oklch(0.96 0.01 240)", border: "1px solid oklch(0.88 0.02 240)", color: "oklch(0.45 0.05 240)" }}
        >
          No locations found. Try searching by digital address (GA-XXX-XXX), city name, or postcode.
        </div>
      )}
    </div>
  );
}
