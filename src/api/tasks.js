import { client } from './client'

export async function fetchTasks() {
  const res = await client.get('/tasks')
  return res.data.tasks
}

export async function createTask(payload) {
  const res = await client.post('/tasks', payload)
  return res.data.task
}

export async function updateTask(id, payload) {
  const res = await client.put(`/tasks/${id}`, payload)
  return res.data.task
}

export async function deleteTask(id) {
  const res = await client.delete(`/tasks/${id}`)
  return res.data
}

