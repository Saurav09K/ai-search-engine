function SearchBar({ query, setQuery, onSubmit, isLoading }) {
  return (
    <div className="search-panel">
      <form className="search-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="search-query">
          Search query
        </label>
        <input
          id="search-query"
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask a precise question..."
          autoComplete="off"
        />
        <button className="search-button" type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? 'Searching' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default SearchBar
