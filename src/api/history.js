import client from './client'

export const getHistory = ({ limit = 20, offset = 0 } = {}) =>
  client.get('/api/history', { params: { limit, offset } }).then((r) => r.data)

export const getHistoryDetail = (sessionId) =>
  client.get(`/api/history/${sessionId}`).then((r) => r.data)
