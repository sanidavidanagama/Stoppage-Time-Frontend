import { lazy, Suspense, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import Flag from '../components/Flag'
import MatchClock from '../components/MatchClock'
import { getHistoryDetail } from '../api/history'
import { betStatus, STATUS_LABEL } from '../lib/betStatus'

const ShareCardModal = lazy(() => import('../components/ShareCardModal'))

const PILL_CLASS = { win: 'win', loss: 'loss', live: 'live', skipped: 'pending', pending: 'pending' }

export default function HistoryDetail() {
  const { sessionId } = useParams()
  const [shareOpen, setShareOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history-detail', sessionId],
    queryFn: () => getHistoryDetail(sessionId),
  })

  const session = data?.session
  const bet = data?.bet
  const logs = data?.logs ?? []
  const status = bet ? betStatus(bet) : null

  return (
    <Layout>
      <section className="page-fade">
        <div className="section-head">
          <div>
            <div className="section-tag">
              {bet ? `${bet.home_team ?? 'Home'} vs ${bet.away_team ?? 'Away'}` : 'Bet detail'}
            </div>
            <h2 className="stamp">How This Bet Was Made</h2>
          </div>
          <Link to="/history" className="btn btn-ghost">← All Bets</Link>
        </div>

        {isLoading && <div className="status-line"><span className="dot" />Loading…</div>}

        {isError && (
          <div className="alert error">
            Couldn't find this bet — the session may not exist, or hasn't reached a decision yet.
          </div>
        )}

        {session && bet && (
          <div className="detail-card">
            <div className="detail-head">
              <div className="matchup stamp">
                <Flag team={bet.home_team} />
                {bet.home_team ?? 'Home'}
                <span className="vs" style={{ fontFamily: "'IBM Plex Mono'", fontSize: 14, color: 'var(--muted-2)' }}>vs</span>
                <Flag team={bet.away_team} />
                {bet.away_team ?? 'Away'}
              </div>
              <div className={`result-pill ${PILL_CLASS[status]}`}>
                {STATUS_LABEL[status]}
                {bet.pnl != null && ` ${bet.pnl >= 0 ? '+' : ''}$${bet.pnl.toFixed(2)}`}
              </div>
            </div>
            <div className="detail-sub">
              fixture_id: {bet.fixture_id ?? '—'} · session_id: {sessionId}
              {bet.settled_at && ` · settled ${new Date(bet.settled_at).toLocaleString()}`}
            </div>

            <MatchClock session={session} bet={bet} logs={logs} />

            <div className="share-cta">
              <button className="btn btn-primary" onClick={() => setShareOpen(true)}>Share</button>
            </div>
          </div>
        )}
      </section>

      {shareOpen && (
        <Suspense fallback={null}>
          <ShareCardModal open={shareOpen} onClose={() => setShareOpen(false)} session={session} bet={bet} />
        </Suspense>
      )}
    </Layout>
  )
}
