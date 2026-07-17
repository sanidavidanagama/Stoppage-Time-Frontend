import { useMemo, useState } from 'react'
import { buildStops, activeStopIndex } from '../lib/matchClock'

function fmtTime(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

function resultPhase(status, bet) {
  const decisionGrid = bet && ['home', 'draw', 'away'].includes(bet.decision) && (
    <div className="decision-grid">
      <div className="decision-cell"><div className="v">{bet.decision.toUpperCase()}</div><div className="l">Decision</div></div>
      {bet.edge_pp != null && <div className="decision-cell"><div className="v">{bet.edge_pp}pp</div><div className="l">Edge</div></div>}
      {bet.stake_usd != null && <div className="decision-cell"><div className="v">${bet.stake_usd}</div><div className="l">Stake</div></div>}
    </div>
  )

  if (status === 'completed') {
    return {
      title: 'Result — Order Settled',
      meta: bet?.order_id ? `order_id: ${bet.order_id}` : undefined,
      body: (
        <>
          {decisionGrid}
          <p>
            Order placed at {bet?.fill_price != null ? `fill price ${bet.fill_price}` : 'market price'}.
            {bet?.order_status ? ` Status: ${bet.order_status}.` : ''}
          </p>
        </>
      ),
    }
  }
  if (status === 'skipped') {
    return {
      title: 'Result — No Bet',
      body: <p>{bet?.bet_reason || 'The agent decided the edge wasn’t there and passed on this fixture.'}</p>,
    }
  }
  if (status === 'awaiting_order') {
    return {
      title: 'Result — Awaiting Confirmation',
      body: (
        <>
          {decisionGrid}
          <p>A decision has been made but the order hasn’t been placed yet.</p>
        </>
      ),
    }
  }
  if (status === 'error') {
    return {
      title: 'Result — Error',
      body: <p style={{ color: 'var(--card-red)' }}>Something failed during this run. Check the steps above for the last successful one.</p>,
    }
  }
  return {
    title: 'Result',
    body: <p style={{ color: 'var(--muted-2)' }}>Not reached yet.</p>,
  }
}

export default function MatchClock({ session, bet, logs = [] }) {
  const status = session?.status
  const stops = useMemo(() => buildStops(logs), [logs])
  const active = activeStopIndex(status, stops)

  const [selected, setSelected] = useState(active === -1 ? 0 : active)
  const [userPinned, setUserPinned] = useState(false)

  // Auto-advance the selected stop as a live run progresses, unless the
  // user has clicked a stop themselves to inspect it. Adjusting state
  // during render (not in an effect) on a derived-value change is the
  // pattern React recommends here — see
  // https://react.dev/learn/you-might-not-need-an-effect
  const [prevActive, setPrevActive] = useState(active)
  if (active !== prevActive) {
    setPrevActive(active)
    if (!userPinned && active !== -1) setSelected(active)
  }

  const selectStop = (i) => {
    setSelected(i)
    setUserPinned(true)
  }

  const stopState = (i) => {
    if (active === -1) return ''
    if (i < active) return 'done'
    if (i === active) return status === 'error' ? 'error' : 'active'
    return ''
  }

  const stop = stops[selected]
  const log = stop?.log

  const phase = stop?.isResult
    ? resultPhase(status, bet)
    : {
        title: stop?.label,
        meta: [stop?.subtitle, log?.model, fmtTime(log?.created_at)].filter(Boolean).join(' · '),
        body: <p>{log?.response || log?.prompt || '—'}</p>,
      }

  return (
    <>
      <div className="clock-track">
        <div className="clock-stops" style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(72px, 1fr))` }}>
          <div className="clock-line" />
          {stops.map((s, i) => (
            <div
              key={s.id}
              className={`clock-stop ${stopState(i)} ${selected === i ? 'selected' : ''}`}
              onClick={() => selectStop(i)}
            >
              <div className="marker">{s.marker}</div>
              <div className="clock-label">{s.label}</div>
              <div className="agent-name">{s.subtitle}</div>
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
