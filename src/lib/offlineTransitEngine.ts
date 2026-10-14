// Vanara AI: On-Device Offline Transit Intelligence Engine
// Powered by Official BMTC & Namma Metro datasets
// Operates 100% offline with zero network connectivity required

import {
  BMTC_FLEET_STATISTICS,
  BMTC_DIVISIONAL_FLEET_DATA,
  OFFICIAL_BMTC_STOPS,
  OFFICIAL_BMTC_ROUTES,
  getOfficialStopByName,
  getRoutesPassingThroughStop,
  getStopsForRoute
} from "@/data/bmtcOfficialData";

import nammaMetroData from "@/data/namma_metro.json";

// Quick Metro Stations lookup map
const METRO_STATIONS = (nammaMetroData.stations || []).map((s: any) => ({
  name: s.name,
  lines: s.lines || [],
  isInterchange: s.isInterchange || false,
  lat: s.lat,
  lon: s.lon
}));

interface CorridorDetails {
  title: string;
  buses: string[];
  metro?: string;
  duration: string;
  fare: string;
  chokePoints: string;
  steps: string[];
}

const CORRIDOR_KNOWLEDGE_BASE: Record<string, CorridorDetails> = {
  "yelahanka_silkboard": {
    title: "Yelahanka New Town ⇄ Central Silk Board (Outer Ring Road Corridor)",
    buses: ["500D (Hebbal ➔ Silk Board Express)", "500CA", "500K", "V-500D (AC Volvo Vajra)", "401K"],
    metro: "Green Line (Nagasandra ➔ Majestic) transfer to Purple Line (Majestic ➔ Indiranagar) + Route 201 feeder bus",
    duration: "65 - 85 mins (Peak Hours) | 45 - 55 mins (Off-Peak)",
    fare: "Ordinary Bus: ₹30 - ₹35 | Volvo AC: ₹85 - ₹95 | BMTC Daily Pass: ₹70 (Non-AC) / ₹120 (AC)",
    chokePoints: "Hebbal Flyover ramp, Tin Factory / KR Puram bridge, Marathahalli junction, Bellandur ecospace",
    steps: [
      "Board Route 250 or 401K from Yelahanka NES / Santhe Circle to Hebbal Junction (15 mins).",
      "Switch to Route 500D Express or AC Volvo V-500D at Hebbal bus bay.",
      "Travel along the Outer Ring Road passing Manyata Tech Park, Nagawara, Tin Factory, Marathahalli, Bellandur, and HSR Layout.",
      "Alight directly at Central Silk Board bus stop."
    ]
  },
  "majestic_whitefield": {
    title: "Kempegowda Majestic ⇄ Whitefield (Kadugodi / ITPL)",
    buses: ["335E (Majestic ➔ Kadugodi via HAL)", "V-335E (Volvo AC)", "333P", "330", "55-B"],
    metro: "Namma Metro Purple Line (Direct Train from Kempegowda Station Platform 3 ➔ Whitefield Kadugodi)",
    duration: "Metro: 42 mins (Zero Traffic) | Bus: 75 - 100 mins",
    fare: "Metro: ₹60 (₹57 with Smartcard/NCMC) | Bus: ₹30 - ₹35 (Ordinary) / ₹85 (Volvo AC)",
    chokePoints: "Old Airport Road, Marathahalli Multiplex signal, Kundalahalli gate, Hope Farm junction",
    steps: [
      "FASTEST: Enter Kempegowda Metro Station (Majestic), take Escalator to Platform 3.",
      "Board eastbound Purple Line direct train to Whitefield (Kadugodi).",
      "Ride non-stop through Central CBD: MG Road ➔ Indiranagar ➔ Baiyappanahalli ➔ KR Puram ➔ Hoodi ➔ ITPL ➔ Whitefield.",
      "Alternatively for surface transit, board Route 335E from Majestic KBS Platform 17."
    ]
  },
  "koramangala_electronic_city": {
    title: "Koramangala ⇄ Electronic City (Elevated Expressway)",
    buses: ["365 (Majestic ➔ E-City via Koramangala)", "V-365 (AC Vajra Volvo)", "356-CW-FLY (Elevated Flyover Express)", "600F", "342"],
    metro: "Yellow Line (RV Road ⇄ Bommasandra via Silk Board & Electronic City)",
    duration: "30 - 45 mins via BETL Elevated Highway",
    fare: "Ordinary Bus: ₹25 - ₹30 | Volvo AC: ₹70 - ₹80",
    chokePoints: "Silk Board junction, Madivala checkpost, Bommanahalli signal",
    steps: [
      "Board Route 356-CW-FLY or Route 365 from Koramangala Water Tank / Sony World signal.",
      "Bus ascends the BETL 10km Electronic City Elevated Expressway bypassing surface traffic.",
      "Alight at Electronic City Toll Gate, Infosys Gate 1, or Wipro Gate."
    ]
  },
  "airport_transit": {
    title: "Bengaluru City ⇄ Kempegowda International Airport (KIA Devanahalli)",
    buses: [
      "KIA-9 (Majestic KBS ➔ Airport via Hebbal) - Every 10 mins (24x7)",
      "KIA-8 (Electronic City / Silk Board ➔ Airport via Marathahalli, Hebbal) - Every 15 mins",
      "KIA-4 (HAL / Indiranagar ➔ Airport) - Every 20 mins",
      "KIA-6 (Whitefield ITPL ➔ Airport via Kadugodi) - Every 25 mins",
      "KIA-10 (Silk Board / Koramangala ➔ Airport) - Every 20 mins"
    ],
    duration: "50 - 90 mins depending on origin zone",
    fare: "₹240 - ₹350 (Includes luggage, free onboard WiFi, air conditioning)",
    chokePoints: "Hebbal Flyover airport ramp, Yelahanka bypass signal, Sadahalli toll",
    steps: [
      "Locate designated BMTC Vayu Vajra shelter or major bus station.",
      "Board dedicated KIA Volvo shuttle matching your departure zone.",
      "Travel along Ballari Road elevated airport express corridor.",
      "Alight directly at Terminal 1 or Terminal 2 (Garden Terminal) departures curb."
    ]
  },
  "majestic_hebbal": {
    title: "Kempegowda Majestic ⇄ Hebbal Junction",
    buses: ["250", "280", "285", "401K", "KIA-9"],
    duration: "25 - 40 mins",
    fare: "Ordinary Bus: ₹20 - ₹25 | Volvo: ₹50 - ₹70",
    chokePoints: "Cauvery Theatre junction, Palace Grounds, Mekhri Circle underpass",
    steps: [
      "From Majestic Kempegowda Bus Station, head to Platform 19 or 22.",
      "Board Route 250, 280, or 285 heading towards Yelahanka / Hebbal.",
      "Travel via Sheshadripuram ➔ Mekhri Circle ➔ Veterinary College ➔ Hebbal Flyover.",
      "Alight at Hebbal bus bay for Outer Ring Road feeder connections."
    ]
  }
};

/**
 * Main On-Device Offline Transit Intelligence Generator
 */
export function generateOfflineTransitReply(
  query: string,
  appLang: string = "en",
  cityName: string = "bengaluru"
): string {
  const q = query.toLowerCase().trim();
  const offlineBadge = appLang === "kn"
    ? `> ⚡ **ಆಫ್‌ಲೈನ್ ಬಿಎಂಟಿಸಿ & ಮೆಟ್ರೋ ಮೋಡ್:** ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಸ್ಥಳೀಯ ಡೇಟಾಬೇಸ್‌ನಿಂದ ನೇರವಾಗಿ ಒದಗಿಸಲಾಗಿದೆ.\n\n`
    : appLang === "hi"
    ? `> ⚡ **ऑफलाइन बीएमटीसी एवं मेट्रो मोड:** बिना इंटरनेट के स्थानीय डेटाबेस से तुरंत लोड किया गया।\n\n`
    : `> ⚡ **Offline Transit Mode:** Answered directly from on-device BMTC & Namma Metro local database (Zero Internet Needed).\n\n`;

  // 1. SPECIFIC BUS ROUTE LOOKUP
  const busRouteMatch = q.match(/\b([vV]-)?(kia|kias|mf|d)?[0-9]{1,4}[a-z]{0,4}(-?[a-z0-9]+)?\b/i);
  if (busRouteMatch) {
    const rawCode = busRouteMatch[0].toUpperCase();
    const cleanCode = rawCode.replace(/[^A-Z0-9]/g, "");

    // Search in official 1,307 routes
    const matchedRoute = OFFICIAL_BMTC_ROUTES.find(
      r => r.route.toUpperCase() === rawCode || r.route.toUpperCase().replace(/[^A-Z0-9]/g, "") === cleanCode
    );

    // Find stops serving this route
    const servingStops = getStopsForRoute(rawCode);

    if (matchedRoute) {
      if (appLang === "kn") {
        return offlineBadge + `### 🚌 ಬಿಎಂಟಿಸಿ ಬಸ್ ಮಾರ್ಗ: **${matchedRoute.route}**

* **ಸೇವೆಯ ವಿಧ:** ${matchedRoute.type}
* **ಕಾರಿಡಾರ್:** ${matchedRoute.corridor}
* **ದೈನಂದಿನ ಟ್ರಿಪ್‌ಗಳು:** **${matchedRoute.trips.toLocaleString()} ಟ್ರಿಪ್‌ಗಳು/ದಿನ** (ಹೆಚ್ಚು ಆವರ್ತನದ ಮಾರ್ಗ)
* **ದರ ಮಾಹಿತಿ:** ಸಾಮಾನ್ಯ: ₹5 - ₹35 | ದೈನಂದಿನ ಪಾಸ್: ₹70 (ಸಾಮಾನ್ಯ) / ₹120 (ವಜ್ರ ಎಸಿ)
* **ಕಾರ್ಯಾಚರಣೆ ಸಮಯ:** ಬೆಳಗ್ಗೆ 05:00 ರಿಂದ ರಾತ್ರಿ 10:45 ರವರೆಗೆ (ಪ್ರಮುಖ ನಿಲ್ದಾಣಗಳಲ್ಲಿ 24x7 ರಾತ್ರಿ ಸೇವೆ ಲಭ್ಯ)
${servingStops.length > 0 ? `* **ಪ್ರಮುಖ ನಿಲ್ದಾಣಗಳು (${servingStops.length} ನಿಲ್ದಾಣಗಳು):** ${servingStops.slice(0, 8).map(s => s.name).join(" ➔ ")}` : ""}

💡 *ಸಲಹೆ:* ನಿಲ್ದಾಣದಲ್ಲಿ ಬಸ್ ತಲುಪುವ ಲೈವ್ ಸಮಯವನ್ನು 'ಲೈವ್ ಮ್ಯಾಪ್' ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.`;
      } else if (appLang === "hi") {
        return offlineBadge + `### 🚌 बीएमटीसी बस रूट: **${matchedRoute.route}**

* **सेवा का प्रकार:** ${matchedRoute.type}
* **कॉरीडोर:** ${matchedRoute.corridor}
* **दैनिक फेरे (Trips):** **${matchedRoute.trips.toLocaleString()} फेरे/प्रतिदिन** (उच्च आवृत्ति)
* **किराया संरचना:** साधारण: ₹5 - ₹35 | दैनिक पास: ₹70 (साधारण) / ₹120 (वज्र एसी)
* **समय सारणी:** सुबह 05:00 बजे से रात 10:45 बजे तक (नाइट आउल बसें भी उपलब्ध)
${servingStops.length > 0 ? `* **प्रमुख स्टॉप (${servingStops.length} स्टॉप):** ${servingStops.slice(0, 8).map(s => s.name).join(" ➔ ")}` : ""}

💡 *सुझाव:* बस के लाइव आगमन को 'लाइव मैप' टैब पर सीधे ट्रैक करें।`;
      } else {
        return offlineBadge + `### 🚌 BMTC Official Bus Route: **${matchedRoute.route}**

* **Service Type:** **${matchedRoute.type}**
* **Primary Corridor:** **${matchedRoute.corridor}**
* **Daily Trip Frequency:** **${matchedRoute.trips.toLocaleString()} trips/day** across Bengaluru
* **Fare Structure:** Ordinary: **₹5 – ₹35** | BMTC Daily Pass: **₹70** (Non-AC) / **₹120** (Volvo Vajra AC)
* **Operating Hours:** First bus **05:00 AM** | Last regular bus **10:45 PM** | Night Owl arterial service active
${servingStops.length > 0 ? `* **Key Transit Stops (${servingStops.length} hubs served):**\n  ${servingStops.slice(0, 8).map(s => `• **${s.name}** (${s.dailyTrips} total daily hub trips)`).join("\n  ")}` : ""}

💡 *Commuter Tip:* Use the **Live Map** tab in Bharat Vision to view live GPS coordinates and approaching bus deviations.`;
      }
    }
  }

  // 2. OFFICIAL BMTC BUS STOP INQUIRY (from ac150-stops.csv)
  const foundStop = getOfficialStopByName(query);
  if (foundStop && foundStop.routesMap) {
    const routeEntries = Object.entries(foundStop.routesMap).sort((a, b) => b[1] - a[1]);
    const topRouteChips = routeEntries.slice(0, 10).map(([r, t]) => `**${r}** (${t} trips/day)`).join(" • ");

    if (appLang === "kn") {
      return offlineBadge + `### 🚏 ಬಿಎಂಟಿಸಿ ಅಧಿಕೃತ ಬಸ್ ನಿಲ್ದಾಣ: **${foundStop.name}**

* **ಸ್ಥಳ:** ಅಕ್ಷಾಂಶ ${foundStop.lat.toFixed(5)}, ರೇಖಾಂಶ ${foundStop.lng.toFixed(5)}
* **ದೈನಂದಿನ ಸಂಚಾರ ಸಾಂದ್ರತೆ:** **${foundStop.dailyTrips} ಬಸ್ ಟ್ರಿಪ್‌ಗಳು/ದಿನ** ಈ ನಿಲ್ದಾಣದ ಮೂಲಕ ಹಾದುಹೋಗುತ್ತವೆ
* **ಸಂಪರ್ಕಿತ ಮಾರ್ಗಗಳು:** **${foundStop.routesCount} ವಿಭಿನ್ನ ಬಿಎಂಟಿಸಿ ಮಾರ್ಗಗಳು**
* **ಪ್ರಮುಖ ಬಸ್ ಮಾರ್ಗಗಳು:** ${topRouteChips}
${routeEntries.length > 10 ? `\n*+${routeEntries.length - 10} ಇತರೆ ಮಾರ್ಗಗಳು ಈ ನಿಲ್ದಾಣವನ್ನು ಸಂಪರ್ಕಿಸುತ್ತವೆ.*` : ""}

💡 *ಸಲಹೆ:* ಯಾವುದೇ ಆನ್‌ಲೈನ್ ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದರೂ ಭಾರತ್ ವಿಷನ್ ಈ ನಿಲ್ದಾಣದ ಸಂಪೂರ್ಣ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಲಭ್ಯವಾಗಿಸುತ್ತದೆ.`;
    } else if (appLang === "hi") {
      return offlineBadge + `### 🚏 बीएमटीसी आधिकारिक बस स्टॉप: **${foundStop.name}**

* **लोकेशन:** अक्षांश ${foundStop.lat.toFixed(5)}, देशांतर ${foundStop.lng.toFixed(5)}
* **दैनिक बस आवागमन:** **${foundStop.dailyTrips} बस फेरे/प्रतिदिन**
* **जुड़े हुए रूट:** कुल **${foundStop.routesCount} अलग-अलग बीएमटीसी रूट**
* **प्रमुख रूट:** ${topRouteChips}
${routeEntries.length > 10 ? `\n*+${routeEntries.length - 10} अन्य रूट भी इस स्टॉप पर रुकते हैं।*` : ""}

💡 *सुझाव:* यह जानकारी आपके डिवाइस के ऑफलाइन डेटाबेस से सीधे लोड की गई है।`;
    } else {
      return offlineBadge + `### 🚏 Official BMTC Bus Stop: **${foundStop.name}**

* **Coordinates:** Lat **${foundStop.lat.toFixed(5)}**, Lon **${foundStop.lng.toFixed(5)}**
* **Daily Trip Density:** **${foundStop.dailyTrips} bus trips/day** passing through this stop
* **Connected Routes:** **${foundStop.routesCount} distinct BMTC routes**
* **Top Operating Routes:** ${topRouteChips}
${routeEntries.length > 10 ? `\n*+${routeEntries.length - 10} additional feeder and ordinary routes stop here.*` : ""}

💡 *Commuter Tip:* Even underground without cellular data, Bharat Vision serves full BMTC stop frequencies offline.`;
    }
  }

  // 3. OFFICIAL BMTC FLEET & DIVISIONAL STATISTICS (from 56f6deb2-c7ad-4ade-88fb-92190eafe19b.csv)
  if (q.includes("fleet") || q.includes("division") || q.includes("buses held") || q.includes("buses on road") || q.includes("how many buses") || q.includes("depot")) {
    if (appLang === "kn") {
      return offlineBadge + `### 🚌 ಬಿಎಂಟಿಸಿ ಅಧಿಕೃತ ಫ್ಲೀಟ್ ಮತ್ತು ವಿಭಾಗೀಯ ಕಾರ್ಯಾಚರಣೆ ಮಾಹಿತಿ

* **ಒಟ್ಟು ಬೆಂಗಳೂರು ಬಸ್‌ಗಳು (Held Fleet):** **6,514.9 ಬಸ್‌ಗಳು** (ನಗರವ್ಯಾಪಿ ಅಧಿಕೃತ ಫ್ಲೀಟ್)
* **ದೈನಂದಿನ ರಸ್ತೆಯಲ್ಲಿರುವ ಬಸ್‌ಗಳು:** **5,542.4 ಬಸ್‌ಗಳು/ದಿನ**
* **ಫ್ಲೀಟ್ ಬಳಕೆಯ ದರ (Utilization):** **85.1%** (ಸ್ಪೇರ್ ರಿಸರ್ವ್: **504.9 ಬಸ್‌ಗಳು**)
* **ಆಫ್-ರೋಡ್ ನಿರ್ವಹಣೆ ದರ:** **7.1%** (467.4 ಬಸ್‌ಗಳು)

#### 🏢 ಅಧಿಕೃತ 6 ವಿಭಾಗಗಳ ವಿವರ:
* **ಉತ್ತರ ವಿಭಾಗ (ಯಲಹಂಕ / ಹೆಬ್ಬಾಳ / ದೊಡ್ಡಬಳ್ಳಾಪುರ):** **1,416.4 ಬಸ್‌ಗಳು** (87.5% ಬಳಕೆ)
* **ಪಶ್ಚಿಮ ವಿಭಾಗ (ಯಶವಂತಪುರ / ಪೀಣ್ಯ / ಕೆಂಗೇರಿ):** **1,174.8 ಬಸ್‌ಗಳು** (85.5% ಬಳಕೆ)
* **ದಕ್ಷಿಣ ವಿಭಾಗ (ಬನಶಂಕರಿ / ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ / ಜಯನಗರ):** **1,138.2 ಬಸ್‌ಗಳು** (88.2% ಬಳಕೆ)
* **ಪೂರ್ವ ವಿಭಾಗ (ವೈಟ್‌ಫೀಲ್ಡ್ / ಇಂದಿರಾನಗರ / ಕೆಆರ್ ಪುರಂ):** **1,026.6 ಬಸ್‌ಗಳು** (84.2% ಬಳಕೆ)
* **ಈಶಾನ್ಯ ವಿಭಾಗ (ನಾಗವಾರ / ಥಣಿಸಂದ್ರ / ಕಲ್ಯಾಣ ನಗರ):** **906.5 ಬಸ್‌ಗಳು** (87.0% ಬಳಕೆ)
* **ಕೇಂದ್ರ ವಿಭಾಗ (ಮೆಜೆಸ್ಟಿಕ್ / ಶಿವಾಜಿನಗರ / ಶಾಂತಿನಗರ):** **852.2 ಬಸ್‌ಗಳು** (75.2% ಬಳಕೆ)

* **ಒಟ್ಟು ಸಕ್ರಿಯ ಟಿಟಿಎಂಸಿ ಡಿಪೋಗಳು:** ಬೆಂಗಳೂರಿನಾದ್ಯಂತ **50 ಡಿಪೋಗಳು**.`;
    } else if (appLang === "hi") {
      return offlineBadge + `### 🚌 बीएमटीसी आधिकारिक फ्लीट एवं संभागीय परिचालन (Govt Data)

* **कुल बेंगलुरु फ्लीट (Held):** **6,514.9 बसें**
* **दैनिक ऑन-रोड बसें:** **5,542.4 बसें/प्रतिदिन**
* **फ्लीट उपयोगिता दर (Utilization):** **85.1%** (स्पेयर बसें: **504.9 बसें**)
* **ऑफ-रोड मेंटेनेंस दर:** **7.1%** (467.4 बसें)

#### 🏢 आधिकारिक 6 डिवीजनों का विवरण:
* **नॉर्थ डिवीजन (येलहंका / हेब्बाल / दोड्डबल्लापुर):** **1,416.4 बसें** (87.5% उपयोगिता)
* **वेस्ट डिवीजन (यशवंतपुर / पीण्या / केंगेरी):** **1,174.8 बसें** (85.5% उपयोगिता)
* **साउथ डिवीजन (बनशंकरी / इलेक्ट्रॉनिक सिटी / जयनगर):** **1,138.2 बसें** (88.2% उपयोगिता)
* **ईस्ट डिवीजन (व्हाइटफील्ड / इंदिरानगर / केआर पुरम):** **1,026.6 बसें** (84.2% उपयोगिता)
* **नॉर्थ ईस्ट डिवीजन (नागवारा / थणिसंद्रा / कल्याण नगर):** **906.5 बसें** (87.0% उपयोगिता)
* **सेंट्रल डिवीजन (मजेस्टिक / शिवाजीनगर / शांतिनगर):** **852.2 बसें** (75.2% उपयोगिता)

* **कुल एक्टिव टीटीएमसी डिपो:** बेंगलुरु में **50 मुख्य डिपो**।`;
    } else {
      return offlineBadge + `### 🚌 Official BMTC Fleet & Divisional Operations (Govt Open Data)

* **Bengaluru Total Fleet Held:** **6,514.9 buses** (Official operational average)
* **Buses on Road Daily:** **5,542.4 buses/day**
* **Fleet Utilization Rate:** **85.1%** (Road-worthy spare reserves: **504.9 buses**)
* **Off-Road Maintenance Rate:** **7.1%** (467.4 buses)

#### 🏢 Official Division Breakdown:
* **North Division (Yelahanka / Hebbal / Doddaballapur):** **1,416.4 held** | 1,239.9 on road (**87.5% utilization**)
* **West Division (Yeshwantpur / Peenya / Kengeri):** **1,174.8 held** | 1,004.8 on road (**85.5% utilization**)
* **South Division (Banashankari / Electronic City / Jayanagar):** **1,138.2 held** | 1,003.9 on road (**88.2% utilization**)
* **East Division (Whitefield / Indiranagar / KR Puram):** **1,026.6 held** | 864.4 on road (**84.2% utilization**)
* **North East Division (Nagawara / Thanisandra / Kalyan Nagar):** **906.5 held** | 788.7 on road (**87.0% utilization**)
* **Central Division (Majestic / Shivajinagar / Shantinagar):** **852.2 held** | 640.7 on road (**75.2% utilization**)

* **Total Active Operating Depots:** **50 TTMC Depots** across Bengaluru metropolitan region.`;
    }
  }

  // 4. NAMMA METRO CORRIDORS & STATIONS INQUIRY (from namma_metro.json)
  const isMetroQuery = q.includes("metro") || q.includes("train") || q.includes("purple") || q.includes("green") || q.includes("yellow") || q.includes("interchange");
  const matchedStation = METRO_STATIONS.find(s => q.includes(s.name.toLowerCase()));

  if (matchedStation || (isMetroQuery && (q.includes("timing") || q.includes("time") || q.includes("schedule") || q.includes("interchange") || q.includes("line")))) {
    if (appLang === "kn") {
      return offlineBadge + `### 🚇 ನಮ್ಮ ಮೆಟ್ರೋ ಅಧಿಕೃತ ಮಾಹಿತಿ (Namma Metro Network)

${matchedStation ? `* **ಮೆಟ್ರೋ ನಿಲ್ದಾಣ:** **${matchedStation.name}**\n* **ಸಂಪರ್ಕಿತ ಮಾರ್ಗಗಳು:** ${matchedStation.lines.join(", ")} ಲೈನ್\n* **ಇಂಟರ್‌ಚೇಂಜ್ ಹಬ್:** ${matchedStation.isInterchange ? "ಹೌದು (ಪ್ರಮುಖ ಜಂಕ್ಷನ್)" : "ನಿಯಮಿತ ನಿಲ್ದಾಣ"}\n` : ""}
* **ನೇರಳೆ ಲೈನ್ (Purple Line):** ಚಲ್ಲಘಟ್ಟ ⇄ ವೈಟ್‌ಫೀಲ್ಡ್ (ಕಡುಗೋಡಿ) - 43.49 ಕಿ.ಮೀ. (ಮೆಜೆಸ್ಟಿಕ್, ಎಂಜಿ ರಸ್ತೆ, ಇಂದಿರಾನಗರ, ಕೆಆರ್ ಪುರಂ ಮೂಲಕ).
* **ಹಸಿರು ಲೈನ್ (Green Line):** ನಾಗಸಂದ್ರ ⇄ ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ - 30.5 ಕಿ.ಮೀ. (ಯಶವಂತಪುರ, ಮೆಜೆಸ್ಟಿಕ್, ಬನಶಂಕರಿ ಮೂಲಕ).
* **ಪ್ರಮುಖ ಇಂಟರ್‌ಚೇಂಜ್:** ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿಲ್ದಾಣ (ಮೆಜೆಸ್ಟಿಕ್) - ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1/2 (ಹಸಿರು ಲೈನ್) ಮತ್ತು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 3/4 (ನೇರಳೆ ಲೈನ್).
* **ರೈಲು ಆವರ್ತನ:** ಪೀಕ್ ಸಮಯದಲ್ಲಿ ಪ್ರತಿ **3.5 ರಿಂದ 5 ನಿಮಿಷಗಳಿಗೆ**.
* **ಸಮಯ:** ಮುಂಜಾನೆ **05:00 AM** ರಿಂದ ರಾತ್ರಿ **11:00 PM** ವರೆಗೆ (ಭಾನುವಾರ ಬೆಳಗ್ಗೆ 07:00 AM).
* **ದರ:** ಕನಿಷ್ಠ **₹10** ರಿಂದ ಗರಿಷ್ಠ **₹60** (ಸ್ಮಾರ್ಟ್‌ಕಾರ್ಡ್ / NCMC ಕಾರ್ಡ್‌ಗೆ **5% ರಿಯಾಯಿತಿ**).`;
    } else if (appLang === "hi") {
      return offlineBadge + `### 🚇 नम्मा मेट्रो आधिकारिक गाइड (Namma Metro Network)

${matchedStation ? `* **मेट्रो स्टेशन:** **${matchedStation.name}**\n* **लाइन:** ${matchedStation.lines.join(", ")} लाइन\n* **इंटरचेंज हब:** ${matchedStation.isInterchange ? "हाँ (मुख्य जंक्शन)" : "नियमित स्टेशन"}\n` : ""}
* **पर्पल लाइन (Purple Line):** चल्लाघट्टा ⇄ व्हाइटफील्ड (काडुगोडी) - 43.5 किमी (मजेस्टिक, एमजी रोड, इंदिरानगर होकर)।
* **ग्रीन लाइन (Green Line):** नागासंद्रा ⇄ सिल्क इंस्टीट्यूट - 30.5 किमी (यशवंतपुर, मजेस्टिक, बनशंकरी होकर)।
* **मुख्य इंटरचेंज:** केम्पेगौड़ा मजेस्टिक स्टेशन - प्लेटफॉर्म 1/2 (ग्रीन लाइन) एवं प्लेटफॉर्म 3/4 (पर्पल लाइन)।
* **ट्रेन फ्रीक्वेंसी:** पीक आवर्स में हर **3.5 से 5 मिनट** में।
* **संचालन समय:** सुबह **05:00 AM** से रात **11:00 PM** तक (रविवार सुबह 07:00 AM)।
* **किराया:** न्यूनतम **₹10** से अधिकतम **₹60** (NCMC और स्मार्ट कार्ड पर **5% की छूट**)।`;
    } else {
      return offlineBadge + `### 🚇 Namma Metro Official Transit System

${matchedStation ? `* **Station Identified:** **${matchedStation.name}**\n* **Serving Line(s):** **${matchedStation.lines.join(", ")} Line**\n* **Interchange Hub:** ${matchedStation.isInterchange ? "Yes (Major Multi-Line Interchange)" : "Standard Passenger Platform"}\n` : ""}
* **Purple Line Corridor:** **Challaghatta ⇄ Whitefield (Kadugodi)** — 43.5 km non-stop CBD spine passing Majestic, MG Road, Indiranagar, Baiyappanahalli, and ITPL.
* **Green Line Corridor:** **Nagasandra ⇄ Silk Institute** — 30.5 km North-South spine passing Yeshwanthpur, Rajajinagar, Majestic, Jayanagar, and Banashankari.
* **Central Interchange:** **Nadaprabhu Kempegowda Station (Majestic)** — Escalators connect Platforms 1/2 (Green Line) and Platforms 3/4 (Purple Line).
* **Train Headways:** Every **3.5 to 5 minutes** during peak hours | Every 7–8 mins off-peak.
* **First & Last Timings:** First train **05:00 AM** | Last train **11:00 PM** (Sundays start 07:00 AM).
* **Fare Structure:** Minimum **₹10** to Maximum **₹60** (Flat **5% discount** using NCMC Metro Smartcard).`;
    }
  }

  // 5. PASSES, FARES, AND CONCESSIONS
  if (q.includes("pass") || q.includes("ticket") || q.includes("fare") || q.includes("price") || q.includes("concession") || q.includes("student")) {
    if (appLang === "kn") {
      return offlineBadge + `### 🎫 ಬಿಎಂಟಿಸಿ & ನಮ್ಮ ಮೆಟ್ರೋ ದರ ಮತ್ತು ಪಾಸ್ ವಿವರಗಳು

* **ದೈನಂದಿನ ಸಾಮಾನ್ಯ ಬಸ್ ಪಾಸ್:** **₹70** (ಕಂಡಕ್ಟರ್ ಬಳಿ ಲಭ್ಯ, ಯಾವುದೇ ಸರ್ಕಾರಿ ಐಡಿ ತೋರಿಸಿ ಪಡೆಯಬಹುದು).
* **ದೈನಂದಿನ ವಜ್ರ ಎಸಿ ಪಾಸ್:** **₹120** (ಎಲ್ಲಾ ವಜ್ರ ಎಸಿ ಬಸ್‌ಗಳಲ್ಲೂ ಅನ್ವಯಿಸುತ್ತದೆ, ವಿಮಾನ ನಿಲ್ದಾಣದ ಬಸ್‌ಗಳನ್ನು ಹೊರತುಪಡಿಸಿ).
* **ಮಾಸಿಕ ಸಾಮಾನ್ಯ ಪಾಸ್:** **₹1,050** (ಬಿಎಂಟಿಸಿ ಟಿಟಿಎಂಸಿ ಕೌಂಟರ್‌ಗಳಲ್ಲಿ ಲಭ್ಯ).
* **ಮಾಸಿಕ ವಜ್ರ ಎಸಿ ಪಾಸ್:** **₹2,200** (ನಗರವ್ಯಾಪಿ ಪೂರ್ಣ ಪ್ರವೇಶ).
* **ನಮ್ಮ ಮೆಟ್ರೋ ಟೋಕನ್/ಸ್ಮಾರ್ಟ್‌ಕಾರ್ಡ್:** **₹10 ರಿಂದ ₹60** (ಸ್ಮಾರ್ಟ್‌ಕಾರ್ಡ್ / NCMC ಕಾರ್ಡ್‌ಗೆ **5% ರಿಯಾಯಿತಿ**).
* **ವಿದ್ಯಾರ್ಥಿ ರಿಯಾಯಿತಿ:** ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸೇವಾ ಸಿಂಧು ಮೂಲಕ ಶೇ. 75% ರಿಯಾಯಿತಿ ಪಾಸ್ ಲಭ್ಯ.
* **ಸಹಾಯವಾಣಿ:** ಬಿಎಂಟಿಸಿ: **080-22483777** | ಮೆಟ್ರೋ: **1800-425-12345** | ತುರ್ತು: **112**.`;
    } else if (appLang === "hi") {
      return offlineBadge + `### 🎫 बीएमटीसी एवं नम्मा मेट्रो किराया तथा पास विवरण

* **दैनिक साधारण बस पास:** **₹70** (कंडक्टर से तुरंत खरीदा जा सकता है, किसी भी सरकारी पहचान पत्र के साथ)।
* **दैनिक वोल्वो वज्र एसी पास:** **₹120** (एयरपोर्ट वोल्वो को छोड़कर सभी वज्र एसी बसों में मान्य)।
* **मासिक साधारण पास:** **₹1,050** (टीटीएमसी डिपो केंद्रों पर उपलब्ध)।
* **मासिक वोल्वो वज್ರ पास:** **₹2,200**।
* **नम्मा मेट्रो किराया:** **₹10 से ₹60** (NCMC और स्मार्ट कार्ड पर **5% की छूट**)।
* **विद्यार्थी रियायत:** छात्रों के लिए 75% रियायती पास ई-केवाईसी सत्यापन द्वारा मान्य।
* **हेल्पलाइन:** बीएमटीसी: **080-22483777** | मेट्रो: **1800-425-12345** | आपातकाल: **112**।`;
    } else {
      return offlineBadge + `### 🎫 Official BMTC & Namma Metro Fare & Pass Structure

* **BMTC Daily Non-AC Pass:** **₹70** (Issued directly on-board by conductors with any government ID).
* **BMTC Daily Volvo Vajra AC Pass:** **₹120** (Unlimited travel on all AC Vajra services, excluding KIA airport shuttles).
* **BMTC Monthly Ordinary Pass:** **₹1,050** (Issued at all 50 major TTMC depots).
* **BMTC Monthly Volvo Vajra Pass:** **₹2,200** (Full citywide network).
* **Namma Metro Fare Slabs:** Minimum **₹10** to Maximum **₹60** (Flat **5% discount** using NCMC / Smartcard).
* **Student Concession Pass:** **75% fare concession** subsidized for institutional students via e-KYC.
* **Official Helplines:** BMTC: **080-22483777** | Metro: **1800-425-12345** | Police/SOS: **112**.`;
    }
  }

  // 6. MULTI-MODAL POINT-TO-POINT CORRIDORS
  let matchedCorridor: CorridorDetails | null = null;
  if ((q.includes("yelahanka") && (q.includes("silk") || q.includes("500d") || q.includes("orr"))) || (q.includes("hebbal") && q.includes("silk"))) {
    matchedCorridor = CORRIDOR_KNOWLEDGE_BASE["yelahanka_silkboard"];
  } else if ((q.includes("majestic") && q.includes("whitefield")) || q.includes("kadugodi") || q.includes("itpl")) {
    matchedCorridor = CORRIDOR_KNOWLEDGE_BASE["majestic_whitefield"];
  } else if ((q.includes("koramangala") && q.includes("electronic")) || q.includes("365") || q.includes("ecity")) {
    matchedCorridor = CORRIDOR_KNOWLEDGE_BASE["koramangala_electronic_city"];
  } else if (q.includes("airport") || q.includes("kia") || q.includes("vayu vajra") || q.includes("flight")) {
    matchedCorridor = CORRIDOR_KNOWLEDGE_BASE["airport_transit"];
  } else if (q.includes("hebbal") && q.includes("majestic")) {
    matchedCorridor = CORRIDOR_KNOWLEDGE_BASE["majestic_hebbal"];
  }

  if (matchedCorridor) {
    if (appLang === "kn") {
      return offlineBadge + `### 🗺️ ಮಾರ್ಗ ಯೋಜನೆ: ${matchedCorridor.title}

* **ಪ್ರಮುಖ ಬಸ್ ಮಾರ್ಗಗಳು:** ${matchedCorridor.buses.join(" • ")}
${matchedCorridor.metro ? `* **ಮೆಟ್ರೋ ಆಯ್ಕೆ:** ${matchedCorridor.metro}\n` : ""}* **ಅಂದಾಜು ಪ್ರಯಾಣ ಸಮಯ:** ${matchedCorridor.duration}
* **ದರ ಮಾಹಿತಿ:** ${matchedCorridor.fare}
* **ಪ್ರಮುಖ ಟ್ರಾಫಿಕ್ ಜಂಕ್ಷನ್‌ಗಳು:** ${matchedCorridor.chokePoints}

#### 📋 ಹಂತ-ಹಂತದ ಪ್ರಯಾಣ ವಿವರ:
${matchedCorridor.steps.map((s, idx) => `**ಹಂತ ${idx + 1}:** ${s}`).join("\n")}

💡 *ಸಲಹೆ:* ಪೀಕ್ ಸಮಯದಲ್ಲಿ ಟ್ರಾಫಿಕ್ ತಪ್ಪಿಸಲು ಸಮೀಪದ ಮೆಟ್ರೋ ಕಾರಿಡಾರ್ ಆದ್ಯತೆ ನೀಡಿ.`;
    } else if (appLang === "hi") {
      return offlineBadge + `### 🗺️ रूट योजना: ${matchedCorridor.title}

* **प्रमुख बस रूट:** ${matchedCorridor.buses.join(" • ")}
${matchedCorridor.metro ? `* **मेट्रो विकल्प:** ${matchedCorridor.metro}\n` : ""}* **अनुमानित यात्रा समय:** ${matchedCorridor.duration}
* **किराया:** ${matchedCorridor.fare}
* **ट्रैफिक कंजेशन प्वाइंट्स:** ${matchedCorridor.chokePoints}

#### 📋 चरणबद्ध यात्रा योजना:
${matchedCorridor.steps.map((s, idx) => `**चरण ${idx + 1}:** ${s}`).join("\n")}

💡 *सुझाव:* भारी ट्रैफिक के दौरान नम्मा मेट्रो पर्पल/ग्रीन लाइन को प्राथमिकता दें।`;
    } else {
      return offlineBadge + `### 🗺️ Optimal Transit Itinerary: ${matchedCorridor.title}

* **Primary Bus Routes:** ${matchedCorridor.buses.join(" • ")}
${matchedCorridor.metro ? `* **Metro Alternative:** ${matchedCorridor.metro}\n` : ""}* **Estimated Travel Duration:** ${matchedCorridor.duration}
* **Fare Breakdown:** ${matchedCorridor.fare}
* **Critical Traffic Bottlenecks:** ${matchedCorridor.chokePoints}

#### 📋 Step-by-Step Itinerary:
${matchedCorridor.steps.map((s, idx) => `**Step ${idx + 1}:** ${s}`).join("\n")}

💡 *Commuter Pro-Tip:* To avoid peak-hour surface jams, prioritize grade-separated Namma Metro Purple / Green lines.`;
    }
  }

  // 7. COMPREHENSIVE GENERAL OFFLINE TRANSIT GUIDE
  if (appLang === "kn") {
    return offlineBadge + `### 🗺️ ವಾನರ ಎಐ: ಬೆಂಗಳೂರು ನೈಜ ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ (Offline Transit Mastermind)

ನಿಮ್ಮ ಪ್ರಶ್ನೆ: **"${query}"**

* **ಮೆಟ್ರೋ ಕಾರ್ಯಾಚರಣೆ (Namma Metro):** ನೇರಳೆ ಲೈನ್ (ಚಲ್ಲಘಟ್ಟ ⇄ ವೈಟ್‌ಫೀಲ್ಡ್) ಮತ್ತು ಹಸಿರು ಲೈನ್ (ನಾಗಸಂದ್ರ ⇄ ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್). ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1/2 (ಹಸಿರು) ಹಾಗೂ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 3/4 (ನೇರಳೆ) ನಡುವೆ ನೇರ ಇಂಟರ್‌ಚೇಂಜ್ ಲಭ್ಯ.
* **ಪ್ರಮುಖ ಬಿಎಂಟಿಸಿ ಮಾರ್ಗಗಳು:**
  - **500D ಎಕ್ಸ್‌ಪ್ರೆಸ್:** ಹೆಬ್ಬಾಳ ➔ ಮಾನ್ಯತಾ ➔ ಟಿನ್ ಫ್ಯಾಕ್ಟರಿ ➔ ಮಾರತ್‌ಹಳ್ಳಿ ➔ ಬೆಳ್ಳಂದೂರು ➔ ಸಿಲ್ಕ್ ಬೋರ್ಡ್ (ಹೊರವರ್ತುಲ ರಸ್ತೆ).
  - **335E / V-335E:** ಮೆಜೆಸ್ಟಿಕ್ ➔ ಎಂಜಿ ರಸ್ತೆ ➔ ಎಚ್‌ಎಎಲ್ ➔ ವೈಟ್‌ಫೀಲ್ಡ್ ಐಟಿಪಿಎಲ್.
  - **250 / 401K:** ಮೆಜೆಸ್ಟಿಕ್ ➔ ಯಶವಂತಪುರ ➔ ಯಲಹಂಕ ⇄ ಕೆಂಗೇರಿ ರಿಂಗ್ ರೋಡ್.
  - **KIA ವಾಯು ವಜ್ರ:** ನಗರದ ಪ್ರಮುಖ ತಾಣಗಳಿಂದ ಕೆಂಪೇಗೌಡ ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ 24 ಗಂಟೆ ನಿರಂತರ ಸೇವೆ (KIA-4, KIA-8, KIA-9).
* **ದರ & ಪಾಸ್:** ಸಾಮಾನ್ಯ ಪಾಸ್: **₹70** | ವಜ್ರ ಎಸಿ ಪಾಸ್: **₹120** | ಮೆಟ್ರೋ: **₹10 - ₹60** (ಸ್ಮಾರ್ಟ್‌ಕಾರ್ಡ್‌ಗೆ 5% ರಿಯಾಯಿತಿ).
* **ಸಹಾಯವಾಣಿ:** ಬಿಎಂಟಿಸಿ: **080-22483777** | ಮೆಟ್ರೋ: **1800-425-12345** | ತುರ್ತು ಸಹಾಯ: **112**.`;
  } else if (appLang === "hi") {
    return offlineBadge + `### 🗺️ वानर एआई: बेंगलुरु वास्तविक ट्रांजिट गाइड (Offline Transit Mastermind)

आपकी क्वेरी: **"${query}"**

* **नम्मा मेट्रो नेटवर्क:** पर्पल लाइन (चल्लाघट्टा ⇄ व्हाइटफील्ड) एवं ग्रीन लाइन (नागासंद्रा ⇄ सिल्क इंस्टीट्यूट)। मजेस्टिक स्टेशन पर प्लेटफॉर्म 1/2 (ग्रीन) तथा 3/4 (पर्पल) पर सीधा इंटरचेंज उपलब्ध है।
* **प्रमुख बीएमटीसी बस कॉरीडोर:**
  - **रूट 500D एक्सप्रेस:** हेब्बाल ➔ मान्यता ➔ टिन फैक्ट्री ➔ मराठाहल्ली ➔ बेल्लंदूर ➔ सिल्क बोर्ड (आउटर रिंग रोड)।
  - **रूट 335E / V-335E:** मजेस्टिक ➔ एमजी रोड ➔ एचएएल ➔ व्हाइटफील्ड आईटीपीएल।
  - **रूट 250 / 401K:** मजेस्टिक ➔ यशवंतपुर ➔ येलहंका ⇄ केंगेरी रिंग रोड।
  - **KIA वायु वज्र वोल्वो:** एयरपोर्ट के लिए 24x7 लक्जरी वोल्वो एक्सप्रेस (KIA-4, KIA-8, KIA-9)।
* **किराया एवं पास:** दैनिक साधारण पास: **₹70** | दैनिक वज्र एसी पास: **₹120** | मेट्रो: **₹10 - ₹60** (5% छूट)।
* **हेल्पलाइन:** बीएमटीसी: **080-22483777** | मेट्रो: **1800-425-12345** | पुलिस/इमरजेंसी: **112**।`;
  } else {
    return offlineBadge + `### 🗺️ Vanara AI: Bengaluru Offline Transit Mastermind

Inquiry: **"${query}"**

* **Rapid Rail Spine (Namma Metro):**
  - **Purple Line:** Challaghatta ⇄ Whitefield (Kadugodi) via Majestic, MG Road, Indiranagar, KR Puram. Frequency: 3.5 mins.
  - **Green Line:** Nagasandra ⇄ Silk Institute via Yeshwanthpur, Majestic, Banashankari. Frequency: 5 mins.
  - **Major Interchange:** Kempegowda Station (Majestic) connects Platforms 1/2 (Green) & Platforms 3/4 (Purple).
* **Key High-Capacity BMTC Corridors:**
  - **Route 500D Express:** Hebbal ➔ Manyata ➔ Tin Factory ➔ Marathahalli ➔ Bellandur ➔ Silk Board (Outer Ring Road).
  - **Route 335E / V-335E:** Majestic ➔ HAL Main Gate ➔ ITPL / Kadugodi.
  - **Route 250 / 401K:** Majestic ➔ Yeshwanthpur ➔ Yelahanka / Kengeri Ring Road.
  - **Vayu Vajra (KIA Series):** 24x7 luxury Volvo airport transit (KIA-4, KIA-8, KIA-9).
* **Fares & Passes:** Daily Ordinary Pass: **₹70** | Daily Vajra Volvo Pass: **₹120** | Metro Token/Smartcard: **₹10 - ₹60** (5% discount on NCMC).
* **Emergency Contacts:** Police/SOS: **112** | Women Helpline: **1091** | BMTC Call Center: **080-22483777** | Metro Helpline: **1800-425-12345**.`;
  }
}
