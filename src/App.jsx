import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

import { clearToken, getToken } from './utils/token'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

function PrivateRoute({ children }) {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [token, setToken] = useState(getToken())
  const location = useLocation()

  useEffect(() => {
    setToken(getToken())
  }, [location.pathname])

  const nav = useMemo(() => {
    if (token) {
      return (
        <div className="nav-actions">
          <Link className="nav-link" to="/tasks">
            Tasks
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => {
              clearToken()
              setToken(null)
            }}
            type="button"
          >
            Logout
          </button>
        </div>
      )
    }

    return (
      <div className="nav-actions">
        <Link className="nav-link" to="/login">
          Login
        </Link>
        <Link className="nav-link" to="/register">
          Register
        </Link>
      </div>
    )
  }, [token])

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 className="brand">Todo App</h1>
        {nav}
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/tasks' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}
