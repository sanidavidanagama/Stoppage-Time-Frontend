import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import ProbBar from '../components/ProbBar'
import Flag from '../components/Flag'
import { getAgentStats } from '../api/stats'

const FEATURES = [
  {
    name: 'Market-Blind Reasoning',
    job: 'The model that forms an opinion never sees the market price. It commits to a probability first — only then does the system check if the market disagrees.',
  },
  {
    name: 'Real Money, Real Stakes',
    job: 'No paper trading. Every order is placed live, with hard dollar caps, and every result — win or lose — stays on the record.',
  },
  {
    name: 'Fully Auditable',
    job: 'Every step is logged before the bet is placed — what it read, what it thought, why it landed on a number. Nothing gets cleaned up after the fact.',
  },
]

function money(n) {
  if (n == null) return '—'
  return `$${n.toFixed(2)}`
}

function pct(n) {
  if (n == null) return '—'
  return `${n.toFixed(1)}%`
}

export default function Home() {
  const navigate = useNavigate()

  const { data: stats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: getAgentStats,
    retry: 1,
  })

  const pnl = stats ? stats.wallet_balance_usd - stats.starting_balance_usd : null

  return (
    <Layout>
      <div className="page-fade">
        <div className="hero">
          <img className="hero-logo" src="/Stoppage Time.png" alt="" />
          <div className="kicker">World Cup 2026 · Arena Agent</div>
          <h1 className="stamp">
            The edge arrives
            <br />
            <span className="a">late.</span>
          </h1>
          <p className="sub">
            An agent pipeline that watches every World Cup fixture, reasons through it, and only
            bets when the market is wrong. Every decision is logged, timed, and open to review —
            and every bet becomes a card you can hold.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => navigate('/stats')}>
              View Live Stats
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/fixture')}>
              Run New Analysis
            </button>
          </div>
        </div>

        {/* Why it's different — the actual point, kept short */}
        <div className="home-features">
          <div className="hiw-kicker" style={{ textAlign: 'center' }}>Why it's different</div>
          <h2 className="stamp" style={{ textAlign: 'center', fontSize: 28, marginBottom: 30 }}>
            Reasoning first. Market second.
          </h2>
          <div className="agent-grid">
            {FEATURES.map((f) => (
              <div className="agent-card" key={f.name}>
                <div className="ac-name">{f.name}</div>
                <div className="ac-job">{f.job}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/how-it-works')}>
              See How It Works →
            </button>
          </div>
        </div>

        {/* Live record — real numbers, not copy */}
        {stats && (
          <div className="home-features">
            <div className="hiw-kicker" style={{ textAlign: 'center' }}>Not a simulation</div>
            <h2 className="stamp" style={{ textAlign: 'center', fontSize: 28, marginBottom: 30 }}>
              The live record
            </h2>
            <div className="stats-grid" style={{ maxWidth: 860, margin: '0 auto' }}>
              <div className="stat-cell">
                <div className={`val mono ${pnl > 0 ? 'up' : pnl < 0 ? 'down' : ''}`}>
                  {pnl != null ? `${pnl >= 0 ? '+' : ''}${money(pnl)}` : '—'}
                </div>
                <div className="lbl">Cumulative P&amp;L</div>
              </div>
              <div className="stat-cell">
                <div className="val mono">{pct(stats.win_percentage)}</div>
                <div className="lbl">Win Rate</div>
              </div>
              <div className="stat-cell">
                <div className="val mono">{stats.bets_placed}</div>
                <div className="lbl">Bets Placed</div>
              </div>
              <div className="stat-cell">
                <div className="val mono">{money(stats.wallet_balance_usd)}</div>
                <div className="lbl">Wallet Balance</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <button className="btn btn-ghost" onClick={() => navigate('/stats')}>
                View Full Stats →
              </button>
            </div>
          </div>
        )}

        <div className="home-teaser">
          <div className="teaser-copy">
            <div className="lbl">Every decision, on the record</div>
            <p>
              Each fixture analysis leaves a full breakdown behind — the probability split, the
              edge it found, the stake it committed, and the one line of reasoning that mattered.
              Turn it into a card if you want one to keep — that's a bonus, not the point.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => navigate('/history')}>
              See Bet History →
            </button>
          </div>
          <div className="mini-card-wrap">
            <div className="share-card" style={{ width: 220, padding: '16px 15px 14px', transform: 'scale(0.92)' }}>
              <div className="sc-top">
                <div className="sc-stage">Semi-finals</div>
                <img src="/Stoppage Time.png" alt="" />
              </div>
              <div className="sc-teams">
                <div className="sc-team">
                  <Flag team="Spain" />
                  <div className="name">ESP</div>
                </div>
                <div className="sc-vs">VS</div>
                <div className="sc-team">
                  <Flag team="France" />
                  <div className="name">FRA</div>
                </div>
              </div>
              <ProbBar home={0.48} draw={0.24} away={0.28} pick="home" compact />
              <div className="sc-stats">
                <div className="sc-stat"><div className="v">+5.8pp</div><div className="l">Edge</div></div>
                <div className="sc-stat"><div className="v">$38</div><div className="l">Stake</div></div>
                <div className="sc-stat"><div className="v">2.05</div><div className="l">Odds</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
