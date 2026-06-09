import { useMemo, useState } from 'react'
import { DEFAULT_FILTERS, Filters, type FilterState } from './components/Filters'
import { MoveList } from './components/MoveList'
import { BeltPromotion } from './components/BeltPromotion'
import { OnboardingModal } from './components/OnboardingModal'
import { InstallPrompt, isStandalone } from './components/InstallPrompt'
import { BeltIcon } from './components/BeltIcon'
import { BeltLabel } from './lib/beltLabel'
import { beltBarStyleSingle } from './lib/beltBarStyle'
import { PositionMap } from './components/PositionMap'
import { ProficiencyPanel } from './components/ProficiencyPanel'
import { TodaysDrills } from './components/TodaysDrills'
import { positions } from './data/positions'
import type { BeltLevel } from './data/positions'
import { techniques } from './data/techniques'
import { BELT_COLORS, BELT_ORDER } from './data/types'
import { useLearned } from './hooks/useLearned'
import { useWatchlist } from './hooks/useWatchlist'
import { computeProficiency } from './lib/proficiency'
import './App.css'

const REAL_BELT_KEY = 'bjj-map.real-belt'

function loadRealBelt(): BeltLevel | null {
  try {
    const v = localStorage.getItem(REAL_BELT_KEY)
    return (BELT_ORDER as string[]).includes(v ?? '') ? (v as BeltLevel) : null
  } catch {
    return null
  }
}

function saveRealBelt(belt: BeltLevel) {
  try { localStorage.setItem(REAL_BELT_KEY, belt) } catch { /* ignore */ }
}

type Tab = 'progress' | 'map'

export default function App() {
  const { learned, toggle, markAll, unmarkAll, reset } = useLearned()
  const { watchlist, toggleWatchlist, removeFromWatchlist, addToWatchlist, notes, setNote } = useWatchlist()
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(() => !isStandalone())
  const [activeTab, setActiveTab] = useState<Tab>('map')
  const [mapExpanded, setMapExpanded] = useState(true)
  const [showMapHint, setShowMapHint] = useState(() => {
    try { return !localStorage.getItem('bjj-map.map-hint-seen') } catch { return false }
  })

  function dismissMapHint() {
    try { localStorage.setItem('bjj-map.map-hint-seen', '1') } catch { /* ignore */ }
    setShowMapHint(false)
  }

  // Tracks techniques that were in-progress when marked learned, so we can restore them if unlearned.
  const [wasInProgress] = useState<Set<string>>(() => new Set())

  function handleToggleLearned(id: string) {
    const isLearned = learned.has(id)
    const isInProgress = watchlist.has(id)
    if (!isLearned) {
      // Marking as learned
      if (isInProgress) {
        wasInProgress.add(id)
        removeFromWatchlist(id)
      }
    } else {
      // Unmarking learned — restore in-progress if it was before
      if (wasInProgress.has(id)) {
        wasInProgress.delete(id)
        addToWatchlist(id)
      }
    }
    toggle(id)
  }
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const [realBelt, setRealBelt] = useState<BeltLevel | null>(loadRealBelt)
  const [changingBelt, setChangingBelt] = useState(false)
  const [promotionBelt, setPromotionBelt] = useState<BeltLevel | null>(null)
  const showOnboarding = realBelt === null || changingBelt

  function handleOnboardingComplete(belt: BeltLevel, startPosition: string | null) {
    const isPromotion = changingBelt && realBelt !== null && BELT_ORDER.indexOf(belt) > BELT_ORDER.indexOf(realBelt)
    saveRealBelt(belt)
    setRealBelt(belt)
    setChangingBelt(false)
    if (startPosition) {
      setSelectedPosition(startPosition)
      setActiveTab('map')
    }
    if (isPromotion) setPromotionBelt(belt)
  }

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return techniques.filter((t) => {
      if (filters.belts.length > 0 && !filters.belts.includes(t.beltLevel)) return false
      if (filters.moveType !== 'all' && t.moveType !== filters.moveType) return false
      if (filters.playerPosition !== 'all' && t.playerPosition !== 'both' && t.playerPosition !== filters.playerPosition) return false
      if (filters.giMode === 'gi' && t.giType !== 'gi') return false
      if (filters.giMode === 'nogi' && t.giType === 'gi') return false
      if (filters.categories.length > 0 && !filters.categories.includes(t.category)) return false
      if (filters.learned === 'learned' && !learned.has(t.id)) return false
      if (filters.learned === 'unlearned' && learned.has(t.id)) return false
      if (filters.learned === 'watchlist' && !watchlist.has(t.id)) return false
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q))
        return false
      return true
    })
  }, [filters, learned, watchlist])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const t of filtered) for (const p of t.positions) c[p] = (c[p] ?? 0) + 1
    return c
  }, [filtered])

  const visible = useMemo(
    () => (selectedPosition ? filtered.filter((t) => t.positions.includes(selectedPosition)) : filtered),
    [filtered, selectedPosition],
  )

  const selectedName = selectedPosition
    ? positions.find((p) => p.id === selectedPosition)?.name ?? null
    : null

  const inProgressTechniques = useMemo(
    () => techniques.filter((t) => watchlist.has(t.id)),
    [watchlist],
  )

  const learnedCount = learned.size
  const totalCount = techniques.length

  const proficiency = useMemo(() => computeProficiency(learned), [learned])

  const positionBelts = useMemo(() => {
    const m: Record<string, string> = {}
    for (const p of proficiency.positions) {
      m[p.positionId] = p.started ? BELT_COLORS[p.belt] : ''
    }
    return m
  }, [proficiency])

  // Insight strip data
  const startedPositions = proficiency.positions.filter((p) => p.started)
  const strongest = startedPositions.length > 0 && !proficiency.isBlack
    ? [...startedPositions].sort((a, b) => b.ratio - a.ratio)[0]
    : null
  const weakest = startedPositions.length > 1 && !proficiency.isBlack
    ? [...startedPositions].sort((a, b) => a.ratio - b.ratio)[0]
    : null

  function beltIndex(b: BeltLevel) { return BELT_ORDER.indexOf(b) }
  const strongestAbove = strongest && realBelt && beltIndex(strongest.belt) > beltIndex(realBelt)

  function handleSelectPosition(id: string) {
    setSelectedPosition(id)
    setActiveTab('map')
  }

  return (
    <div className="app">
      {showInstallPrompt && (
        <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
      )}
      {!showInstallPrompt && showOnboarding && (
        <OnboardingModal
          onComplete={handleOnboardingComplete}
          onDismiss={changingBelt ? () => setChangingBelt(false) : undefined}
          initialBelt={changingBelt ? realBelt ?? undefined : undefined}
        />
      )}
      {promotionBelt && (
        <BeltPromotion belt={promotionBelt} onClose={() => setPromotionBelt(null)} />
      )}

      <header className="header">
        <div className="header-left">
          <div className="brand">
            <img src="/logo.png" alt="" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-title">BJJ PROFICIENCY TRACKER</span>
              <span className="brand-accent" />
            </div>
          </div>
        </div>

        <div className="header-belt">
          {realBelt && (
            <div className="header-belt-real">
              <span className="header-belt-label">Your belt</span>
              <button
                className="header-belt-box"
                style={{
                  borderColor: realBelt === 'black' ? '#64748b' : BELT_COLORS[realBelt],
                  background: realBelt === 'black' ? 'rgba(100,116,139,0.1)' : `${BELT_COLORS[realBelt]}18`,
                }}
                onClick={() => setChangingBelt(true)}
                title="Change your belt"
              >
                <BeltIcon belt={realBelt} size={8} />
                <span className="header-belt-name" style={{ color: realBelt === 'black' ? '#94a3b8' : realBelt === 'brown' ? '#c2763a' : BELT_COLORS[realBelt] }}>
                  {realBelt}
                </span>
                <span className="header-belt-edit" aria-hidden="true">✎</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Techniques
        </button>
        <div className="tab-divider" />
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          My Progress
        </button>
      </div>

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="tab-content progress-tab">

          {/* 1 — In Progress (daily call-to-action) */}
          <TodaysDrills
            techniques={inProgressTechniques}
            learned={learned}
            watchlist={watchlist}
            notes={notes}
            onToggleLearned={handleToggleLearned}
            onToggleWatchlist={toggleWatchlist}
            onSetNote={setNote}
            onSeeAll={() => {
              setFilters((f) => ({ ...f, learned: 'watchlist' }))
              setSelectedPosition(null)
              setActiveTab('map')
            }}
          />

          {/* 2 — Strongest / Weakest */}
          {startedPositions.length > 0 && (
            <div className="insight-strip">
              {strongest && (
                <button
                  className={`insight-card insight-best ${strongestAbove ? 'insight-above' : ''}`}
                  onClick={() => handleSelectPosition(strongest.positionId)}
                >
                  <span className="insight-card-label">↑ Strongest area</span>
                  <span className="insight-card-value">
                    {strongest.positionName}
                    <BeltIcon belt={strongest.belt} size={7} />
                  </span>
                </button>
              )}
              {weakest && (
                <button
                  className="insight-card insight-gap"
                  onClick={() => handleSelectPosition(weakest.positionId)}
                >
                  <span className="insight-card-label">↓ Weakest area</span>
                  <span className="insight-card-value">
                    {weakest.positionName}
                    <BeltIcon belt={weakest.belt} size={7} />
                  </span>
                </button>
              )}
            </div>
          )}

          {/* 3 — Estimates + technique count */}
          <div className="progress-tab-body">
            <ProficiencyPanel
              proficiency={proficiency}
              realBelt={realBelt}
              learnedCount={learnedCount}
              totalCount={totalCount}
              onSelectPosition={handleSelectPosition}
              onSelectCategory={(cat) => {
                setFilters((f) => ({ ...f, categories: [cat] }))
                setSelectedPosition(null)
                setActiveTab('map')
              }}
              onReset={() => setShowResetConfirm(true)}
            />
          </div>
        </div>
      )}

      {/* Map & Techniques tab */}
      {activeTab === 'map' && (
        <div className="tab-content map-tab">
          {/* Progress bar strip */}
          <div className="map-progress-strip">
            <div className="map-progress-info">
              <span className="map-progress-label">Overall estimate</span>
              <span className="map-progress-belt" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {learnedCount === 0
                  ? <span style={{ color: '#475569' }}>Mark techniques to begin</span>
                  : <>
                      <BeltLabel belt={proficiency.belt} beltPct={proficiency.beltPct} isBlack={proficiency.isBlack} fontSize={12} />
                      {!proficiency.isBlack && proficiency.beltPct != null && (
                        <span style={{ color: '#64748b', fontWeight: 400 }}>· {(proficiency.beltPct * 100).toFixed(1)}%</span>
                      )}
                    </>}
              </span>
            </div>
            <div className="map-progress-bar-wrap">
              <div
                className="map-progress-fill"
                style={learnedCount === 0 ? { width: '0%' } : beltBarStyleSingle(proficiency.belt, proficiency.isBlack ? 1 : (proficiency.beltPct ?? 0))}
              />
            </div>
            <span className="map-progress-count">{learnedCount}/{totalCount} techniques learned</span>
          </div>

          <div className="map-techniques-split">
            {mapExpanded && <div className="map-section">
              {showMapHint && (
                <div className="map-hint-overlay" onClick={dismissMapHint}>
                  <div className="map-hint-bubble">
                    <span className="map-hint-icon">👆</span>
                    <span>Tap a position to explore its techniques</span>
                  </div>
                </div>
              )}
              <div className="map-react-flow">
                <PositionMap
                  key={activeTab}
                  selectedPosition={selectedPosition}
                  perspective={filters.playerPosition === 'top' ? 'top' : filters.playerPosition === 'bottom' ? 'bottom' : 'all'}
                  onSelect={(id) => {
                    dismissMapHint()
                    setSelectedPosition((cur) => {
                      const next = cur === id ? null : id
                      if (next !== cur) setFilters((f) => ({ ...f, playerPosition: 'all' }))
                      return next
                    })
                  }}
                  onPerspective={(p) => setFilters((f) => ({ ...f, playerPosition: p }))}
                  onDeselect={() => { setSelectedPosition(null); setFilters((f) => ({ ...f, playerPosition: 'all' })) }}
                  counts={counts}
                  positionBelts={positionBelts}
                />
              </div>
            </div>}

            <aside className={`list-section ${mapExpanded ? '' : 'list-section-full'}`}>
              <Filters filters={filters} onChange={setFilters} />
              <MoveList
                techniques={visible}
                learned={learned}
                watchlist={watchlist}
                notes={notes}
                onToggleLearned={handleToggleLearned}
                onToggleWatchlist={toggleWatchlist}
                onSetNote={setNote}
                onMarkAll={markAll}
                onUnmarkAll={unmarkAll}
                selectedPositionName={selectedName}
                mapExpanded={mapExpanded}
                onShowMap={() => setMapExpanded(true)}
                onHideMap={() => setMapExpanded(false)}
              />
            </aside>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Reset all progress?</h2>
            <p className="modal-text">
              This will un-mark all <strong>{learnedCount}</strong> learned technique
              {learnedCount === 1 ? '' : 's'} and reset every estimated belt level back to white. This
              can't be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="modal-btn danger" onClick={() => { reset(); setShowResetConfirm(false) }}>
                Reset everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
