import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginUser } from '../api/auth'
import { getToken, setToken } from '../utils/token'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Request failed'
}

export default function Login() {
  const navigate = useNavigate()

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
      const data = await loginUser({ email, password })
      setToken(data.token)
      navigate('/tasks')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>Login</h2>
      <form className="card" onSubmit={onSubmit}>
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
            autoComplete="current-password"
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

