import { useEffect } from 'react'

interface ToastMessage {
  id: number
  text: string
  onUndo?: () => void
}

interface Props {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

export type { ToastMessage }

export function Toast({ toasts, onDismiss }: Props) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className="toast">
      <span className="toast-text">{toast.text}</span>
      {toast.onUndo && (
        <button
          className="toast-undo"
          onClick={() => {
            toast.onUndo!()
            onDismiss(toast.id)
          }}
        >
          Undo
        </button>
      )}
      <button className="toast-close" onClick={() => onDismiss(toast.id)}>✕</button>
    </div>
  )
}
