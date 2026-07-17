function pct(n) {
  return `${Math.round((n ?? 0) * 100)}%`
}

const BAR_HEIGHT = 22
const COMPACT_BAR_HEIGHT = 16

// Three-segment probability bar for home/draw/away, used on the share card
// and the live Decision panel. This is purely the probability split — which
// outcome the agent actually backed is shown separately as its own
// "Decision" stat (see decisionLabel in lib/decision.js), not folded into
// this bar, so it stays a plain, unopinionated read of the split.
export default function ProbBar({ home, draw, away, homeLabel, awayLabel, compact = false }) {
  const segments = [
    { key: 'home', value: home ?? 0, label: homeLabel || 'Home' },
    { key: 'draw', value: draw ?? 0, label: 'Draw' },
    { key: 'away', value: away ?? 0, label: awayLabel || 'Away' },
  ]

  // The % labels are vertically centered via line-height rather than
  // flexbox align-items — html2canvas (used for the card's PNG export)
  // doesn't reliably replicate flex vertical centering for text and was
  // rendering it noticeably low in the downloaded image, even though it
  // looked fine in the live DOM. line-height centering has no such gap.
  const barHeight = compact ? COMPACT_BAR_HEIGHT : BAR_HEIGHT

  return (
    <div className="sc-probbar-wrap" style={compact ? { margin: '14px 0 10px' } : undefined}>
      <div className="sc-probbar" style={{ height: barHeight }}>
        {segments.map((seg) => {
          const width = Math.max(0, Math.min(100, seg.value * 100))
          if (width <= 0) return null
          return (
            <div
              key={seg.key}
              className={`seg ${seg.key}`}
              style={{ width: `${width}%`, lineHeight: `${barHeight}px` }}
              title={`${seg.label}: ${pct(seg.value)}`}
            >
              {width >= 14 && pct(seg.value)}
            </div>
          )
        })}
      </div>
      <div className="sc-probbar-legend">
        {segments.map((seg) => (
          <span key={seg.key}>{seg.label} {pct(seg.value)}</span>
        ))}
      </div>
    </div>
  )
}
