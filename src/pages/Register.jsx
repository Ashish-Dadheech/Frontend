import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { registerUser } from '../api/auth'
import { getToken } from '../utils/token'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Request failed'
}

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (getToken()) navigate('/tasks')
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await registerUser({ name, email, password })
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>Register</h2>
      <form className="card" onSubmit={onSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

