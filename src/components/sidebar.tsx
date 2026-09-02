"use client";

import { useMemo } from "react";
import {
  GraduationCap,
  Train,
  Bus,
  Star,
  Route,
  MapPin,
  SlidersHorizontal,
  X,
  Search,
  Building2,
  TramFront,
  Compass,
  Layers,
  GitBranch,
  Target,
  Briefcase,
  IndianRupee,
  Trophy,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CITIES,
  CITY_LIST,
  TYPE_META,
  TIERS,
  TIER_META,
  formatCurrencyLakhs,
  formatPackage,
  INSTITUTE_TYPES,
  BRANCHES,
  BRANCH_LABELS,
  CAP_ROUNDS,
  CAP_ROUND_LABELS,
  SEAT_TYPES,
  SEAT_TYPE_LABELS,
  DEFAULT_FILTERS,
  PROVENANCE,
  hubDistanceKm,
  instituteType,
  visibleColleges as filterVisible,
  type CityId,
  type Filters,
  type InstituteType,
  type Tier,
  type BranchFilter,
} from "@/lib/college-data";

interface SidebarProps {
  cityId: CityId;
  onCityChange: (id: CityId) => void;
  filters: Filters;
  onChange: (f: Filters) => void;
  visibleCount: number;
  onSelectCollege: (id: string) => void;
  selectedCollegeId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSelect: (cityId: CityId, collegeId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Sidebar({
  cityId,
  onCityChange,
  filters,
  onChange,
  visibleCount,
  onSelectCollege,
  selectedCollegeId,
  searchQuery,
  onSearchChange,
  onSearchSelect,
  open,
  onOpenChange,
}: SidebarProps) {
  const city = CITIES[cityId];

  const toggleType = (type: InstituteType) => {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next.length ? next : [type] });
  };

  const toggleTier = (tier: Tier) => {
    const next = filters.tiers.includes(tier)
      ? filters.tiers.filter((t) => t !== tier)
      : [...filters.tiers, tier];
    onChange({ ...filters, tiers: next.length ? next : [tier] });
  };

  const toggle = (key: keyof Filters, checked: boolean) =>
    onChange({ ...filters, [key]: checked });

  const reset = () => onChange({ ...DEFAULT_FILTERS });

  const shownColleges = useMemo(() => filterVisible(city, filters), [city, filters]);

  // Global search across ALL cities by name or institute code.
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const out: {
      cityId: CityId;
      cityName: string;
      collegeId: string;
      name: string;
      shortName: string;
      code: string;
      type: InstituteType;
      tier: Tier;
      avgPackage?: number;
      fee?: number;
    }[] = [];
    for (const c of CITY_LIST) {
      for (const col of c.colleges) {
        if (
          col.name.toLowerCase().includes(q) ||
          col.shortName.toLowerCase().includes(q) ||
          (col.instituteCode ?? "").includes(q)
        ) {
          out.push({
            cityId: c.id,
            cityName: c.name,
            collegeId: col.id,
            name: col.name,
            shortName: col.shortName,
            code: col.instituteCode ?? "—",
            type: instituteType(col),
            tier: col.tier,
            avgPackage: col.placement?.avgPackage,
            fee: col.feeStructure?.totalAnnualFee,
          });
        }
      }
      if (out.length >= 12) break;
    }
    return out;
  }, [searchQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed z-40 top-0 left-0 h-full w-[324px] max-w-[88vw] bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none lg:w-[340px] lg:flex lg:flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Filter panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border bg-sidebar lg:hidden">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-sidebar-foreground leading-tight">
              Filters
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden text-sidebar-foreground/75 hover:bg-muted/20"
            onClick={() => onOpenChange(false)}
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable filter body */}
        <div className="chm-scroll flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* City selector */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2">
              Select City
            </h3>
            <Select value={cityId} onValueChange={(v) => onCityChange(v as CityId)}>
              <SelectTrigger className="w-full h-10 bg-sidebar border-sidebar-border text-sidebar-foreground">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <SelectValue placeholder="Choose a city" />
                </span>
              </SelectTrigger>
              <SelectContent>
                {CITY_LIST.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        · {c.colleges.length} colleges
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-[11px] text-sidebar-foreground/70 leading-snug">
              Hub:{" "}
              <span className="font-semibold text-sidebar-foreground">
                {city.hub.name}
              </span>
            </p>
          </section>

          {/* Global search */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2">
              Search Colleges
            </h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Name or institute code…"
                className="pl-8 h-9 bg-sidebar border-sidebar-border text-sidebar-foreground"
                aria-label="Search colleges by name or institute code"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  aria-label="Clear search"
                  suppressHydrationWarning
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <div className="chm-scroll mt-2 max-h-56 overflow-y-auto rounded-xl border border-sidebar-border bg-sidebar">
                {searchResults.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-sidebar-foreground/60">
                    No colleges found.
                  </div>
                )}
                {searchResults.map((r) => {
                  const meta = TYPE_META[r.type];
                  const tierMeta = TIER_META[r.tier];
                  const crossCity = r.cityId !== cityId;
                  return (
                    <button
                      key={r.cityId + r.collegeId}
                      onClick={() => {
                        onSearchSelect(r.cityId, r.collegeId);
                        onOpenChange(false);
                      }}
                      className="flex w-full items-center gap-2.5 border-b border-sidebar-border px-3 py-2 text-left last:border-0 hover:bg-muted/50 text-sidebar-foreground"
                      suppressHydrationWarning
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white font-bold text-[10px]"
                        style={{ backgroundColor: tierMeta.color }}
                        title={tierMeta.label}
                      >
                        {tierMeta.badge}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-sidebar-foreground truncate">
                            {r.shortName}
                            <span className="ml-1 text-[10px] font-normal text-sidebar-foreground/60">
                              #{r.code}
                            </span>
                          </span>
                          {r.avgPackage ? (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{r.avgPackage} LPA
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[10px] text-sidebar-foreground/75 truncate">
                          {r.name}
                          {r.fee ? ` · ${formatCurrencyLakhs(r.fee)}/yr` : ""}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-5 shrink-0",
                          crossCity
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                            : "border-teal-500/40 bg-teal-500/10 text-teal-300"
                        )}
                      >
                        {r.cityName}
                        {crossCity ? " ↗" : ""}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* CAP round + seat type — the two switches that change every cutoff */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" /> CAP Round
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {CAP_ROUNDS.map((r) => (
                <button
                  key={r}
                  onClick={() => onChange({ ...filters, round: r })}
                  aria-pressed={filters.round === r}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-all",
                    filters.round === r
                      ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                      : "border-sidebar-border bg-sidebar text-sidebar-foreground hover:border-muted-foreground"
                  )}
                  suppressHydrationWarning
                >
                  {CAP_ROUND_LABELS[r]}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-sidebar-foreground/60 leading-snug">
              Official MHT-CET CAP {PROVENANCE.capYear} closing percentiles,
              published by the State CET Cell.
            </p>

            <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2">
              Seat Type
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {SEAT_TYPES.map((st) => (
                <button
                  key={st}
                  onClick={() => onChange({ ...filters, seatType: st })}
                  aria-pressed={filters.seatType === st}
                  title={SEAT_TYPE_LABELS[st]}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-[10px] font-semibold leading-tight transition-all",
                    filters.seatType === st
                      ? "border-teal-600 bg-teal-600/15 text-teal-700 dark:text-teal-300"
                      : "border-sidebar-border bg-sidebar text-sidebar-foreground hover:border-muted-foreground"
                  )}
                  suppressHydrationWarning
                >
                  {SEAT_TYPE_LABELS[st]}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-sidebar-foreground/60 leading-snug">
              Home University = your own university region. Autonomous institutes
              publish a single State Level line.
            </p>
          </section>

          {/* Institute type — taken from the official Status / Autonomy fields */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75">
                Institute Type
              </h3>
              <Badge variant="secondary" className="text-[10px] h-5 bg-muted text-sidebar-foreground">
                {filters.types.length}/{INSTITUTE_TYPES.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {INSTITUTE_TYPES.map((type) => {
                const meta = TYPE_META[type];
                const active = filters.types.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    title={meta.desc}
                    aria-pressed={active}
                    className={cn(
                      "group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                      active
                        ? "text-white border-transparent shadow-sm"
                        : "bg-sidebar text-sidebar-foreground border-sidebar-border hover:border-muted-foreground"
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: meta.color,
                            borderColor: meta.color,
                            boxShadow: `0 0 0 2px ${meta.color}33`,
                          }
                        : undefined
                    }
                    suppressHydrationWarning
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        !active && "ring-1 ring-inset ring-muted-foreground"
                      )}
                      style={{ backgroundColor: active ? "#fff" : meta.color }}
                    />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* College Tier filter (Tier 1, 2, 3) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> College Tier
              </h3>
              <Badge variant="secondary" className="text-[10px] h-5 bg-muted text-sidebar-foreground">
                {filters.tiers.length}/{TIERS.length}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {TIERS.map((t) => {
                const meta = TIER_META[t];
                const active = filters.tiers.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTier(t)}
                    title={meta.desc}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-all",
                      active
                        ? "text-white shadow-xs"
                        : "bg-sidebar text-sidebar-foreground border-sidebar-border hover:border-muted-foreground"
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: meta.color,
                            borderColor: meta.color,
                            boxShadow: `0 0 0 2px ${meta.color}33`,
                          }
                        : undefined
                    }
                    suppressHydrationWarning
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: active ? "#fff" : meta.color }}
                    />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Min Avg Package Slider (Placements) */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Min Avg Package
              </h3>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {filters.minAvgPackage === 0 ? "Any Package" : `${filters.minAvgPackage} LPA+`}
              </span>
            </div>
            <Slider
              value={[filters.minAvgPackage]}
              min={0}
              max={15}
              step={0.5}
              onValueChange={(v) => onChange({ ...filters, minAvgPackage: v[0] })}
              aria-label="Minimum average placement package in LPA"
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-sidebar-foreground/60">
              <span>Any</span>
              <span>5 LPA</span>
              <span>10 LPA</span>
              <span>15+ LPA</span>
            </div>
          </section>

          {/* Max Annual Fee Slider (Fee Structure) */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Max Annual Fee
              </h3>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {filters.maxAnnualFee >= 500000 ? "Any Fee" : `${formatCurrencyLakhs(filters.maxAnnualFee)} / yr`}
              </span>
            </div>
            <Slider
              value={[filters.maxAnnualFee]}
              min={25000}
              max={500000}
              step={25000}
              onValueChange={(v) => onChange({ ...filters, maxAnnualFee: v[0] })}
              aria-label="Maximum annual tuition fee"
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-sidebar-foreground/60">
              <span>₹25k</span>
              <span>₹1.5 L</span>
              <span>₹3 L</span>
              <span>Any</span>
            </div>
          </section>

          {/* Branch filter */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2 flex items-center gap-1">
              <GitBranch className="h-3.5 w-3.5" /> Branch
            </h3>
            <Select
              value={filters.branch}
              onValueChange={(v) =>
                onChange({ ...filters, branch: v as BranchFilter })
              }
            >
              <SelectTrigger className="w-full h-9 bg-sidebar border-sidebar-border text-sidebar-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Branches</SelectItem>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {BRANCH_LABELS[b]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Cutoff percentile slider (eligibility) */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 flex items-center gap-1">
                <Target className="h-3.5 w-3.5" /> Your Percentile
              </h3>
              <span className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                {filters.percentile.toFixed(1)}%ile
              </span>
            </div>
            <Slider
              value={[filters.percentile]}
              min={60}
              max={99.9}
              step={0.1}
              onValueChange={(v) =>
                onChange({ ...filters, percentile: v[0] })
              }
              aria-label="Your MHT-CET percentile (eligibility)"
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-sidebar-foreground/60">
              <span>60</span>
              <span>80</span>
              <span>99.9</span>
            </div>
            <p className="mt-1 text-[10px] text-sidebar-foreground/50 leading-snug">
              Shows colleges whose {CAP_ROUND_LABELS[filters.round]} Open-category
              closing percentile ({SEAT_TYPE_LABELS[filters.seatType]}) is ≤ yours.
              Institutes outside the CAP have no official cutoff and are always
              shown.
            </p>
          </section>

          {/* Distance slider */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75">
                Distance from Hub
              </h3>
              <span className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                {filters.maxDistance >= 50
                  ? "50+ km"
                  : `${filters.maxDistance} km`}
              </span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              min={1}
              max={50}
              step={1}
              onValueChange={(v) => onChange({ ...filters, maxDistance: v[0] })}
              aria-label="Maximum distance in kilometres"
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-sidebar-foreground/60">
              <span>1 km</span>
              <span>25 km</span>
              <span>50+ km</span>
            </div>
          </section>

          {/* Layer toggles */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75 mb-2">
              Map Layers
            </h3>
            <div className="space-y-1">
              <ToggleRow
                icon={<TramFront className="h-4 w-4" />}
                color="#8b5cf6"
                label="Transit Points"
                sub="Railway & bus stops"
                checked={filters.showTransit}
                onCheckedChange={(v) => toggle("showTransit", v)}
              />
              <ToggleRow
                icon={<Star className="h-4 w-4" />}
                color="#ec4899"
                label="Landmarks"
                sub="Famous city landmarks"
                checked={filters.showLandmarks}
                onCheckedChange={(v) => toggle("showLandmarks", v)}
              />
              <ToggleRow
                icon={<Route className="h-4 w-4" />}
                color="#14b8a6"
                label="Connecting Threads"
                sub="Distance lines to hub"
                checked={filters.showThreads}
                onCheckedChange={(v) => toggle("showThreads", v)}
              />
            </div>
          </section>

          {/* Visible colleges list */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/75">
                Colleges in View
              </h3>
              <Badge className="bg-teal-600 text-[10px] h-5">{visibleCount}</Badge>
            </div>
            <div className="chm-scroll max-h-80 overflow-y-auto space-y-1.5 pr-1">
              {shownColleges.length === 0 && (
                <div className="text-center py-6 text-xs text-sidebar-foreground/60">
                  <MapPin className="h-5 w-5 mx-auto mb-1 opacity-40" />
                  No colleges match your filters.
                </div>
              )}
              {shownColleges.map((c) => {
                const meta = TYPE_META[instituteType(c)];
                const tierMeta = TIER_META[c.tier];
                const dist = hubDistanceKm(city, c);
                const active = selectedCollegeId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCollege(c.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-2.5 rounded-lg border p-2 text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                        : "border-sidebar-border bg-sidebar hover:border-muted-foreground hover:bg-muted/20 text-sidebar-foreground"
                    )}
                    suppressHydrationWarning
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-bold text-[10px]"
                      style={{ backgroundColor: tierMeta.color }}
                      title={`${tierMeta.label} · ${meta.label}`}
                    >
                      {tierMeta.badge}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-sidebar-foreground truncate">
                          {c.shortName}
                          {c.instituteCode && (
                            <span className="ml-1 text-[10px] font-normal text-sidebar-foreground/60">
                              #{c.instituteCode}
                            </span>
                          )}
                        </span>
                        {c.placement?.avgPackage ? (
                          <span className="shrink-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{c.placement.avgPackage} LPA
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-sidebar-foreground/75 truncate mt-0.5">
                        <span style={{ color: tierMeta.color }} className="font-semibold">{tierMeta.label}</span>
                        {c.feeStructure?.totalAnnualFee ? ` · ${formatCurrencyLakhs(c.feeStructure.totalAnnualFee)}/yr` : ""}
                        {dist !== null ? ` · ${dist.toFixed(1)} km` : ""}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer reset */}
        <div className="border-t border-sidebar-border px-5 py-3 bg-sidebar">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-sidebar border-sidebar-border text-sidebar-foreground hover:bg-muted/20"
            onClick={reset}
          >
            <Compass className="h-3.5 w-3.5" />
            Reset all filters
          </Button>
          <p className="mt-2 text-[10px] leading-snug text-sidebar-foreground/60">
            Data from the{" "}
            <a
              href={PROVENANCE.capPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sidebar-foreground"
            >
              State CET Cell CAP portal
            </a>{" "}
            ({PROVENANCE.capYear}) and{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sidebar-foreground"
            >
              OpenStreetMap
            </a>
            . Retrieved {PROVENANCE.generatedOn}.
          </p>
        </div>
      </aside>
    </>
  );
}

function ToggleRow({
  icon,
  color,
  label,
  sub,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  sub: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted/20">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </span>
        <div>
          <Label className="text-sm text-sidebar-foreground cursor-pointer leading-tight">
            {label}
          </Label>
          <p className="text-[10px] text-sidebar-foreground/60 leading-tight">
            {sub}
          </p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
