import client from './client'

function normalizeBetsResponse(body) {
  // already the expected shape
  if (body && Array.isArray(body.data)) return body
  // bare array
  if (Array.isArray(body)) return { data: body, total_pages: 1 }
  // common alternative keys
  const arr = body?.items ?? body?.results ?? body?.bets ?? null
  if (arr) return { data: arr, total_pages: body.total_pages ?? 1 }
  // fallback: wrap whatever came back so the UI never gets undefined
  return { data: [], total_pages: 1 }
}

export const getBets = (params) =>
  client.get('/api/bets', { params }).then(r => normalizeBetsResponse(r.data))

export const getBet = (id) => client.get(`/api/bets/${id}`).then(r => r.data)
export const getBetLogs = (id) => client.get(`/api/bets/${id}/logs`).then(r => r.data)
export const updateOutcome = (id, body) => client.put(`/api/bets/${id}/outcome`, body).then(r => r.data)
