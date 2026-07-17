import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Layout from '../components/Layout'
import Flag from '../components/Flag'
import { getHistory } from '../api/history'
import { runSettlement } from '../api/settlement'
import { isAuthenticated } from '../api/auth'
import { betStatus, STATUS_LABEL } from '../lib/betStatus'

const PILL_CLASS = { win: 'win', loss: 'loss', live: 'live', skipped: 'pending', pending: 'pending' }
const LIMIT = 20

function SettlementPanel() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: runSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] })
    },
  })

  if (!isAuthenticated()) return null

  return (
    <div className="fixture-card" style={{ padding: 24, marginBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-tag" style={{ marginBottom: 4 }}>Admin</div>
          <h4 className="cond" style={{ margin: 0, fontSize: 16, letterSpacing: '0.04em' }}>Settlement</h4>
        </div>
        <button className="btn btn-ghost" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Checking…' : 'Run Settlement Check'}
        </button>
      </div>

      {mutation.isError && (
        <div className="alert error" style={{ marginTop: 14 }}>Settlement run failed — try again shortly.</div>
      )}

      {mutation.data && (
        <div className="alert info" style={{ marginTop: 14 }}>
          Checked {mutation.data.checked} pending bet{mutation.data.checked === 1 ? '' : 's'}, settled {mutation.data.settled}.
          {mutation.data.results?.filter((r) => r.status === 'settled').map((r) => (
            <div key={r.bet_id} style={{ marginTop: 6 }}>
              — {r.bet_id}: {r.actual_outcome} ({r.pnl != null ? `${r.pnl >= 0 ? '+' : ''}$${r.pnl.toFixed(2)}` : 'n/a'})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', offset],
    queryFn: () => getHistory({ limit: LIMIT, offset }),
  })

  const total = data?.total ?? 0
  const hasPrev = offset > 0
  const hasNext = offset + LIMIT < total

  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">Every settled &amp; open position</div>
            <h2 className="stamp">Bet History</h2>
          </div>
          <Link to="/awaiting-orders" className="btn btn-ghost">Awaiting Orders →</Link>
        </div>

        <SettlementPanel />

        {isLoading && (
          <div className="stub-list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="skeleton" style={{ height: 96, borderRadius: 6 }} key={i} />
            ))}
          </div>
        )}

        {isError && <div className="alert error">Couldn't load bet history — the API may be unreachable.</div>}

        {data && data.items.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No bets recorded yet.</p>
        )}

        {data && data.items.length > 0 && (
          <div className="stub-list">
            {data.items.map((bet) => {
              const status = betStatus(bet)
              return (
                <div className="stub" key={bet.id} onClick={() => navigate(`/history/${bet.session_id}`)}>
                  <div className="stub-main">
                    <div className="stub-stage">{bet.fixture_name || '—'}</div>
                    <div className="stub-matchup">
                      <Flag team={bet.home_team} />
                      {bet.home_team ?? bet.home_code ?? 'Home'}
                      <span className="vs">vs</span>
                      <Flag team={bet.away_team} />
                      {bet.away_team ?? bet.away_code ?? 'Away'}
                    </div>
                    <div className="stub-meta">
                      {bet.edge_pp != null && <span className="gold">{bet.edge_pp}pp edge</span>}
                      {bet.stake_usd != null && <span>${bet.stake_usd} staked</span>}
                      {bet.decision && <span>pick: {bet.decision}</span>}
                    </div>
                  </div>
                  <div className="stub-stub">
                    <div className={`result-pill ${PILL_CLASS[status]}`}>{STATUS_LABEL[status]}</div>
                    {bet.pnl != null ? (
                      <div className={`pl ${bet.pnl >= 0 ? 'up' : 'down'}`}>{bet.pnl >= 0 ? '+' : ''}${bet.pnl.toFixed(2)}</div>
                    ) : (
                      <div className="pl">—</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {data && total > LIMIT && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
            <button className="btn btn-ghost" disabled={!hasPrev} onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}>
              ← Prev
            </button>
            <span className="status-line" style={{ margin: 0 }}>
              {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
            </span>
            <button className="btn btn-ghost" disabled={!hasNext} onClick={() => setOffset((o) => o + LIMIT)}>
              Next →
            </button>
          </div>
        )}
      </section>
    </Layout>
  )
}
