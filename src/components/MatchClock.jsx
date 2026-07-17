import { useEffect, useMemo, useState } from 'react'
import { STOPS, groupLogs, currentStopIndex, toolLabel } from '../lib/matchClock'

function fmtTime(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

function LogGroup({ logs, emptyText }) {
  if (!logs.length) {
    return <p style={{ color: 'var(--muted-2)' }}>{emptyText}</p>
  }
  return (
    <>
      {logs.map((log) => (
        <div className="log-entry" key={log.id}>
          <div className="log-head">
            <span>{toolLabel(log.tool)}{log.model ? ` · ${log.model}` : ''}</span>
            {fmtTime(log.created_at) && <span>{fmtTime(log.created_at)}</span>}
          </div>
          <div className="log-body">
            <p>{log.response || log.prompt || '—'}</p>
          </div>
        </div>
      ))}
      <div className="ledger-line">
        tool_name={logs[logs.length - 1].tool} · step={logs.length}/{logs.length}
      </div>
    </>
  )
}

export default function MatchClock({ session, bet, logs = [] }) {
  const status = session?.status
  const groups = useMemo(() => groupLogs(logs), [logs])
  const current = currentStopIndex(status, groups)
  const terminalDone = status === 'completed' || status === 'skipped'
  const [selected, setSelected] = useState(current)
  const [userPinned, setUserPinned] = useState(false)

  // Auto-advance the selected phase as a live run progresses, unless the
  // user has clicked a stop themselves to inspect it — then leave it alone.
  useEffect(() => {
    if (!userPinned) setSelected(current)
  }, [current, userPinned])

  const selectStop = (i) => {
    setSelected(i)
    setUserPinned(true)
  }

  const stopState = (i) => {
    if (i < current) return 'done'
    if (i === current) {
      if (status === 'error') return 'error'
      if (terminalDone) return 'done'
      return 'active'
    }
    return ''
  }

  const renderPhase = () => {
    switch (STOPS[selected].key) {
      case 'kickoff':
        return {
          title: 'Kickoff',
          meta: [session?.fixture_name, fmtTime(session?.created_at)].filter(Boolean).join(' · '),
          body: (
            <p>
              Fixture data pulled for <strong>{session?.home_team ?? 'Home'}</strong> vs{' '}
              <strong>{session?.away_team ?? 'Away'}</strong>
              {session?.status ? ` — session status: ${session.status}.` : '.'}
            </p>
          ),
        }
      case 'gathering':
        return {
          title: '1st Half — Gathering Context',
          meta: 'Tactics · News · H2H — independent tool calls, no probabilities shared between them',
          body: <LogGroup logs={groups.gathering} emptyText="No tactics/news/H2H activity recorded for this run yet." />,
        }
      case 'reasoning':
        return {
          title: 'Team Talk — Reasoning',
          meta: 'Combines context into a probability view',
          body: <LogGroup logs={groups.reasoning} emptyText="Reasoning hasn't run yet." />,
        }
      case 'betting':
        return {
          title: '2nd Half — Betting Decision',
          meta: 'Edge gate + stake sizing',
          body: (
            <>
              <LogGroup logs={groups.betting} emptyText="Betting agent hasn't run yet." />
              {bet && (bet.decision === 'home' || bet.decision === 'draw' || bet.decision === 'away') && (
                <div className="decision-grid">
                  <div className="decision-cell"><div className="v">{bet.decision.toUpperCase()}</div><div className="l">Decision</div></div>
                  {bet.edge_pp != null && <div className="decision-cell"><div className="v">{bet.edge_pp}pp</div><div className="l">Edge</div></div>}
                  {bet.stake_usd != null && <div className="decision-cell"><div className="v">${bet.stake_usd}</div><div className="l">Stake</div></div>}
                </div>
              )}
            </>
          ),
        }
      case 'result':
      default:
        if (status === 'completed') {
          return {
            title: 'Full Time — Order Settled',
            meta: bet?.order_id ? `order_id: ${bet.order_id}` : undefined,
            body: (
              <p>
                Order placed at {bet?.fill_price != null ? `fill price ${bet.fill_price}` : 'market price'}.
                {bet?.order_status ? ` Status: ${bet.order_status}.` : ''}
              </p>
            ),
          }
        }
        if (status === 'skipped') {
          return {
            title: 'Full Time — No Bet',
            body: <p>{bet?.bet_reason || 'The agent decided the edge wasn’t there and passed on this fixture.'}</p>,
          }
        }
        if (status === 'error') {
          return {
            title: 'Full Time — Error',
            body: <p style={{ color: 'var(--card-red)' }}>Something failed during this run. Check the logs above for the last successful step.</p>,
          }
        }
        return {
          title: 'Full Time',
          body: <p style={{ color: 'var(--muted-2)' }}>Not reached yet.</p>,
        }
    }
  }

  const phase = renderPhase()

  return (
    <>
      <div className="clock-track">
        <div className="clock-line" />
        <div className="clock-stops">
          {STOPS.map((stop, i) => (
            <div
              key={stop.key}
              className={`clock-stop ${stopState(i)} ${selected === i ? 'selected' : ''}`}
              onClick={() => selectStop(i)}
            >
              <div className="marker">{stop.marker}</div>
              <div className="clock-label">{stop.label}</div>
              <div className="agent-name">{stop.agent}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="phase-panel">
        <h4>{phase.title}</h4>
        {phase.meta && <div className="phase-meta">{phase.meta}</div>}
        {phase.body}
      </div>
    </>
  )
}
