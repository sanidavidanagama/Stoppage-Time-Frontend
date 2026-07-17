import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Layout from '../components/Layout'
import Flag from '../components/Flag'
import { getAwaitingOrders, deleteAwaitingOrder } from '../api/orders'
import { isAuthenticated } from '../api/auth'
import { decisionLabel } from '../lib/decision'

export default function AwaitingOrders() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['awaiting-orders'],
    queryFn: getAwaitingOrders,
    refetchInterval: 20000,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAwaitingOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['awaiting-orders'] }),
  })

  const handleDiscard = (e, sessionId) => {
    e.stopPropagation()
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/awaiting-orders' } })
      return
    }
    if (!window.confirm('Discard this analysis? This can’t be undone.')) return
    deleteMutation.mutate(sessionId)
  }

  const items = data?.items ?? []

  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">Decided, not yet ordered</div>
            <h2 className="stamp">Awaiting Orders</h2>
          </div>
          {data && <div className="public-badge">{data.count} waiting</div>}
        </div>

        {isLoading && (
          <div className="stub-list">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="skeleton" style={{ height: 96, borderRadius: 6 }} key={i} />
            ))}
          </div>
        )}

        {isError && <div className="alert error">Couldn't load awaiting orders — the API may be unreachable.</div>}

        {deleteMutation.isError && (
          <div className="alert error" style={{ marginBottom: 16 }}>
            Couldn't discard that one — {deleteMutation.error?.response?.data?.detail || 'try again.'}
          </div>
        )}

        {data && items.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Nothing waiting on a decision right now.</p>
        )}

        {items.length > 0 && (
          <div className="stub-list">
            {items.map(({ session, bet }) => {
              const sessionId = session.session_id
              const discarding = deleteMutation.isPending && deleteMutation.variables === sessionId
              return (
                <div className="stub" key={sessionId} onClick={() => navigate(`/fixture?session=${sessionId}`)}>
                  <div className="stub-main">
                    <div className="stub-stage">{bet.fixture_name || session.fixture_name || '—'}</div>
                    <div className="stub-matchup">
                      <Flag team={bet.home_team} />
                      {bet.home_team ?? 'Home'}
                      <span className="vs">vs</span>
                      <Flag team={bet.away_team} />
                      {bet.away_team ?? 'Away'}
                    </div>
                    <div className="stub-meta">
                      <span className="gold">{decisionLabel(bet)} pick</span>
                      {bet.edge_pp != null && <span>{bet.edge_pp}pp edge</span>}
                      {bet.stake_usd != null && <span>${bet.stake_usd} staked</span>}
                    </div>
                  </div>
                  <div className="stub-stub">
                    <div className="result-pill live">Awaiting</div>
                    <button
                      className="discard-btn"
                      disabled={discarding}
                      onClick={(e) => handleDiscard(e, sessionId)}
                    >
                      {discarding ? 'Discarding…' : isAuthenticated() ? 'Discard' : '🔒 Sign In'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </Layout>
  )
}
