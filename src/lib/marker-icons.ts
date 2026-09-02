// SVG-based marker HTML snippets used to build Leaflet divIcons.
// Inline SVG keeps markers crisp, themeable, and free of external image deps.

import { TYPE_META, type InstituteType } from "./college-data";

const wrap = (inner: string, bg: string, size = 28) =>
  `<div class="chm-pin" style="width:${size}px;height:${size}px;background:${bg};">${inner}</div>`;

const svg = (path: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

export function collegeIcon(type: InstituteType, size = 28): string {
  const c = TYPE_META[type].color;
  // graduation-cap path
  const cap =
    '<path d="M22 10L12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/>';
  return wrap(svg(cap), c, size);
}

export function railwayIcon(size = 26): string {
  const bg = "#8b5cf6"; // violet
  const body =
    '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14"/><circle cx="8.5" cy="14.5" r="1"/><circle cx="15.5" cy="14.5" r="1"/><path d="M8 17l-2 3M16 17l2 3"/>';
  return wrap(svg(body), bg, size);
}

export function busIcon(size = 26): string {
  const bg = "#eab308"; // yellow — distinct from the orange affiliated pin
  const body =
    '<rect x="4" y="4" width="16" height="13" rx="3"/><path d="M4 11h16"/><path d="M7 17v2M17 17v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>';
  return wrap(svg(body), bg, size);
}

export function landmarkIcon(size = 26): string {
  const bg = "#ec4899"; // pink
  const body =
    '<path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 15.5 7.1 17.7l.9-5.5-4-3.9 5.5-.8z"/>';
  return wrap(svg(body), bg, size);
}

export function hubIcon(): string {
  const star =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  return `<div class="chm-hub-wrap">
    <span class="chm-pulse"></span>
    <span class="chm-pulse delay"></span>
    <div class="chm-hub-core">${star}</div>
  </div>`;
}
