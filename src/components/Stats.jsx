function Stats({ total, pending, completed }) {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="stats">
      <div>Total: {total}</div>
      <div>Pending: {pending}</div>
      <div>Completed: {completed}</div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${completionPercentage}%` }}></div>
        </div>
        <span>{completionPercentage}% Complete</span>
      </div>
    </div>
  )
}

export default Stats
