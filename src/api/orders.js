import client from './client'

// Every session currently sitting at awaiting_order — a decision's been
// made but no order placed yet. Full session+bet+logs per item, same
// shape as history detail, since the point is reviewing the reasoning
// before deciding whether to place the order. Not paginated (small,
// actionable queue rather than a growing history).
export const getAwaitingOrders = () => client.get('/api/orders/awaiting').then((r) => r.data)

// Deletes an awaiting_order session and its logs/bet — a decision nobody
// acted on. Only works while the session is still at awaiting_order.
export const deleteAwaitingOrder = (sessionId) =>
  client.delete(`/api/orders/awaiting/${sessionId}`).then((r) => r.data)
