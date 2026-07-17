import client from './client'

// Kicks off a background pipeline run. Returns { session_id } immediately —
// the actual reasoning happens after this resolves.
export const createFixture = ({ home, away, stage, agent, kickOffTime }) =>
  client
    .post('/api/fixture', {
      home,
      away,
      stage,
      agent,
      ...(kickOffTime ? { kick_off_time: kickOffTime } : {}),
    })
    .then((r) => r.data)

// Poll this while a run is in flight. Can briefly 404 right after
// createFixture() resolves (background task hasn't created the session row
// yet) — callers should tolerate one retry.
export const getFixture = (sessionId) =>
  client.get(`/api/fixture/${sessionId}`).then((r) => r.data)

// Places the real order. Non-2xx responses are still a full OrderResponse
// body (status/reason), not a bare `detail` string, so surface the response
// data on error instead of throwing a generic axios error.
export const placeOrder = async (sessionId) => {
  try {
    const { data } = await client.post(`/api/fixture/${sessionId}/order`)
    return data
  } catch (err) {
    if (err.response?.data) return err.response.data
    throw err
  }
}
