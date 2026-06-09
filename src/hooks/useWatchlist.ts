import { useCallback, useEffect, useState } from 'react'

const WATCHLIST_KEY = 'bjj-map.watchlist'
const NOTES_KEY = 'bjj-map.notes'

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Set<string>>(() => loadSet(WATCHLIST_KEY))
  const [notes, setNotes] = useState<Record<string, string>>(() => loadNotes())

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...watchlist]))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes])

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const addToWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const setNote = useCallback((id: string, text: string) => {
    setNotes((prev) => {
      if (!text.trim()) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: text }
    })
  }, [])

  return { watchlist, toggleWatchlist, removeFromWatchlist, addToWatchlist, notes, setNote }
}
