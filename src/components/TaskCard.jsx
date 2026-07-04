import { getTaskStatus } from '../utils/taskStatus'

function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const status = getTaskStatus(task)

  return (
    <li className={`task-item ${status} priority-${task.priority}`} data-completed={task.completed}>
      <div className="task-main">
        <div className="task-status-indicator">
          {status === 'completed' && <span className="checkmark">✓</span>}
          {status === 'overdue' && <span className="warning-icon">⚠️</span>}
          {status === 'due-soon' && <span className="due-soon-icon">⏳</span>}
        </div>

        <div className="task-info">
          <span className="task-text">{task.text}</span>

          <div className="task-meta">
            {task.category && <span className="category">{task.category}</span>}
            {task.deadline && <span className="deadline">Due: {new Date(task.deadline).toLocaleString()}</span>}
            <span className={`priority ${task.priority}`}>{task.priority} priority</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        {!task.completed && (
          <button onClick={() => onComplete(task)} className="complete-btn">
            Complete
          </button>
        )}
        <button onClick={() => onEdit(task)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(task)} className="delete-btn">
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskCard
