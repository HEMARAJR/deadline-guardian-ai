# 🛡️ Deadline Guardian AI

> **Predict Missed Deadlines Before They Happen**

Deadline Guardian AI is an AI-powered Chief-of-Staff platform that predicts project risks before deadlines are missed. It analyzes workload, estimates success probability, simulates future outcomes, and generates AI-powered rescue plans to help users complete work on time.

---

## 🌐 Live Demo

**Cloud Run Deployment**

https://deadline-guardian-ai-314376660603.asia-south1.run.app

---

## 📂 GitHub Repository

https://github.com/HEMARAJR/deadline-guardian-ai

---

# Problem Statement

Students, professionals, and teams often realize they will miss deadlines only when it is too late. Existing task managers only remind users—they don't predict failure or suggest recovery strategies.

Deadline Guardian AI solves this by forecasting deadline risks before they occur and recommending personalized rescue plans.

---

# Features

* AI-powered deadline risk prediction
* Future outcome simulation
* Emergency rescue planning
* Google Authentication
* Voice command support
* Interactive dashboard
* Analytics and progress tracking
* Firebase Authentication
* Firestore database
* Google Cloud deployment

---

# Tech Stack

### Frontend

* Next.js 14
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Next.js API Routes

### AI

* Google Gemini API

### Database

* Firebase Firestore

### Authentication

* Firebase Authentication

### Cloud

* Google Cloud Run

---

# Project Structure

```text
app/
components/
hooks/
lib/
public/
types/
agents/
prompts/
```

---

# Installation

```bash
git clone <repository-url>

cd deadline-guardian-ai

npm install

npm run dev
```

Create a `.env.local` file with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
```

---

Architecture Diagram

                    +-------------------------+
                    |        User             |
                    +------------+------------+
                                 |
                                 v
                    +-------------------------+
                    |      Next.js Frontend   |
                    +------------+------------+
                                 |
             +-------------------+-------------------+
             |                   |                   |
             v                   v                   v
     Firebase Auth        Gemini API         Firestore Database
             |                   |                   |
             +-------------------+-------------------+
                                 |
                                 v
                    +-------------------------+
                    |  Risk Prediction Engine |
                    +-------------------------+
                                 |
                                 v
                    +-------------------------+
                    | Future Simulator Engine |
                    +-------------------------+
                                 |
                                 v
                    +-------------------------+
                    |  Rescue Plan Generator  |
                    +-------------------------+
                                 |
                                 v
                    Google Cloud Run Deployment

# Deployment

This project is deployed using **Google Cloud Run**.

---

# Future Enhancements

* Team collaboration
* Calendar integration
* Email reminders
* Mobile application
* AI productivity coach
* Smart scheduling
* Slack integration
* Microsoft Teams integration

---

# License

MIT License
