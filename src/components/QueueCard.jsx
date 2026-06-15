import Countdown from './Countdown'

const statusStyles = {
  pending: 'bg-blue-100 text-[#2A398D]',
  running: 'bg-green-100 text-[#3CAC3B] animate-pulse',
  done: 'bg-gray-100 text-gray-500',
  failed: 'bg-red-100 text-[#E61D25]',
}

export default function QueueCard({ entry, onRun, onRemove }) {
  const isRunning = entry.status === 'running'
  const isDone = entry.status === 'done' || entry.status === 'failed'

  const totalWindow = entry.seconds_until_kickoff || 1
  const runProgress = Math.max(0, Math.min(100,
    (1 - entry.seconds_until_run / totalWindow) * 100
  ))

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {entry.home_team} vs {entry.away_team}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Kickoff: {new Date(entry.kickoff_time).toLocaleString()}
          </p>
        </div>
        <span className={`ml-3 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[entry.status] || 'bg-gray-100 text-gray-500'}`}>
          {entry.status}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div
          className="bg-[#2A398D] h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${runProgress}%` }}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span>
          Run in:{' '}
          <span className="font-medium text-gray-700">
            <Countdown seconds={entry.seconds_until_run} />
          </span>
        </span>
        <span>
          Kickoff in:{' '}
          <span className="font-medium text-gray-700">
            <Countdown seconds={entry.seconds_until_kickoff} />
          </span>
        </span>
      </div>

      {!isDone && (
        <div className="flex gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex-1 bg-[#3CAC3B] text-white text-xs py-1.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
          >
            Run Now
          </button>
          <button
            onClick={onRemove}
            disabled={isRunning}
            className="flex-1 bg-[#E61D25] text-white text-xs py-1.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-40 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
