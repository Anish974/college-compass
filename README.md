# 🧭 Campus Compass: Maharashtra Engineering College Dashboard

> **An interactive, geo-intelligent visualization and cutoff analytics dashboard helping engineering aspirants search, filter, and discover 56+ colleges across Maharashtra's major education hubs (Pune, Mumbai, Nagpur, and Amravati).**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-19.4-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🎯 Overview & Problem Solved

During the MHT-CET CAP counseling rounds in Maharashtra, students and parents face a daunting challenge: cross-referencing massive 100+ page PDF cutoff lists with real campus locations, travel times, and placement data.

**Campus Compass** bridges the gap between **spatial intelligence** and **academic analytics**:
- 📍 **Geographic Context**: View exact college coordinates on dynamic maps with real-time radial distance rings from central city landmarks.
- 🎯 **Percentile Matcher**: Enter your MHT-CET score and branch of choice to instantly see where you qualify based on official 2025 CAP Round-1 cutoffs.
- 💼 **Placement & Tier Analytics**: Compare average & highest salary packages (LPA), top recruiters, and institute tiers (Tier 1 / Tier 2 / Tier 3).
- 🚆 **Transit & Commute Insights**: Real-time calculated distances to nearest railway stations, bus stands, and key hubs.

---

## 🌟 Key Features

* 🗺️ **Interactive Leaflet Map**:
  * **Light Mode**: Clean OpenStreetMap tiles.
  * **Dark & Blue Modes**: Sleek CartoDB Dark Matter tiles with neon hub glows and matching node pins.
  * **Interactive Radius Circles**: Dynamic influence-radius circle representing the active distance filter.
* 📍 **Multi-City Hub Visualization**:
  * **Pune**: Shaniwar Wada
  * **Mumbai**: Dadar
  * **Nagpur**: Sitabuldi
  * **Amravati**: Rajkamal Square
  * *Displays dashed connecting threads from the hub to colleges with real-time hover distance calculations.*
* 🔍 **Cross-City Global Search**: Search instantly by college name or official DTE (Directorate of Technical Education) institute codes. Selecting a result automatically switches the city view and highlights the campus.
* ⚡ **Advanced Multi-Criteria Filtering**:
  * **Branch Cutoffs & Percentile Eligibility**: Filter across major branches (CSE, IT, E&TC, Mechanical, Civil) to show colleges where closing cutoff $\le$ your percentile.
  * **Placements & Packages**: Filter by minimum average placement package (LPA).
  * **Distance**: Filter colleges within a 1km to 50km+ radius from the city's central hub.
  * **Layer Toggles**: Show/hide connecting threads, transit points (railways, bus stands), and local landmarks.
* 💳 **Detailed Info Cards**: Displays DTE code, established year, complete 5-branch cutoff grid, average & highest packages, top recruiters, and transit distances.
* 🌗 **Adaptive Theming**: Powered by `next-themes` with custom CSS micro-animations and custom color palettes (Light / Dark / Blue).

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across data models & spatial calculations)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
* **Mapping**: [Leaflet 1.9](https://leafletjs.com/) (Client-side dynamic rendering to prevent SSR hydration mismatches)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) primitives
* **Database ORM**: [Prisma](https://www.prisma.io/) (SQL database ready)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) (recommended) or [Node.js 18+](https://nodejs.org/) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anish974/college-compass.git
   cd college-compass
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Run the development server**:
   ```bash
   bun dev
   # or
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 📂 Project Structure

```
college-compass/
├── prisma/               # Prisma database schema & configuration
├── public/               # Static assets & map marker icons
├── src/
│   ├── app/              # Next.js App Router (layout, page, theme providers)
│   ├── components/       # Reusable UI components
│   │   ├── college-card.tsx    # Campus detailed profile drawer
│   │   ├── map-view.tsx        # Leaflet dynamic map layer & controls
│   │   ├── sidebar.tsx         # Multi-criteria filtering controls & search
│   │   └── theme-controller.tsx# Theme switcher (Light / Dark / Blue)
│   └── lib/
│       ├── college-data.ts     # Curated dataset (56 colleges, cutoffs, coords)
│       └── marker-icons.ts     # Custom SVG map pin generators
├── tailwind.config.ts    # Tailwind CSS v4 styling tokens
└── package.json          # Project metadata and dependencies
```

---

## 📊 Data Source & Methodology

All college geographic coordinates (latitude/longitude), DTE institute codes, MHT-CET 2025 CAP Round-1 closing percentiles, and placement statistics (2024–2025) are compiled from official Maharashtra State CET Cell CAP publications and verified institutional disclosures.  
*(Note: VNIT Nagpur admissions are conducted via JEE Main / JoSAA / CSAB and are cataloged accordingly in the interface.)*

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
