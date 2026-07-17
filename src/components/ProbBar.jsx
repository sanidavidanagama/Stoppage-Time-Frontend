function pct(n) {
  return `${Math.round((n ?? 0) * 100)}%`
}

// Three-segment probability bar for home/draw/away, used on the share card
// and the live Decision panel. When `pick` (home/draw/away) is set — the
// agent actually committed to an outcome, not skip/pending — it's called
// out as a plain text line above the bar, in the card's own label
// typography (Oswald, same treatment as the stage line), plus a ring on
// the winning segment. Probability alone doesn't say what the agent
// backed, so this needs to be legible, but it doesn't need to look like a
// sticker slapped on top of the design to get there.
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
        <div className="prob-pick-line">
          <span className="ppl-tag">Agent's Pick</span>
          <span className="ppl-team">{picked.key === 'draw' ? 'Draw' : picked.label}</span>
          <span className="ppl-pct">{pct(picked.value)}</span>
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
