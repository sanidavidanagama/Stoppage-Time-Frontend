import { useState } from 'react'
import { ChevronDownIcon } from './Icons'

const resultColors = {
  won: { bg: 'rgba(60,172,59,0.12)', text: '#3cac3b', border: 'rgba(60,172,59,0.25)' },
  lost: { bg: 'rgba(230,29,37,0.12)', text: '#e61d25', border: 'rgba(230,29,37,0.25)' },
  pending: { bg: 'rgba(42,57,141,0.15)', text: '#6b82d4', border: 'rgba(42,57,141,0.3)' },
  no_bet: { bg: 'rgba(71,74,74,0.15)', text: '#474a4a', border: 'rgba(71,74,74,0.3)' },
}

const resultLabel = {
  no_bet: 'Skipped',
}

const outcomeLabel = {
  home: 'Home Win',
  draw: 'Draw',
  away: 'Away Win',
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs mb-0.5 uppercase tracking-wide" style={{ color: '#474a4a', fontSize: '0.6rem', letterSpacing: '0.08em' }}>{label}</p>
      <p className="text-xs font-medium" style={{ color: '#d1d4d1' }}>{value ?? '—'}</p>
    </div>
  )
}

export default function BetCard({ bet, expanded, detail, onToggle, onUpdateOutcome, updating }) {
  const [selectedOutcome, setSelectedOutcome] = useState('')
  const [pnlInput, setPnlInput] = useState('')

  const handleUpdate = (e) => {
    e.preventDefault()
    if (!selectedOutcome || pnlInput === '') return
    onUpdateOutcome({ actual_outcome: selectedOutcome, pnl: parseFloat(pnlInput) })
  }

  const rc = resultColors[bet.result] || { bg: 'rgba(71,74,74,0.15)', text: '#474a4a', border: 'rgba(71,74,74,0.25)' }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start justify-between transition-colors"
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div className="flex-1 min-w-0 pr-3">
          <p className="font-semibold text-white truncate text-sm">
            {bet.home} <span style={{ color: '#474a4a' }}>vs</span> {bet.away}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            {bet.agent_prediction && (
              <span className="text-xs" style={{ color: '#474a4a' }}>
                Pred: <span className="font-medium" style={{ color: '#d1d4d1' }}>{outcomeLabel[bet.agent_prediction] || bet.agent_prediction}</span>
              </span>
            )}
            {bet.market_price != null && (
              <span className="text-xs" style={{ color: '#474a4a' }}>
                Price: <span className="font-medium" style={{ color: '#d1d4d1' }}>{(bet.market_price * 100).toFixed(1)}%</span>
              </span>
            )}
            {bet.edge != null && (
              <span className="text-xs" style={{ color: '#474a4a' }}>
                Edge: <span className="font-medium" style={{ color: '#2a398d' }}>{bet.edge}pp</span>
              </span>
            )}
            {bet.stake != null && (
              <span className="text-xs" style={{ color: '#474a4a' }}>
                Stake: <span className="font-medium" style={{ color: '#d1d4d1' }}>${bet.stake}</span>
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
            style={{
              backgroundColor: rc.bg,
              color: rc.text,
              border: `1px solid ${rc.border}`,
              letterSpacing: '0.06em',
              fontSize: '0.6rem',
            }}
          >
            {resultLabel[bet.result] ?? bet.result}
          </span>
          {bet.pnl != null && (
            <span className="text-xs font-bold" style={{ color: bet.pnl >= 0 ? '#3cac3b' : '#e61d25' }}>
              {bet.pnl >= 0 ? '+' : ''}{bet.pnl.toFixed(2)} USDC
            </span>
          )}
          <ChevronDownIcon
            size={14}
            style={{
              color: '#474a4a',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </div>
      </button>

      {expanded && (
        <div
          className="p-4 space-y-4"
          style={{ borderTop: '1px solid #1e1e1e', backgroundColor: '#0a0a0a' }}
        >
          {detail ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailRow label="Confidence" value={detail.confidence_level} />
                <DetailRow
                  label="Actual Outcome"
                  value={detail.actual_outcome ? (outcomeLabel[detail.actual_outcome] || detail.actual_outcome) : null}
                />
                <DetailRow label="Tool Calls" value={detail.tool_calls_made} />
                {detail.ml_home_prob != null && (
                  <>
                    <DetailRow label="ML Home" value={`${(detail.ml_home_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="ML Draw" value={`${(detail.ml_draw_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="ML Away" value={`${(detail.ml_away_prob * 100).toFixed(1)}%`} />
                  </>
                )}
                {detail.bk_home_prob != null && (
                  <>
                    <DetailRow label="BK Home" value={`${(detail.bk_home_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="BK Draw" value={`${(detail.bk_draw_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="BK Away" value={`${(detail.bk_away_prob * 100).toFixed(1)}%`} />
                  </>
                )}
                {detail.pm_home_prob != null && (
                  <>
                    <DetailRow label="PM Home" value={`${(detail.pm_home_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="PM Draw" value={`${(detail.pm_draw_prob * 100).toFixed(1)}%`} />
                    <DetailRow label="PM Away" value={`${(detail.pm_away_prob * 100).toFixed(1)}%`} />
                  </>
                )}
                {detail.agent_probability != null && (
                  <DetailRow label="Agent Prob" value={`${(detail.agent_probability * 100).toFixed(1)}%`} />
                )}
                {detail.edge_pp != null && (
                  <DetailRow label="Edge (pp)" value={`${detail.edge_pp}pp`} />
                )}
                {detail.stage && <DetailRow label="Stage" value={detail.stage} />}
                {detail.kickoff && (
                  <DetailRow label="Kickoff" value={new Date(detail.kickoff).toLocaleString()} />
                )}
              </div>

              {detail.rationale && (
                <div>
                  <p className="text-xs mb-1.5 uppercase tracking-wide" style={{ color: '#474a4a', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                    Rationale
                  </p>
                  <p
                    className="text-xs leading-relaxed rounded-lg p-3"
                    style={{ color: '#d1d4d1', backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
                  >
                    {detail.rationale}
                  </p>
                </div>
              )}

              {bet.result === 'pending' && (
                <form onSubmit={handleUpdate} className="pt-3 space-y-2" style={{ borderTop: '1px solid #1e1e1e' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#d1d4d1', letterSpacing: '0.08em' }}>
                    Update Outcome
                  </p>
                  <div className="flex gap-2">
                    {['home', 'draw', 'away'].map(o => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setSelectedOutcome(o)}
                        className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-all"
                        style={{
                          backgroundColor: selectedOutcome === o ? '#2a398d' : 'transparent',
                          color: selectedOutcome === o ? '#ffffff' : '#474a4a',
                          border: `1px solid ${selectedOutcome === o ? '#2a398d' : '#2a2a2a'}`,
                        }}
                      >
                        {outcomeLabel[o]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="P&L in USDC (e.g. 8.40 or -5.00)"
                      value={pnlInput}
                      onChange={e => setPnlInput(e.target.value)}
                      className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none"
                      style={{
                        backgroundColor: '#111111',
                        border: '1px solid #2a2a2a',
                        color: '#ffffff',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={updating || !selectedOutcome || pnlInput === ''}
                      className="text-white text-xs px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40"
                      style={{ backgroundColor: '#3cac3b' }}
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <p className="text-xs text-center py-2" style={{ color: '#474a4a' }}>Loading details...</p>
          )}
        </div>
      )}
    </div>
  )
}
