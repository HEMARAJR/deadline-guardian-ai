# 🛡️ Deadline Guardian AI

> **"Predict missed deadlines before they happen."**

An AI Chief-of-Staff platform that listens to voice commands, calculates deadline risk in real-time, simulates future outcomes, and generates emergency rescue plans.

Built for hackathons. Production-quality code.

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd deadline-guardian-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your keys (see below)

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Create `.env.local`:

```env
# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI (from Google AI Studio → aistudio.google.com)
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

---

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Google provider
4. Enable **Firestore Database** (start in test mode)
5. Copy config to `.env.local`
6. Deploy security rules: `firebase deploy --only firestore:rules`

---

## 🤖 Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Add to `.env.local` as `GEMINI_API_KEY`

> **Note:** The app works in demo mode without API keys — AI responses fall back to intelligent local calculations.

---

## 📁 Project Structure

```
deadline-guardian-ai/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── dashboard/               # Main dashboard
│   ├── command-center/          # Voice AI interface
│   ├── simulator/               # Future simulation
│   ├── rescue/                  # Emergency rescue
│   ├── analytics/               # Analytics
│   ├── settings/                # Settings
│   └── api/
│       ├── chat/route.ts        # Voice command API
│       ├── risk/route.ts        # Risk prediction API
│       ├── future/route.ts      # Simulation API
│       ├── rescue/route.ts      # Rescue plan API
│       └── breakdown/route.ts   # Task breakdown API
├── agents/
│   ├── plannerAgent.ts          # Task breakdown
│   ├── riskAgent.ts             # Risk prediction
│   ├── futureAgent.ts           # Future simulation
│   └── rescueAgent.ts           # Rescue planning
├── components/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── TaskCard.tsx
│   ├── VoiceInterface.tsx
│   ├── RiskMeter.tsx
│   ├── FutureTimeline.tsx
│   ├── RescuePlan.tsx
│   └── AnalyticsChart.tsx
├── hooks/
│   ├── useAuth.ts               # Firebase auth
│   ├── useVoice.ts              # Web Speech API
│   └── useTasks.ts              # Task CRUD
├── lib/
│   ├── firebase.ts              # Firebase init
│   ├── firestore.ts             # Firestore operations
│   ├── gemini.ts                # Gemini AI client
│   └── store.ts                 # Zustand state
├── prompts/
│   ├── taskBreakdown.ts
│   ├── riskPrediction.ts
│   ├── futureSimulation.ts
│   ├── rescuePlanning.ts
│   └── voiceCommand.ts
└── types/
    └── index.ts                 # TypeScript types
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎙️ **Voice Commands** | Speak tasks naturally — AI extracts deadline, effort, category |
| 📊 **Risk Prediction** | Real-time success probability with AI reasoning |
| ⚡ **Future Simulator** | "What if I delay 24h?" — visual scenario comparison |
| 🚨 **Rescue Planner** | Emergency hour-by-hour rescue schedules |
| 📈 **Analytics** | Weekly trends, risk distribution, completion rates |
| 🔐 **Google Auth** | One-click sign in with Firebase |
| 💾 **Cloud Sync** | All data persisted to Firestore |

---

## 🏆 Tech Stack

- **Next.js 14** App Router
- **TypeScript** — fully typed
- **Tailwind CSS** — dark futuristic UI
- **Firebase** — Auth + Firestore
- **Gemini 1.5 Flash** — AI reasoning
- **Framer Motion** — animations
- **Zustand** — state management
- **Recharts** — data visualization
- **Web Speech API** — voice recognition

---

## 🚢 Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📄 License

MIT — Free to use, modify, and distribute.

Built with ❤️ for hackathons.
