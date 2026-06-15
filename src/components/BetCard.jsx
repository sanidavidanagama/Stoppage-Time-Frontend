import { useState } from 'react'

const resultStyles = {
  won: 'bg-green-100 text-[#3CAC3B]',
  lost: 'bg-red-100 text-[#E61D25]',
  pending: 'bg-blue-100 text-[#2A398D]',
}

const outcomeLabel = {
  home: 'Home Win',
  draw: 'Draw',
  away: 'Away Win',
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-xs font-medium text-gray-800 mt-0.5">{value ?? '—'}</p>
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0 pr-3">
          <p className="font-semibold text-gray-900 truncate">
            {bet.home} vs {bet.away}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="text-xs text-gray-500">
              Pred:{' '}
              <span className="font-medium text-gray-700">
                {outcomeLabel[bet.agent_prediction] || bet.agent_prediction}
              </span>
            </span>
            {bet.market_price != null && (
              <span className="text-xs text-gray-500">
                Price:{' '}
                <span className="font-medium text-gray-700">
                  {(bet.market_price * 100).toFixed(1)}%
                </span>
              </span>
            )}
            {bet.edge != null && (
              <span className="text-xs text-gray-500">
                Edge:{' '}
                <span className="font-medium text-[#2A398D]">{bet.edge}pp</span>
              </span>
            )}
            {bet.stake != null && (
              <span className="text-xs text-gray-500">
                Stake:{' '}
                <span className="font-medium text-gray-700">${bet.stake}</span>
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${resultStyles[bet.result] || 'bg-gray-100 text-gray-500'}`}>
            {bet.result}
          </span>
          {bet.pnl != null && (
            <span className={`text-xs font-bold ${bet.pnl >= 0 ? 'text-[#3CAC3B]' : 'text-[#E61D25]'}`}>
              {bet.pnl >= 0 ? '+' : ''}{bet.pnl.toFixed(2)} USDC
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          {detail ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailRow label="Confidence" value={detail.confidence_level} />
                <DetailRow label="Actual Outcome" value={detail.actual_outcome ? (outcomeLabel[detail.actual_outcome] || detail.actual_outcome) : null} />
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
                  <p className="text-xs text-gray-500 mb-1">Rationale</p>
                  <p className="text-xs text-gray-700 bg-white rounded-lg p-3 border border-gray-100 leading-relaxed">
                    {detail.rationale}
                  </p>
                </div>
              )}

              {bet.result === 'pending' && (
                <form onSubmit={handleUpdate} className="pt-3 border-t border-gray-200 space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Update Outcome</p>
                  <div className="flex gap-2">
                    {['home', 'draw', 'away'].map(o => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setSelectedOutcome(o)}
                        className={`flex-1 text-xs py-1.5 rounded-lg font-medium border transition-colors ${
                          selectedOutcome === o
                            ? 'bg-[#2A398D] text-white border-[#2A398D]'
                            : 'border-gray-200 text-gray-600 hover:border-[#2A398D] bg-white'
                        }`}
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
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2A398D] bg-white"
                    />
                    <button
                      type="submit"
                      disabled={updating || !selectedOutcome || pnlInput === ''}
                      className="bg-[#3CAC3B] text-white text-xs px-4 py-1.5 rounded-lg font-medium disabled:opacity-40 hover:bg-green-700 transition-colors"
                    >
                      {updating ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">Loading details…</p>
          )}
        </div>
      )}
    </div>
  )
}
