import { useQuery } from '@tanstack/react-query'
import { getPublicStats } from '../api/public'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import Countdown from '../components/Countdown'

function countdownSeconds(iso) {
  if (!iso) return null
  return Math.max(0, Math.floor((new Date(iso) - Date.now()) / 1000))
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
        <h1 className="text-xl font-bold text-gray-900 mb-1">Agent Performance</h1>
        <p className="text-sm text-gray-500 mb-5">FIFA World Cup 2026 — live stats</p>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-7 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-[#E61D25] text-sm">Failed to load stats. Is the backend running?</p>
        )}

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Bets Won"
              value={data.bets_won}
              accent="text-[#3CAC3B]"
            />
            <StatCard
              label="Bets Lost"
              value={data.bets_lost}
              accent="text-[#E61D25]"
            />
            <StatCard
              label="Win Rate"
              value={`${data.win_rate?.toFixed(1)}%`}
              accent="text-[#2A398D]"
            />
            <StatCard
              label="Total P&L"
              value={`${data.total_pnl >= 0 ? '+' : ''}$${data.total_pnl?.toFixed(2)}`}
              accent={data.total_pnl >= 0 ? 'text-[#3CAC3B]' : 'text-[#E61D25]'}
            />
            <StatCard
              label="Balance"
              value={`$${data.current_balance?.toFixed(2)}`}
            />
            <StatCard
              label="Agent Status"
              value={data.agent_status === 'active' ? 'Active' : 'Inactive'}
              accent={data.agent_status === 'active' ? 'text-[#3CAC3B]' : 'text-gray-400'}
            />
            {data.next_scheduled_run && (
              <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Next Run</p>
                <p className="text-2xl font-bold text-[#2A398D] mt-1">
                  <Countdown seconds={countdownSeconds(data.next_scheduled_run)} />
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(data.next_scheduled_run).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
