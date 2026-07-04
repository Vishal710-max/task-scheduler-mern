import api from './api'

export const fetchTasks = async () => {
  const { data } = await api.get('/tasks')
  return data
}

export const addTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData)
  return data
}

export const editTask = async (id, updates) => {
  const { data } = await api.put(`/tasks/${id}`, updates)
  return data
}

export const removeTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`)
  return data
}
