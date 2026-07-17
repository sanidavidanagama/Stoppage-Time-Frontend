import { lazy, Suspense, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Layout from '../components/Layout'
import Flag from '../components/Flag'
import MatchClock from '../components/MatchClock'
import ProbBar from '../components/ProbBar'
import { createFixture, getFixture, placeOrder } from '../api/fixture'
import { deleteAwaitingOrder } from '../api/orders'
import { isAuthenticated } from '../api/auth'
import { isTerminalStatus } from '../lib/matchClock'
import { localDateTimeToUTCISOString, formatUTCPreview } from '../lib/time'

// html2canvas is a hefty dependency only needed once someone actually opens
// the share card, so keep it out of the main bundle.
const ShareCardModal = lazy(() => import('../components/ShareCardModal'))

// Must match the stage strings the backend's fixture resolver expects
// exactly (service/schedule.py::find_fixture_by_teams matches on these).
const STAGES = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  '3rd Place Final',
  'Final',
]

// Creating a fixture now requires auth. If someone fills the form out
// signed-out, save it before sending them to log in so they don't have to
// retype it — consumed (and cleared) once, on the next mount of the bare
// form.
const DRAFT_KEY = 'stoppage-time:fixture-draft'

function readAndClearDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    sessionStorage.removeItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function Fixture() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sessionId = searchParams.get('session')

  const [draft] = useState(readAndClearDraft)
  const [home, setHome] = useState(draft.home ?? '')
  const [away, setAway] = useState(draft.away ?? '')
  const [stage, setStage] = useState(draft.stage ?? STAGES[0])
  const [agent, setAgent] = useState(draft.agent ?? 'multi-agent')
  const [kickOffTime, setKickOffTime] = useState(draft.kickOffTime ?? '')
  const [shareOpen, setShareOpen] = useState(false)

  const createMutation = useMutation({
    mutationFn: createFixture,
    onSuccess: (data) => setSearchParams({ session: data.session_id }),
  })

  const fixtureQuery = useQuery({
    queryKey: ['fixture', sessionId],
    queryFn: () => getFixture(sessionId),
    enabled: !!sessionId,
    retry: (failureCount, err) => failureCount < 2 && err?.response?.status === 404,
    refetchInterval: (query) => {
      const status = query.state.data?.session?.status
      return status && isTerminalStatus(status) ? false : 2500
    },
  })

  const orderMutation = useMutation({
    mutationFn: () => placeOrder(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fixture', sessionId] }),
  })

  const discardMutation = useMutation({
    mutationFn: () => deleteAwaitingOrder(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awaiting-orders'] })
      navigate('/awaiting-orders')
    },
  })

  const handleDiscard = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/fixture?session=${sessionId}` } })
      return
    }
    if (!window.confirm('Discard this analysis? This can’t be undone.')) return
    discardMutation.mutate()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!home.trim() || !away.trim()) return
    createMutation.mutate({
      home: home.trim(),
      away: away.trim(),
      stage,
      agent,
      kickOffTime: localDateTimeToUTCISOString(kickOffTime),
    })
  }

  const handleLockedSubmit = () => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ home, away, stage, agent, kickOffTime }))
    navigate('/login', { state: { from: '/fixture' } })
  }

  const handleReset = () => {
    setSearchParams({}, { replace: true })
    createMutation.reset()
  }

  const session = fixtureQuery.data?.session
  const bet = fixtureQuery.data?.bet
  const logs = fixtureQuery.data?.logs ?? []
  const status = session?.status

  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">Runs the live pipeline</div>
            <h2 className="stamp">New Fixture Analysis</h2>
          </div>
        </div>

        {!sessionId && (
          <div className="fixture-card">
            <form onSubmit={handleSubmit}>
              <div className="fixture-row">
                <div>
                  <label className="field-label" htmlFor="home">Home</label>
                  <div className="team-select focus-ring">
                    <Flag team={home} />
                    <input id="home" placeholder="e.g. Brazil" value={home} onChange={(e) => setHome(e.target.value)} required />
                  </div>
                </div>
                <div className="vs-mark">VS</div>
                <div>
                  <label className="field-label" htmlFor="away">Away</label>
                  <div className="team-select focus-ring">
                    <Flag team={away} />
                    <input id="away" placeholder="e.g. Germany" value={away} onChange={(e) => setAway(e.target.value)} required />
                  </div>
                </div>
              </div>

              <label className="field-label" htmlFor="stage">Stage</label>
              <div className="stage-select">
                <select id="stage" value={stage} onChange={(e) => setStage(e.target.value)}>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <label className="field-label" style={{ marginTop: 22 }}>Pipeline</label>
              <div className="pill-toggle" style={{ marginBottom: 22 }}>
                <button type="button" className={agent === 'multi-agent' ? 'active' : ''} onClick={() => setAgent('multi-agent')}>
                  Multi-Agent
                </button>
                <button type="button" className={agent === 'unified' ? 'active' : ''} onClick={() => setAgent('unified')}>
                  Unified
                </button>
              </div>

              <label className="field-label" htmlFor="kickoff">Kickoff Time — your local time (optional, disambiguates a rematch)</label>
              <div className="stage-select" style={{ marginBottom: 6 }}>
                <input
                  id="kickoff"
                  type="datetime-local"
                  value={kickOffTime}
                  onChange={(e) => setKickOffTime(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--chalk)', width: '100%', outline: 'none', fontFamily: 'IBM Plex Sans', fontSize: 15 }}
                />
              </div>
              <div className="fixture-id-preview" style={{ marginBottom: 22, minHeight: 15 }}>
                {kickOffTime && <>Sent to the API as <span>{formatUTCPreview(kickOffTime)}</span> (UTC)</>}
              </div>

              {createMutation.isError && (
                <div className="alert error" style={{ marginBottom: 16 }}>
                  {createMutation.error?.response?.data?.detail || 'Failed to start analysis — please try again.'}
                </div>
              )}

              {isAuthenticated() ? (
                <button type="submit" className="kickoff-btn" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Kicking Off…' : 'Kick Off Analysis'}
                </button>
              ) : (
                <button type="button" className="kickoff-btn locked" onClick={handleLockedSubmit}>
                  Sign In to Run Analysis
                </button>
              )}
              <div className="lock-note">
                {isAuthenticated()
                  ? 'Signed in — analysis, order confirmation, and discarding are all available.'
                  : '🔒 Running analysis, placing orders, and discarding all require sign-in.'}
              </div>
            </form>
          </div>
        )}

        {sessionId && (
          <div className="fixture-card">
            {fixtureQuery.isLoading && (
              <div className="status-line"><span className="dot" />Loading session…</div>
            )}

            {fixtureQuery.isError && (
              <div className="alert error">
                Couldn't load this session ({sessionId}). It may not exist, or the API is unreachable.
              </div>
            )}

            {session && (
              <>
                <div className="detail-head" style={{ marginBottom: 20 }}>
                  <div className="matchup stamp">
                    <Flag team={session.home_team} />
                    {session.home_team ?? home}
                    <span className="vs" style={{ fontFamily: "'IBM Plex Mono'", fontSize: 14, color: 'var(--muted-2)' }}>vs</span>
                    <Flag team={session.away_team} />
                    {session.away_team ?? away}
                  </div>
                  {!isTerminalStatus(status) && (
                    <div className="status-line" style={{ margin: 0 }}><span className="dot" />{status}</div>
                  )}
                </div>
                <div className="detail-sub">session_id: {session.session_id}</div>

                <MatchClock session={session} bet={bet} logs={logs} />

                {status === 'awaiting_order' && bet && (
                  <div className="phase-panel" style={{ marginTop: 24 }}>
                    <h4>Decision</h4>
                    {(bet.home_probability != null || bet.draw_probability != null || bet.away_probability != null) && (
                      <ProbBar
                        home={bet.home_probability}
                        draw={bet.draw_probability}
                        away={bet.away_probability}
                        homeLabel={bet.home_code || session.home_team}
                        awayLabel={bet.away_code || session.away_team}
                      />
                    )}
                    {bet.bet_reason && <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, marginTop: 14 }}>{bet.bet_reason}</p>}

                    {orderMutation.data?.status === 'error' && (
                      <div className="alert error" style={{ marginTop: 12 }}>{orderMutation.data.reason || 'Order failed.'}</div>
                    )}
                    {discardMutation.isError && (
                      <div className="alert error" style={{ marginTop: 12 }}>
                        Couldn't discard — {discardMutation.error?.response?.data?.detail || 'try again.'}
                      </div>
                    )}

                    <div className="share-cta">
                      {isAuthenticated() ? (
                        <button className="btn btn-primary" disabled={orderMutation.isPending} onClick={() => orderMutation.mutate()}>
                          {orderMutation.isPending ? 'Placing Order…' : 'Confirm & Place Order'}
                        </button>
                      ) : (
                        <button className="btn btn-primary" onClick={() => navigate('/login', { state: { from: `/fixture?session=${sessionId}` } })}>
                          Sign In to Place Order
                        </button>
                      )}
                      <button className="btn btn-ghost" onClick={() => setShareOpen(true)}>Share</button>
                      <button className="btn btn-ghost" disabled={discardMutation.isPending} onClick={handleDiscard}>
                        {discardMutation.isPending ? 'Discarding…' : isAuthenticated() ? 'Discard' : 'Sign In to Discard'}
                      </button>
                      <button className="btn btn-ghost" onClick={handleReset}>New Analysis</button>
                    </div>
                  </div>
                )}

                {status === 'skipped' && (
                  <div className="share-cta">
                    <button className="btn btn-primary" onClick={() => setShareOpen(true)}>Share</button>
                    <button className="btn btn-ghost" onClick={handleReset}>New Analysis</button>
                  </div>
                )}

                {status === 'completed' && (
                  <div className="share-cta">
                    <button className="btn btn-primary" onClick={() => setShareOpen(true)}>Share</button>
                    <button className="btn btn-ghost" onClick={handleReset}>New Analysis</button>
                  </div>
                )}

                {status === 'error' && (
                  <div className="share-cta">
                    <button className="btn btn-ghost" onClick={handleReset}>Try Again</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {sessionId && shareOpen && (
        <Suspense fallback={null}>
          <ShareCardModal open={shareOpen} onClose={() => setShareOpen(false)} session={session} bet={bet} stage={stage} />
        </Suspense>
      )}
    </Layout>
  )
}
