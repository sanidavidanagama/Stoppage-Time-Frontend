function pct(n) {
  return `${Math.round((n ?? 0) * 100)}%`
}

// Three-segment probability bar for home/draw/away, used on the share card
// and anywhere else a compact win-probability split is useful.
export default function ProbBar({ home, draw, away, pick, homeLabel, awayLabel, compact = false }) {
  const segments = [
    { key: 'home', value: home ?? 0, label: homeLabel || 'Home' },
    { key: 'draw', value: draw ?? 0, label: 'Draw' },
    { key: 'away', value: away ?? 0, label: awayLabel || 'Away' },
  ]

  return (
    <div className="sc-probbar-wrap" style={compact ? { margin: '14px 0 10px' } : undefined}>
      <div className="sc-probbar" style={compact ? { height: 16 } : undefined}>
        {segments.map((seg) => {
          const width = Math.max(0, Math.min(100, seg.value * 100))
          if (width <= 0) return null
          return (
            <div
              key={seg.key}
              className={`seg ${seg.key}`}
              style={{ width: `${width}%` }}
              title={`${seg.label}: ${pct(seg.value)}`}
            >
              {width >= 14 && pct(seg.value)}
            </div>
          )
        })}
      </div>
      <div className="sc-probbar-legend">
        {segments.map((seg) => (
          <span key={seg.key} className={pick === seg.key ? 'pick' : ''}>
            {seg.label} {pct(seg.value)}
          </span>
        ))}
      </div>
    </div>
  )
}
