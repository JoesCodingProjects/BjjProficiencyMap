import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'bjj-map.learned'

// Tracks which technique ids the user has marked as "learned", persisted to localStorage.
export function useLearned() {
  const [learned, setLearned] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learned]))
  }, [learned])

  const toggle = useCallback((id: string) => {
    setLearned((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const markAll = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    setLearned((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
  }, [])

  const unmarkAll = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    setLearned((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }, [])

  const reset = useCallback(() => setLearned(new Set<string>()), [])

  return { learned, toggle, markAll, unmarkAll, reset }
}
