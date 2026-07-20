# Stoppage Time — Frontend

A public-facing arena site for **Stoppage Time**, an AI agent that reasons through World Cup 2026 fixtures and bets real money on Polymarket when it finds an edge. The frontend lets anyone kick off a live fixture analysis, watch the agent's pipeline run step by step, browse the full bet history with the reasoning behind every decision, and follow the agent's real-money track record. Built with React + Vite and styled with Tailwind CSS v4.

> **Backend repository:** [Stoppage Time (API)](https://github.com/sanidavidanagama/Stoppage-Time) — FastAPI + Supabase, see its [API README](https://github.com/sanidavidanagama/Stoppage-Time/blob/main/api/README.md) for the full endpoint reference.

---

## Features

- **Home** — landing page with a pitch for the project and a snapshot of the live record
- **Fixture Analysis** — kick off a new pipeline run for any fixture (home/away team, stage, kickoff time, multi-agent or unified pipeline), then watch it move live through planning → reasoning → betting on a match-clock-style timeline, with the full probability split, edge, and reasoning once a decision lands
- **Awaiting Orders** — decisions the agent has made but hasn't placed an order for yet; confirm or discard them
- **Bet History** — every settled and open bet, paginated, with outcome, P&L, and a manual "run settlement" trigger for admins
- **Bet detail** — the full reasoning trail behind a single bet, reconstructed from the agent's logs
- **How It Works** — an explainer of the agent pipeline: the five specialist agents, the "wall" that keeps reasoning blind to market prices, the two pipeline architectures (multi-agent vs. unified), and a day-in-the-life walkthrough
- **Match Stats** — public dashboard of the agent's live-money performance: cumulative P&L, win rate, ROI, wallet balance, biggest win/loss, and recent form
- **Share cards** — turn any bet (live or historical) into a shareable image card via `html2canvas`
- **JWT authentication** via cookies — creating a fixture, placing an order, discarding a decision, and running settlement all require sign-in; everything else is public
- Auto-refreshing data using React Query (live fixture runs poll every ~2.5s until terminal, stats every 30s, awaiting orders every 20s)
- Responsive layout with desktop nav and a mobile slide-out menu

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
| Markdown rendering | [react-markdown](https://github.com/remarkjs/react-markdown) (agent log content) |
| Share card export | [html2canvas](https://html2canvas.hertzen.com) |

---

## Project Structure

```
src/
├── api/
│   ├── client.js         # Axios instance with base URL + auth interceptor
│   ├── auth.js           # Login / logout / isAuthenticated
│   ├── fixture.js        # Create/poll a fixture run, place an order
│   ├── orders.js         # Awaiting-orders queue (list, discard)
│   ├── history.js        # Bet history (list, detail)
│   ├── settlement.js     # Manual settlement trigger
│   └── stats.js          # Public agent stats
├── components/
│   ├── Layout.jsx         # App shell (top nav, mobile menu, ambient background)
│   ├── Flag.jsx           # Team flag icon from src/data/teamFlags.js
│   ├── MatchClock.jsx     # Pipeline timeline built from agent_logs
│   ├── ProbBar.jsx        # Home/draw/away probability bar
│   ├── ShareCard.jsx      # Shareable bet card layout
│   ├── ShareCardModal.jsx # Modal wrapper + html2canvas export (lazy-loaded)
│   └── LogMarkdown.jsx    # Renders agent log content as markdown
├── lib/
│   ├── betStatus.js       # Derives win/loss/live/skipped/pending from a bet row
│   ├── decision.js        # Human-readable label for a bet's decision
│   ├── matchClock.js      # Builds pipeline timeline stops from raw logs
│   └── time.js            # Local <-> UTC datetime conversion for kickoff times
├── data/
│   └── teamFlags.js       # Team name -> flag asset lookup
├── pages/
│   ├── Home.jsx            # /
│   ├── Stats.jsx           # /stats — public dashboard
│   ├── Fixture.jsx         # /fixture — run & inspect a live analysis
│   ├── AwaitingOrders.jsx  # /awaiting-orders — decisions pending an order
│   ├── History.jsx         # /history — full bet history
│   ├── HistoryDetail.jsx   # /history/:sessionId — one bet's full reasoning
│   ├── HowItWorks.jsx      # /how-it-works — pipeline explainer
│   └── Login.jsx           # /login
├── App.jsx                # Router setup + QueryClient provider
├── main.jsx                # Entry point
└── index.css                # Global styles + Tailwind imports
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

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

Set `VITE_API_URL` to wherever the backend API is running. (At runtime, `window.__APP_CONFIG__?.API_URL` takes precedence over the env var if present — useful for injecting the API URL at deploy time without a rebuild.)

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

The app uses JWT bearer tokens stored in a cookie (`access_token`), issued by `POST /api/auth/login`. The Axios client automatically attaches the token to every request via a request interceptor. The cookie's expiry is read from the token's own `exp` claim so it matches the server-side session lifetime.

Browsing is entirely public — stats, fixture results, and bet history are visible to anyone. Sign-in is only required to *act*: starting a new fixture analysis, placing an order, discarding an awaiting-order decision, or running a settlement check. Pages don't hard-gate on auth; instead, actions that need it prompt sign-in inline (preserving the in-progress fixture form via a draft saved to `sessionStorage`) and redirect back afterward.

---

## Related

- [Stoppage Time Backend](https://github.com/sanidavidanagama/Stoppage-Time) — FastAPI + Supabase backend running the reasoning pipeline and betting agent
- [API Reference](https://github.com/sanidavidanagama/Stoppage-Time/blob/main/api/README.md) — full endpoint documentation for the backend this app talks to
