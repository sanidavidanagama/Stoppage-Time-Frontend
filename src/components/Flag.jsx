import { useState } from 'react'
import { flagUrlForTeam, normalizeTeamName } from '../data/teamFlags'

function initialsFor(team) {
  const normalized = normalizeTeamName(team)
  if (!normalized) return '?'
  const words = normalized.split(' ').filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase()
}

// Renders a national flag by team name via flagcdn.com, falling back to an
// initials badge (styled to match) rather than a broken <img> when the name
// doesn't resolve to a known code, or the image itself fails to load.
export default function Flag({ team, className = '', style }) {
  const url = flagUrlForTeam(team)
  const [failed, setFailed] = useState(false)

  if (!url || failed) {
    return (
      <span className={`flag-fallback ${className}`} style={style} title={team || undefined}>
        {initialsFor(team)}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt={team ? `${team} flag` : 'flag'}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  )
}
