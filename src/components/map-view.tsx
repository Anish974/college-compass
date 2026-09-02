"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CITIES,
  getCity,
  getAllTransit,
  hubDistanceKm,
  instituteType,
  visibleColleges,
  TYPE_META,
  TIER_META,
  formatCurrencyLakhs,
  type CityId,
  type CityData,
  type Filters,
} from "@/lib/college-data";
import {
  collegeIcon,
  railwayIcon,
  busIcon,
  landmarkIcon,
  hubIcon,
} from "@/lib/marker-icons";

export type { Filters } from "@/lib/college-data";

interface MapViewProps {
  cityId: CityId;
  filters: Filters;
  mapTheme: "light" | "dark" | "blue";
  onSelectCollege: (id: string) => void;
  focusCollegeId?: string | null;
  focusNonce?: number;
  cityCenterNonce?: number;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const LIGHT_TILES = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const DARK_TILES = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const BLUE_TILES = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
  : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export default function MapView({
  cityId,
  filters,
  mapTheme,
  onSelectCollege,
  focusCollegeId,
  focusNonce,
  cityCenterNonce,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const hubMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const collegeLayerRef = useRef<L.LayerGroup | null>(null);
  const threadLayerRef = useRef<L.LayerGroup | null>(null);
  const transitLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarkLayerRef = useRef<L.LayerGroup | null>(null);

  const handlersRef = useRef({ onSelectCollege });
  handlersRef.current = { onSelectCollege };

  const firstCenterRef = useRef(true);
  const firstFocusRef = useRef(true);

  // --- init map once ---
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const city = getCity(cityId);

    const map = L.map(containerRef.current, {
      center: [city.hub.position.lat, city.hub.position.lng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: false,
    });
    mapRef.current = map;

    let url = LIGHT_TILES;
    let className: string | undefined = undefined;
    if (mapTheme === "dark") {
      url = DARK_TILES;
      if (!MAPBOX_TOKEN) className = "chm-dark-tiles";
    } else if (mapTheme === "blue") {
      url = BLUE_TILES;
      if (!MAPBOX_TOKEN) className = "chm-blue-tiles";
    }

    const attr = MAPBOX_TOKEN
      ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 19,
      attribution: attr,
      subdomains: "abcd",
      className,
    }).addTo(map);

    radiusCircleRef.current = L.circle(
      [city.hub.position.lat, city.hub.position.lng],
      {
        radius: filters.maxDistance * 1000,
        color: "#14b8a6",
        weight: 1,
        fillColor: "#14b8a6",
        fillOpacity: 0.08,
        className: "chm-hub-radius",
      }
    ).addTo(map);

    hubMarkerRef.current = L.marker(
      [city.hub.position.lat, city.hub.position.lng],
      {
        icon: L.divIcon({
          className: "chm-hub-divicon",
          html: hubIcon(),
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
        zIndexOffset: 1000,
      }
    ).addTo(map);

    bindHub(hubMarkerRef.current, city);

    collegeLayerRef.current = L.layerGroup().addTo(map);
    threadLayerRef.current = L.layerGroup().addTo(map);
    transitLayerRef.current = L.layerGroup().addTo(map);
    landmarkLayerRef.current = L.layerGroup().addTo(map);

    const all = [
      city.hub.position,
      ...city.colleges.map((c) => c.position),
      ...getAllTransit(city).map((t) => t.position),
      ...city.landmarks.map((l) => l.position),
    ].filter((p): p is NonNullable<typeof p> => p !== null);
    const bounds = L.latLngBounds(
      all.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // --- swap tile layer when theme changes ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let url = LIGHT_TILES;
    let className: string | undefined = undefined;
    if (mapTheme === "dark") {
      url = DARK_TILES;
      if (!MAPBOX_TOKEN) className = "chm-dark-tiles";
    } else if (mapTheme === "blue") {
      url = BLUE_TILES;
      if (!MAPBOX_TOKEN) className = "chm-blue-tiles";
    }

    const attr = MAPBOX_TOKEN
      ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 19,
      attribution: attr,
      subdomains: "abcd",
      className,
    }).addTo(map);
    tileLayerRef.current.bringToBack();
  }, [mapTheme]);

  // --- rebuild layers when city or filters change ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const city = getCity(cityId);
    const f = filters;

    if (hubMarkerRef.current) {
      hubMarkerRef.current.setLatLng([
        city.hub.position.lat,
        city.hub.position.lng,
      ]);
      bindHub(hubMarkerRef.current, city);
    }
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([
        city.hub.position.lat,
        city.hub.position.lng,
      ]);
      radiusCircleRef.current.setRadius(f.maxDistance * 1000);
    }

    // Only colleges with a coordinate can be drawn; the sidebar still lists the
    // rest so a real college never silently disappears.
    const shown = visibleColleges(city, f).filter((c) => c.position);

    // ---- Colleges ----
    const clgLayer = collegeLayerRef.current!;
    clgLayer.clearLayers();
    shown.forEach((c) => {
      const type = instituteType(c);
      const meta = TYPE_META[type];
      const dist = hubDistanceKm(city, c);
      const at = c.position!;
      const code = c.instituteCode ? `Code ${c.instituteCode} · ` : "";
      const approx =
        c.positionSource === "approximate" ? " · approx. location" : "";
      const marker = L.marker([at.lat, at.lng], {
        icon: L.divIcon({
          className: "chm-college-divicon",
          html: collegeIcon(type, c.tier),
          iconSize: [28, 28],
          iconAnchor: [14, 30],
        }),
        zIndexOffset: 500,
      });
      const tierMeta = TIER_META[c.tier];
      const pkg = c.placement?.avgPackage ? `${c.placement.avgPackage} LPA avg` : "";
      const fee = c.feeStructure?.totalAnnualFee ? `${formatCurrencyLakhs(c.feeStructure.totalAnnualFee)}/yr` : "";
      const highlight = [pkg, fee].filter(Boolean).join(" · ");
      marker.bindTooltip(
        `<strong>${c.name}</strong><br/><span style="color:${tierMeta.color};font-weight:700;">${tierMeta.label}</span> · <span style="opacity:.85">${code}${
          meta.label
        }</span>${highlight ? `<br/><span style="color:#0ea5e9;font-weight:600;">${highlight}</span>` : ""}<br/><span style="opacity:.75;">${dist !== null ? `${dist.toFixed(1)} km from hub` : "distance n/a"}${approx}</span>`,
        { direction: "top", offset: [0, -28], className: "chm-thread-tooltip" }
      );
      marker.on("click", () => {
        handlersRef.current.onSelectCollege(c.id);
      });
      clgLayer.addLayer(marker);
    });

    // ---- Threads (hub -> college) ----
    const threadLayer = threadLayerRef.current!;
    threadLayer.clearLayers();
    if (f.showThreads) {
      shown.forEach((c) => {
        const meta = TYPE_META[instituteType(c)];
        const dist = hubDistanceKm(city, c);
        const at = c.position!;
        const line = L.polyline(
          [
            [city.hub.position.lat, city.hub.position.lng],
            [at.lat, at.lng],
          ],
          {
            color: meta.color,
            weight: 2,
            opacity: 0.55,
            dashArray: "6 7",
            className: "chm-thread",
          }
        );
        line.bindTooltip(
          `<strong>${c.shortName}</strong> · ${
            dist !== null ? `${dist.toFixed(1)} km` : "—"
          }`,
          { sticky: true, className: "chm-thread-tooltip", direction: "top" }
        );
        line.on("mouseover", () => line.setStyle({ weight: 4, opacity: 1 }));
        line.on("mouseout", () => line.setStyle({ weight: 2, opacity: 0.55 }));
        threadLayer.addLayer(line);
      });
    }

    // ---- Transit ----
    const transitLayer = transitLayerRef.current!;
    transitLayer.clearLayers();
    if (f.showTransit) {
      const railIds = new Set(city.railways.map((r) => r.id));
      getAllTransit(city).forEach((t) => {
        const isRail = railIds.has(t.id);
        const html = isRail ? railwayIcon() : busIcon();
        const marker = L.marker([t.position.lat, t.position.lng], {
          icon: L.divIcon({
            className: "chm-transit-divicon",
            html,
            iconSize: [26, 26],
            iconAnchor: [13, 27],
          }),
          zIndexOffset: 300,
        });
        marker.bindTooltip(
          `<strong>${t.name}</strong><br/><span style="opacity:.85">${
            isRail ? "Railway Station" : "Bus Stop"
          }</span>`,
          {
            direction: "top",
            offset: [0, -26],
            className: "chm-thread-tooltip",
          }
        );
        marker.bindPopup(
          `<div style="min-width:170px">
            <div style="font-weight:700;font-size:13px">${t.name}</div>
            <div style="margin-top:3px;color:#64748b;font-size:12px">${
              isRail ? "Railway station" : "Bus stand"
            } · <a href="https://www.openstreetmap.org/${
              t.osm
            }" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></div>
          </div>`
        );
        transitLayer.addLayer(marker);
      });
    }

    // ---- Landmarks ----
    const lmLayer = landmarkLayerRef.current!;
    lmLayer.clearLayers();
    if (f.showLandmarks) {
      city.landmarks.forEach((l) => {
        const marker = L.marker([l.position.lat, l.position.lng], {
          icon: L.divIcon({
            className: "chm-landmark-divicon",
            html: landmarkIcon(),
            iconSize: [26, 26],
            iconAnchor: [13, 27],
          }),
          zIndexOffset: 300,
        });
        marker.bindTooltip(
          `<strong>${l.name}</strong><br/><span style="opacity:.85">Landmark</span>`,
          {
            direction: "top",
            offset: [0, -26],
            className: "chm-thread-tooltip",
          }
        );
        marker.bindPopup(
          `<div style="min-width:170px">
            <div style="font-weight:700;font-size:13px">${l.name}</div>
            <div style="margin-top:3px;color:#64748b;font-size:12px">Landmark · <a href="https://www.openstreetmap.org/${
              l.osm
            }" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></div>
          </div>`
        );
        lmLayer.addLayer(marker);
      });
    }
  }, [cityId, filters]);

  // --- fly to active city's center on dropdown change ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (firstCenterRef.current) {
      firstCenterRef.current = false;
      return;
    }
    const city = getCity(cityId);
    map.flyTo([city.hub.position.lat, city.hub.position.lng], 12, {
      duration: 0.9,
    });
  }, [cityCenterNonce]);

  // --- fly to selected college ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (firstFocusRef.current) {
      firstFocusRef.current = false;
      return;
    }
    if (!focusCollegeId) return;
    const found = findInCity(cityId, focusCollegeId) || findGlobal(focusCollegeId);
    if (!found) return;
    map.flyTo([found.lat, found.lng], 14, { duration: 0.9 });
  }, [focusNonce]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Interactive map of colleges around the city hub"
    />
  );
}

function bindHub(marker: L.Marker, city: CityData) {
  marker.unbindTooltip();
  marker.unbindPopup();
  marker.bindTooltip(
    `<strong>${city.hub.name}</strong><br/><span style="opacity:.8">Central City Hub · ${city.name}</span>`,
    { direction: "top", offset: [0, -14], className: "chm-thread-tooltip" }
  );
  marker.bindPopup(
    `<div style="min-width:190px">
      <div style="font-weight:700;font-size:14px;color:#0d9488">${city.hub.name}</div>
      <div style="margin-top:4px;color:#475569;font-size:12px">All distances on this map are measured from here. Location from <a href="https://www.openstreetmap.org/${city.hub.osm}" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>.</div>
    </div>`
  );
}

function findInCity(cityId: CityId, collegeId: string) {
  const c = getCity(cityId).colleges.find((x) => x.id === collegeId);
  return c?.position ?? null;
}
function findGlobal(collegeId: string) {
  for (const city of Object.values(CITIES)) {
    const c = city.colleges.find((x) => x.id === collegeId);
    if (c?.position) return c.position;
  }
  return null;
}
