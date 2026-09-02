// Campus Compass dataset — every field here comes from an official source.
//
// The data itself lives in `colleges.generated.json`, produced by the scripts in
// /scripts from:
//   * institute facts (name, code, address, status, autonomy, affiliating
//     university, course-wise intake) — the State CET Cell CAP portal's own
//     institute pages, https://fe2026.mahacet.org
//   * MHT-CET CAP Round I / II / III closing percentiles — the official
//     "Cut Off List for Maharashtra & Minority Seats" PDFs published on the same
//     portal for A.Y. 2026-27
//   * campus coordinates — OpenStreetMap (© OpenStreetMap contributors, ODbL)
//
// Nothing is estimated, interpolated, or typed in by hand. Where an official
// source publishes no value — a branch that took no Open-category candidate in a
// round, an institute outside the CAP — the value is absent and the UI says so
// rather than showing a number.
//
// To refresh: `python scripts/build_dataset.py <work-dir>`

import raw from "./colleges.generated.json";

export type CityId = "pune" | "mumbai" | "nagpur" | "amravati";
export type Branch = "CSE" | "IT" | "E&TC" | "Mech" | "Civil";
export type BranchFilter = Branch | "All";

/** CAP rounds published for the current admission year. */
export type CapRound = "1" | "2" | "3";
export const CAP_ROUNDS: CapRound[] = ["1", "2", "3"];
export const CAP_ROUND_LABELS: Record<CapRound, string> = {
  "1": "Round I",
  "2": "Round II",
  "3": "Round III",
};

/**
 * Which seat pool a cutoff belongs to. DTE publishes separate closing lines for
 * candidates from the institute's own university region and for everyone else;
 * autonomous institutes publish a single state-level line instead.
 */
export type SeatType = "home" | "other" | "state";
export const SEAT_TYPES: SeatType[] = ["home", "other", "state"];
export const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  home: "Home University",
  other: "Other than Home Univ.",
  state: "State Level",
};
/** The Open-category bucket to read for each seat pool. G = general, L = ladies. */
const OPEN_KEY: Record<SeatType, string[]> = {
  home: ["GOPENH", "LOPENH"],
  other: ["GOPENO", "LOPENO"],
  state: ["GOPENS", "LOPENS"],
};

/**
 * Institute type, derived only from the official Status / Autonomy fields —
 * it is a description of what the institute *is*, not a ranking.
 */
export type InstituteType = "government" | "autonomous" | "affiliated" | "non-cap";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Course {
  choiceCode: string;
  name: string;
  branch: Branch | null;
  intake: number | null;
  accreditation: string | null;
  /** round -> seat pool -> category -> closing percentile */
  cutoffs: Partial<Record<CapRound, Record<string, Record<string, number>>>>;
}

export interface College {
  id: string;
  cityId: CityId;
  name: string;
  shortName: string;
  website: string;
  position: LatLng | null;
  positionSource: "osm" | "approximate" | null;
  geo: { osm: string; matched: string; query: string } | null;
  capParticipant: boolean;
  courses: Course[];
  /** Present only for CAP-participating institutes. */
  instituteCode?: string;
  address?: string;
  district?: string;
  status?: string;
  autonomy?: string;
  minority?: string;
  university?: string;
  totalIntake?: number;
  sourceUrl?: string;
  /** Present only for institutes outside the CAP. */
  admissionNote?: string;
}

export interface MapPoint {
  id: string;
  name: string;
  query: string;
  position: LatLng;
  osm: string;
}

export interface CityData {
  id: CityId;
  name: string;
  state: string;
  hub: MapPoint;
  railways: MapPoint[];
  busStops: MapPoint[];
  landmarks: MapPoint[];
  colleges: College[];
}

export const BRANCHES: Branch[] = ["CSE", "IT", "E&TC", "Mech", "Civil"];

export const BRANCH_LABELS: Record<Branch, string> = {
  CSE: "Computer Engg. (CSE)",
  IT: "Information Tech. (IT)",
  "E&TC": "Electronics & Telecom (E&TC)",
  Mech: "Mechanical Engg.",
  Civil: "Civil Engg.",
};

// ---------------------------------------------------------------------------
// Dataset + provenance
// ---------------------------------------------------------------------------

const dataset = raw as unknown as {
  generatedOn: string;
  capYear: string;
  sources: {
    capPortal: string;
    capCutoffPdfs: Record<CapRound, string>;
    instituteSummary: string;
    instituteList: string;
    coordinates: string;
  };
  cities: Record<CityId, CityData>;
};

export const CITIES: Record<CityId, CityData> = dataset.cities;
export const CITY_LIST: CityData[] = Object.values(CITIES);
export const DEFAULT_CITY: CityId = "pune";

/** Everything the UI needs to credit its sources. */
export const PROVENANCE = {
  generatedOn: dataset.generatedOn,
  capYear: dataset.capYear,
  ...dataset.sources,
};

export const TOTAL_COLLEGES = CITY_LIST.reduce((n, c) => n + c.colleges.length, 0);

export function getCity(id: CityId): CityData {
  return CITIES[id];
}

export function getAllTransit(city: CityData): MapPoint[] {
  return [...city.railways, ...city.busStops];
}

export function findCollegeGlobal(
  id: string
): { college: College; city: CityData } | null {
  for (const city of CITY_LIST) {
    const c = city.colleges.find((x) => x.id === id);
    if (c) return { college: c, city };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Cutoff lookup
// ---------------------------------------------------------------------------

/**
 * Closing Open-category percentile for one course, or null when DTE published
 * no Open-category line for that round and seat pool.
 */
export function courseCutoff(
  course: Course,
  round: CapRound,
  seatType: SeatType
): number | null {
  const pool = course.cutoffs[round]?.[seatType];
  if (!pool) return null;
  for (const key of OPEN_KEY[seatType]) {
    if (pool[key] !== undefined) return pool[key];
  }
  return null;
}

/** Seat pools this course actually has a published Open line for, in this round. */
export function availableSeatTypes(course: Course, round: CapRound): SeatType[] {
  return SEAT_TYPES.filter((s) => courseCutoff(course, round, s) !== null);
}

/**
 * Best (lowest) closing percentile across the courses mapped to `branch`.
 * A college can offer the same branch under two choice codes; the lowest line is
 * the one that decides whether an applicant gets in.
 */
export function branchCutoff(
  college: College,
  branch: Branch,
  round: CapRound,
  seatType: SeatType
): number | null {
  let best: number | null = null;
  for (const course of college.courses) {
    if (course.branch !== branch) continue;
    const cut = courseCutoff(course, round, seatType);
    if (cut !== null && (best === null || cut < best)) best = cut;
  }
  return best;
}

/** Branches for which this college has a published cutoff in this round/pool. */
export function offeredBranches(
  college: College,
  round: CapRound,
  seatType: SeatType
): Branch[] {
  return BRANCHES.filter((b) => branchCutoff(college, b, round, seatType) !== null);
}

/**
 * Eligibility filter. Institutes outside the CAP have no official cutoff, so
 * they are never filtered *out* by percentile — hiding them would imply a
 * cutoff we do not have.
 */
export function branchEligible(
  c: College,
  branch: BranchFilter,
  percentile: number,
  round: CapRound,
  seatType: SeatType
): boolean {
  if (!c.capParticipant) return true;
  if (branch === "All") {
    const offered = offeredBranches(c, round, seatType);
    if (offered.length === 0) return true; // nothing published for this round
    return offered.some(
      (b) => (branchCutoff(c, b, round, seatType) as number) <= percentile
    );
  }
  const cut = branchCutoff(c, branch, round, seatType);
  return cut !== null && cut <= percentile;
}

// ---------------------------------------------------------------------------
// Geo helpers
// ---------------------------------------------------------------------------

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Straight-line km from the city hub, or null when the campus has no coordinate. */
export function hubDistanceKm(city: CityData, college: College): number | null {
  return college.position ? haversineKm(city.hub.position, college.position) : null;
}

export function nearestPoint(college: College, points: MapPoint[]): MapPoint | null {
  if (points.length === 0 || !college.position) return null;
  const at = college.position;
  return points.reduce((best, p) =>
    haversineKm(at, p.position) < haversineKm(at, best.position) ? p : best
  );
}

// ---------------------------------------------------------------------------
// Institute type — read straight off the official Status / Autonomy fields
// ---------------------------------------------------------------------------

export function instituteType(c: College): InstituteType {
  if (!c.capParticipant) return "non-cap";
  const status = c.status ?? "";
  if (/Government|University/i.test(status)) return "government";
  return /Autonomous/i.test(c.autonomy ?? "") ? "autonomous" : "affiliated";
}

export const TYPE_META: Record<
  InstituteType,
  { label: string; desc: string; color: string; ring: string; soft: string; text: string }
> = {
  government: {
    label: "Government / University",
    desc: "Government, government-aided or university department",
    color: "#10b981",
    ring: "#059669",
    soft: "#d1fae5",
    text: "#065f46",
  },
  autonomous: {
    label: "Autonomous (Un-Aided)",
    desc: "Private un-aided institute with autonomous status",
    color: "#3b82f6",
    ring: "#2563eb",
    soft: "#dbeafe",
    text: "#1e40af",
  },
  affiliated: {
    label: "Affiliated (Un-Aided)",
    desc: "Private un-aided institute affiliated to its university",
    color: "#f97316",
    ring: "#ea580c",
    soft: "#ffedd5",
    text: "#9a3412",
  },
  "non-cap": {
    label: "Outside CAP",
    desc: "Admits outside the DTE CAP — no official CAP cutoff exists",
    color: "#8b5cf6",
    ring: "#7c3aed",
    soft: "#ede9fe",
    text: "#5b21b6",
  },
};

export const INSTITUTE_TYPES: InstituteType[] = [
  "government",
  "autonomous",
  "affiliated",
  "non-cap",
];

/** One-line factual summary built only from official fields. */
export function summaryLine(c: College): string {
  if (!c.capParticipant) return c.admissionNote ?? "";
  const bits = [c.status, c.autonomy, c.minority].filter(
    (b): b is string => Boolean(b) && b !== "Non-Minority"
  );
  const seats = c.totalIntake ? `${c.totalIntake} sanctioned seats` : null;
  return [bits.join(" · "), c.university, seats].filter(Boolean).join(" · ");
}

// ---------------------------------------------------------------------------
// Filtering — one definition, used by the map, the sidebar and the header count
// ---------------------------------------------------------------------------

export interface Filters {
  types: InstituteType[];
  maxDistance: number;
  branch: BranchFilter;
  percentile: number;
  round: CapRound;
  seatType: SeatType;
  showTransit: boolean;
  showLandmarks: boolean;
  showThreads: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  types: [...INSTITUTE_TYPES],
  maxDistance: 50,
  branch: "All",
  percentile: 99.9,
  round: "1",
  seatType: "state",
  showTransit: true,
  showLandmarks: true,
  showThreads: true,
};

export function matchesFilters(city: CityData, c: College, f: Filters): boolean {
  if (!f.types.includes(instituteType(c))) return false;
  const dist = hubDistanceKm(city, c);
  // A campus with no coordinate cannot be distance-filtered; keep it visible in
  // the list rather than silently dropping a real college.
  if (dist !== null && dist > f.maxDistance) return false;
  return branchEligible(c, f.branch, f.percentile, f.round, f.seatType);
}

/** Colleges passing the filters, nearest to the hub first. */
export function visibleColleges(city: CityData, f: Filters): College[] {
  return city.colleges
    .filter((c) => matchesFilters(city, c, f))
    .sort(
      (a, b) =>
        (hubDistanceKm(city, a) ?? Infinity) - (hubDistanceKm(city, b) ?? Infinity)
    );
}
