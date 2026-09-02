"use client";

import {
  X,
  ExternalLink,
  Train,
  Bus,
  MapPin,
  Calendar,
  Ruler,
  GraduationCap,
  Navigation,
  TrendingUp,
  Award,
  Building2,
  Target,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCity,
  TIER_META,
  BRANCHES,
  haversineKm,
  nearestTransit,
  type CityId,
} from "@/lib/college-data";
import { cn } from "@/lib/utils";

interface CollegeCardProps {
  cityId: CityId;
  collegeId: string | null;
  onClose: () => void;
}

export default function CollegeCard({
  cityId,
  collegeId,
  onClose,
}: CollegeCardProps) {
  const city = getCity(cityId);
  const college = collegeId
    ? city.colleges.find((c) => c.id === collegeId)
    : undefined;

  if (!college) return null;

  const meta = TIER_META[college.tier];
  const dist = haversineKm(city.hub.position, college.position);
  const nearestRail = nearestTransit(college, city.railways);
  const nearestBus = nearestTransit(college, city.busStops);
  const railDist = nearestRail
    ? haversineKm(college.position, nearestRail.position)
    : null;
  const busDist = nearestBus
    ? haversineKm(college.position, nearestBus.position)
    : null;

  const fmtPkg = (v: number) =>
    v >= 100 ? `₹${(v / 100).toFixed(1)} Cr` : `₹${v.toFixed(1)} LPA`;

  const offeredBranches = BRANCHES.filter((b) => b in college.cutoffs);

  return (
    <div
      className={cn(
        "chm-card-in pointer-events-auto absolute z-[600] bottom-4 right-4 left-4 sm:left-auto sm:w-[372px]",
        "rounded-2xl bg-card text-card-foreground shadow-2xl border border-border overflow-hidden"
      )}
      role="dialog"
      aria-label={`${college.name} details`}
    >
      {/* Tier banner */}
      <div
        className="relative px-4 pt-4 pb-3"
        style={{
          background: `linear-gradient(135deg, ${meta.color}, ${meta.ring})`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40 transition-colors"
          aria-label="Close info card"
          suppressHydrationWarning
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 text-white">
            <GraduationCap className="h-4 w-4" />
          </span>
          <Badge className="bg-white/25 text-white border-0 hover:bg-white/25 text-[10px]">
            {meta.label}
          </Badge>
          <span className="ml-auto mr-9 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
            <Building2 className="h-3 w-3" />
            Code {college.instituteCode}
          </span>
        </div>
        <h3 className="text-white font-bold text-base sm:text-lg leading-tight pr-8">
          {college.name}
        </h3>
        <p className="text-white/80 text-xs mt-0.5">
          {college.shortName} · Est. {college.established} · {city.name}
        </p>
      </div>

      {/* Body */}
      <div className="chm-scroll max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {college.description}
        </p>

        {/* Placement summary */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-card p-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Placement Summary
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-muted/30 border border-border p-2">
              <div className="flex items-center gap-1 text-[10px] font-medium uppercase text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Avg
              </div>
              <div className="text-sm font-bold text-card-foreground tabular-nums">
                {fmtPkg(college.placement.avgPackage)}
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border p-2">
              <div className="flex items-center gap-1 text-[10px] font-medium uppercase text-muted-foreground">
                <Award className="h-3 w-3" /> Highest
              </div>
              <div className="text-sm font-bold text-emerald-500 tabular-nums">
                {fmtPkg(college.placement.highestPackage)}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {college.placement.topRecruiters.map((r) => (
              <span
                key={r}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Branch cutoffs */}
        <div className="rounded-xl border border-border p-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Round-1 Cutoff (MHT-CET %ile)
            </span>
          </div>
          {offeredBranches.length === 0 ? (
            <p className="text-[11px] text-muted-foreground pl-1">
              Specialised institute — standard B.Tech branches not offered.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {BRANCHES.map((b) => {
                const cut = college.cutoffs[b];
                const offered = cut !== undefined;
                return (
                  <div
                    key={b}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1 text-[11px]",
                      offered
                        ? "bg-muted/40"
                        : "opacity-50"
                    )}
                  >
                    <span className="flex items-center gap-1 text-muted-foreground">
                      {offered ? (
                        <CheckCircle2 className="h-3 w-3 text-teal-500" />
                      ) : (
                        <MinusCircle className="h-3 w-3 opacity-60" />
                      )}
                      {b}
                    </span>
                    <span className="font-semibold text-card-foreground tabular-nums">
                      {offered ? cut.toFixed(1) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <Stat
            icon={<Ruler className="h-3.5 w-3.5" />}
            label="From Hub"
            value={`${dist.toFixed(1)} km`}
            tint={meta.color}
          />
          <Stat
            icon={<Calendar className="h-3.5 w-3.5" />}
            label="Established"
            value={`${college.established}`}
            tint="#64748b"
          />
        </div>

        {/* Transit distances */}
        <div className="grid grid-cols-2 gap-2">
          <TransitStat
            icon={<Train className="h-3.5 w-3.5" />}
            tint="#8b5cf6"
            label="Nearest Railway"
            name={nearestRail?.name ?? "—"}
            dist={railDist}
          />
          <TransitStat
            icon={<Bus className="h-3.5 w-3.5" />}
            tint="#eab308"
            label="Nearest Bus"
            name={nearestBus?.name ?? "—"}
            dist={busDist}
          />
        </div>

        {/* Hub reference */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>
            Measured from{" "}
            <span className="font-semibold text-card-foreground">
              {city.hub.name}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit Website
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800"
            onClick={() => {
              const url = `https://www.openstreetmap.org/directions?from=${city.hub.position.lat}%2C${city.hub.position.lng}&to=${college.position.lat}%2C${college.position.lng}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            <Navigation className="h-3.5 w-3.5" />
            Directions
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-border p-2.5 bg-muted/20">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ color: tint }}>{icon}</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-sm font-bold text-card-foreground tabular-nums">
        {value}
      </div>
    </div>
  );
}

function TransitStat({
  icon,
  tint,
  label,
  name,
  dist,
}: {
  icon: React.ReactNode;
  tint: string;
  label: string;
  name: string;
  dist: number | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-2.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ color: tint }}>{icon}</span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-[11px] font-semibold text-card-foreground truncate">
        {name}
      </div>
      {dist !== null && (
        <div className="text-[10px] text-muted-foreground tabular-nums">
          {dist.toFixed(1)} km away
        </div>
      )}
    </div>
  );
}
