import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBets, getBet, updateOutcome } from '../api/bets'
import Layout from '../components/Layout'
import BetCard from '../components/BetCard'
import { TrendingUpIcon, ChevronLeftIcon, ChevronRightIcon, InboxIcon } from '../components/Icons'

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
    staleTime: 0,
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

        <div className="flex items-center gap-2 mb-5">
          <TrendingUpIcon size={14} style={{ color: '#d1d4d1' }} />
          <h1
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#d1d4d1', letterSpacing: '0.18em' }}
          >
            Bet History
          </h1>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 mb-4 p-1 rounded-xl"
          style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: status === tab.value ? '#1e1e1e' : 'transparent',
                color: status === tab.value ? '#ffffff' : '#474a4a',
                border: status === tab.value ? '1px solid #2a2a2a' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-xl p-4 animate-pulse"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                <div className="h-4 rounded w-1/2 mb-2" style={{ backgroundColor: '#1e1e1e' }} />
                <div className="h-3 rounded w-2/3" style={{ backgroundColor: '#1a1a1a' }} />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-center py-8" style={{ color: '#e61d25' }}>
            Failed to load bets.
          </p>
        )}

        {!isLoading && !isError && data && data.data.length === 0 && (
          <div className="text-center py-16" style={{ color: '#474a4a' }}>
            <InboxIcon size={36} style={{ color: '#2a2a2a', margin: '0 auto 12px' }} />
            <p className="text-xs uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>No bets found</p>
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
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a', color: '#d1d4d1' }}
            >
              <ChevronLeftIcon size={13} />
              Prev
            </button>
            <span className="text-xs" style={{ color: '#474a4a' }}>
              {page} / {data.total_pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
              disabled={page === data.total_pages}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{ backgroundColor: '#111111', border: '1px solid #2a2a2a', color: '#d1d4d1' }}
            >
              Next
              <ChevronRightIcon size={13} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
