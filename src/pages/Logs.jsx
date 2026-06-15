import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBets } from '../api/bets'
import { getBetLogs } from '../api/logs'
import Layout from '../components/Layout'
import LogViewer from '../components/LogViewer'

export default function Logs() {
  const [selectedBet, setSelectedBet] = useState(null)

  const { data: betsData, isLoading: betsLoading } = useQuery({
    queryKey: ['bets-for-logs'],
    queryFn: () => getBets({ page: 1, per_page: 50 }),
  })

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['logs', selectedBet?.id],
    queryFn: () => getBetLogs(selectedBet.id),
    enabled: !!selectedBet,
  })

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Agent Logs</h1>
        <div className="md:grid md:gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
          <div className="mb-4 md:mb-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Match</p>
              </div>
              {betsLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : betsData?.data?.length === 0 ? (
                <p className="text-sm text-gray-400 p-4 text-center">No bets yet</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {betsData?.data?.map(bet => (
                    <li key={bet.id}>
                      <button
                        onClick={() => setSelectedBet(bet)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedBet?.id === bet.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className={`text-sm font-medium ${selectedBet?.id === bet.id ? 'text-[#2A398D]' : 'text-gray-800'}`}>
                          {bet.home} vs {bet.away}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{bet.result}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            {!selectedBet ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-gray-400 text-sm">Select a match to view agent logs</p>
              </div>
            ) : logsLoading ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-400 text-sm animate-pulse">Loading logs…</p>
              </div>
            ) : logsData ? (
              <LogViewer logs={logsData.logs} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-[#E61D25] text-sm">Failed to load logs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
