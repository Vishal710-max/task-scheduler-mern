import TaskCard from './TaskCard'

function TaskList({ tasks, onComplete, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks found. Add a new task above!</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
