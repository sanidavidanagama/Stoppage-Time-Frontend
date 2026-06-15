import { useState, useEffect } from 'react'

function formatSeconds(s) {
  if (s == null || s <= 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

export default function Countdown({ seconds }) {
  const [remaining, setRemaining] = useState(seconds ?? 0)

  useEffect(() => {
    setRemaining(seconds ?? 0)
  }, [seconds])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(r => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <>{formatSeconds(remaining)}</>
}
