import { useEffect, useState } from 'react'
import type { BeltLevel } from '../data/positions'
import type { Category, MoveType, PlayerPosition } from '../data/types'
import { BELT_COLORS, BELT_ORDER, CATEGORY_LABELS } from '../data/types'

export interface FilterState {
  belts: BeltLevel[]
  moveType: MoveType | 'all'
  playerPosition: PlayerPosition | 'all'
  giMode: 'all' | 'gi' | 'nogi'
  categories: Category[]
  search: string
  learned: 'all' | 'learned' | 'unlearned' | 'watchlist'
}

export const DEFAULT_FILTERS: FilterState = {
  belts: [],
  moveType: 'all',
  playerPosition: 'all',
  giMode: 'all',
  categories: [],
  search: '',
  learned: 'all',
}

interface Props {
  filters: FilterState
  onChange: (next: FilterState) => void
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

function activeFilterCount(filters: FilterState): number {
  let n = 0
  n += filters.belts.length
  if (filters.moveType !== 'all') n++
  if (filters.playerPosition !== 'all') n++
  if (filters.giMode !== 'all') n++
  n += filters.categories.length
  if (filters.learned !== 'all') n++
  return n
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

const FILTER_GROUPS = ['Belt', 'Perspective', 'Gi / No-Gi', 'Type', 'Category', 'Status'] as const
type FilterGroup = typeof FILTER_GROUPS[number]

export function Filters({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Set<FilterGroup>>(new Set<FilterGroup>(['Status']))
  // Pending = what the user is building inside the drawer, not yet applied
  const [pending, setPending] = useState<FilterState>(filters)

  function toggleGroup(g: FilterGroup) {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(g) ? next.delete(g) : next.add(g)
      return next
    })
  }

  // When the drawer opens, seed pending from the currently applied filters
  useEffect(() => {
    if (open) setPending(filters)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // When filters change externally (e.g. map node top/bottom buttons) and the
  // drawer is closed, keep pending in sync so it doesn't revert on next open
  useEffect(() => {
    if (!open) setPending(filters)
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setPending((p) => ({ ...p, [key]: value }))

  function apply() {
    onChange({ ...pending, search: filters.search })
    setOpen(false)
  }

  function clear() {
    const cleared = { ...DEFAULT_FILTERS, search: filters.search }
    setPending(cleared)
    onChange(cleared)
  }

  const activeCount = activeFilterCount(filters)
  const pendingCount = activeFilterCount(pending)

  return (
    <div className="filters">
      {/* Toggle row — always visible */}
      <div className="filter-header">
        <input
          className="search"
          type="text"
          placeholder="Search techniques…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
        <button
          className={`filter-toggle-btn ${activeCount > 0 ? 'has-active' : ''} ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
        >
          {`Filter${activeCount > 0 ? ` (${activeCount})` : ''}`} {open ? '▲' : '▼'}
        </button>
        {(activeCount > 0 || open) && (
          <button className="filter-clear-btn" onClick={clear}>
            Clear
          </button>
        )}
      </div>

      {/* Active filter summary — visible when collapsed */}
      {!open && activeCount > 0 && (
        <div className="filter-summary">
          {filters.belts.map((b) => (
            <span
              key={b}
              className="filter-summary-chip"
              style={
                b === 'black'
                  ? { borderColor: '#94a3b8', color: '#e2e8f0' }
                  : b === 'white'
                  ? { borderColor: BELT_COLORS[b], color: '#111', background: BELT_COLORS[b] }
                  : { borderColor: BELT_COLORS[b], color: BELT_COLORS[b] }
              }
            >
              {b}
            </span>
          ))}
          {filters.playerPosition !== 'all' && (
            <span className="filter-summary-chip">{filters.playerPosition === 'top' ? '↑ Top' : '↓ Bottom'}</span>
          )}
          {filters.giMode !== 'all' && (
            <span className="filter-summary-chip">{filters.giMode === 'gi' ? '🥋 Gi' : 'No-Gi'}</span>
          )}
          {filters.moveType !== 'all' && (
            <span className="filter-summary-chip">{filters.moveType === 'offensive' ? 'Offense' : 'Defense'}</span>
          )}
          {filters.categories.map((c) => (
            <span key={c} className="filter-summary-chip">{CATEGORY_LABELS[c]}</span>
          ))}
          {filters.learned !== 'all' && (
            <span className="filter-summary-chip">
              {filters.learned === 'unlearned' ? 'Not learned' : filters.learned === 'learned' ? 'Learned' : '★ In Progress'}
            </span>
          )}
        </div>
      )}

      {/* Expanded filter panel — uses pending state */}
      {open && (
        <div className="filter-panel">

          {/* Belt */}
          {(() => {
            const g: FilterGroup = 'Belt'
            const isOpen = openGroups.has(g)
            const count = pending.belts.length
            return (
              <div className="filter-accordion">
                <button className={`filter-accordion-header ${isOpen ? 'is-open' : ''}`} onClick={() => toggleGroup(g)}>
                  <span>Belt</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                  <span className="filter-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="chips chips-nowrap" style={{ padding: '8px 0 4px' }}>
                    <button className={`chip ${pending.belts.length === 0 ? 'active' : ''}`} onClick={() => set('belts', [])}>All</button>
                    {BELT_ORDER.map((b) => {
                      const active = pending.belts.includes(b)
                      return (
                        <button
                          key={b}
                          className={`chip ${active ? 'active' : ''}`}
                          onClick={() => set('belts', toggleItem(pending.belts, b))}
                          style={
                            active
                              ? b === 'black'
                                ? { background: '#000', color: '#fff', borderColor: '#94a3b8' }
                                : { background: BELT_COLORS[b], color: b === 'white' ? '#111' : '#fff', borderColor: BELT_COLORS[b] }
                              : b === 'black'
                                ? { borderColor: BELT_COLORS[b], borderWidth: '2px' }
                                : { borderColor: BELT_COLORS[b] }
                          }
                        >{b}</button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Perspective */}
          {(() => {
            const g: FilterGroup = 'Perspective'
            const isOpen = openGroups.has(g)
            const count = pending.playerPosition !== 'all' ? 1 : 0
            return (
              <div className="filter-accordion">
                <button className={`filter-accordion-header ${isOpen ? 'is-open' : ''}`} onClick={() => toggleGroup(g)}>
                  <span>Perspective</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                  <span className="filter-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="chips" style={{ padding: '8px 0 4px' }}>
                    <button className={`chip ${pending.playerPosition === 'all' ? 'active' : ''}`} onClick={() => set('playerPosition', 'all')}>All</button>
                    <button className={`chip ${pending.playerPosition === 'top' ? 'active' : ''}`} onClick={() => set('playerPosition', 'top')}>↑ Top</button>
                    <button className={`chip ${pending.playerPosition === 'bottom' ? 'active' : ''}`} onClick={() => set('playerPosition', 'bottom')}>↓ Bottom</button>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Gi / No-Gi */}
          {(() => {
            const g: FilterGroup = 'Gi / No-Gi'
            const isOpen = openGroups.has(g)
            const count = pending.giMode !== 'all' ? 1 : 0
            return (
              <div className="filter-accordion">
                <button className={`filter-accordion-header ${isOpen ? 'is-open' : ''}`} onClick={() => toggleGroup(g)}>
                  <span>Gi / No-Gi</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                  <span className="filter-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="chips" style={{ padding: '8px 0 4px' }}>
                    <button className={`chip ${pending.giMode === 'all' ? 'active' : ''}`} onClick={() => set('giMode', 'all')}>All</button>
                    <button className={`chip ${pending.giMode === 'gi' ? 'active' : ''}`} onClick={() => set('giMode', 'gi')}>🥋 Gi only</button>
                    <button className={`chip ${pending.giMode === 'nogi' ? 'active' : ''}`} onClick={() => set('giMode', 'nogi')}>No-Gi only</button>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Type */}
          {(() => {
            const g: FilterGroup = 'Type'
            const isOpen = openGroups.has(g)
            const count = pending.moveType !== 'all' ? 1 : 0
            return (
              <div className="filter-accordion">
                <button className={`filter-accordion-header ${isOpen ? 'is-open' : ''}`} onClick={() => toggleGroup(g)}>
                  <span>Type</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                  <span className="filter-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="chips" style={{ padding: '8px 0 4px' }}>
                    {(['all', 'offensive', 'defensive'] as const).map((t) => (
                      <button key={t} className={`chip ${pending.moveType === t ? 'active' : ''}`} onClick={() => set('moveType', t)}>
                        {t === 'all' ? 'All' : t === 'offensive' ? 'Offense' : 'Defense'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Category */}
          {(() => {
            const g: FilterGroup = 'Category'
            const isOpen = openGroups.has(g)
            const count = pending.categories.length
            return (
              <div className="filter-accordion">
                <button className={`filter-accordion-header ${isOpen ? 'is-open' : ''}`} onClick={() => toggleGroup(g)}>
                  <span>Category</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                  <span className="filter-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="chips" style={{ padding: '8px 0 4px' }}>
                    <button className={`chip ${pending.categories.length === 0 ? 'active' : ''}`} onClick={() => set('categories', [])}>All</button>
                    {CATEGORIES.map((c) => {
                      const active = pending.categories.includes(c)
                      return (
                        <button key={c} className={`chip ${active ? 'active' : ''}`} onClick={() => set('categories', toggleItem(pending.categories, c))}>
                          {CATEGORY_LABELS[c]}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Status — always visible, no collapse */}
          {(() => {
            const count = pending.learned !== 'all' ? 1 : 0
            return (
              <div className="filter-accordion" style={{ borderBottom: 'none' }}>
                <div className="filter-accordion-header is-open" style={{ cursor: 'default' }}>
                  <span>Status</span>
                  {count > 0 && <span className="filter-accordion-badge">{count}</span>}
                </div>
                <div className="chips" style={{ padding: '4px 0 10px' }}>
                  {(['all', 'unlearned', 'learned', 'watchlist'] as const).map((v) => (
                    <button key={v} className={`chip ${pending.learned === v ? 'active' : ''}`} onClick={() => set('learned', v)}>
                      {v === 'all' ? 'All' : v === 'unlearned' ? 'Not learned' : v === 'learned' ? 'Learned' : '★ In Progress'}
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

          <div className="filter-apply-row">
            {pendingCount > 0 && (
              <button className="filter-apply-btn" onClick={apply}>
                Apply ({pendingCount} filter{pendingCount === 1 ? '' : 's'})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
