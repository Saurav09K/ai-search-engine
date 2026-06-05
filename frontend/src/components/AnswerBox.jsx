function AnswerBox({ answer, isLoading }) {
  return (
    <article className="answer-box">
      <h2 className="section-title">Answer</h2>
      {isLoading ? (
        <p className="loading-text">Thinking...</p>
      ) : (
        <p className="answer-text fade-in">
          {answer || 'Run a search to generate an answer from your retrieved context.'}
        </p>
      )}
    </article>
  )
}

export default AnswerBox
