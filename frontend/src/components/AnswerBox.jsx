function AnswerBox({ answer, isLoading, query }) {
  return (
    <article className="answer-box">
      <div className="section-heading">
        <h2 className="section-label">Answer</h2>
        {query && <span className="section-meta">{query}</span>}
      </div>
      {isLoading ? (
        <p className="loading-text">Thinking...</p>
      ) : (
        <p className="ai-text fade-in">
          {answer || 'Submit a query to generate an answer from your retrieved context.'}
        </p>
      )}
    </article>
  )
}

export default AnswerBox
