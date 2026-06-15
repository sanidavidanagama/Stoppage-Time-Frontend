import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBets, getBet, updateOutcome } from '../api/bets'
import Layout from '../components/Layout'
import BetCard from '../components/BetCard'

const TABS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'No Bet', value: 'no_bet' },
]

export default function Bets() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bets', status, page],
    queryFn: () => getBets({ page, per_page: 20, ...(status ? { status } : {}) }),
  })

  const { data: detail } = useQuery({
    queryKey: ['bet', expandedId],
    queryFn: () => getBet(expandedId),
    enabled: !!expandedId,
  })

  const outcomeMutation = useMutation({
    mutationFn: ({ id, body }) => updateOutcome(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bet', expandedId] })
    },
  })

  const handleTabChange = (val) => {
    setStatus(val)
    setPage(1)
    setExpandedId(null)
  }

  const handleToggle = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Bets</h1>

        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                status === tab.value
                  ? 'bg-white text-[#2A398D] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-[#E61D25] text-sm text-center py-8">Failed to load bets.</p>
        )}

        {!isLoading && data?.data?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">💰</p>
            <p className="text-sm">No bets found</p>
          </div>
        )}

        {data?.data && data.data.length > 0 && (
          <div className="space-y-3">
            {data.data.map(bet => (
              <BetCard
                key={bet.id}
                bet={bet}
                expanded={expandedId === bet.id}
                detail={expandedId === bet.id ? detail : null}
                onToggle={() => handleToggle(bet.id)}
                onUpdateOutcome={(body) => outcomeMutation.mutate({ id: bet.id, body })}
                updating={outcomeMutation.isPending}
              />
            ))}
          </div>
        )}

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              {page} / {data.total_pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
              disabled={page === data.total_pages}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
