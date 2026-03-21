import { client } from './client'

export async function registerUser(payload) {
  const res = await client.post('/auth/register', payload)
  return res.data
}

export async function loginUser(payload) {
  const res = await client.post('/auth/login', payload)
  return res.data
}

