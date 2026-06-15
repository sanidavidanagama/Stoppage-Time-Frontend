import client from './client'

export const getQueue = () => client.get('/api/queue').then(r => r.data)
export const addToQueue = (body) => client.post('/api/queue', body).then(r => r.data)
export const removeFromQueue = (id) => client.delete(`/api/queue/${id}`).then(r => r.data)
export const runNow = (id) => client.post(`/api/queue/${id}/run`).then(r => r.data)
