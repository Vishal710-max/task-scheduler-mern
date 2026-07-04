export function getTaskStatus(task) {
  if (task.completed) return 'completed'
  if (task.deadline && new Date(task.deadline) < new Date()) return 'overdue'
  if (task.deadline && new Date(task.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)) return 'due-soon'
  return 'pending'
}
