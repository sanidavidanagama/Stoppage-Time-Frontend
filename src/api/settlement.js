import client from './client'

// Safe to call repeatedly — idempotent, no money moves here. Records
// actual_outcome/pnl for any pending bets whose fixtures have concluded.
export const runSettlement = () =>
  client.post('/api/settlement/run').then((r) => r.data)
