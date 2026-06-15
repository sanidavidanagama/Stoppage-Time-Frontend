import client from './client'

export const getPublicStats = () => client.get('/api/public/stats').then(r => r.data)
