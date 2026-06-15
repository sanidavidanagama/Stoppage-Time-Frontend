import Countdown from './Countdown'
import { PlayIcon, TrashIcon, ClockIcon } from './Icons'

const statusConfig = {
  pending: { bg: 'rgba(42,57,141,0.15)', text: '#6b82d4', border: 'rgba(42,57,141,0.3)' },
  running: { bg: 'rgba(60,172,59,0.12)', text: '#3cac3b', border: 'rgba(60,172,59,0.25)', pulse: true },
  done: { bg: 'rgba(71,74,74,0.15)', text: '#474a4a', border: 'rgba(71,74,74,0.25)' },
  failed: { bg: 'rgba(230,29,37,0.12)', text: '#e61d25', border: 'rgba(230,29,37,0.25)' },
}

export default function QueueCard({ entry, onRun, onRemove }) {
  const isRunning = entry.status === 'running'
  const isDone = entry.status === 'done' || entry.status === 'failed'

  const totalWindow = entry.seconds_until_kickoff || 1
  const runProgress = Math.max(0, Math.min(100,
    (1 - entry.seconds_until_run / totalWindow) * 100
  ))

  const sc = statusConfig[entry.status] || statusConfig.pending

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">
            {entry.home_team} <span style={{ color: '#474a4a' }}>vs</span> {entry.away_team}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#474a4a' }}>
            Kickoff: {new Date(entry.kickoff_time).toLocaleString()}
          </p>
        </div>
        <span
          className={`ml-3 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${sc.pulse ? 'animate-pulse' : ''}`}
          style={{
            backgroundColor: sc.bg,
            color: sc.text,
            border: `1px solid ${sc.border}`,
            letterSpacing: '0.06em',
            fontSize: '0.6rem',
          }}
        >
          {entry.status}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full mb-3" style={{ backgroundColor: '#1e1e1e', height: '3px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${runProgress}%`, backgroundColor: '#2a398d' }}
        />
      </div>

      {/* Countdown info */}
      <div className="flex items-center gap-4 text-xs mb-3" style={{ color: '#474a4a' }}>
        <span className="flex items-center gap-1">
          <ClockIcon size={11} />
          Run in:{' '}
          <span className="font-medium" style={{ color: '#d1d4d1' }}>
            <Countdown seconds={entry.seconds_until_run} />
          </span>
        </span>
        <span>
          Kickoff:{' '}
          <span className="font-medium" style={{ color: '#d1d4d1' }}>
            <Countdown seconds={entry.seconds_until_kickoff} />
          </span>
        </span>
      </div>

      {!isDone && (
        <div className="flex gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-1.5 text-white text-xs py-2 rounded-lg font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: '#3cac3b' }}
          >
            <PlayIcon size={11} />
            Run Now
          </button>
          <button
            onClick={onRemove}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-1.5 text-white text-xs py-2 rounded-lg font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(230,29,37,0.4)', color: '#e61d25' }}
          >
            <TrashIcon size={11} />
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
