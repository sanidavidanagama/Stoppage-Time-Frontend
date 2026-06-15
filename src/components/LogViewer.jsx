import { useState } from 'react'

const LOG_TYPES = [
  'tactics_prompt',
  'tactics_response',
  'reasoning_prompt',
  'reasoning_response',
  'bet_prompt',
  'bet_response',
]

const TAB_LABELS = {
  tactics_prompt: 'Tactics IN',
  tactics_response: 'Tactics OUT',
  reasoning_prompt: 'Reasoning IN',
  reasoning_response: 'Reasoning OUT',
  bet_prompt: 'Bet IN',
  bet_response: 'Bet OUT',
}

export default function LogViewer({ logs }) {
  const [activeType, setActiveType] = useState(LOG_TYPES[0])
  const [round, setRound] = useState(1)

  const entries = logs?.[activeType] || []
  const currentEntry = entries.find(e => e.round === round) || entries[0]

  const handleTypeChange = (type) => {
    setActiveType(type)
    setRound(1)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      {/* Tab strip */}
      <div className="overflow-x-auto" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <div className="flex min-w-max">
          {LOG_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className="px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-all"
              style={{
                color: activeType === type ? '#ffffff' : '#474a4a',
                backgroundColor: activeType === type ? 'rgba(42,57,141,0.15)' : 'transparent',
                borderBottom: activeType === type ? '2px solid #2a398d' : '2px solid transparent',
                letterSpacing: '0.04em',
              }}
            >
              {TAB_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Round selector */}
      {entries.length > 1 && (
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: '1px solid #1e1e1e', backgroundColor: '#0a0a0a' }}
        >
          <span className="text-xs uppercase tracking-wide mr-1" style={{ color: '#474a4a', letterSpacing: '0.08em' }}>
            Round
          </span>
          {entries.map(e => (
            <button
              key={e.round}
              onClick={() => setRound(e.round)}
              className="text-xs px-2.5 py-0.5 rounded-md font-medium transition-all"
              style={{
                backgroundColor: round === e.round ? '#2a398d' : 'transparent',
                color: round === e.round ? '#ffffff' : '#474a4a',
                border: round === e.round ? '1px solid #2a398d' : '1px solid #2a2a2a',
              }}
            >
              {e.round}
            </button>
          ))}
        </div>
      )}

      {/* Log content */}
      <div className="p-4">
        {currentEntry ? (
          <pre
            className="font-mono text-xs overflow-auto leading-relaxed"
            style={{
              color: '#d1d4d1',
              backgroundColor: '#0a0a0a',
              border: '1px solid #1e1e1e',
              borderRadius: '10px',
              padding: '12px 14px',
              maxHeight: '60vh',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-words',
            }}
          >
            {currentEntry.content}
          </pre>
        ) : (
          <p className="text-sm text-center py-6" style={{ color: '#474a4a' }}>
            No content for this log type
          </p>
        )}
      </div>
    </div>
  )
}
