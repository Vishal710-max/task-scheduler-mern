function TaskForm({ newTask, onChange, onSubmit, isEditing, onCancel }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...newTask, [name]: value })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <div className="task-form">
      <input
        type="text"
        name="text"
        value={newTask.text}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="Task description"
      />

      <input type="datetime-local" name="deadline" value={newTask.deadline || ''} onChange={handleChange} />

      <select name="priority" value={newTask.priority} onChange={handleChange}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <input
        type="text"
        name="category"
        value={newTask.category}
        onChange={handleChange}
        placeholder="Category/Tag"
      />

      <button onClick={onSubmit}>{isEditing ? 'Update Task' : 'Add Task'}</button>

      {isEditing && (
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      )}
    </div>
  )
}

export default TaskForm
