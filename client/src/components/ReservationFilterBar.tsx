import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";

export interface ReservationFilters {
  dateFrom?: Date;
  dateTo?: Date;
  location?: string;
  status?: string;
  sortBy?: "date" | "cost" | "duration";
  sortOrder?: "asc" | "desc";
}

interface ReservationFilterBarProps {
  onFiltersChange: (filters: ReservationFilters) => void;
  locations: string[];
}

const STATUSES = ["pending", "confirmed", "active", "completed", "cancelled"];
const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "cost", label: "Cost" },
  { value: "duration", label: "Duration" },
];

export default function ReservationFilterBar({ onFiltersChange, locations }: ReservationFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ReservationFilters>({
    sortBy: "date",
    sortOrder: "desc",
  });

  const handleFilterChange = (newFilters: ReservationFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateFromChange = (value: string) => {
    const date = value ? new Date(value) : undefined;
    handleFilterChange({ ...filters, dateFrom: date });
  };

  const handleDateToChange = (value: string) => {
    const date = value ? new Date(value) : undefined;
    handleFilterChange({ ...filters, dateTo: date });
  };

  const handleLocationChange = (value: string) => {
    handleFilterChange({ ...filters, location: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange({ ...filters, status: value || undefined });
  };

  const handleSortChange = (value: "date" | "cost" | "duration") => {
    handleFilterChange({ ...filters, sortBy: value });
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    handleFilterChange({ ...filters, sortOrder: value });
  };

  const clearFilters = () => {
    const clearedFilters = { sortBy: "date" as const, sortOrder: "desc" as const };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.location || filters.status;

  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Toggle & Sort */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
          style={{
            background: isOpen ? "oklch(0.55 0.18 145 / 0.15)" : "oklch(0.17 0.012 240)",
            color: isOpen ? "oklch(0.72 0.18 145)" : "oklch(0.62 0.01 240)",
            border: `1px solid ${isOpen ? "oklch(0.55 0.18 145 / 0.3)" : "oklch(1 0 0 / 8%)"}`,
          }}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "oklch(0.72 0.18 145)", color: "oklch(0.12 0.015 240)" }}
            >
              {[filters.dateFrom, filters.dateTo, filters.location, filters.status].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy || "date"}
            onChange={(e) => handleSortChange(e.target.value as "date" | "cost" | "duration")}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "oklch(0.17 0.012 240)",
              color: "oklch(0.95 0 0)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleSortOrderChange(filters.sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "oklch(0.17 0.012 240)",
              color: "oklch(0.62 0.01 240)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
            title={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            {filters.sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
            style={{
              background: "oklch(0.65 0.18 50 / 0.15)",
              color: "oklch(0.75 0.18 50)",
              border: "1px solid oklch(0.65 0.18 50 / 0.25)",
            }}
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div
          className="p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{
            background: "oklch(0.17 0.012 240)",
            border: "1px solid oklch(1 0 0 / 12%)",
          }}
        >
          {/* Date From */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)" }}>
              From Date
            </label>
            <input
              type="date"
              value={formatDateForInput(filters.dateFrom)}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "oklch(0.12 0.015 240)",
                color: "oklch(0.95 0 0)",
                border: "1px solid oklch(1 0 0 / 12%)",
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)" }}>
              To Date
            </label>
            <input
              type="date"
              value={formatDateForInput(filters.dateTo)}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "oklch(0.12 0.015 240)",
                color: "oklch(0.95 0 0)",
                border: "1px solid oklch(1 0 0 / 12%)",
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)" }}>
              Location
            </label>
            <select
              value={filters.location || ""}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "oklch(0.12 0.015 240)",
                color: "oklch(0.95 0 0)",
                border: "1px solid oklch(1 0 0 / 12%)",
              }}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: "oklch(0.72 0.18 145)" }}>
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none capitalize"
              style={{
                background: "oklch(0.12 0.015 240)",
                color: "oklch(0.95 0 0)",
                border: "1px solid oklch(1 0 0 / 12%)",
              }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
