import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import Stats from '../components/Stats'
import SearchBar from '../components/SearchBar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import * as taskService from '../services/taskService'

const EMPTY_TASK = {
  text: '',
  deadline: '',
  priority: 'medium',
  category: ''
}

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState(EMPTY_TASK)
  const [editingTask, setEditingTask] = useState(null)
  const [view, setView] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Load tasks from the API on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.fetchTasks()
        setTasks(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // Periodic overdue check, mirrors the original localStorage version
  const checkOverdue = useCallback(async () => {
    for (const task of tasks) {
      if (!task.completed && task.deadline && !task.notifiedOverdue) {
        const isOverdue = new Date(task.deadline) < new Date()
        if (isOverdue) {
          try {
            const updated = await taskService.editTask(task._id, { notifiedOverdue: true })
            setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
            toast.warning(`⚠️ Task Overdue: "${task.text}"`, {
              autoClose: false,
              closeOnClick: false
            })
          } catch {
            // silently skip; will retry on next interval
          }
        }
      }
    }
  }, [tasks])

  useEffect(() => {
    const interval = setInterval(checkOverdue, 60 * 60 * 1000)
    checkOverdue()
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setNewTask(EMPTY_TASK)
    setEditingTask(null)
  }

  const handleAddOrUpdateTask = async () => {
    if (!newTask.text.trim()) {
      toast.error('Task description cannot be empty!')
      return
    }

    try {
      if (editingTask) {
        const updated = await taskService.editTask(editingTask._id, newTask)
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
        toast.success('Task updated successfully!')
      } else {
        const created = await taskService.addTask(newTask)
        setTasks((prev) => [created, ...prev])
        toast.success('Task added successfully!')
      }
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleCompleteTask = async (task) => {
    try {
      const updated = await taskService.editTask(task._id, { completed: true })
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      toast.success(`✓ Completed: "${task.text}"`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete task')
    }
  }

  const handleEditTask = (task) => {
    setNewTask({
      text: task.text,
      deadline: task.deadline ? task.deadline.slice(0, 16) : '',
      priority: task.priority,
      category: task.category
    })
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    resetForm()
    toast.info('Edit cancelled')
  }

  const handleDeleteTask = async (task) => {
    try {
      await taskService.removeTask(task._id)
      setTasks((prev) => prev.filter((t) => t._id !== task._id))
      toast.info(`Deleted task: "${task.text}"`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task')
    }
  }

  const filteredTasks = tasks
    .filter((task) => {
      const matchesView =
        view === 'all' || (view === 'pending' && !task.completed) || (view === 'completed' && task.completed)

      const term = searchTerm.toLowerCase()
      const matchesSearch =
        task.text.toLowerCase().includes(term) || (task.category || '').toLowerCase().includes(term)

      return matchesView && matchesSearch
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(a.deadline) - new Date(b.deadline)
    })

  const pendingCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.filter((task) => task.completed).length

  if (loading) {
    return <p className="empty-message">Loading tasks...</p>
  }

  return (
    <>
      <Stats total={tasks.length} pending={pendingCount} completed={completedCount} />

      <SearchBar view={view} setView={setView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TaskForm
        newTask={newTask}
        onChange={setNewTask}
        onSubmit={handleAddOrUpdateTask}
        isEditing={!!editingTask}
        onCancel={handleCancelEdit}
      />

      <TaskList tasks={filteredTasks} onComplete={handleCompleteTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />
    </>
  )
}

export default Dashboard
