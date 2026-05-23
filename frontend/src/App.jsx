import { useEffect, useState } from 'react'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/tasks/'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    try {
      setError(null)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      setError(null)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: trimmed,
          is_completed: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const newTask = await response.json()
      setTasks((prev) => [...prev, newTask])
      setTitle('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <h1>Task Management System</h1>
      <p className="header-subtitle">Task Tracker using Django REST Framework and ReactJS</p>

      <form className="add-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section>
        <p className="section-title">Tasks</p>
        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
                <span className={`task-title ${task.is_completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                <span className={`badge ${task.is_completed ? 'done' : ''}`}>
                  {task.is_completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App