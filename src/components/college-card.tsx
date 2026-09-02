"use client";

import { useState } from "react";
import {
  X,
  ExternalLink,
  Train,
  Bus,
  MapPin,
  Ruler,
  GraduationCap,
  Navigation,
  Building2,
  Target,
  Users,
  FileText,
  Info,
  AlertTriangle,
  Briefcase,
  IndianRupee,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCity,
  TYPE_META,
  TIER_META,
  formatCurrencyLakhs,
  formatPackage,
  CAP_ROUNDS,
  CAP_ROUND_LABELS,
  SEAT_TYPE_LABELS,
  PROVENANCE,
  courseCutoff,
  availableSeatTypes,
  hubDistanceKm,
  haversineKm,
  instituteType,
  nearestPoint,
  summaryLine,
  type CapRound,
  type CityId,
  type SeatType,
} from "@/lib/college-data";
import { cn } from "@/lib/utils";

interface CollegeCardProps {
  cityId: CityId;
  collegeId: string | null;
  round: CapRound;
  seatType: SeatType;
  onRoundChange: (r: CapRound) => void;
  onClose: () => void;
}

export default function CollegeCard({
  cityId,
  collegeId,
  round,
  seatType,
  onRoundChange,
  onClose,
}: CollegeCardProps) {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const city = getCity(cityId);
  const college = collegeId
    ? city.colleges.find((c) => c.id === collegeId)
    : undefined;

  if (!college) return null;

  const meta = TYPE_META[instituteType(college)];
  const dist = hubDistanceKm(city, college);
  const nearestRail = nearestPoint(college, city.railways);
  const nearestBus = nearestPoint(college, city.busStops);
  const railDist =
    nearestRail && college.position
      ? haversineKm(college.position, nearestRail.position)
      : null;
  const busDist =
    nearestBus && college.position
      ? haversineKm(college.position, nearestBus.position)
      : null;

  // Courses with a published Open-category line for the selected round come
  // first; the rest are still listed, marked as not published.
  const courses = [...college.courses].sort((a, b) => {
    const ca = courseCutoff(a, round, seatType);
    const cb = courseCutoff(b, round, seatType);
    if (ca === null && cb === null) return a.name.localeCompare(b.name);
    if (ca === null) return 1;
    if (cb === null) return -1;
    return cb - ca;
  });
  const visibleCourses = showAllCourses ? courses : courses.slice(0, 6);

  return (
    <div
      className={cn(
        "chm-card-in pointer-events-auto absolute z-[600] bottom-4 right-4 left-4 sm:left-auto sm:w-[390px]",
        "rounded-2xl bg-card text-card-foreground shadow-2xl border border-border overflow-hidden"
      )}
      role="dialog"
      aria-label={`${college.name} details`}
    >
      {/* Institute-type banner */}
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
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 text-white">
            <GraduationCap className="h-4 w-4" />
          </span>
          <Badge
            className="font-bold border-0 text-[10px] text-white shadow-xs"
            style={{ backgroundColor: TIER_META[college.tier].color }}
          >
            {TIER_META[college.tier].label}
          </Badge>
          <Badge className="bg-white/25 text-white border-0 hover:bg-white/25 text-[10px]">
            {meta.label}
          </Badge>
          {college.instituteCode && (
            <span className="ml-auto mr-9 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Building2 className="h-3 w-3" />
              DTE {college.instituteCode}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-base sm:text-lg leading-tight pr-8">
          {college.name}
        </h3>
        <p className="text-white/80 text-xs mt-0.5">
          {college.shortName} · {city.name}
        </p>
      </div>

      {/* Body */}
      <div className="chm-scroll max-h-[62vh] overflow-y-auto px-4 py-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {summaryLine(college)}
        </p>
        {college.address && (
          <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
            {college.address}
          </p>
        )}

        {/* Placements Section */}
        {college.placement && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                  Placements (2024–25)
                </span>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                {TIER_META[college.tier].label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="rounded-lg bg-card/90 border border-border/60 p-2 text-center shadow-xs">
                <span className="text-[10px] uppercase text-muted-foreground block font-medium">Avg Package</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPackage(college.placement.avgPackage)}
                </span>
              </div>
              <div className="rounded-lg bg-card/90 border border-border/60 p-2 text-center shadow-xs">
                <span className="text-[10px] uppercase text-muted-foreground block font-medium">Highest Package</span>
                <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                  {formatPackage(college.placement.highestPackage)}
                </span>
              </div>
            </div>
            {college.placement.topRecruiters?.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Top Recruiters
                </span>
                <div className="flex flex-wrap gap-1">
                  {college.placement.topRecruiters.map((r) => (
                    <span
                      key={r}
                      className="rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground/90 border border-border/50"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fee Structure Section */}
        {college.feeStructure && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 p-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">
                  Fee Structure
                </span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full">
                {college.feeStructure.feeType}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-card/90 border border-border/60 p-2 shadow-xs">
                <span className="text-[10px] uppercase text-muted-foreground block font-medium">Annual College Fee</span>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {formatCurrencyLakhs(college.feeStructure.totalAnnualFee)} <span className="text-[10px] text-muted-foreground font-normal">/ yr</span>
                </span>
                <span className="text-[9px] text-muted-foreground block">
                  (₹{college.feeStructure.totalAnnualFee.toLocaleString("en-IN")})
                </span>
              </div>
              <div className="rounded-lg bg-card/90 border border-border/60 p-2 shadow-xs">
                <span className="text-[10px] uppercase text-muted-foreground block font-medium">4-Year Total (Est.)</span>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {formatCurrencyLakhs(college.feeStructure.totalAnnualFee * 4)}
                </span>
                <span className="text-[9px] text-muted-foreground block">Tuition & development</span>
              </div>
            </div>
            <p className="mt-1.5 text-[9px] text-muted-foreground leading-tight">
              * Open/General category annual tuition & college fees. Reserved categories (OBC/EBC/SC/ST/TFWS) receive government fee concessions.
            </p>
          </div>
        )}

        {college.capParticipant ? (
          <>
            {/* Round switch */}
            <div className="rounded-xl border border-border p-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  CAP closing percentile · {SEAT_TYPE_LABELS[seatType]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {CAP_ROUNDS.map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoundChange(r)}
                    aria-pressed={round === r}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                      round === r
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground"
                    )}
                    suppressHydrationWarning
                  >
                    {CAP_ROUND_LABELS[r]}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                {visibleCourses.map((course) => {
                  const cut = courseCutoff(course, round, seatType);
                  const elsewhere = availableSeatTypes(course, round).filter(
                    (s) => s !== seatType
                  );
                  return (
                    <div
                      key={course.choiceCode}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1 text-[11px]",
                        cut !== null ? "bg-muted/40" : "opacity-60"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-muted-foreground">
                        {course.name}
                        {course.intake ? (
                          <span className="ml-1 text-[10px] opacity-70">
                            · {course.intake} seats
                          </span>
                        ) : null}
                      </span>
                      {cut !== null ? (
                        <span className="font-semibold tabular-nums text-card-foreground">
                          {cut.toFixed(4)}
                        </span>
                      ) : (
                        <span
                          className="text-[10px] text-muted-foreground"
                          title={
                            elsewhere.length
                              ? `Published for: ${elsewhere
                                  .map((s) => SEAT_TYPE_LABELS[s])
                                  .join(", ")}`
                              : "No Open-category allotment published for this round"
                          }
                        >
                          {elsewhere.length
                            ? SEAT_TYPE_LABELS[elsewhere[0]]
                            : "not published"}
                        </span>
                      )}
                    </div>
                  );
                })}
                {courses.length === 0 && (
                  <p className="px-1 text-[11px] text-muted-foreground">
                    No courses listed for this institute in the official CAP
                    seat matrix.
                  </p>
                )}
              </div>

              {courses.length > 6 && (
                <button
                  onClick={() => setShowAllCourses((v) => !v)}
                  className="mt-1.5 w-full rounded-md py-1 text-[10px] font-semibold text-teal-700 hover:bg-muted/40 dark:text-teal-400"
                  suppressHydrationWarning
                >
                  {showAllCourses
                    ? "Show fewer courses"
                    : `Show all ${courses.length} courses`}
                </button>
              )}

              <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-snug text-muted-foreground">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Open-category (GOPEN / LOPEN) closing percentile from the
                official {CAP_ROUND_LABELS[round]} cut-off list, A.Y.{" "}
                {PROVENANCE.capYear}. &ldquo;Not published&rdquo; means no
                Open-category candidate was allotted that seat pool in this
                round — it is not a zero.
              </p>
            </div>

            {/* Official record links */}
            <div className="rounded-xl border border-border p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Official sources
                </span>
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                <SourceLink
                  href={college.sourceUrl!}
                  label="DTE institute record (address, status, intake)"
                />
                <SourceLink
                  href={PROVENANCE.capCutoffPdfs[round]}
                  label={`${CAP_ROUND_LABELS[round]} cut-off list (PDF)`}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                No official CAP cutoff
              </span>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {college.admissionNote} Check the institute&apos;s own website for
              its current admission process and cutoffs.
            </p>
          </div>
        )}

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2">
          <Stat
            icon={<Ruler className="h-3.5 w-3.5" />}
            label={`From ${city.hub.name}`}
            value={dist !== null ? `${dist.toFixed(1)} km` : "—"}
            tint={meta.color}
          />
          <Stat
            icon={<Users className="h-3.5 w-3.5" />}
            label="Sanctioned Intake"
            value={college.totalIntake ? `${college.totalIntake}` : "—"}
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

        {/* Coordinate provenance */}
        <p className="flex items-start gap-1.5 text-[10px] leading-snug text-muted-foreground">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
          {college.positionSource === "osm" && college.geo ? (
            <>
              Campus location from{" "}
              <a
                className="underline underline-offset-2"
                href={`https://www.openstreetmap.org/${college.geo.osm}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenStreetMap
              </a>{" "}
              ({college.geo.matched}). Straight-line distances.
            </>
          ) : (
            <>
              Campus not found in OpenStreetMap — this pin is approximate and
              distances from it are indicative only.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            <a href={college.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Official Website
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!college.position}
            className="flex-1 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800"
            onClick={() => {
              if (!college.position) return;
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

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-teal-700 hover:underline dark:text-teal-400"
    >
      <ExternalLink className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </a>
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
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate">
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
