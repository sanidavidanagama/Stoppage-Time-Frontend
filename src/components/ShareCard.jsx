import { forwardRef } from 'react'
import Flag from './Flag'
import ProbBar from './ProbBar'

function agentLabel(source) {
  if (source === 'v2') return 'Unified Agent'
  if (source === 'multi_agent') return 'Multi-Agent Pipeline'
  return 'Stoppage Time Agent'
}

function marketPriceForDecision(bet) {
  if (!bet) return null
  if (bet.decision === 'home') return bet.market_home_price
  if (bet.decision === 'draw') return bet.market_draw_price
  if (bet.decision === 'away') return bet.market_away_price
  return null
}

function truncate(text, max = 220) {
  if (!text) return null
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}

// The downloadable ticket-stub card. Every field is real: teams/flags,
// decision, stake, edge, the market price implied odds for the decided
// outcome, the agent's own reasoning, and which pipeline produced it.
const ShareCard = forwardRef(function ShareCard({ session, bet, stage }, ref) {
  const home = session?.home_team ?? bet?.home_team
  const away = session?.away_team ?? bet?.away_team
  const price = marketPriceForDecision(bet)
  const odds = price ? (1 / price).toFixed(2) : null
  const stageLabel = stage || bet?.fixture_name || session?.fixture_name || 'World Cup 2026'
  const identifier = bet?.fixture_id ?? session?.session_id ?? ''

  return (
    <div className="share-card" ref={ref}>
      <div className="sc-top">
        <div className="sc-stage">{stageLabel}</div>
        <img src="/Stoppage_Time_Logo_Black.png" alt="" />
      </div>

      <div className="sc-teams" style={{ marginTop: 24 }}>
        <div className="sc-team">
          <Flag team={home} />
          <div className="name">{bet?.home_code || home || 'HOME'}</div>
        </div>
        <div className="sc-vs">VS</div>
        <div className="sc-team">
          <Flag team={away} />
          <div className="name">{bet?.away_code || away || 'AWAY'}</div>
        </div>
      </div>

      <div className="perf" />

      {bet && (bet.home_probability != null || bet.draw_probability != null || bet.away_probability != null) && (
        <ProbBar
          home={bet.home_probability}
          draw={bet.draw_probability}
          away={bet.away_probability}
          pick={bet.decision}
          homeLabel={bet.home_code || home}
          awayLabel={bet.away_code || away}
        />
      )}

      <div className="sc-stats">
        <div className="sc-stat"><div className="v">{bet?.edge_pp != null ? `+${bet.edge_pp}pp` : '—'}</div><div className="l">Edge</div></div>
        <div className="sc-stat"><div className="v">{bet?.stake_usd != null ? `$${bet.stake_usd}` : '—'}</div><div className="l">Stake</div></div>
        <div className="sc-stat"><div className="v">{odds ?? '—'}</div><div className="l">Odds</div></div>
      </div>

      {bet?.bet_reason && <div className="sc-reason">&ldquo;{truncate(bet.bet_reason)}&rdquo;</div>}

      <div className="sc-foot">
        <div className="wm">STOPPAGE TIME</div>
        <div className="id">{agentLabel(session?.source)} · {identifier}</div>
      </div>
    </div>
  )
})

export default ShareCard
