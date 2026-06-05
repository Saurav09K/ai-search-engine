function formatSimilarity(score) {
  const value = Number(score)

  if (Number.isNaN(value)) {
    return 'Match'
  }

  return `${Math.round(value * 100)}%`
}

function SourcesList({ sources, isLoading }) {
  return (
    <aside className="sources-list">
      <h2 className="section-title">Sources</h2>
      {isLoading ? (
        <p className="loading-text">Retrieving sources...</p>
      ) : (
        <ul className="source-list fade-in">
          {sources.length > 0 ? (
            sources.map((source, index) => (
              <li className="source-card" key={`${source.url || source.title || 'source'}-${index}`}>
                <div className="source-card-header">
                  <span className="source-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="similarity-badge">
                    {formatSimilarity(source.similarity_score)}
                  </span>
                </div>
                <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                  {source.title || source.url || 'Untitled source'}
                </a>
                {source.url && <span className="source-url">{source.url}</span>}
              </li>
            ))
          ) : (
            <li className="empty-source">No sources returned.</li>
          )}
        </ul>
      )}
    </aside>
  )
}

export default SourcesList
