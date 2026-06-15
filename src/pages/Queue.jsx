import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQueue, addToQueue, removeFromQueue, runNow } from '../api/queue'
import Layout from '../components/Layout'
import QueueCard from '../components/QueueCard'
import { ListIcon, InboxIcon } from '../components/Icons'

export default function Queue() {
  const queryClient = useQueryClient()
  const [home, setHome] = useState('')
  const [away, setAway] = useState('')
  const [kickoff, setKickoff] = useState('')
  const [formError, setFormError] = useState('')

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    refetchInterval: 10000,
  })

  const addMutation = useMutation({
    mutationFn: addToQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      setHome('')
      setAway('')
      setKickoff('')
      setFormError('')
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || 'Failed to add match.')
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFromQueue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queue'] }),
  })

  const runMutation = useMutation({
    mutationFn: runNow,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queue'] }),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    addMutation.mutate({
      home_team: home.trim(),
      away_team: away.trim(),
      kickoff_time: new Date(kickoff).toISOString(),
    })
  }

  const inputStyle = {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
    fontFamily: "'Google Sans', system-ui, sans-serif",
  }

  const handleFocus = e => { e.target.style.borderColor = '#2a398d' }
  const handleBlur = e => { e.target.style.borderColor = '#2a2a2a' }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">

        <div className="flex items-center gap-2 mb-5">
          <ListIcon size={14} style={{ color: '#d1d4d1' }} />
          <h1
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#d1d4d1', letterSpacing: '0.18em' }}
          >
            Match Queue
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-3 mb-6">
            {[1, 2].map(i => (
              <div
                key={i}
                className="rounded-xl p-4 animate-pulse"
                style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
              >
                <div className="h-4 rounded w-1/2 mb-2" style={{ backgroundColor: '#1e1e1e' }} />
                <div className="h-3 rounded w-1/3 mb-3" style={{ backgroundColor: '#1a1a1a' }} />
                <div className="h-1.5 rounded-full mb-3" style={{ backgroundColor: '#1e1e1e' }} />
                <div className="h-8 rounded-lg" style={{ backgroundColor: '#1a1a1a' }} />
              </div>
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-14 mb-6" style={{ color: '#474a4a' }}>
            <InboxIcon size={36} style={{ color: '#2a2a2a', margin: '0 auto 12px' }} />
            <p className="text-xs uppercase tracking-widest" style={{ letterSpacing: '0.12em' }}>
              No matches in the queue
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {queue.map(entry => (
              <QueueCard
                key={entry.id}
                entry={entry}
                onRun={() => runMutation.mutate(entry.id)}
                onRemove={() => removeMutation.mutate(entry.id)}
              />
            ))}
          </div>
        )}

        {/* Add match form */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
        >
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#d1d4d1', letterSpacing: '0.14em' }}
          >
            Add Match
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  className="block text-xs mb-1.5 uppercase tracking-wide"
                  style={{ color: '#474a4a', letterSpacing: '0.08em', fontSize: '0.6rem' }}
                >
                  Home Team
                </label>
                <input
                  value={home}
                  onChange={e => setHome(e.target.value)}
                  placeholder="e.g. Brazil"
                  style={{ ...inputStyle, placeholderColor: '#474a4a' }}
                  className="placeholder-[#474a4a]"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-xs mb-1.5 uppercase tracking-wide"
                  style={{ color: '#474a4a', letterSpacing: '0.08em', fontSize: '0.6rem' }}
                >
                  Away Team
                </label>
                <input
                  value={away}
                  onChange={e => setAway(e.target.value)}
                  placeholder="e.g. Argentina"
                  style={inputStyle}
                  className="placeholder-[#474a4a]"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="block text-xs mb-1.5 uppercase tracking-wide"
                style={{ color: '#474a4a', letterSpacing: '0.08em', fontSize: '0.6rem' }}
              >
                Kickoff Time
              </label>
              <input
                type="datetime-local"
                value={kickoff}
                onChange={e => setKickoff(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
            {formError && (
              <p
                className="text-xs rounded-lg px-3 py-2.5"
                style={{ color: '#e61d25', backgroundColor: 'rgba(230,29,37,0.08)', border: '1px solid rgba(230,29,37,0.2)' }}
              >
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: '#2a398d', color: '#ffffff' }}
            >
              {addMutation.isPending ? 'Adding...' : 'Add to Queue'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
