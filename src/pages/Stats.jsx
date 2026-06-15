import { useQuery } from '@tanstack/react-query'
import { getPublicStats } from '../api/public'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import Countdown from '../components/Countdown'
import { ActivityIcon, ClockIcon, ZapIcon } from '../components/Icons'

function countdownSeconds(iso) {
  if (!iso) return null
  return Math.max(0, Math.floor((new Date(iso) - Date.now()) / 1000))
}

function PageHeading({ children }) {
  return (
    <h1
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: '#d1d4d1', letterSpacing: '0.18em' }}
    >
      {children}
    </h1>
  )
}

function WinLossChart({ won, lost }) {
  const total = Math.max(won + lost, 1)
  const maxH = 72
  const wonH = Math.max(8, Math.round((won / total) * maxH))
  const lostH = Math.max(8, Math.round((lost / total) * maxH))

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      <p
        className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ color: '#474a4a', letterSpacing: '0.1em' }}
      >
        Win / Loss
      </p>
      <div className="flex items-end gap-3" style={{ height: `${maxH + 28}px` }}>
        {/* Won bar */}
        <div className="flex-1 flex flex-col items-center justify-end gap-1.5">
          <span className="text-xs font-bold" style={{ color: '#3cac3b' }}>{won}</span>
          <div
            className="w-full rounded-t transition-all"
            style={{ height: `${wonH}px`, backgroundColor: '#3cac3b', opacity: 0.85 }}
          />
          <span className="text-xs font-medium uppercase" style={{ color: '#474a4a', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
            Won
          </span>
        </div>
        {/* Lost bar */}
        <div className="flex-1 flex flex-col items-center justify-end gap-1.5">
          <span className="text-xs font-bold" style={{ color: '#e61d25' }}>{lost}</span>
          <div
            className="w-full rounded-t transition-all"
            style={{ height: `${lostH}px`, backgroundColor: '#e61d25', opacity: 0.85 }}
          />
          <span className="text-xs font-medium uppercase" style={{ color: '#474a4a', letterSpacing: '0.08em', fontSize: '0.6rem' }}>
            Lost
          </span>
        </div>
      </div>
    </div>
  )
}

function WinRateDonut({ rate }) {
  const pct = Math.min(100, Math.max(0, rate ?? 0))
  const r = 15.9155
  const circumference = 2 * Math.PI * r
  const dashArray = `${(pct / 100) * circumference} ${circumference}`
  const color = pct >= 55 ? '#3cac3b' : pct >= 40 ? '#d1d4d1' : '#e61d25'

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
    >
      <p
        className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ color: '#474a4a', letterSpacing: '0.1em' }}
      >
        Win Rate
      </p>
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r={r} fill="none" stroke="#1e1e1e" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r={r}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeDasharray={dashArray}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color }}>
              {pct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Stats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['publicStats'],
    queryFn: getPublicStats,
    refetchInterval: 30000,
  })

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">

        <div className="flex items-center gap-2 mb-5">
          <ActivityIcon size={14} style={{ color: '#d1d4d1' }} />
          <PageHeading>Agent Performance</PageHeading>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-4 animate-pulse"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                {/* Loading skeleton uses logo as a subtle watermark */}
                <div className="h-3 rounded w-2/3 mb-3" style={{ backgroundColor: '#1e1e1e' }} />
                <div className="h-7 rounded w-1/2" style={{ backgroundColor: '#1a1a1a' }} />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'rgba(230,29,37,0.08)', border: '1px solid rgba(230,29,37,0.2)' }}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#e61d25' }} />
            <p className="text-xs font-medium" style={{ color: '#e61d25' }}>
              Server error: Failed to load data
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Bets Won"
                value={data.bets_won}
                accent="text-[#3cac3b]"
              />
              <StatCard
                label="Bets Lost"
                value={data.bets_lost}
                accent="text-[#e61d25]"
              />
              <StatCard
                label="Total P&L"
                value={`${data.total_pnl >= 0 ? '+' : ''}$${data.total_pnl?.toFixed(2)}`}
                accent={data.total_pnl >= 0 ? 'text-[#3cac3b]' : 'text-[#e61d25]'}
              />
              <StatCard
                label="Balance"
                value={`$${data.current_balance?.toFixed(2)}`}
              />
            </div>

            {/* Charts row */}
            {(data.bets_won != null && data.bets_lost != null) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <WinLossChart won={data.bets_won ?? 0} lost={data.bets_lost ?? 0} />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <WinRateDonut rate={data.win_rate} />
                </div>
              </div>
            )}

            {/* Agent status + countdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const isActive = data.agent_status === 'active'
                const dotColor = isActive ? '#3cac3b' : '#f5a623'
                const labelColor = isActive ? '#3cac3b' : '#f5a623'
                const label = isActive ? 'Active' : 'Idle'
                return (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-widest mb-1"
                      style={{ color: '#474a4a', letterSpacing: '0.1em' }}
                    >
                      Agent Status
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: dotColor }}
                      />
                      <span
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: labelColor, letterSpacing: '0.08em' }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                )
              })()}

              {data.next_scheduled_run && (
                <div
                  className="col-span-1 md:col-span-3 rounded-xl p-4"
                  style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-widest mb-1 flex items-center gap-1.5"
                    style={{ color: '#474a4a', letterSpacing: '0.1em' }}
                  >
                    <ClockIcon size={12} />
                    Next Run
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#2a398d' }}>
                    <Countdown seconds={countdownSeconds(data.next_scheduled_run)} />
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#474a4a' }}>
                    {new Date(data.next_scheduled_run).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
