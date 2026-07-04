import Task from '../models/Task.js'

// @route  GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch tasks' })
  }
}

// @route  POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { text, deadline, priority, category } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task description cannot be empty' })
    }

    const task = await Task.create({
      user: req.user._id,
      text: text.trim(),
      deadline: deadline || null,
      priority: priority || 'medium',
      category: category || ''
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create task' })
  }
}

// @route  PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this task' })
    }

    const { text, deadline, priority, category, completed, notifiedOverdue } = req.body

    if (text !== undefined) task.text = text.trim()
    if (deadline !== undefined) task.deadline = deadline
    if (priority !== undefined) task.priority = priority
    if (category !== undefined) task.category = category
    if (notifiedOverdue !== undefined) task.notifiedOverdue = notifiedOverdue

    if (completed !== undefined && completed !== task.completed) {
      task.completed = completed
      task.completedAt = completed ? new Date() : null
    }

    const updatedTask = await task.save()
    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update task' })
  }
}

// @route  DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' })
    }

    await task.deleteOne()
    res.json({ message: 'Task deleted', id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete task' })
  }
}
