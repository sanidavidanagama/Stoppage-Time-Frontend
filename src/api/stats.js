import client from './client'

export const getAgentStats = () => client.get('/api/agent/stats').then((r) => r.data)
