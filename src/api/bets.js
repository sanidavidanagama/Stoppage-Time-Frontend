import client from './client'

export const getBets = (params) => client.get('/api/bets', { params }).then(r => r.data)
export const getBet = (id) => client.get(`/api/bets/${id}`).then(r => r.data)
export const getBetLogs = (id) => client.get(`/api/bets/${id}/logs`).then(r => r.data)
export const updateOutcome = (id, body) => client.put(`/api/bets/${id}/outcome`, body).then(r => r.data)
