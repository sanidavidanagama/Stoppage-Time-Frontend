function pct(n) {
  return `${Math.round((n ?? 0) * 100)}%`
}

const PICK_WORD = { home: 'Home Win', draw: 'Draw', away: 'Away Win' }

// Three-segment probability bar for home/draw/away, used on the share card
// and the live Decision panel. `pick` (home/draw/away) — when the agent
// actually committed to an outcome, not skip/pending — gets called out as
// its own high-contrast badge above the bar, not just a subtle style
// difference in the legend below: the probability split alone doesn't tell
// you what the agent decided to back, and that's the one thing this needs
// to make unmistakable at a glance.
export default function ProbBar({ home, draw, away, pick, homeLabel, awayLabel, compact = false }) {
  const segments = [
    { key: 'home', value: home ?? 0, label: homeLabel || 'Home' },
    { key: 'draw', value: draw ?? 0, label: 'Draw' },
    { key: 'away', value: away ?? 0, label: awayLabel || 'Away' },
  ]

  const picked = segments.find((s) => s.key === pick)

  return (
    <div className="sc-probbar-wrap" style={compact ? { margin: '14px 0 10px' } : undefined}>
      {picked && (
        <div className="prob-pick">
          <span className="prob-pick-tag">Agent's Pick</span>
          <span className="prob-pick-value">
            {picked.key === 'draw' ? (
              'Draw'
            ) : (
              <>{picked.label} <span className="prob-pick-word">({PICK_WORD[picked.key]})</span></>
            )} · {pct(picked.value)}
          </span>
        </div>
      )}
      <div className="sc-probbar" style={compact ? { height: 16 } : undefined}>
        {segments.map((seg) => {
          const width = Math.max(0, Math.min(100, seg.value * 100))
          if (width <= 0) return null
          return (
            <div
              key={seg.key}
              className={`seg ${seg.key} ${pick === seg.key ? 'picked' : ''}`}
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
