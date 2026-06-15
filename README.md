# Stoppage Time — Frontend

A real-time dashboard for the **Stoppage Time** WC 2026 AI betting agent. Displays live agent performance stats, bet history, queue state, and logs. Built with React + Vite and styled with Tailwind CSS v4.

> **Backend repository:** [Stoppage Time (API)](https://github.com/sanidavidanagama/Stoppage-Time)

---

## Features

- **Public stats page** — agent status, bets won/lost, total P&L, current balance, win rate donut chart, and a live countdown to the next scheduled run
- **Queue** — view the agent's current match queue (protected)
- **Bets** — full bet history with outcomes (protected)
- **Logs** — live agent log viewer (protected)
- JWT authentication via cookies with protected routes
- Auto-refreshing data using React Query (every 30 seconds)
- Responsive layout with desktop nav and mobile bottom bar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vite.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Data fetching | [TanStack React Query v5](https://tanstack.com/query) |
| Routing | [React Router v7](https://reactrouter.com) |
| HTTP client | [Axios](https://axios-http.com) |
| Auth tokens | [js-cookie](https://github.com/js-cookie/js-cookie) |

---

## Project Structure

```
src/
├── api/
│   ├── client.js        # Axios instance with base URL + auth interceptor
│   ├── auth.js          # Login / logout
│   ├── public.js        # Public stats endpoint
│   ├── queue.js         # Queue API
│   ├── bets.js          # Bets API
│   └── logs.js          # Logs API
├── components/
│   ├── Layout.jsx        # App shell (header, nav, mobile bottom bar)
│   ├── ProtectedRoute.jsx# Auth guard for private pages
│   ├── StatCard.jsx      # Metric card component
│   ├── BetCard.jsx       # Individual bet display
│   ├── QueueCard.jsx     # Queue item display
│   ├── LogViewer.jsx     # Scrollable log output
│   ├── Countdown.jsx     # Live countdown timer
│   └── Icons.jsx         # SVG icon components
├── pages/
│   ├── Stats.jsx         # / — public dashboard
│   ├── Login.jsx         # /login
│   ├── Queue.jsx         # /queue (protected)
│   ├── Bets.jsx          # /bets (protected)
│   └── Logs.jsx          # /logs (protected)
├── App.jsx               # Router setup + QueryClient provider
├── main.jsx              # Entry point
└── index.css             # Global styles + Tailwind imports
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [Stoppage Time backend](https://github.com/sanidavidanagama/Stoppage-Time) running locally or deployed

### Installation

```bash
git clone https://github.com/sanidavidanagama/Stoppage-Time-Frontend
cd Stoppage-Time-Frontend
npm install
```

### Configuration

Copy the example environment file and set the backend URL:

```bash
cp .env.example .env
```

`.env`:

```env
VITE_API_URL=http://localhost:8000
```

Set `VITE_API_URL` to wherever the backend API is running.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Authentication

The app uses JWT bearer tokens stored in a cookie (`access_token`). The Axios client automatically attaches the token to every request via a request interceptor. Pages under `/queue`, `/bets`, and `/logs` are protected — unauthenticated users are redirected to `/login`.

---

## Related

- [Stoppage Time Backend](https://github.com/sanidavidanagama/Stoppage-Time) — FastAPI backend powering the betting agent and REST API
