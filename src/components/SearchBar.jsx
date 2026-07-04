function SearchBar({ view, setView, searchTerm, setSearchTerm }) {
  return (
    <div className="controls">
      <div className="view-buttons">
        <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>
          All Tasks
        </button>
        <button className={view === 'pending' ? 'active' : ''} onClick={() => setView('pending')}>
          Pending
        </button>
        <button className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>
          Completed
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  )
}

export default SearchBar
