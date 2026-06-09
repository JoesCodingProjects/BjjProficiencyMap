import { useMemo, useEffect, useCallback } from 'react'
import ReactFlow, {
  Background,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { positions, transitions } from '../data/positions'

const NODE_COLOR = { bg: '#1e293b', border: '#64748b' }

// Positions where top/bottom doesn't make sense
const NO_PERSPECTIVE = new Set(['standing'])

interface Props {
  selectedPosition: string | null
  perspective: 'all' | 'top' | 'bottom'
  onSelect: (id: string) => void
  onPerspective: (p: 'top' | 'bottom' | 'all') => void
  onDeselect: () => void
  counts: Record<string, number>
  positionBelts: Record<string, string>
}

// Node dimensions
const NODE_W = 178
const NODE_H = 100

function MapInner({ selectedPosition, perspective, onSelect, onPerspective, onDeselect, counts, positionBelts }: Props) {
  const { setViewport } = useReactFlow()

  const fitToContainer = useCallback(() => {
    const el = document.querySelector('.map-react-flow') as HTMLElement
    if (!el) return
    const cw = el.clientWidth
    const ch = el.clientHeight

    // Bounds of all nodes
    const xs = positions.map(p => p.x)
    const ys = positions.map(p => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs) + NODE_W
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys) + NODE_H

    const contentW = maxX - minX
    const contentH = maxY - minY

    const padding = 8 // small equal gap on all sides
    const zoom = Math.min((cw - padding * 2) / contentW, (ch - padding * 2) / contentH)

    const x = (cw - contentW * zoom) / 2 - minX * zoom
    const y = (ch - contentH * zoom) / 2 - minY * zoom

    setViewport({ x, y, zoom }, { duration: 0 })
  }, [setViewport])

  useEffect(() => {
    const t = setTimeout(fitToContainer, 80)
    const el = document.querySelector('.map-react-flow') as HTMLElement
    if (!el) return () => clearTimeout(t)
    const ro = new ResizeObserver(fitToContainer)
    ro.observe(el)
    return () => { clearTimeout(t); ro.disconnect() }
  }, [fitToContainer])

  const nodes: Node[] = useMemo(() => {
    return positions.map((p) => {
      const isSelected = p.id === selectedPosition
      const rawBelt = positionBelts[p.id]
      // Unstarted nodes treat as white belt visually
      const belt = rawBelt || '#d4d4d8'
      const isBlackBelt = belt === '#18181b'
      const isWhiteBelt = belt === '#d4d4d8'
      const selectionColor = isBlackBelt ? '#585858' : isWhiteBelt ? '#d4d4d8' : belt
      const borderColor = isSelected ? selectionColor : belt
      const count = counts[p.id] ?? 0
      const showPerspective = isSelected && !NO_PERSPECTIVE.has(p.id)
      const topActive = perspective === 'top'
      const botActive = perspective === 'bottom'

      return {
        id: p.id,
        position: { x: p.x, y: p.y },
        data: {
          label: (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 21.5, letterSpacing: '0.01em' }}>{p.name}</div>
              <div style={{ fontSize: 15.9, opacity: 0.7, marginTop: 2 }}>
                {count} {count === 1 ? 'Technique' : 'Techniques'}
              </div>
              {showPerspective && (
                <div style={{ display: 'flex', gap: 5, marginTop: 9, justifyContent: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: 800,
                      padding: '5px 0',
                      borderRadius: 6,
                      border: `2px solid ${topActive ? (isBlackBelt ? '#fff' : selectionColor) : '#64748b'}`,
                      background: topActive ? (isBlackBelt ? '#111' : `${selectionColor}33`) : 'rgba(255,255,255,0.12)',
                      color: topActive ? (isBlackBelt ? '#fff' : selectionColor) : '#cbd5e1',
                      cursor: 'pointer',
                      lineHeight: 1.2,
                    }}
                    onClick={(e) => { e.stopPropagation(); onPerspective(topActive ? 'all' : 'top') }}
                  >
                    Top
                  </button>
                  <button
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: 800,
                      padding: '5px 0',
                      borderRadius: 6,
                      border: `2px solid ${botActive ? (isBlackBelt ? '#fff' : selectionColor) : '#64748b'}`,
                      background: botActive ? (isBlackBelt ? '#111' : `${selectionColor}33`) : 'rgba(255,255,255,0.12)',
                      color: botActive ? (isBlackBelt ? '#fff' : selectionColor) : '#cbd5e1',
                      cursor: 'pointer',
                      lineHeight: 1.2,
                    }}
                    onClick={(e) => { e.stopPropagation(); onPerspective(botActive ? 'all' : 'bottom') }}
                  >
                    Bottom
                  </button>
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: isSelected ? '#2d3f55' : NODE_COLOR.bg,
          opacity: selectedPosition && !isSelected ? 0.45 : 1,
          color: '#f8fafc',
          border: isBlackBelt
            ? '4px solid #111'
            : isWhiteBelt
            ? '2px solid #d4d4d8'
            : `2px solid ${borderColor}`,
          borderRadius: 12,
          padding: showPerspective ? '8px 8px' : '10px 14px',
          width: 178,
          boxShadow: isSelected
            ? isBlackBelt
              ? `0 0 0 2px #0f172a, 0 0 0 3px ${selectionColor}, 0 0 18px ${selectionColor}88, inset 0 0 12px rgba(255,255,255,0.04)`
              : `0 0 0 3px ${selectionColor}, 0 0 22px ${selectionColor}66, inset 0 0 12px ${selectionColor}18`
            : isBlackBelt
            ? '0 0 0 1px #4a5568, 0 2px 6px rgba(0,0,0,0.6)'
            : isWhiteBelt
            ? '0 0 0 1px #a1a1aad0, 0 2px 6px rgba(0,0,0,0.4)'
            : '0 2px 6px rgba(0,0,0,0.4)',
          cursor: 'pointer',
        },
      }
    })
  }, [selectedPosition, perspective, counts, positionBelts, onPerspective])

  const edges: Edge[] = useMemo(() => {
    if (!selectedPosition) return []
    const rawColor = positionBelts[selectedPosition]
    // Black belt: dark arrow with lighter marker; white/unstarted: silver
    const isBlackEdge = rawColor === '#18181b'
    const isWhiteEdge = !rawColor || rawColor === '#d4d4d8'
    const edgeColor = isBlackEdge ? '#6d6d6d' : isWhiteEdge ? '#d4d4d8' : rawColor
    const edgeMarkerColor = isBlackEdge ? '#46464a' : isWhiteEdge ? '#e2e8f0' : rawColor
    return transitions
      .filter((t) => t.from === selectedPosition || t.to === selectedPosition)
      .map((t, i) => ({
        id: `e-${i}`,
        source: t.from,
        target: t.to,
        className: isBlackEdge ? 'edge-black-belt' : undefined,
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeMarkerColor },
        animated: true,
      }))
  }, [selectedPosition, positionBelts],
  )

  // Node bounds: x 0→505, y 0→315. We let fitView handle it but clamp padding to near-zero.
  // To eliminate ReactFlow's internal dead space, we also set minZoom/maxZoom tightly.
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={(_, node) => onSelect(node.id)}
      onPaneClick={onDeselect}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={true}
      zoomOnDoubleClick={false}
      preventScrolling={false}
    >
      <Background color="#2b3f57ea" gap={20} />
    </ReactFlow>
  )
}

export function PositionMap(props: Props) {
  return (
    <ReactFlowProvider>
      <MapInner {...props} />
    </ReactFlowProvider>
  )
}
