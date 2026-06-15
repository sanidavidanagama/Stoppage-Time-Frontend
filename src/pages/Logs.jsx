import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBets } from '../api/bets'
import { getBetLogs } from '../api/logs'
import Layout from '../components/Layout'
import LogViewer from '../components/LogViewer'
import { TerminalIcon, FileTextIcon } from '../components/Icons'

const resultColors = {
  won: '#3cac3b',
  lost: '#e61d25',
  pending: '#6b82d4',
}

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

        <div className="flex items-center gap-2 mb-5">
          <TerminalIcon size={14} style={{ color: '#d1d4d1' }} />
          <h1
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#d1d4d1', letterSpacing: '0.18em' }}
          >
            Agent Logs
          </h1>
        </div>

        <div className="md:grid md:gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>

          {/* Sidebar: match selector */}
          <div className="mb-4 md:mb-0">
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
            >
              <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #1e1e1e' }}>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#474a4a', letterSpacing: '0.12em' }}
                >
                  Select Match
                </p>
              </div>
              {betsLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-10 rounded-lg animate-pulse"
                      style={{ backgroundColor: '#1e1e1e' }}
                    />
                  ))}
                </div>
              ) : betsData?.data?.length === 0 ? (
                <p className="text-xs p-4 text-center" style={{ color: '#474a4a' }}>No bets yet</p>
              ) : (
                <ul>
                  {betsData?.data?.map((bet, idx) => (
                    <li
                      key={bet.id}
                      style={{ borderBottom: idx < betsData.data.length - 1 ? '1px solid #1a1a1a' : 'none' }}
                    >
                      <button
                        onClick={() => setSelectedBet(bet)}
                        className="w-full text-left px-4 py-3 transition-all"
                        style={{
                          backgroundColor: selectedBet?.id === bet.id
                            ? 'rgba(42,57,141,0.15)'
                            : 'transparent',
                        }}
                        onMouseEnter={e => {
                          if (selectedBet?.id !== bet.id)
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
                        }}
                        onMouseLeave={e => {
                          if (selectedBet?.id !== bet.id)
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <p
                          className="text-sm font-medium"
                          style={{ color: selectedBet?.id === bet.id ? '#ffffff' : '#d1d4d1' }}
                        >
                          {bet.home} vs {bet.away}
                        </p>
                        <p
                          className="text-xs mt-0.5 capitalize font-medium"
                          style={{ color: resultColors[bet.result] || '#474a4a', fontSize: '0.65rem' }}
                        >
                          {bet.result}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Log viewer panel */}
          <div>
            {!selectedBet ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                <div className="flex justify-center mb-3" style={{ color: '#2a2a2a' }}>
                  <FileTextIcon size={40} />
                </div>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#474a4a', letterSpacing: '0.12em' }}>
                  Select a match to view agent logs
                </p>
              </div>
            ) : logsLoading ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                <p className="text-xs animate-pulse" style={{ color: '#474a4a' }}>
                  Loading logs...
                </p>
              </div>
            ) : logsData ? (
              <LogViewer logs={logsData.logs} />
            ) : (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                <p className="text-sm" style={{ color: '#e61d25' }}>Failed to load logs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
