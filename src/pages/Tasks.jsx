import { useEffect, useMemo, useState } from 'react'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { clearToken, getToken } from '../utils/token'
import { useNavigate } from 'react-router-dom'

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Request failed'
}

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function Tasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
  })

  const isAuthed = useMemo(() => !!getToken(), [])

  useEffect(() => {
    if (!isAuthed) navigate('/login')
  }, [isAuthed, navigate])

  async function loadTasks() {
    setError('')
    setLoading(true)
    try {
      const data = await fetchTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetForm() {
    setEditingId(null)
    setForm({ title: '', description: '', status: 'todo' })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (editingId) {
        await updateTask(editingId, form)
      } else {
        await createTask(form)
      }
      resetForm()
      await loadTasks()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this task?')
    if (!ok) return

    setError('')
    setLoading(true)
    try {
      await deleteTask(id)
      await loadTasks()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function onEdit(task) {
    setEditingId(task._id)
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
    })
  }

  return (
    <div className="page tasks-page">
      <h2>{editingId ? 'Edit Task' : 'Your Tasks'}</h2>

      {error ? <div className="error">{error}</div> : null}
      {loading ? <div className="loading">Loading...</div> : null}

      <form className="card task-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            rows={3}
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>
            {editingId ? 'Save Changes' : 'Create Task'}
          </button>
          {editingId ? (
            <button className="btn btn-secondary" type="button" disabled={loading} onClick={resetForm}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="tasks-list">
        {tasks.length === 0 && !loading ? <div className="muted">No tasks yet.</div> : null}
        {tasks.map((task) => (
          <div key={task._id} className="task-item">
            <div className="task-main">
              <div className="task-title">{task.title}</div>
              {task.description ? <div className="task-desc">{task.description}</div> : null}
              <div className="task-meta">
                <span>Status: {task.status}</span>
              </div>
            </div>
            <div className="task-actions">
              <button
                className="btn btn-secondary"
                type="button"
                disabled={loading}
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                type="button"
                disabled={loading}
                onClick={() => onDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="logout-note">
        {getToken() ? null : (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              clearToken()
              navigate('/login')
            }}
          >
            Login again
          </button>
        )}
      </div>
    </div>
  )
}

