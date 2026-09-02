"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Menu,
  GraduationCap,
  Train,
  Bus,
  Star,
  Route,
  Compass,
  Heart,
  Building2,
  MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import CollegeCard from "@/components/college-card";
import ThemeController from "@/components/theme-controller";
import {
  CITIES,
  TOTAL_COLLEGES,
  TYPE_META,
  TIERS,
  TIER_META,
  INSTITUTE_TYPES,
  DEFAULT_FILTERS,
  PROVENANCE,
  CAP_ROUND_LABELS,
  visibleColleges,
  type CityId,
  type CapRound,
  type Filters,
} from "@/lib/college-data";

// Leaflet must only run in the browser — disable SSR for the map.
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-950 dark:text-slate-500">
      <div className="flex flex-col items-center gap-2">
        <Compass className="h-8 w-8 animate-spin" />
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
});

export default function Home() {
  // resolvedTheme is undefined on first client render; MapView handles the
  // tile swap once a concrete theme resolves (defaults to light tiles).
  const { theme, resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark" || theme === "system";

  const [cityId, setCityId] = useState<CityId>("pune");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(
    null
  );
  const [focusCollegeId, setFocusCollegeId] = useState<string | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const [cityCenterNonce, setCityCenterNonce] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const city = CITIES[cityId];

  const visibleCount = useMemo(
    () => visibleColleges(city, filters).length,
    [city, filters]
  );

  const handleCityChange = (id: CityId) => {
    setCityId(id);
    setSelectedCollegeId(null);
    setCityCenterNonce((n) => n + 1);
  };

  const handleSelectCollege = (id: string) => {
    setSelectedCollegeId(id);
    setFocusCollegeId(id);
    setFocusNonce((n) => n + 1);
  };

  const handleSearchSelect = (targetCityId: CityId, collegeId: string) => {
    if (targetCityId !== cityId) {
      setCityId(targetCityId);
    }
    setSelectedCollegeId(collegeId);
    setFocusCollegeId(collegeId);
    setFocusNonce((n) => n + 1);
    setSearchQuery("");
  };

  const currentTheme = (theme === "system" ? "blue" : theme || "light") as
    | "light"
    | "dark"
    | "blue";
  const isMapDark = currentTheme === "dark" || currentTheme === "blue";

  return (
    <div
      className={`flex h-screen flex-col overflow-hidden bg-background text-foreground ${
        currentTheme === "blue" ? "blue" : currentTheme === "dark" ? "dark" : ""
      }`}
      suppressHydrationWarning
    >
      {/* ===== Header ===== */}
      <header className="shrink-0 z-50 border-b border-header-border bg-header/95 backdrop-blur supports-[backdrop-filter]:bg-header/80 text-header-foreground">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 shrink-0 text-header-foreground hover:bg-header/20"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open filters"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/logo.png"
                alt="Campus Compass Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain dark:drop-shadow-[0_0_8px_rgba(45,212,191,0.65)] dark:brightness-110 transition-all"
              />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold leading-tight truncate text-header-foreground">
                  Campus Compass
                </h1>
                <p className="text-[11px] leading-tight truncate flex items-center gap-1 text-header-foreground/80">
                  <MapPinned className="h-3 w-3" />
                  {city.name} · MHT-CET CAP {PROVENANCE.capYear} ·{" "}
                  {CAP_ROUND_LABELS[filters.round]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="hidden md:inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15">
              <Building2 className="h-3 w-3" />
              {city.name}
            </Badge>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-header/50 border border-header-border px-3 py-1 text-header-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              <span className="text-xs font-semibold">
                {visibleCount} colleges
              </span>
            </div>
            <ThemeController />
          </div>
        </div>
      </header>

      {/* ===== Main split: sidebar + map ===== */}
      <main className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          cityId={cityId}
          onCityChange={handleCityChange}
          filters={filters}
          onChange={setFilters}
          visibleCount={visibleCount}
          onSelectCollege={handleSelectCollege}
          selectedCollegeId={selectedCollegeId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        {/* Map region */}
        <div className="relative flex-1 min-w-0 min-h-0">
          <MapView
            cityId={cityId}
            filters={filters}
            mapTheme={currentTheme}
            onSelectCollege={handleSelectCollege}
            focusCollegeId={focusCollegeId}
            focusNonce={focusNonce}
            cityCenterNonce={cityCenterNonce}
          />

          {/* Floating legend */}
          <Legend />

          {/* Mobile "open filters" floating button */}
          <Button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute top-3 left-3 z-[500] bg-card text-card-foreground border border-border shadow-md hover:bg-muted h-9"
            size="sm"
          >
            <Menu className="h-4 w-4" />
            Filters
          </Button>

          {/* Selected college info card */}
          <CollegeCard
            cityId={cityId}
            collegeId={selectedCollegeId}
            round={filters.round}
            seatType={filters.seatType}
            onRoundChange={(r: CapRound) =>
              setFilters((f) => ({ ...f, round: r }))
            }
            onClose={() => setSelectedCollegeId(null)}
          />
        </div>
      </main>

      {/* ===== Sticky Footer ===== */}
      <footer className="mt-auto shrink-0 border-t border-header-border bg-header px-4 py-2.5 text-header-foreground">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <p className="text-[11px] leading-snug text-header-foreground/75">
            Cutoffs, institute codes, addresses and intakes are taken from the
            official{" "}
            <a
              href={PROVENANCE.capPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
            >
              DTE / State CET Cell CAP portal
            </a>{" "}
            for A.Y. {PROVENANCE.capYear} (
            <a
              href={PROVENANCE.capCutoffPdfs["1"]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              R-I
            </a>
            ,{" "}
            <a
              href={PROVENANCE.capCutoffPdfs["2"]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              R-II
            </a>
            ,{" "}
            <a
              href={PROVENANCE.capCutoffPdfs["3"]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              R-III
            </a>{" "}
            cut-off PDFs); map data ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              OpenStreetMap
            </a>{" "}
            contributors. Retrieved {PROVENANCE.generatedOn}. Always confirm
            against the official portal before acting on it.
          </p>
          <p className="shrink-0 text-[11px] text-header-foreground/60 flex items-center justify-center gap-1">
            {TOTAL_COLLEGES} colleges · made with{" "}
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
          </p>
        </div>
      </footer>
    </div>
  );
}

function Legend() {
  const items = [
    { icon: <Star className="h-3 w-3" />, color: "#14b8a6", label: "City Hub" },
    ...TIERS.map((t) => ({
      icon: <GraduationCap className="h-3 w-3" />,
      color: TIER_META[t].color,
      label: TIER_META[t].label,
    })),
    { icon: <Train className="h-3 w-3" />, color: "#8b5cf6", label: "Railway" },
    { icon: <Bus className="h-3 w-3" />, color: "#eab308", label: "Bus Stop" },
    { icon: <Star className="h-3 w-3" />, color: "#ec4899", label: "Landmark" },
    { icon: <Route className="h-3 w-3" />, color: "#14b8a6", label: "Thread" },
  ];
  return (
    <div className="hidden sm:block absolute top-3 right-3 z-[500] rounded-xl bg-card/95 backdrop-blur border border-border shadow-md p-2.5 text-card-foreground">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        Legend
      </p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: it.color }}
            >
              {it.icon}
            </span>
            <span className="text-[10px] text-card-foreground/80">
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
