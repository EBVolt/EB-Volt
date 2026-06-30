import { Heart } from "lucide-react";
import { useState } from "react";

interface FavoritesFilterProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  favoriteCount: number;
}

export function FavoritesFilter({ isActive, onToggle, favoriteCount }: FavoritesFilterProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "oklch(0.95 0.01 240)", border: "1px solid oklch(0.88 0.02 240)" }}>
      <button
        onClick={() => onToggle(!isActive)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
        style={{
          background: isActive ? "oklch(0.65 0.18 50)" : "oklch(0.88 0.02 240)",
          color: isActive ? "white" : "oklch(0.45 0.05 240)",
          border: isActive ? "1px solid oklch(0.65 0.18 50)" : "1px solid oklch(0.88 0.02 240)",
        }}
      >
        <Heart
          size={18}
          style={{
            fill: isActive ? "white" : "none",
            color: isActive ? "white" : "oklch(0.45 0.05 240)",
          }}
        />
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
          {isActive ? "Favorites Only" : "Show All"}
        </span>
        {favoriteCount > 0 && (
          <span
            className="ml-2 px-2 py-1 rounded text-xs font-bold"
            style={{
              background: isActive ? "rgba(255, 255, 255, 0.2)" : "oklch(0.65 0.18 50)",
              color: isActive ? "white" : "white",
            }}
          >
            {favoriteCount}
          </span>
        )}
      </button>
      <p style={{ color: "oklch(0.45 0.05 240)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
        {isActive ? `Showing ${favoriteCount} favorite station${favoriteCount !== 1 ? "s" : ""}` : "All stations"}
      </p>
    </div>
  );
}
