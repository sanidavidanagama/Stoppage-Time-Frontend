import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { getAgentStats } from '../api/stats'
import { getHistory } from '../api/history'
import { betStatus } from '../lib/betStatus'

function money(n, { sign = false } = {}) {
  if (n == null) return '—'
  const s = sign && n > 0 ? '+' : ''
  return `${s}$${n.toFixed(2)}`
}

function pct(n) {
  if (n == null) return '—'
  return `${n.toFixed(1)}%`
}

function StatCell({ label, value, tone }) {
  return (
    <div className="stat-cell">
      <div className={`val mono ${tone ?? ''}`}>{value}</div>
      <div className="lbl">{label}</div>
    </div>
  )
}

function SkeletonGrid({ cells = 4 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: cells }).map((_, i) => (
        <div className="stat-cell" key={i}>
          <div className="skeleton" style={{ height: 30, width: '60%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 11, width: '80%' }} />
        </div>
      ))}
    </div>
  )
}

const FORM_CLASS = { win: 'w', loss: 'l', live: 'd', skipped: 'd', pending: 'd' }
const FORM_LABEL = { win: 'W', loss: 'L', live: '•', skipped: 'S', pending: '•' }

export default function Stats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: getAgentStats,
    refetchInterval: 30000,
  })

  const { data: recent } = useQuery({
    queryKey: ['history', 'recent-form'],
    queryFn: () => getHistory({ limit: 10, offset: 0 }),
  })

  const pnl = data ? data.wallet_balance_usd - data.starting_balance_usd : null

  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">The agent's real-money track record</div>
            <h2 className="stamp">Match Stats</h2>
          </div>
          <div className="public-badge">● Public</div>
        </div>

        {isError && (
          <div className="alert error">Couldn't load agent stats — the API may be unreachable.</div>
        )}

        {isLoading && <SkeletonGrid cells={4} />}

        {data && (
          <>
            <div className="stats-grid">
              <StatCell label="Cumulative P&L" value={money(pnl, { sign: true })} tone={pnl > 0 ? 'up' : pnl < 0 ? 'down' : ''} />
              <StatCell label="Win Rate" value={pct(data.win_percentage)} />
              <StatCell label="ROI (pooled)" value={pct(data.roi_percentage)} tone={data.roi_percentage > 0 ? 'up' : data.roi_percentage < 0 ? 'down' : ''} />
              <StatCell label="Wallet Balance" value={money(data.wallet_balance_usd)} />
            </div>

            <div className="stats-grid" style={{ marginTop: 1 }}>
              <StatCell label="Bets Placed" value={data.bets_placed} />
              <StatCell label="Bets Won" value={data.bets_won} tone="up" />
              <StatCell label="Bets Lost" value={data.bets_lost} tone="down" />
              <StatCell label="Bets Skipped" value={data.bets_skipped} />
            </div>

            <div className="stats-grid" style={{ marginTop: 1 }}>
              <StatCell label="Biggest Profit" value={money(data.biggest_profit_usd, { sign: true })} tone="up" />
              <StatCell label="Biggest Loss" value={money(data.biggest_loss_usd)} tone="down" />
              <StatCell label="Starting Balance" value={money(data.starting_balance_usd)} />
            </div>
          </>
        )}

        {recent?.items?.length > 0 && (
          <div className="form-guide">
            <div className="lbl">Last {recent.items.length} Bets</div>
            <div className="form-row">
              {recent.items.map((bet) => {
                const status = betStatus(bet)
                return (
                  <div
                    key={bet.id}
                    className={`form-chip ${FORM_CLASS[status]}`}
                    title={`${bet.home_team ?? '?'} vs ${bet.away_team ?? '?'} — ${status}`}
                  >
                    {FORM_LABEL[status]}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
