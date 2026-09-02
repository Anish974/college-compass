// Maharashtra Engineering College Distance Mapping — comprehensive dataset.
// Colleges grouped by city (Pune, Mumbai, Nagpur, Amravati). Each entry carries
// real campus coordinates, DTE/MHT-CET institute codes, placement statistics and
// MHT-CET CAP Round-1 home-state Open-category closing percentiles per branch.
//
// DATA CURRENCY: cutoffs are MHT-CET 2025 CAP Round-1 (GOPENS/Open) closing
// percentiles and placements are the latest reported (2024–25) figures, sourced
// from public college/aggregator disclosures in mid-2026. Where an official
// per-branch CAP line item was not published for a given branch, that branch's
// percentile is interpolated from the college's reported band (core branches
// always close below the computing branches). VNIT (a JEE-Main/JoSAA NIT) and
// MPSTME/NMIMS (NMIMS-CET) do not admit through MHT-CET; their percentile values
// are indicative equivalents only. Institute codes are indicative DTE codes.
// Verify against the official DTE Maharashtra CAP cutoff PDFs for live use.

export type Tier = 1 | 2 | 3;
export type CityId = "pune" | "mumbai" | "nagpur" | "amravati";
export type Branch = "CSE" | "IT" | "E&TC" | "Mech" | "Civil";
export type BranchFilter = Branch | "All";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Hub {
  id: string;
  name: string;
  position: LatLng;
  description: string;
}

export interface Placement {
  avgPackage: number; // LPA
  highestPackage: number; // LPA
  topRecruiters: string[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  instituteCode: string; // DTE / MHT-CET code
  tier: Tier;
  position: LatLng;
  description: string;
  website: string;
  established: number;
  placement: Placement;
  cutoffs: Partial<Record<Branch, number>>; // Round-1 closing percentile
}

export interface Transit {
  id: string;
  name: string;
  type: "railway" | "bus";
  position: LatLng;
  description: string;
}

export interface Landmark {
  id: string;
  name: string;
  position: LatLng;
  description: string;
}

export interface CityData {
  id: CityId;
  name: string;
  state: string;
  hub: Hub;
  colleges: College[];
  railways: Transit[];
  busStops: Transit[];
  landmarks: Landmark[];
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
// CITY DATASETS
// ---------------------------------------------------------------------------

export const CITIES: Record<CityId, CityData> = {
  // =========================================================================
  // PUNE
  // =========================================================================
  pune: {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    hub: {
      id: "pune-hub",
      name: "Shaniwar Wada — Central Pune Hub",
      position: { lat: 18.5196, lng: 73.8553 },
      description:
        "Shaniwar Wada, the historic Peshwa seat in the heart of Pune, anchors the central market district from which all college distances are measured.",
    },
    colleges: [
      // ---- Tier 1 ----
      {
        id: "pune-coep",
        name: "COEP Technological University",
        shortName: "COEP",
        instituteCode: "6006",
        tier: 1,
        position: { lat: 18.5292, lng: 73.8565 },
        description: "Established in 1854, COEP Technological University is one of India's oldest engineering institutes and an autonomous institute of national importance.",
        website: "https://www.coep.org.in",
        established: 1854,
        placement: { avgPackage: 11.4, highestPackage: 50.5, topRecruiters: ["Microsoft", "Goldman Sachs", "Tata Motors", "Bajaj Auto", "Citi India"] },
        cutoffs: { CSE: 99.88, "E&TC": 99.45, Mech: 98.2, Civil: 95.9 },
      },
      {
        id: "pune-pict",
        name: "Pune Institute of Computer Technology",
        shortName: "PICT",
        instituteCode: "6271",
        tier: 1,
        position: { lat: 18.4575, lng: 73.8508 },
        description: "A top-ranked private engineering college at Dhankawadi renowned for computer & IT placements.",
        website: "https://pict.edu",
        established: 1983,
        placement: { avgPackage: 12.8, highestPackage: 46.2, topRecruiters: ["Bloomberg", "PhonePe", "Amazon", "Mastercard", "Rakuten"] },
        cutoffs: { CSE: 99.55, IT: 99.3, "E&TC": 98.4 },
      },
      {
        id: "pune-cummins",
        name: "MKSSS's Cummins College of Engineering for Women",
        shortName: "Cummins Pune",
        instituteCode: "6281",
        tier: 2,
        position: { lat: 18.4881, lng: 73.8164 },
        description: "A leading women-only engineering college at Karvenagar under MKSSS, known for strong IT & electronics placements.",
        website: "https://www.cumminscollege.org",
        established: 1991,
        placement: { avgPackage: 8.5, highestPackage: 44, topRecruiters: ["Citi", "Salesforce", "Deutsche Bank", "Boeing", "Microsoft"] },
        cutoffs: { CSE: 97.45, IT: 96.8, "E&TC": 94.2, Mech: 83.1 },
      },
      {
        id: "pune-vit",
        name: "Vishwakarma Institute of Technology",
        shortName: "VIT Pune",
        instituteCode: "6273",
        tier: 2,
        position: { lat: 18.4635, lng: 73.8682 },
        description: "An autonomous private engineering college at Bibwewadi affiliated to Savitribai Phule Pune University.",
        website: "https://www.vit.edu",
        established: 1983,
        placement: { avgPackage: 7.2, highestPackage: 41, topRecruiters: ["Nvidia", "Credit Suisse", "Siemens", "TCS Digital", "Mercedes-Benz"] },
        cutoffs: { CSE: 98.1, IT: 97.6, "E&TC": 95.8, Mech: 88.5, Civil: 80.2 },
      },
      {
        id: "pune-pccoe",
        name: "Pimpri Chinchwad College of Engineering",
        shortName: "PCCOE",
        instituteCode: "6208",
        tier: 2,
        position: { lat: 18.6548, lng: 73.7628 },
        description: "A well-established autonomous engineering college in the Pimpri-Chinchwad industrial belt at Nigdi.",
        website: "https://www.pccoepune.com",
        established: 1999,
        placement: { avgPackage: 6.8, highestPackage: 36, topRecruiters: ["Capgemini", "Cognizant", "KPIT", "Quantiphi", "Adobe"] },
        cutoffs: { CSE: 98.25, IT: 97.75, "E&TC": 95.4, Mech: 86.9, Civil: 78.1 },
      },
      // ---- Tier 2 ----
      {
        id: "pune-mitwpu",
        name: "MIT World Peace University",
        shortName: "MIT-WPU",
        instituteCode: "JEE/JoSAA",
        tier: 2,
        position: { lat: 18.5182, lng: 73.8152 },
        description: "A multi-disciplinary private university on Kothrud's educational stretch with strong industry linkages.",
        website: "https://mitwpu.edu.in",
        established: 1983,
        placement: { avgPackage: 6.5, highestPackage: 51.3, topRecruiters: ["IBM", "Barclays", "Infosys", "Deloitte", "Philips"] },
        cutoffs: { CSE: 93.5, IT: 91.8, "E&TC": 88.0, Mech: 76.5, Civil: 70.2 },
      },
      {
        id: "pune-viit",
        name: "Vishwakarma Institute of Information Technology",
        shortName: "VIIT",
        instituteCode: "6754",
        tier: 2,
        position: { lat: 18.4594, lng: 73.8967 },
        description: "An autonomous IT-focused engineering college at Kondhwa, Pune.",
        website: "https://www.viit.ac.in",
        established: 2002,
        placement: { avgPackage: 6.2, highestPackage: 32, topRecruiters: ["Cognizant", "Wipro", "EQ Technologies", "Capgemini", "LTI"] },
        cutoffs: { CSE: 96.9, IT: 96.2, "E&TC": 93.1, Mech: 80.5, Civil: 72.3 },
      },
      {
        id: "pune-aissms",
        name: "AISSMS College of Engineering",
        shortName: "AISSMS COE",
        instituteCode: "6278",
        tier: 3,
        position: { lat: 18.5317, lng: 73.867 },
        description: "A reputed private engineering college near the Pune RTO at Shivajinagar, established by AISSMS society.",
        website: "https://aissmscoe.com",
        established: 1992,
        placement: { avgPackage: 4.5, highestPackage: 18, topRecruiters: ["Godrej", "TCS", "Reliance", "L&T Infotech", "Forbes Marshall"] },
        cutoffs: { CSE: 92.1, "E&TC": 83.4, Mech: 65.2, Civil: 61.8 },
      },
      {
        id: "pune-dypatil",
        name: "D.Y. Patil College of Engineering, Akurdi",
        shortName: "DYPCOE",
        instituteCode: "6270",
        tier: 2,
        position: { lat: 18.6449, lng: 73.7621 },
        description: "A well-known autonomous engineering college at Akurdi in the D.Y. Patil educational campus.",
        website: "https://www.dypcoeakurdi.ac.in",
        established: 1984,
        placement: { avgPackage: 5.8, highestPackage: 28, topRecruiters: ["TCS", "Capgemini", "Virtusa", "Hexaware", "Birlasoft"] },
        cutoffs: { CSE: 95.8, IT: 94.9, "E&TC": 90.1, Mech: 74.3, Civil: 67.8 },
      },
      {
        id: "pune-mmcoe",
        name: "Marathwada Mitra Mandal's College of Engineering",
        shortName: "MMCOE",
        instituteCode: "6156",
        tier: 3,
        position: { lat: 18.4902, lng: 73.8124 },
        description: "A private engineering college at Karvenagar under the Marathwada Mitra Mandal society.",
        website: "https://www.mmcoe.edu.in",
        established: 2006,
        placement: { avgPackage: 4.8, highestPackage: 14.5, topRecruiters: ["Persistent", "Zensar", "Infosys", "Amazon", "Xoriant"] },
        cutoffs: { CSE: 91.8, IT: 90.1, "E&TC": 82.5, Mech: 60.1, Civil: 54.3 },
      },
      {
        id: "pune-jscoe",
        name: "JSPM's Jayawantrao Sawant College of Engineering",
        shortName: "JSCOE",
        instituteCode: "6145",
        tier: 3,
        position: { lat: 18.5147, lng: 73.9339 },
        description: "A JSPM-group engineering college on Handewadi Road, Hadapsar.",
        website: "https://www.jspm.edu.in",
        established: 2004,
        placement: { avgPackage: 4.0, highestPackage: 12, topRecruiters: ["TCS", "Wipro", "Capgemini", "Tech Mahindra", "Zensar"] },
        cutoffs: { CSE: 86.4, IT: 84.1, "E&TC": 73.8, Mech: 38.5, Civil: 32.4 },
      },
      // ---- Tier 3 ----
      {
        id: "pune-scoe",
        name: "Sinhgad College of Engineering",
        shortName: "SCOE",
        instituteCode: "6177",
        tier: 3,
        position: { lat: 18.4691, lng: 73.8362 },
        description: "An engineering college in the Sinhgad institutes campus at Vadgaon Budruk on Sinhgad Road.",
        website: "http://www.sinhgad.edu",
        established: 1996,
        placement: { avgPackage: 4.6, highestPackage: 19, topRecruiters: ["Cognizant", "Accenture", "TCS", "LTI", "Atlas Copco"] },
        cutoffs: { CSE: 89.9, IT: 88.2, "E&TC": 79.5, Mech: 51.4, Civil: 47.9 },
      },
      {
        id: "pune-zcoer",
        name: "Zeal College of Engineering & Research",
        shortName: "ZCOER",
        instituteCode: "6298",
        tier: 3,
        position: { lat: 18.4485, lng: 73.8242 },
        description: "A private engineering college at Narhe on the Sinhgad road educational belt.",
        website: "https://zealeducation.com",
        established: 2007,
        placement: { avgPackage: 3.8, highestPackage: 11, topRecruiters: ["Amazon", "Tech Mahindra", "Zensar", "Mphasis", "TCS"] },
        cutoffs: { CSE: 81.2, IT: 78.4, "E&TC": 66.1, Mech: 28.4, Civil: 24.5 },
      },
      {
        id: "pune-trinity",
        name: "Trinity College of Engineering & Research",
        shortName: "TCOER",
        instituteCode: "6634",
        tier: 3,
        position: { lat: 18.4357, lng: 73.8998 },
        description: "A KJ's Educational Institute engineering college at Pisoli, south Pune.",
        website: "https://www.kjei.edu.in/tcoer",
        established: 2008,
        placement: { avgPackage: 3.6, highestPackage: 10, topRecruiters: ["Infosys", "Amazon", "KPIT", "Sudarshan Chemicals", "TCS"] },
        cutoffs: { CSE: 78.1, IT: 74.2, "E&TC": 59.8, Mech: 21.0, Civil: 18.5 },
      },
      {
        id: "pune-apcoe",
        name: "Anantrao Pawar College of Engineering & Research",
        shortName: "APCOER",
        instituteCode: "6794",
        tier: 3,
        position: { lat: 18.5144, lng: 73.8441 },
        description: "A private engineering college at Parvati (Laxminagar, Shahu College Road) in central Pune.",
        website: "https://abmspcoer.org",
        established: 2012,
        placement: { avgPackage: 3.5, highestPackage: 9, topRecruiters: ["Capgemini", "IBM", "Zensar", "Tech Mahindra", "Infosys"] },
        cutoffs: { CSE: 80.5, IT: 76.1, "E&TC": 61.4, Mech: 22.4, Civil: 19.1 },
      },
      {
        id: "pune-ghrce-w",
        name: "G.H. Raisoni College of Engineering & Management, Wagholi",
        shortName: "GHRCEM-W",
        instituteCode: "1432",
        tier: 3,
        position: { lat: 18.5732, lng: 73.9815 },
        description: "A Raisoni-group engineering college on the eastern Pune corridor at Wagholi.",
        website: "https://ghrcem.raisoni.net",
        established: 2006,
        placement: { avgPackage: 4.5, highestPackage: 18, topRecruiters: ["Bosch", "Accenture", "Amazon", "Persistent", "NVIDIA"] },
        cutoffs: { CSE: 93.2, IT: 91.9, "E&TC": 89.8, Mech: 78.6, Civil: 77.1 },
      },
      {
        id: "pune-nbn",
        name: "NBN Sinhgad School of Engineering",
        shortName: "NBNSSOE",
        instituteCode: "6772",
        tier: 3,
        position: { lat: 18.4554, lng: 73.8239 },
        description: "An engineering college in the Sinhgad institutes campus at Ambegaon/Narhe.",
        website: "http://www.sinhgad.edu",
        established: 2011,
        placement: { avgPackage: 4.1, highestPackage: 14, topRecruiters: ["Cognizant", "Accenture", "Wipro", "TCS", "Capgemini"] },
        cutoffs: { CSE: 87.2, IT: 85.3, "E&TC": 74.9, Mech: 39.2 },
      },
      {
        id: "pune-alard",
        name: "Alard College of Engineering & Management",
        shortName: "ACEM",
        instituteCode: "6325",
        tier: 3,
        position: { lat: 18.5991, lng: 73.7422 },
        description: "A private engineering college at Hinjewadi/Marunje on Pune's western tech corridor.",
        website: "https://alardinstitutes.com",
        established: 2009,
        placement: { avgPackage: 3.4, highestPackage: 8, topRecruiters: ["TCS", "Wipro", "Sutherland", "Amazon", "Teleperformance"] },
        cutoffs: { CSE: 74.6, "E&TC": 52.1, Mech: 18.2 },
      },
    ],
    railways: [
      { id: "pune-rail-jn", name: "Pune Junction", type: "railway", position: { lat: 18.5293, lng: 73.872 }, description: "The main intercity railway terminal of Pune." },
      { id: "pune-rail-shivajinagar", name: "Shivajinagar Station", type: "railway", position: { lat: 18.5316, lng: 73.8481 }, description: "A busy suburban rail station in central Pune." },
    ],
    busStops: [
      { id: "pune-bus-pmp", name: "Swargate PMP Bus Stand", type: "bus", position: { lat: 18.5018, lng: 73.8648 }, description: "Swargate — one of Pune's largest PMPML & MSRTC interchanges." },
      { id: "pune-bus-shivajinagar", name: "Shivajinagar Bus Stand", type: "bus", position: { lat: 18.5324, lng: 73.852 }, description: "Central PMPML bus hub near the rail station." },
    ],
    landmarks: [
      { id: "pune-lm-shaniwar", name: "Shaniwar Wada", position: { lat: 18.5196, lng: 73.8553 }, description: "The historic 18th-century seat of the Peshwas of the Maratha Empire." },
      { id: "pune-lm-aga", name: "Aga Khan Palace", position: { lat: 18.5562, lng: 73.904 }, description: "A historic palace & Gandhi memorial set in serene gardens." },
    ],
  },

  // =========================================================================
  // MUMBAI (MMR)
  // =========================================================================
  mumbai: {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    hub: {
      id: "mumbai-hub",
      name: "Dadar — Central Mumbai Hub",
      position: { lat: 19.0195, lng: 72.8432 },
      description: "Dadar, at the crossroads of Central & Western Mumbai, is the city's central transit & market node where the Dadar railway junction and Dadar market converge.",
    },
    colleges: [
      // ---- Tier 1 ----
      {
        id: "mumbai-vjti",
        name: "Veermata Jijabai Technological Institute",
        shortName: "VJTI",
        instituteCode: "3012",
        tier: 1,
        position: { lat: 19.0222, lng: 72.8561 },
        description: "One of India's oldest engineering institutes, autonomous and centrally located at Matunga.",
        website: "https://www.vjti.ac.in",
        established: 1887,
        placement: { avgPackage: 14.5, highestPackage: 62, topRecruiters: ["Google", "Morgan Stanley", "Amazon", "L&T", "Godrej"] },
        cutoffs: { CSE: 99.94, IT: 99.85, "E&TC": 99.6, Mech: 98.8, Civil: 96.5 },
      },
      {
        id: "mumbai-spit",
        name: "Sardar Patel Institute of Technology",
        shortName: "SPIT",
        instituteCode: "3215",
        tier: 1,
        position: { lat: 19.1232, lng: 72.8361 },
        description: "An autonomous engineering college in Andheri run by the Bharatiya Vidya Bhavan.",
        website: "https://www.spit.ac.in",
        established: 2005,
        placement: { avgPackage: 12.5, highestPackage: 45, topRecruiters: ["JPMorgan Chase", "Microsoft", "Barclays", "Quantiphi", "Deutsche Bank"] },
        cutoffs: { CSE: 99.72, "E&TC": 98.9 },
      },
      {
        id: "mumbai-ict",
        name: "Institute of Chemical Technology",
        shortName: "ICT Mumbai",
        instituteCode: "3036",
        tier: 1,
        position: { lat: 19.0225, lng: 72.8576 },
        description: "An elite deemed university for chemical, food & pharmaceutical engineering at Matunga.",
        website: "https://www.ictmumbai.edu.in",
        established: 1933,
        placement: { avgPackage: 8.5, highestPackage: 30, topRecruiters: ["Reliance Industries", "Hindustan Unilever", "BASF", "Asian Paints", "Pidilite"] },
        cutoffs: {},
      },
      {
        id: "mumbai-djsanghvi",
        name: "Dwarkadas J. Sanghvi College of Engineering",
        shortName: "DJ Sanghvi",
        instituteCode: "3199",
        tier: 2,
        position: { lat: 19.1025, lng: 72.8373 },
        description: "A top private engineering college at Vile Parle under SVKM, known for strong IT placements.",
        website: "https://www.djsce.ac.in",
        established: 1994,
        placement: { avgPackage: 11.2, highestPackage: 56, topRecruiters: ["JPMorgan Chase", "Morgan Stanley", "TCS Digital", "Directi", "Accenture"] },
        cutoffs: { CSE: 98.95, IT: 98.5, "E&TC": 96.2, Mech: 89.4 },
      },
      // ---- Tier 2 ----
      {
        id: "mumbai-tsec",
        name: "Thadomal Shahani Engineering College",
        shortName: "TSEC",
        instituteCode: "3182",
        tier: 2,
        position: { lat: 19.0645, lng: 72.8359 },
        description: "A reputed private engineering college at Bandra (W) Reclamation under the Hyderabad (Sind) National Collegiate Board.",
        website: "https://tsec.edu",
        established: 1977,
        placement: { avgPackage: 9.5, highestPackage: 40, topRecruiters: ["Deutsche Bank", "Oracle", "Barclays", "Ernst & Young", "Infosys"] },
        cutoffs: { CSE: 97.8, IT: 97.1, "E&TC": 92.5 },
      },
      {
        id: "mumbai-crce",
        name: "Fr. Conceicao Rodrigues College of Engineering",
        shortName: "CRCE",
        instituteCode: "3184",
        tier: 2,
        position: { lat: 19.0427, lng: 72.8202 },
        description: "A private engineering college at Bandra run by the Agnel Ashram Fathers Society.",
        website: "https://www.frcrce.ac.in",
        established: 1984,
        placement: { avgPackage: 7.5, highestPackage: 31, topRecruiters: ["TCS", "Accenture", "Godrej", "Cimpress", "LTI"] },
        cutoffs: { CSE: 96.4, "E&TC": 89.5, Mech: 78.4 },
      },
      {
        id: "mumbai-kjsomaiya",
        name: "K.J. Somaiya College of Engineering",
        shortName: "KJSCE",
        instituteCode: "3181",
        tier: 2,
        position: { lat: 19.0731, lng: 72.8998 },
        description: "A constituent engineering college of Somaiya Vidyavihar University at Vidyavihar.",
        website: "https://kjsce.somaiya.edu",
        established: 1983,
        placement: { avgPackage: 9.0, highestPackage: 38, topRecruiters: ["Accenture", "Infosys", "IBM", "Capgemini", "Morgan Stanley"] },
        cutoffs: { CSE: 97.1, IT: 96.3, "E&TC": 91.5, Mech: 82.0 },
      },
      {
        id: "mumbai-vidyalankar",
        name: "Vidyalankar Institute of Technology",
        shortName: "VIT-Mum",
        instituteCode: "3139",
        tier: 3,
        position: { lat: 19.0227, lng: 72.8689 },
        description: "A private engineering college at Wadala under the Vidyalankar Dyanapeeth Trust.",
        website: "https://vit.edu.in",
        established: 1999,
        placement: { avgPackage: 5.2, highestPackage: 21, topRecruiters: ["TCS", "Capgemini", "Infosys", "Zeus Learning", "LTI"] },
        cutoffs: { CSE: 94.6, IT: 93.4, "E&TC": 85.1 },
      },
      {
        id: "mumbai-atharva",
        name: "Atharva College of Engineering",
        shortName: "ACE",
        instituteCode: "3203",
        tier: 3,
        position: { lat: 19.1952, lng: 72.8184 },
        description: "A private engineering college at Malad under the Atharva Educational Trust.",
        website: "https://atharvacoe.ac.in",
        established: 1999,
        placement: { avgPackage: 4.5, highestPackage: 16, topRecruiters: ["TCS", "Infosys", "Tech Mahindra", "Capgemini", "Wipro"] },
        cutoffs: { CSE: 90.1, IT: 88.5, "E&TC": 78.4 },
      },
      // ---- Tier 3 ----
      {
        id: "mumbai-sies",
        name: "SIES Graduate School of Technology",
        shortName: "SIES GST",
        instituteCode: "3211",
        tier: 3,
        position: { lat: 19.0359, lng: 73.0228 },
        description: "A private engineering college at Nerul in Navi Mumbai under the SIES trust.",
        website: "https://siesgst.edu.in",
        established: 2002,
        placement: { avgPackage: 5.4, highestPackage: 23, topRecruiters: ["JPMorgan", "LTI", "Cadbury", "TCS", "Accenture"] },
        cutoffs: { CSE: 93.8, IT: 92.5, "E&TC": 84.6, Mech: 58.2 },
      },
      {
        id: "mumbai-terna",
        name: "Terna Engineering College",
        shortName: "Terna",
        instituteCode: "3190",
        tier: 3,
        position: { lat: 19.0305, lng: 73.0182 },
        description: "A private engineering college at Nerul, Navi Mumbai under the Terna Public Charitable Trust.",
        website: "https://ternaengg.ac.in",
        established: 1991,
        placement: { avgPackage: 4.2, highestPackage: 14, topRecruiters: ["TCS", "Infosys", "Capgemini", "Reliance", "Godrej"] },
        cutoffs: { CSE: 88.5, IT: 86.1, "E&TC": 72.3, Mech: 36.1, Civil: 31.4 },
      },
      {
        id: "mumbai-rgit",
        name: "MCT's Rajiv Gandhi Institute of Technology",
        shortName: "RGIT",
        instituteCode: "3196",
        tier: 3,
        position: { lat: 19.1352, lng: 72.8258 },
        description: "A private engineering college at Versova, Andheri under the MCT's trust.",
        website: "https://www.rgit.ac.in",
        established: 1992,
        placement: { avgPackage: 4.6, highestPackage: 15, topRecruiters: ["TCS", "Capgemini", "Wipro", "Tech Mahindra", "LTI"] },
        cutoffs: { CSE: 91.2, IT: 89.4, "E&TC": 79.1, Mech: 48.2 },
      },
      {
        id: "mumbai-sfit",
        name: "St. Francis Institute of Technology",
        shortName: "SFIT",
        instituteCode: "3204",
        tier: 3,
        position: { lat: 19.2439, lng: 72.8559 },
        description: "A private engineering college at Borivali West run by the Franciscan Missionary Brothers.",
        website: "https://www.sfit.ac.in",
        established: 1999,
        placement: { avgPackage: 5.1, highestPackage: 19.5, topRecruiters: ["TCS Digital", "LTI", "Capgemini", "Xoriant", "Hexaware"] },
        cutoffs: { CSE: 94.2, IT: 93.1, "E&TC": 82.3, Mech: 54.1 },
      },
      {
        id: "mumbai-mpstme",
        name: "Mukesh Patel School of Technology Management & Engineering",
        shortName: "MPSTME",
        instituteCode: "JEE/JoSAA",
        tier: 2,
        position: { lat: 19.1121, lng: 72.8404 },
        description: "NMIMS Deemed University's engineering school at Vile Parle, Mumbai (admits via NMIMS-CET).",
        website: "https://engineering.nmims.edu",
        established: 2006,
        placement: { avgPackage: 8.8, highestPackage: 35, topRecruiters: ["Google", "Amazon", "Deloitte", "EY", "Infosys Enterprise"] },
        cutoffs: { CSE: 92.5, IT: 90.1, "E&TC": 84.3 },
      },
      {
        id: "mumbai-donbosco",
        name: "Don Bosco Institute of Technology",
        shortName: "DBIT",
        instituteCode: "3208",
        tier: 3,
        position: { lat: 19.0812, lng: 72.8885 },
        description: "A private engineering college at Kurla run by the Don Bosco Society.",
        website: "https://www.dbit.in",
        established: 2001,
        placement: { avgPackage: 4.8, highestPackage: 16, topRecruiters: ["TCS", "Capgemini", "Infosys", "Jacobs", "LTI"] },
        cutoffs: { CSE: 92.4, IT: 91.0, "E&TC": 81.2, Mech: 50.1 },
      },
      {
        id: "mumbai-pillai",
        name: "Pillai HOC College of Engineering & Technology",
        shortName: "PHCET",
        instituteCode: "3223",
        tier: 3,
        position: { lat: 18.9814, lng: 73.1785 },
        description: "A private engineering college at Rasayani, Panvel under the Mahatma Education Society.",
        website: "https://phcet.ac.in",
        established: 2009,
        placement: { avgPackage: 3.8, highestPackage: 12, topRecruiters: ["TCS", "Capgemini", "Wipro", "Reliance", "Hexaware"] },
        cutoffs: { CSE: 78.4, "E&TC": 51.4, Mech: 23.4, Civil: 19.6 },
      },
    ],
    railways: [
      { id: "mumbai-rail-dadar", name: "Dadar Junction", type: "railway", position: { lat: 19.0186, lng: 72.8443 }, description: "A key Central + Western Railway junction linking the two suburban lines." },
      { id: "mumbai-rail-csmt", name: "CSMT", type: "railway", position: { lat: 18.9403, lng: 72.8354 }, description: "Mumbai's UNESCO-listed headquarters terminus of the Central Railway." },
    ],
    busStops: [
      { id: "mumbai-bus-dadar", name: "Dadar BEST Bus Stand", type: "bus", position: { lat: 19.0201, lng: 72.842 }, description: "A major BEST bus interchange at Dadar." },
      { id: "mumbai-bus-andheri", name: "Andheri Bus Station", type: "bus", position: { lat: 19.1197, lng: 72.8468 }, description: "A major BEST interchange in the western suburbs." },
    ],
    landmarks: [
      { id: "mumbai-lm-gateway", name: "Gateway of India", position: { lat: 18.922, lng: 72.8347 }, description: "The iconic 26-metre basalt arch overlooking the Arabian Sea." },
      { id: "mumbai-lm-cst", name: "CSMT Heritage Building", position: { lat: 18.9398, lng: 72.8354 }, description: "A Victorian-Gothic UNESCO World Heritage railway marvel." },
    ],
  },

  // =========================================================================
  // NAGPUR
  // =========================================================================
  nagpur: {
    id: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    hub: {
      id: "nagpur-hub",
      name: "Sitabuldi — Central Nagpur Hub",
      position: { lat: 21.1458, lng: 79.0782 },
      description: "Sitabuldi, around the historic twin hills and bustling market district, is Nagpur's central commercial & transit hub.",
    },
    colleges: [
      // ---- Tier 1 ----
      {
        id: "nagpur-vnit",
        name: "Visvesvaraya National Institute of Technology, Nagpur",
        shortName: "VNIT",
        instituteCode: "JEE/JoSAA",
        tier: 1,
        position: { lat: 21.1231, lng: 79.0515 },
        description: "An Institute of National Importance and one of the top NITs in India (admits via JEE-Main/JoSAA), founded in 1960 at Ambazari.",
        website: "https://vnit.ac.in",
        established: 1960,
        placement: { avgPackage: 11.5, highestPackage: 64, topRecruiters: ["Google", "Microsoft", "Amazon", "Tata Motors", "L&T"] },
        cutoffs: { CSE: 99.45, IT: 99.12, "E&TC": 98.65, Mech: 97.2, Civil: 95.8 },
      },
      {
        id: "nagpur-rcoem",
        name: "Shri Ramdeobaba College of Engineering and Management",
        shortName: "RCOEM",
        instituteCode: "4115",
        tier: 2,
        position: { lat: 21.1766, lng: 79.0617 },
        description: "A reputed autonomous private engineering university (Ramdeobaba University) at Gittikhadan/Katol Road, Nagpur.",
        website: "https://www.rknec.edu",
        established: 1984,
        placement: { avgPackage: 7.0, highestPackage: 48, topRecruiters: ["TCS", "Infosys", "Cognizant", "Accenture", "Capgemini"] },
        cutoffs: { CSE: 96.75, IT: 95.88, "E&TC": 93.42, Mech: 82.5, Civil: 76.1 },
      },
      // ---- Tier 2 ----
      {
        id: "nagpur-ycce",
        name: "Yeshwantrao Chavan College of Engineering",
        shortName: "YCCE",
        instituteCode: "4125",
        tier: 2,
        position: { lat: 21.0991, lng: 79.0042 },
        description: "An autonomous engineering college at Wanadongri, Hingna, on Nagpur's south-western edge.",
        website: "https://www.ycce.edu",
        established: 1984,
        placement: { avgPackage: 5.5, highestPackage: 26, topRecruiters: ["TCS", "Cognizant", "Wipro", "Tech Mahindra", "Infocepts"] },
        cutoffs: { CSE: 92.4, IT: 90.85, "E&TC": 85.12, Mech: 67.4, Civil: 58.2 },
      },
      {
        id: "nagpur-ghrce",
        name: "G.H. Raisoni College of Engineering",
        shortName: "GHRCE",
        instituteCode: "4123",
        tier: 2,
        position: { lat: 21.1011, lng: 79.0028 },
        description: "An autonomous engineering college in the Raisoni group campus at Digdoh Hills, Hingna, Nagpur.",
        website: "https://ghrce.raisoni.net",
        established: 1996,
        placement: { avgPackage: 5.2, highestPackage: 20, topRecruiters: ["Capgemini", "TCS", "Cognizant", "Amazon", "Wipro"] },
        cutoffs: { CSE: 89.95, IT: 87.5, "E&TC": 81.2, Mech: 62.1, Civil: 54.3 },
      },
      {
        id: "nagpur-gcoen",
        name: "Government College of Engineering, Nagpur",
        shortName: "GCOEN",
        instituteCode: "4025",
        tier: 2,
        position: { lat: 21.0345, lng: 79.0805 },
        description: "A newer government engineering college in the MIHAN / New Khapri area, south Nagpur.",
        website: "https://www.gcoen.ac.in",
        established: 2016,
        placement: { avgPackage: 5.0, highestPackage: 15, topRecruiters: ["TCS", "Infosys", "Adani Power", "L&T Infotech", "Hexaware"] },
        cutoffs: { CSE: 95.7, "E&TC": 91.18, Mech: 77.6, Civil: 69.34 },
      },
      // ---- Tier 3 ----
      {
        id: "nagpur-pce",
        name: "Priyadarshini College of Engineering",
        shortName: "PCE",
        instituteCode: "4116",
        tier: 3,
        position: { lat: 21.1215, lng: 78.9912 },
        description: "A private engineering college under the Lokmanya Tilak Jankalyan Shikshan Sanstha at Digdoh Hills, Hingna Road, Nagpur.",
        website: "https://www.pcenagpur.edu.in",
        established: 1888,
        placement: { avgPackage: 4.0, highestPackage: 12, topRecruiters: ["TCS", "Cognizant", "Infosys", "Tech Mahindra", "Capgemini"] },
        cutoffs: { CSE: 83.5, IT: 80.2, "E&TC": 71.1, Mech: 45.3, Civil: 38.4 },
      },
      {
        id: "nagpur-anjuman",
        name: "Anjuman College of Engineering & Technology",
        shortName: "ACET",
        instituteCode: "4134",
        tier: 3,
        position: { lat: 21.161, lng: 79.0833 },
        description: "A minority-status private engineering college at Sadar, central Nagpur, under the Anjuman Hami-e-Islam.",
        website: "https://www.anjumanengg.edu.in",
        established: 1999,
        placement: { avgPackage: 3.8, highestPackage: 10.5, topRecruiters: ["TCS", "Collabera", "Capgemini", "Amazon", "Epic Research"] },
        cutoffs: { CSE: 79.4, "E&TC": 61.2, Mech: 33.1, Civil: 28.5 },
      },
      {
        id: "nagpur-kdk",
        name: "K.D.K. College of Engineering",
        shortName: "KDK",
        instituteCode: "4143",
        tier: 3,
        position: { lat: 21.1344, lng: 79.1172 },
        description: "A private engineering college (Karmaveer Dadasaheb Kannamwar) at Nandanvan, Great Nag Road, Nagpur.",
        website: "https://www.kdkce.edu",
        established: 1984,
        placement: { avgPackage: 3.6, highestPackage: 9, topRecruiters: ["TCS", "Infosys", "Capgemini", "Tech Mahindra", "Hexaware"] },
        cutoffs: { CSE: 81.1, IT: 77.4, "E&TC": 66.8, Mech: 41.2, Civil: 35.7 },
      },
      {
        id: "nagpur-nuva",
        name: "Nuva College of Engineering & Technology",
        shortName: "NCET",
        instituteCode: "4168",
        tier: 3,
        position: { lat: 21.1924, lng: 79.2555 },
        description: "A private engineering college on the Nagpur–Katol highway near Kalmeshwar, on Nagpur's north-western outskirts.",
        website: "https://nuva.edu.in",
        established: 2010,
        placement: { avgPackage: 3.0, highestPackage: 6, topRecruiters: ["Mass Recruiters", "Local Vendors"] },
        cutoffs: { CSE: 42.1, Mech: 15.3 },
      },
      {
        id: "nagpur-srpce",
        name: "Smt. Radhikatai Pandav College of Engineering",
        shortName: "SRPCE",
        instituteCode: "4127",
        tier: 3,
        position: { lat: 21.1118, lng: 79.1624 },
        description: "A private engineering college at Vihirgaon, Nagpur, under the Sanmarg Shikshan Sanstha.",
        website: "http://srpce.ac.in",
        established: 1999,
        placement: { avgPackage: 3.2, highestPackage: 7.5, topRecruiters: ["TCS", "Tech Mahindra", "Genpact", "CMS IT", "HCL"] },
        cutoffs: { CSE: 68.4, "E&TC": 41.2, Mech: 22.1, Civil: 18.9 },
      },
      {
        id: "nagpur-tgpcet",
        name: "Tulsiramji Gaikwad-Patil College of Engineering & Technology",
        shortName: "TGPCET",
        instituteCode: "4151",
        tier: 3,
        position: { lat: 21.0312, lng: 79.0304 },
        description: "An autonomous private engineering college at Wardha Road, Nagpur, accredited with NAAC A+ grade.",
        website: "https://www.tgpcet.com",
        established: 2007,
        placement: { avgPackage: 4.1, highestPackage: 12, topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra", "Persistent Systems"] },
        cutoffs: { CSE: 82.3, IT: 78.5, "E&TC": 69.4, Mech: 48.9, Civil: 41.2 },
      },
      {
        id: "nagpur-jdcoem",
        name: "J D College of Engineering and Management",
        shortName: "JDCOEM",
        instituteCode: "4139",
        tier: 3,
        position: { lat: 21.2268, lng: 79.0142 },
        description: "An autonomous private engineering college on Katol Road, Nagpur, known for its NAAC 'A' grade accreditation.",
        website: "https://jdcoem.ac.in",
        established: 2008,
        placement: { avgPackage: 4.2, highestPackage: 10, topRecruiters: ["TCS", "Cognizant", "Capgemini", "Mphasis", "Hexaware"] },
        cutoffs: { CSE: 84.1, IT: 80.6, "E&TC": 70.3, Civil: 44.1 },
      },
      {
        id: "nagpur-gniet",
        name: "Guru Nanak Institute of Engineering and Technology",
        shortName: "GNIET",
        instituteCode: "4147",
        tier: 3,
        position: { lat: 21.2014, lng: 79.0069 },
        description: "A private engineering college at Dahegaon, Kalmeshwar Road, Nagpur, affiliated with RTMNU.",
        website: "https://gniet.edu.in",
        established: 2007,
        placement: { avgPackage: 3.5, highestPackage: 8, topRecruiters: ["TCS", "Capgemini", "Tech Mahindra", "GlobalLogic", "Teleperformance"] },
        cutoffs: { CSE: 74.2, "E&TC": 53.4 },
      },
      {
        id: "nagpur-nit",
        name: "Nagpur Institute of Technology",
        shortName: "NIT Nagpur",
        instituteCode: "4144",
        tier: 3,
        position: { lat: 21.2181, lng: 79.0289 },
        description: "A private engineering college on Katol Road / Fetri, Nagpur, offering career-oriented engineering programs.",
        website: "https://nit.edu.in",
        established: 2008,
        placement: { avgPackage: 3.6, highestPackage: 9, topRecruiters: ["Infosys", "TCS", "Capgemini", "Amazon Recruiting", "Epic Research"] },
        cutoffs: { CSE: 77.8, IT: 72.4, Mech: 31.4, Civil: 29.1 },
      },
      {
        id: "nagpur-scet",
        name: "Suryodaya College of Engineering & Technology",
        shortName: "SCET",
        instituteCode: "4167",
        tier: 3,
        position: { lat: 21.0801, lng: 79.1664 },
        description: "A private engineering college in Vihirgaon, Umred Road, Nagpur, focusing on practical learning and industry connections.",
        website: "https://scetngp.com",
        established: 2010,
        placement: { avgPackage: 3.4, highestPackage: 8.5, topRecruiters: ["TCS", "Tech Mahindra", "Mphasis", "Dhoot Transmission", "Jayswal Neco"] },
        cutoffs: { CSE: 72.6, "E&TC": 48.2, Mech: 25.4, Civil: 21.0 },
      },
      // ---- Added: further major Nagpur colleges (identity & DTE codes verified;
      // coordinates, cutoffs & placements are indicative — pending precise research) ----
      {
        id: "nagpur-iiit",
        name: "Indian Institute of Information Technology, Nagpur",
        shortName: "IIIT Nagpur",
        instituteCode: "JEE/JoSAA",
        tier: 1,
        position: { lat: 20.9491, lng: 79.0296 },
        description: "An Institute of National Importance (PPP model, admits via JEE-Main/JoSAA) with its permanent campus at Waranga near Butibori, south of Nagpur.",
        website: "https://www.iiitn.ac.in",
        established: 2016,
        placement: { avgPackage: 15.0, highestPackage: 42, topRecruiters: ["Amazon", "Microsoft", "Cisco", "Deloitte", "Oracle"] },
        cutoffs: { CSE: 96.5, "E&TC": 93.0 },
      },
      {
        id: "nagpur-svpcet",
        name: "St. Vincent Pallotti College of Engineering & Technology",
        shortName: "SVPCET",
        instituteCode: "4174",
        tier: 2,
        position: { lat: 21.0389, lng: 79.045 },
        description: "A private engineering college at Gavsi Manapur on Wardha Road, south Nagpur, run by the Nagpur Pallottine Society (est. 2004).",
        website: "https://www.stvincentngp.edu.in",
        established: 2004,
        placement: { avgPackage: 4.5, highestPackage: 14, topRecruiters: ["TCS", "Infosys", "Capgemini", "Cognizant", "Tech Mahindra"] },
        cutoffs: { CSE: 88.0, IT: 84.0, "E&TC": 74.0, Mech: 52.0, Civil: 46.0 },
      },
      {
        id: "nagpur-sbjit",
        name: "S. B. Jain Institute of Technology, Management & Research",
        shortName: "SBJITMR",
        instituteCode: "4137",
        tier: 2,
        position: { lat: 21.193, lng: 78.956 },
        description: "An autonomous private engineering institute (Hindi-linguistic minority) at Yerla, Kalmeshwar Road / Fetri, north-west Nagpur, under the Sir Shantilal Badjate Charitable Trust (est. 2008).",
        website: "https://www.sbjit.edu.in",
        established: 2008,
        placement: { avgPackage: 4.5, highestPackage: 20, topRecruiters: ["TCS", "Infosys", "Persistent", "Capgemini", "Cognizant"] },
        cutoffs: { CSE: 89.0, IT: 85.0, "E&TC": 74.0, Mech: 50.0, Civil: 45.0 },
      },
      {
        id: "nagpur-pbcoe",
        name: "Priyadarshini Bhagwati College of Engineering",
        shortName: "PBCOE",
        instituteCode: "4177",
        tier: 3,
        position: { lat: 21.114, lng: 79.117 },
        description: "A private engineering college at Harpur Nagar on Umred Road, central-east Nagpur (est. 2007).",
        website: "https://www.pbcoe.edu.in",
        established: 2007,
        placement: { avgPackage: 3.4, highestPackage: 8, topRecruiters: ["TCS", "Wipro", "Cognizant", "Tech Mahindra", "Hexaware"] },
        cutoffs: { CSE: 74.0, IT: 68.0, "E&TC": 58.0, Mech: 42.0, Civil: 38.0 },
      },
      {
        id: "nagpur-pjlce",
        name: "Priyadarshini J.L. College of Engineering",
        shortName: "PJLCE",
        instituteCode: "4136",
        tier: 3,
        position: { lat: 21.1335, lng: 79.124 },
        description: "A private engineering college at New Nandanvan Layout, east Nagpur, affiliated to RTMNU (est. 2008).",
        website: "http://pjlce.edu.in",
        established: 2008,
        placement: { avgPackage: 3.3, highestPackage: 8, topRecruiters: ["TCS", "Infosys", "Cognizant", "Capgemini", "Wipro"] },
        cutoffs: { CSE: 72.0, IT: 66.0, "E&TC": 56.0, Mech: 40.0, Civil: 36.0 },
      },
      {
        id: "nagpur-dbacer",
        name: "Dr. Babasaheb Ambedkar College of Engineering & Research",
        shortName: "DBACER",
        instituteCode: "4187",
        tier: 3,
        position: { lat: 21.0865, lng: 78.9755 },
        description: "A private engineering college at Wanadongri, Hingna Road, south-west Nagpur, affiliated to RTMNU (est. 2008).",
        website: "https://dbacer.edu.in",
        established: 2008,
        placement: { avgPackage: 3.4, highestPackage: 8, topRecruiters: ["TCS", "Wipro", "Capgemini", "Cognizant", "Tech Mahindra"] },
        cutoffs: { CSE: 73.0, IT: 67.0, "E&TC": 56.0, Mech: 40.0, Civil: 36.0 },
      },
      {
        id: "nagpur-wcem",
        name: "Wainganga College of Engineering & Management",
        shortName: "WCEM",
        instituteCode: "4145",
        tier: 3,
        position: { lat: 20.903, lng: 78.982 },
        description: "A private engineering college at Dongargaon near Gumgaon railway station, Wardha Road, far-south Nagpur (est. 2008).",
        website: "https://www.wcem.in",
        established: 2008,
        placement: { avgPackage: 3.0, highestPackage: 7, topRecruiters: ["TCS", "Wipro", "Cognizant", "Tech Mahindra", "Genpact"] },
        cutoffs: { CSE: 66.0, "E&TC": 48.0, Mech: 38.0, Civil: 35.0 },
      },
    ],
    railways: [
      { id: "nagpur-rail-jn", name: "Nagpur Junction", type: "railway", position: { lat: 21.1463, lng: 79.0886 }, description: "A major A1-category railway junction on the Howrah–Mumbai route." },
      { id: "nagpur-rail-ajni", name: "Ajni Station", type: "railway", position: { lat: 21.138, lng: 79.072 }, description: "A satellite station serving south Nagpur & freight traffic." },
    ],
    busStops: [
      { id: "nagpur-bus-msrtc", name: "Mor Bhavan MSRTC Bus Stand", type: "bus", position: { lat: 21.1495, lng: 79.0816 }, description: "Nagpur's main intercity MSRTC bus terminus near Sitabuldi." },
      { id: "nagpur-bus-sitabuldi", name: "Sitabuldi Bus Stand", type: "bus", position: { lat: 21.1458, lng: 79.0782 }, description: "A busy city-bus hub in the heart of Nagpur's market district." },
    ],
    landmarks: [
      { id: "nagpur-lm-deeksha", name: "Deekshabhoomi", position: { lat: 21.1466, lng: 79.0808 }, description: "The sacred Buddhist monument where Dr. B.R. Ambedkar embraced Buddhism." },
      { id: "nagpur-lm-fort", name: "Sitabuldi Fort", position: { lat: 21.1505, lng: 79.0732 }, description: "A historic hilltop fort overlooking the twin hills of Sitabuldi." },
    ],
  },

  // =========================================================================
  // AMRAVATI
  // =========================================================================
  amravati: {
    id: "amravati",
    name: "Amravati",
    state: "Maharashtra",
    hub: {
      id: "amravati-hub",
      name: "Rajkamal Square — Central Amravati Hub",
      position: { lat: 20.9333, lng: 77.75 },
      description: "Rajkamal Square beside the heritage Irwin Market is the commercial & transit heart of Amravati city.",
    },
    colleges: [
      // ---- Tier 1 ----
      {
        id: "amravati-gcoea",
        name: "Government College of Engineering, Amravati",
        shortName: "GCOEA",
        instituteCode: "1002",
        tier: 2,
        position: { lat: 20.9414, lng: 77.7512 },
        description: "An autonomous government engineering institute at Kathora Naka, Amravati, established in 1965.",
        website: "https://www.gcoea.ac.in",
        established: 1964,
        placement: { avgPackage: 5.4, highestPackage: 18, topRecruiters: ["TCS", "Cognizant", "Wipro", "L&T Infotech", "Adani Group"] },
        cutoffs: { CSE: 94.8, IT: 93.1, "E&TC": 88.5, Mech: 71.4, Civil: 64.2 },
      },
      // ---- Tier 2 ----
      {
        id: "amravati-prmitr",
        name: "Prof. Ram Meghe Institute of Technology & Research",
        shortName: "PRMIT&R",
        instituteCode: "1105",
        tier: 3,
        position: { lat: 20.9318, lng: 77.7121 },
        description: "A private engineering college at Badnera (Anjangaon Bari Road), the railway suburb of Amravati.",
        website: "https://mitra.ac.in",
        established: 1983,
        placement: { avgPackage: 4.1, highestPackage: 12.5, topRecruiters: ["TCS", "Cognizant", "Capgemini", "Tech Mahindra", "Infosys"] },
        cutoffs: { CSE: 84.5, IT: 81.2, "E&TC": 70.4, Mech: 41.2, Civil: 38.5 },
      },
      {
        id: "amravati-prpote",
        name: "P.R. Pote (Patil) College of Engineering & Management",
        shortName: "PRPCE",
        instituteCode: "1127",
        tier: 3,
        position: { lat: 20.9548, lng: 77.7264 },
        description: "A private engineering college on Kathora Road, Amravati, offering core & IT branches.",
        website: "https://prpotepatilengg.ac.in",
        established: 2008,
        placement: { avgPackage: 3.8, highestPackage: 10, topRecruiters: ["TCS", "Wipro", "Capgemini", "Amazon Recruiting", "Atos"] },
        cutoffs: { CSE: 81.2, "E&TC": 66.4, Mech: 35.1, Civil: 31.2 },
      },
      {
        id: "amravati-sipna",
        name: "Sipna College of Engineering & Technology",
        shortName: "Sipna",
        instituteCode: "1114",
        tier: 3,
        position: { lat: 20.9602, lng: 77.7589 },
        description: "An engineering college on Badnera Road, Amravati, under Sipna Shikshan Prasarak Mandal.",
        website: "https://sipnaengg.ac.in",
        established: 1999,
        placement: { avgPackage: 4.0, highestPackage: 11.5, topRecruiters: ["TCS", "Cognizant", "Persistent Systems", "Capgemini", "Hexaware"] },
        cutoffs: { CSE: 83.9, IT: 80.4, "E&TC": 69.1, Mech: 38.2, Civil: 34.6 },
      },
      // ---- Tier 3 ----
      {
        id: "amravati-mngm",
        name: "Prof. Ram Meghe College of Engineering & Management",
        shortName: "PRMCEM",
        instituteCode: "1128",
        tier: 3,
        position: { lat: 20.9333, lng: 77.7145 },
        description: "A regional private engineering & management college at Badnera, Amravati.",
        website: "https://prmcem.ac.in",
        established: 2009,
        placement: { avgPackage: 3.6, highestPackage: 9, topRecruiters: ["TCS", "Wipro", "Infosys", "Dhoot Transmission", "Collabera"] },
        cutoffs: { CSE: 79.8, "E&TC": 62.3, Civil: 28.1 },
      },
      {
        id: "amravati-hvpm",
        name: "H.V.P.M. College of Engineering & Technology",
        shortName: "HVPM COET",
        instituteCode: "1121",
        tier: 3,
        position: { lat: 20.9272, lng: 77.7505 },
        description: "A private engineering college under the Hanuman Vyayam Prasarak Mandal (Hanuman Vyayam Nagar) at Amravati.",
        website: "https://hvpmcoet.in",
        established: 2002,
        placement: { avgPackage: 3.4, highestPackage: 8.5, topRecruiters: ["TCS", "Tech Mahindra", "Reliance", "Genpact", "CMS IT"] },
        cutoffs: { CSE: 75.1, "E&TC": 54.2, Mech: 21.4 },
      },
      {
        id: "amravati-drgitr",
        name: "Dr. Rajendra Gode Institute of Technology & Research",
        shortName: "DRGITR",
        instituteCode: "1116",
        tier: 3,
        position: { lat: 20.9248, lng: 77.7712 },
        description: "A private engineering college on Mardi Road, Amravati offering core & computing branches.",
        website: "http://drgitr.com",
        established: 2008,
        placement: { avgPackage: 3.2, highestPackage: 7, topRecruiters: ["Mass Recruiters", "Local Vendors"] },
        cutoffs: { CSE: 69.5, Civil: 18.2 },
      },
    ],
    railways: [
      { id: "amravati-rail-jn", name: "Amravati Railway Station", type: "railway", position: { lat: 20.9356, lng: 77.7689 }, description: "The terminal railway station serving Amravati city." },
      { id: "amravati-rail-badnera", name: "Badnera Junction", type: "railway", position: { lat: 20.872, lng: 77.749 }, description: "The main junction on the Howrah–Nagpur–Mumbai route near Amravati." },
    ],
    busStops: [
      { id: "amravati-bus-st", name: "Amravati ST Stand", type: "bus", position: { lat: 20.9318, lng: 77.7681 }, description: "The city's main MSRTC intercity bus terminus." },
      { id: "amravati-bus-irwin", name: "Irwin Market Bus Stop", type: "bus", position: { lat: 20.9331, lng: 77.7655 }, description: "A central city-bus stop at the heritage market square." },
    ],
    landmarks: [
      { id: "amravati-lm-ambadevi", name: "Ambadevi Temple", position: { lat: 20.9337, lng: 77.7833 }, description: "An ancient temple to Goddess Amba, the tutelary deity of Amravati." },
      { id: "amravati-lm-wadali", name: "Wadali Talab", position: { lat: 20.9537, lng: 77.7533 }, description: "A historic lake and green recreation spot in the city." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Convenience accessors
// ---------------------------------------------------------------------------

export const CITY_LIST: CityData[] = Object.values(CITIES);

export function getCity(id: CityId): CityData {
  return CITIES[id];
}

export function getAllTransit(city: CityData): Transit[] {
  return [...city.railways, ...city.busStops];
}

export const TOTAL_COLLEGES = CITY_LIST.reduce(
  (n, c) => n + c.colleges.length,
  0
);

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

export function nearestTransit(
  college: College,
  transits: Transit[]
): Transit | null {
  if (transits.length === 0) return null;
  return transits.reduce((best, r) =>
    haversineKm(college.position, r.position) <
    haversineKm(college.position, best.position)
      ? r
      : best
  );
}

/** Branch + cutoff eligibility for a college given a filter. */
export function branchEligible(
  c: College,
  branch: BranchFilter,
  percentile: number
): boolean {
  if (branch === "All") {
    const offered = BRANCHES.filter((b) => b in c.cutoffs);
    if (offered.length === 0) return true; // e.g. ICT (chemical only) — always visible in All
    return offered.some((b) => (c.cutoffs[b] as number) <= percentile);
  }
  const cut = c.cutoffs[branch];
  return cut !== undefined && cut <= percentile;
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
// Tier metadata — color-coded for instant scanning
// Tier 1 = Emerald, Tier 2 = Blue, Tier 3 = Orange
// ---------------------------------------------------------------------------

export const TIER_META: Record<
  Tier,
  { label: string; color: string; ring: string; soft: string; text: string }
> = {
  1: { label: "Tier 1", color: "#10b981", ring: "#059669", soft: "#d1fae5", text: "#065f46" },
  2: { label: "Tier 2", color: "#3b82f6", ring: "#2563eb", soft: "#dbeafe", text: "#1e40af" },
  3: { label: "Tier 3", color: "#f97316", ring: "#ea580c", soft: "#ffedd5", text: "#9a3412" },
};

export const DEFAULT_CITY: CityId = "pune";
