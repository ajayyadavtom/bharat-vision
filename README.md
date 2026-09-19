# 🚀 Bharat Vision | Bengaluru Neural Transit Hub 20X

**Bharat Vision** is a next-generation, AI-powered multi-modal transit ecosystem designed exclusively for Namma Bengaluru. Built to solve critical urban mobility challenges, it seamlessly integrates BMTC bus tracking, Namma Metro token generation, dynamic route planning, and offline SOS capabilities into a single, unified Progressive Web App (PWA).

**Developer:** Ajay M.

---

## 🧠 Core Architecture & Modules

| Module | Description | Tech Stack |
| :--- | :--- | :--- |
| **Vanara AI Engine** | Live, context-aware transit assistant powered by Google Gemini. Provides route optimization, delay analysis, and local transit guidance in real-time. | Gemini 3.6 AI, REST API |
| **Namma Metro Hub** | Dynamic fare calculator, active route interchange detection (e.g., Majestic), and instant QR token generation linked directly to a cloud wallet. | React, Zustand, Edge Routes |
| **SafeKeep Offline SOS** | Zero-network cellular fallback system. Allows commuters to dispatch emergency SMS payloads and purchase offline tickets in dead zones. | HTML5 Intents, Native APIs |
| **Commuter Karma** | Gamified impact dashboard tracking carbon offset, verified hazard reporting (e.g., Silk Board congestion), and student ID verification. | Supabase, PostgreSQL |

---

## ⚡ Technical Stack

*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
*   **Backend & Database:** Supabase (Cloud PostgreSQL), Vercel Edge Functions
*   **Artificial Intelligence:** Google Generative AI (Gemini Flash)
*   **Infrastructure:** Fully offline-capable Progressive Web App (PWA) with custom service workers.

---

## 🔒 Security & Resilience

Bharat Vision is designed for high-density urban environments where network reliability fluctuates. The application features a robust **PWA Offline Engine** utilizing `PwaRegistry`. If a user loses 5G connectivity while underground or in transit, critical components like the SafeKeep SOS and SMS Ticket Fallback seamlessly pivot to native cellular carrier intents, ensuring the commuter is never stranded.

---

## 🌍 The Vision

Bengaluru requires a transit infrastructure that matches its status as a global technology capital. The Bengaluru Neural Transit Hub 20X architecture bridges the gap between disparate transport authorities (BMTC, BMRCL) and the everyday commuter, drastically reducing wait times, carbon emissions, and transit friction. 

---

### 💻 Local Development Setup

1. Clone the repository:
   \`git clone https://github.com/your-username/bharat-vision.git\`
2. Install dependencies:
   \`npm install\`
3. Configure Environment Variables (\`.env.local\`):
   * \`NEXT_PUBLIC_SUPABASE_URL\`
   * \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   * \`GEMINI_API_KEY\`
4. Launch the local development server:
   \`npm run dev\`