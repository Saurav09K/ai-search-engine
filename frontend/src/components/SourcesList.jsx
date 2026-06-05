function formatSimilarity(score) {
  const numericScore = Number(score)

  if (Number.isNaN(numericScore)) {
    return 'Match'
  }

  return `${Math.round(numericScore * 100)}% match`
}

function getHostname(url) {
  if (!url) {
    return 'Indexed source'
  }

  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function SourcesList({ sources, isLoading }) {
  return (
    <aside className="sources-list">
      <div className="section-heading">
        <h2 className="section-label">Sources</h2>
        {!isLoading && sources.length > 0 && (
          <span className="section-meta">{sources.length} matches</span>
        )}
      </div>
      {isLoading ? (
        <p className="loading-text">Retrieving sources...</p>
      ) : (
        <ul className="source-items fade-in">
          {sources.length > 0 ? (
            sources.map((source, index) => (
              <li className="source-card" key={`${source.url || source.title}-${index}`}>
                <div className="source-card-top">
                  <span className="source-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="match-badge">{formatSimilarity(source.similarity_score)}</span>
                </div>
                <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                  {source.title || source.url || 'Untitled source'}
                </a>
                <span className="source-url">{getHostname(source.url)}</span>
                {source.chunk_text && <p className="source-snippet">{source.chunk_text}</p>}
              </li>
            ))
          ) : (
            <li className="empty-state">No sources returned yet.</li>
          )}
        </ul>
      )}
    </aside>
  )
}

export default SourcesList
