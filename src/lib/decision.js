// A human-readable label for a bet's decision — the actual team code (or
// name, if no code is set) when it backed a side, "Draw" for a draw, or an
// em dash when there's nothing decided yet (skip/pending). Shared between
// the share card and the match-clock result panel so "what did it pick"
// reads identically everywhere it's shown.
export function decisionLabel(bet) {
  if (!bet) return '—'
  if (bet.decision === 'home') return bet.home_code || bet.home_team || 'Home'
  if (bet.decision === 'away') return bet.away_code || bet.away_team || 'Away'
  if (bet.decision === 'draw') return 'Draw'
  return '—'
}
