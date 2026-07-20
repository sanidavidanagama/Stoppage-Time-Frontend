// Derives a single display status for a BetOut row. The API doesn't hand
// back one status enum for bets (only sessions have `status`) — this is
// reconstructed from decision/order_id/actual_outcome/pnl per the rules in
// README.md's "Aggregation definitions" section.
const PLACEABLE = new Set(['home', 'draw', 'away'])

export function betStatus(bet) {
  if (!bet) return 'pending'
  if (bet.decision === 'skip') return 'skipped'
  if (bet.actual_outcome != null) {
    return (bet.pnl ?? 0) > 0 ? 'win' : 'loss'
  }
  if (PLACEABLE.has(bet.decision) && bet.order_id) return 'live'
  return 'pending'
}

export const STATUS_LABEL = {
  win: 'Won',
  loss: 'Lost',
  live: 'Live',
  skipped: 'Skipped',
  pending: 'Pending',
}
