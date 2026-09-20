import { useEffect, useState } from 'react'
import './App.css'

// In the docker-compose setup, the browser talks to the backend directly
// on localhost:3000 (the port we publish from the backend container).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)

  const loadTasks = () => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => setError('Could not reach the backend API.'))
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const addTask = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { title, done: false } }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask])
        setTitle('')
      })
      .catch(() => setError('Could not reach the backend API.'))
  }

  const toggleTask = (task) => {
    fetch(`${API_URL}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { done: !task.done } }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      })
  }

  const deleteTask = (task) => {
    fetch(`${API_URL}/tasks/${task.id}`, { method: 'DELETE' }).then(() => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    })
  }

  return (
    <div className="app">
      <h1>Task List</h1>
      <p className="subtitle">
        React frontend &rarr; Rails API (<code>{API_URL}</code>) &rarr; MySQL
      </p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task)}
              />
              {task.title}
            </label>
            <button onClick={() => deleteTask(task)} className="delete">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
