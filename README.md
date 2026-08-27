# CodeLoom DSA Visualizer — Frontend Web Client

> *"Interactive React + TypeScript interface for step-by-step algorithm visualizer and LeetCode-style problem practice platform."*

This repository contains the web client for **CodeLoom DSA Visualizer**, built with **React 18**, **TypeScript**, **Vite**, **Lucide Icons**, and **TailwindCSS / Vanilla CSS**.

---

## ✨ Features

### 1. 🔍 Algorithm Explorer & Detail Portal
- Browse algorithms by category (Arrays, Sorting, Searching, Graphs, Dynamic Programming, Trees).
- Filter by difficulty, time/space complexity, and real-time search queries.
- Detailed breakdown with intuition explanations, code snippets in multiple languages, and time/space complexity cards.

### 2. 🎬 Interactive Visualization Player
- State animation rendering for **Arrays** (Sorting/Searching bars with comparison, swap, pivot highlights) and **Graphs** (SVG nodes & edges with BFS/DFS visit highlights).
- Playback controls: Play, Pause, Step Forward, Step Backward, Speed adjustment slider (0.25x to 4x), and custom array/graph input generators.

### 3. 💻 LeetCode-Style Problem Practice Workspace
- Problem explorer with difficulty tags (`EASY`, `MEDIUM`, `HARD`), acceptance rates, and topic tags.
- Split-pane problem detail workspace with problem description, examples, constraints, and interactive code editor.
- Simulated code execution runner (`Run Code`) and verdict submission engine (`Submit Code`).
- Auto-saving draft logic.

### 4. 📊 Gamification & Learning Analytics (`/analytics`)
- **Daily Streak Card**: Live flame indicator with streak freeze protections.
- **Level & XP Progress**: Level badge and XP progress bar.
- **Activity Heatmap**: GitHub-style green contribution grid with interactive hover tooltips.
- **Topic Skill Radar**: Custom SVG spider/radar chart displaying mastery across DSA categories.
- **Achievement Showcase**: Trophy showcase highlighting unlocked badges with gold glow.
- **Global Leaderboard**: Ranked top 10 learners by total XP.

---

## 🛠️ Project Structure

```text
frontend/
├── dist/                      # Production build output
├── nginx.conf                 # Nginx SPA configuration & API reverse proxy
├── public/                    # Static assets & favicon
└── src/
    ├── api/                   # Axios API service modules
    │   ├── apiClient.ts       # Axios instance with JWT interceptor
    │   ├── algorithmService.ts
    │   ├── analyticsService.ts
    │   ├── problemService.ts
    │   └── submissionService.ts
    ├── components/            # Reusable UI components
    │   ├── algorithm/         # Detail views, snippets, examples, favorites
    │   ├── analytics/         # Heatmap, Radar Chart, Streak Card, Badges, Leaderboard
    │   ├── dashboard/         # Stat cards, recent activity, continue learning
    │   ├── layout/            # Navbar, Footer, AppLayout
    │   ├── ui/                # Buttons, Cards, Inputs, Badges, Spinners
    │   └── visualization/     # Array Visualizer, Graph Visualizer, Playback Controls
    ├── context/               # AuthContext & global state providers
    ├── pages/                 # Route pages (Home, Algorithms, Player, Problems, Analytics, Dashboard)
    ├── routes/                # Protected & Public route setup
    ├── types/                 # TypeScript interfaces and DTO types
    └── utils/                 # Storage & formatting helpers
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `frontend` folder (or copy `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Type Check & Production Build

### TypeScript Validation
```bash
npx tsc -b
```

### Build for Production
```bash
npm run build
```
The optimized static bundle will be generated in `dist/`.

---

## 🐳 Docker Deployment

The frontend includes a multi-stage Docker build that compiles Vite static files and serves them via Nginx with SPA routing support:

```bash
docker build -t codeloom-frontend .
docker run -p 80:80 codeloom-frontend
```

---

## 📜 License

Distributed under the MIT License.
