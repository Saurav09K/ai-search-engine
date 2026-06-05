import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import AnswerBox from './components/AnswerBox'
import SourcesList from './components/SourcesList'

const API_BASE_URL = 'http://localhost:5000'

function App() {
  const [query, setQuery] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAsking, setIsAsking] = useState(false)

  const handleSearch = async (event) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery || isSearching || isAsking) {
      return
    }

    setAiAnswer('')
    setSources([])
    setIsSearching(true)
    setIsAsking(true)

    const encodedQuery = encodeURIComponent(trimmedQuery)

    try {
      const searchPromise = fetch(`${API_BASE_URL}/api/search?q=${encodedQuery}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Search request failed with status ${response.status}`)
          }

          return response.json()
        })
        .then((data) => {
          setSources(Array.isArray(data) ? data : [])
        })
        .finally(() => {
          setIsSearching(false)
        })

      const askPromise = fetch(`${API_BASE_URL}/api/ask?q=${encodedQuery}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Ask request failed with status ${response.status}`)
          }

          return response.json()
        })
        .then((data) => {
          setAiAnswer(data?.answer || '')
        })
        .finally(() => {
          setIsAsking(false)
        })

      await Promise.all([searchPromise, askPromise])
    } catch (error) {
      console.error(error)
    }
  }

  const hasSubmitted = Boolean(aiAnswer) || sources.length > 0 || isSearching || isAsking

  return (
    <main className="app-shell">
      <header className="top-bar" aria-label="Application header">
        <span className="brand-mark">RAG</span>
        <span className="system-status">
          <span className="status-dot" aria-hidden="true" />
          Local index
        </span>
      </header>

      <section className="search-hero" aria-labelledby="app-title">
        <p className="eyebrow">Retrieval augmented search</p>
        <h1 id="app-title" className="app-title">
          Search the source of truth.
        </h1>
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSubmit={handleSearch}
          isLoading={isSearching || isAsking}
        />
      </section>

      {hasSubmitted && (
        <section className="results-grid" aria-label="Search results">
          <AnswerBox answer={aiAnswer} isLoading={isAsking} query={query} />
          <SourcesList sources={sources} isLoading={isSearching} />
        </section>
      )}
    </main>
  )
}

export default App
