import client from './client'

export const getBetLogs = (id) => client.get(`/api/bets/${id}/logs`).then(r => r.data)
