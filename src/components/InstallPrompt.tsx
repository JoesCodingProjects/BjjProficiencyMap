import { useState } from 'react'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

function getOS(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function getBrowser(): 'safari' | 'chrome' | 'other' {
  const ua = navigator.userAgent
  if (/crios/i.test(ua)) return 'chrome' // Chrome on iOS
  if (/fxios|firefox/i.test(ua)) return 'other'
  if (/chrome|chromium/i.test(ua) && !/edg/i.test(ua)) return 'chrome'
  if (/safari/i.test(ua) && !/chrome|chromium/i.test(ua)) return 'safari'
  return 'other'
}

interface Props {
  onDismiss: () => void
}

export function InstallPrompt({ onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const os = getOS()
  const browser = getBrowser()
  const iosOnChrome = os === 'ios' && browser === 'chrome'

  function dismiss() {
    setDismissed(true)
    setTimeout(onDismiss, 300)
  }

  return (
    <div className={`install-prompt ${dismissed ? 'install-prompt-out' : ''}`}>
      <div className="install-prompt-inner">
        <div className="install-prompt-brand">
          <img src="/logo.png" alt="" className="install-prompt-logo" />
          <span className="install-prompt-title">BJJ PROFICIENCY TRACKER</span>
        </div>

        <p className="install-prompt-tagline">Instructions to install app (works offline).</p>

        <div className="install-prompt-steps">

          {/* iOS on Chrome — must switch to Safari first */}
          {iosOnChrome && (
            <>
              <div className="install-prompt-browser-note">
                Detected: <strong>iPhone / Chrome</strong> — ⚠️ Chrome on iPhone cannot install apps. You must use <strong>Safari</strong>.
              </div>
              <div className="install-step">
                <span className="install-step-num">1</span>
                <span>Copy this URL and open it in <strong>Safari</strong></span>
              </div>
              <div className="install-step">
                <span className="install-step-num">2</span>
                <span>Tap the <strong>Share</strong> button ⎋ at the bottom of Safari</span>
              </div>
              <div className="install-step">
                <span className="install-step-num">3</span>
                <span>Tap <strong>Add to Home Screen</strong>, then <strong>Add</strong></span>
              </div>
            </>
          )}

          {/* iOS on Safari */}
          {os === 'ios' && !iosOnChrome && (
            <>
              <div className="install-prompt-browser-note">
                Detected: <strong>iPhone / Safari</strong>
              </div>
              <div className="install-step">
                <span className="install-step-num">1</span>
                <span>Tap the <strong>Share</strong> button ⎋ at the bottom of your screen</span>
              </div>
              <div className="install-step">
                <span className="install-step-num">2</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
              </div>
              <div className="install-step">
                <span className="install-step-num">3</span>
                <span>Tap <strong>Add</strong> — then open the app from your home screen</span>
              </div>
            </>
          )}

          {/* Android (Chrome) */}
          {os === 'android' && (
            <>
              <div className="install-prompt-browser-note">
                Detected: <strong>Android / {browser === 'chrome' ? 'Chrome' : browser === 'safari' ? 'Samsung Internet' : 'browser'}</strong>
                {browser !== 'chrome' && ' — for best results, open in Chrome'}
              </div>
              <div className="install-step">
                <span className="install-step-num">1</span>
                <span>Tap the <strong>⋮ menu</strong> in the top right of Chrome</span>
              </div>
              <div className="install-step">
                <span className="install-step-num">2</span>
                <span>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong></span>
              </div>
              <div className="install-step">
                <span className="install-step-num">3</span>
                <span>Tap <strong>Install</strong> — then open from your home screen</span>
              </div>
            </>
          )}

          {/* Desktop or unknown */}
          {os === 'other' && (
            <>
              <div className="install-prompt-browser-note">
                Open this link on your phone to install.
              </div>
              <div className="install-step">
                <span className="install-step-num">1</span>
                <span><strong>iPhone/iPad:</strong> open in <strong>Safari</strong>, tap Share ⎋ → Add to Home Screen</span>
              </div>
              <div className="install-step">
                <span className="install-step-num">2</span>
                <span><strong>Android:</strong> open in <strong>Chrome</strong>, tap ⋮ menu → Install app</span>
              </div>
            </>
          )}

        </div>

        <div className="install-prompt-actions">
          <button className="install-prompt-continue" onClick={dismiss}>
            Continue in browser instead
          </button>
        </div>
      </div>
    </div>
  )
}

export { isStandalone }
