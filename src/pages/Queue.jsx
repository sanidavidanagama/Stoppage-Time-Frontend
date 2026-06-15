import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQueue, addToQueue, removeFromQueue, runNow } from '../api/queue'
import Layout from '../components/Layout'
import QueueCard from '../components/QueueCard'

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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Match Queue</h1>

        {isLoading ? (
          <div className="space-y-3 mb-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-1.5 bg-gray-100 rounded-full mb-3" />
                <div className="h-8 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No matches in the queue</p>
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

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Add Match</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Home Team</label>
                <input
                  value={home}
                  onChange={e => setHome(e.target.value)}
                  placeholder="e.g. Brazil"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A398D] transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Away Team</label>
                <input
                  value={away}
                  onChange={e => setAway(e.target.value)}
                  placeholder="e.g. Argentina"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A398D] transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kickoff Time</label>
              <input
                type="datetime-local"
                value={kickoff}
                onChange={e => setKickoff(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A398D] transition"
                required
              />
            </div>
            {formError && (
              <p className="text-[#E61D25] text-xs bg-red-50 rounded-lg px-3 py-2">{formError}</p>
            )}
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full bg-[#2A398D] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
            >
              {addMutation.isPending ? 'Adding…' : 'Add to Queue'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
