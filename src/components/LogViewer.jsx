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
  tactics_prompt: 'Tactics ↓',
  tactics_response: 'Tactics ↑',
  reasoning_prompt: 'Reasoning ↓',
  reasoning_response: 'Reasoning ↑',
  bet_prompt: 'Bet ↓',
  bet_response: 'Bet ↑',
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 overflow-x-auto">
        <div className="flex min-w-max">
          {LOG_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeType === type
                  ? 'border-[#2A398D] text-[#2A398D] bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {TAB_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {entries.length > 1 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-500 mr-1">Round:</span>
          {entries.map(e => (
            <button
              key={e.round}
              onClick={() => setRound(e.round)}
              className={`text-xs px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                round === e.round
                  ? 'bg-[#2A398D] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2A398D]'
              }`}
            >
              {e.round}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {currentEntry ? (
          <pre className="font-mono text-xs text-gray-700 bg-gray-50 rounded-lg p-3 overflow-auto max-h-[60vh] whitespace-pre-wrap break-words leading-relaxed">
            {currentEntry.content}
          </pre>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No content for this log type</p>
        )}
      </div>
    </div>
  )
}
