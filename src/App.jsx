import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, '0')
}

function formatStopwatch(ms) {
  const centiseconds = Math.floor((ms % 1000) / 10)
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor(ms / 3600000)
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

function formatTimer(ms) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor(ms / 3600000)
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

// ─── Doodle Background ────────────────────────────────────────────────────────
function DoodleBg() {
  return (
    <div className="doodle-bg">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Scattered stars */}
        {[
          [60, 80], [200, 40], [350, 120], [500, 60], [650, 90], [820, 50],
          [100, 300], [280, 250], [450, 310], [620, 270], [780, 330],
          [40, 500], [190, 450], [370, 520], [550, 480], [720, 540], [900, 500],
          [130, 700], [310, 660], [480, 720], [660, 680], [840, 740],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
            <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
              fill="none" stroke="#2D2D2D" strokeWidth="1.5" />
          </g>
        ))}
        {/* Circles */}
        {[
          [150, 160, 20], [700, 200, 14], [920, 380, 18], [30, 420, 12], [550, 600, 22],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#2D2D2D"
            strokeWidth="2" opacity="0.12" strokeDasharray="4 3" />
        ))}
        {/* Zigzag lines */}
        <polyline points="0,620 30,600 60,620 90,600 120,620 150,600 180,620"
          fill="none" stroke="#2D2D2D" strokeWidth="1.5" opacity="0.1" />
        <polyline points="800,100 830,80 860,100 890,80 920,100 950,80 980,100"
          fill="none" stroke="#2D2D2D" strokeWidth="1.5" opacity="0.1" />
        {/* Dots scattered */}
        {[
          [420, 30], [760, 430], [220, 560], [640, 160], [80, 240], [960, 270],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#2D2D2D" opacity="0.1" />
        ))}
      </svg>
    </div>
  )
}

// ─── Stopwatch Component ───────────────────────────────────────────────────────
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const elapsedRef = useRef(0)

  const start = useCallback(() => {
    if (running) return
    startTimeRef.current = Date.now() - elapsedRef.current
    intervalRef.current = setInterval(() => {
      const now = Date.now() - startTimeRef.current
      elapsedRef.current = now
      setElapsed(now)
    }, 10)
    setRunning(true)
  }, [running])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setElapsed(0)
    setLaps([])
    elapsedRef.current = 0
  }, [])

  const lap = useCallback(() => {
    if (!running) return
    setLaps(prev => [{ id: prev.length + 1, time: elapsedRef.current }, ...prev])
  }, [running])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const fastestLap = laps.length > 1 ? Math.min(...laps.map(l => l.time)) : null
  const slowestLap = laps.length > 1 ? Math.max(...laps.map(l => l.time)) : null

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Time circle display */}
      <div
        className={`card-2d flex items-center justify-center w-64 h-64 rounded-full relative ${running ? 'pulse-running' : ''}`}
        style={{ background: 'linear-gradient(135deg, #FFB3C6 0%, #C9B8FF 100%)', borderRadius: '50%', width: 240, height: 240 }}
      >
        <div className="flex flex-col items-center">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2D2D2D', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
            Stopwatch
          </span>
          <span className="time-display" style={{ fontSize: elapsed >= 3600000 ? '2rem' : '2.5rem' }}>
            {formatStopwatch(elapsed)}
          </span>
          {running && (
            <span style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, color: '#2D2D2D', opacity: 0.7, letterSpacing: 2 }}>
              ● RUNNING
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        {!running ? (
          <button
            id="sw-start"
            className="btn-2d px-6 py-3 text-sm"
            style={{ background: '#B3F0D9', minWidth: 100 }}
            onClick={start}
          >
            ▶ Start
          </button>
        ) : (
          <button
            id="sw-pause"
            className="btn-2d px-6 py-3 text-sm"
            style={{ background: '#FFF0B3', minWidth: 100 }}
            onClick={pause}
          >
            ⏸ Pause
          </button>
        )}
        <button
          id="sw-lap"
          className="btn-2d px-6 py-3 text-sm"
          style={{ background: '#B3D9FF', minWidth: 100 }}
          onClick={lap}
          disabled={!running}
        >
          🏁 Lap
        </button>
        <button
          id="sw-reset"
          className="btn-2d px-6 py-3 text-sm"
          style={{ background: '#FFD9B3', minWidth: 100 }}
          onClick={reset}
          disabled={elapsed === 0}
        >
          ↩ Reset
        </button>
      </div>

      {/* Lap list */}
      {laps.length > 0 && (
        <div className="w-full max-w-md">
          <div className="card-2d p-4" style={{ background: '#FFFCF5', maxHeight: 260, overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, color: '#2D2D2D' }}>
              🏁 Lap Times
            </h3>
            <div className="flex flex-col gap-2">
              {laps.map((lap) => {
                const isFastest = laps.length > 1 && lap.time === fastestLap
                const isSlowest = laps.length > 1 && lap.time === slowestLap
                return (
                  <div
                    key={lap.id}
                    className="lap-item flex justify-between items-center px-4 py-2 rounded-xl"
                    style={{
                      border: '2.5px solid #2D2D2D',
                      background: isFastest ? '#B3F0D9' : isSlowest ? '#FFB3C6' : '#fff',
                      boxShadow: '2px 2px 0 #2D2D2D',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#2D2D2D' }}>
                      Lap {lap.id}
                      {isFastest && <span style={{ marginLeft: 6, fontSize: '0.7rem' }}>🥇 Fastest</span>}
                      {isSlowest && <span style={{ marginLeft: 6, fontSize: '0.7rem' }}>🐢 Slowest</span>}
                    </span>
                    <span className="time-display" style={{ fontSize: '1rem' }}>
                      {formatStopwatch(lap.time)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Timer Component ───────────────────────────────────────────────────────────
const PRESETS = [
  { label: '1 min', ms: 60000 },
  { label: '5 min', ms: 300000 },
  { label: '10 min', ms: 600000 },
  { label: '25 min', ms: 1500000 },
]

function Timer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [totalMs, setTotalMs] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)
  const endTimeRef = useRef(null)

  const totalMsInput = (hours * 3600 + minutes * 60 + seconds) * 1000

  const startTimer = useCallback(() => {
    if (running) return
    const ms = remaining > 0 ? remaining : totalMsInput
    if (ms <= 0) return
    setTotalMs(remaining > 0 ? totalMs : totalMsInput)
    setDone(false)
    endTimeRef.current = Date.now() + ms
    setRunning(true)
    intervalRef.current = setInterval(() => {
      const left = endTimeRef.current - Date.now()
      if (left <= 0) {
        clearInterval(intervalRef.current)
        setRemaining(0)
        setRunning(false)
        setDone(true)
      } else {
        setRemaining(left)
      }
    }, 100)
  }, [running, remaining, totalMsInput, totalMs])

  const pauseTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setDone(false)
    setRemaining(0)
    setTotalMs(0)
  }, [])

  const applyPreset = useCallback((ms) => {
    resetTimer()
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    setHours(h)
    setMinutes(m)
    setSeconds(s)
  }, [resetTimer])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const displayMs = remaining > 0 ? remaining : (running ? remaining : totalMsInput)
  const progress = totalMs > 0 ? Math.max(0, remaining / totalMs) : 1
  const circumference = 2 * Math.PI * 100
  const strokeDash = circumference * (1 - progress)

  const clamp = (val, min, max) => Math.max(min, Math.min(max, Number(val) || 0))

  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG Progress Circle */}
      <div className={`relative flex items-center justify-center ${done ? 'timer-done' : ''}`}
        style={{ width: 240, height: 240 }}>
        <svg width="240" height="240" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Track */}
          <circle cx="120" cy="120" r="100"
            fill="none" stroke="#E8D5FF" strokeWidth="12"
            style={{ filter: 'none' }} />
          {/* Progress */}
          <circle cx="120" cy="120" r="100"
            fill="none"
            stroke={done ? '#FFB3C6' : '#C9B8FF'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            className="progress-ring__circle" />
        </svg>
        <div
          className="card-2d flex items-center justify-center"
          style={{
            background: done
              ? 'linear-gradient(135deg, #FFB3C6 0%, #FFD9B3 100%)'
              : 'linear-gradient(135deg, #E8D5FF 0%, #B3D9FF 100%)',
            borderRadius: '50%',
            width: 190,
            height: 190,
          }}
        >
          <div className="flex flex-col items-center">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D2D2D', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
              Timer
            </span>
            <span className="time-display" style={{ fontSize: displayMs >= 3600000 ? '2rem' : '2.4rem' }}>
              {formatTimer(displayMs)}
            </span>
            {done && (
              <span style={{ marginTop: 6, fontSize: '0.75rem', fontWeight: 800, color: '#2D2D2D' }}>
                🎉 Done!
              </span>
            )}
            {running && !done && (
              <span style={{ marginTop: 6, fontSize: '0.65rem', fontWeight: 700, color: '#2D2D2D', opacity: 0.7, letterSpacing: 2 }}>
                ● RUNNING
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Presets */}
      {!running && remaining === 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {PRESETS.map(p => (
            <button
              key={p.label}
              id={`preset-${p.label}`}
              className="btn-2d px-4 py-2 text-xs"
              style={{ background: '#FFF0B3' }}
              onClick={() => applyPreset(p.ms)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Custom Time Input — only show when not running and no remaining time */}
      {!running && remaining === 0 && !done && (
        <div className="card-2d p-5" style={{ background: '#FFFCF5', width: '100%', maxWidth: 360 }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, color: '#2D2D2D', textAlign: 'center' }}>
            ⏱ Set Custom Time
          </h3>
          <div className="flex gap-3 items-end justify-center">
            <div className="flex flex-col items-center gap-1">
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D2D2D', letterSpacing: 1 }}>HH</label>
              <input
                id="timer-hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={e => setHours(clamp(e.target.value, 0, 23))}
                className="input-2d w-20 py-3 text-xl"
                style={{ fontSize: '1.5rem' }}
              />
            </div>
            <span className="time-display" style={{ fontSize: '1.8rem', marginBottom: 10 }}>:</span>
            <div className="flex flex-col items-center gap-1">
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D2D2D', letterSpacing: 1 }}>MM</label>
              <input
                id="timer-minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={e => setMinutes(clamp(e.target.value, 0, 59))}
                className="input-2d w-20 py-3 text-xl"
                style={{ fontSize: '1.5rem' }}
              />
            </div>
            <span className="time-display" style={{ fontSize: '1.8rem', marginBottom: 10 }}>:</span>
            <div className="flex flex-col items-center gap-1">
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2D2D2D', letterSpacing: 1 }}>SS</label>
              <input
                id="timer-seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={e => setSeconds(clamp(e.target.value, 0, 59))}
                className="input-2d w-20 py-3 text-xl"
                style={{ fontSize: '1.5rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        {!running ? (
          <button
            id="timer-start"
            className="btn-2d px-6 py-3 text-sm"
            style={{ background: '#B3F0D9', minWidth: 100 }}
            onClick={startTimer}
            disabled={displayMs <= 0 && !done}
          >
            ▶ Start
          </button>
        ) : (
          <button
            id="timer-pause"
            className="btn-2d px-6 py-3 text-sm"
            style={{ background: '#FFF0B3', minWidth: 100 }}
            onClick={pauseTimer}
          >
            ⏸ Pause
          </button>
        )}
        <button
          id="timer-reset"
          className="btn-2d px-6 py-3 text-sm"
          style={{ background: '#FFD9B3', minWidth: 100 }}
          onClick={resetTimer}
          disabled={remaining === 0 && !running && !done}
        >
          ↩ Reset
        </button>
      </div>

      {done && (
        <div
          className="card-2d px-6 py-3 text-center"
          style={{ background: '#FFB3C6', maxWidth: 300, width: '100%' }}
        >
          <p style={{ fontWeight: 800, color: '#2D2D2D', fontSize: '1rem' }}>
            🎉 Time's up! Great job!
          </p>
        </div>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('stopwatch')

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <DoodleBg />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 60px' }}>
        {/* Header */}
        <header className="mb-8 text-center">
          <div
            className="card-2d inline-block px-8 py-4 mb-2"
            style={{ background: '#C9B8FF' }}
          >
            <h1
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: '2.2rem',
                color: '#2D2D2D',
                letterSpacing: 1,
              }}
            >
              ⏱ Tick Tock
            </h1>
          </div>
          <p style={{ fontWeight: 600, color: '#888', fontSize: '0.9rem', marginTop: 6 }}>
            Your pastel-powered time companion
          </p>
        </header>

        {/* Tab switcher */}
        <div
          className="card-2d flex mb-8 p-1"
          style={{ background: '#fff', gap: 6, borderRadius: 18 }}
        >
          <button
            id="tab-stopwatch"
            className={`tab-btn ${tab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setTab('stopwatch')}
          >
            ⏱ Stopwatch
          </button>
          <button
            id="tab-timer"
            className={`tab-btn ${tab === 'timer' ? 'active' : ''}`}
            onClick={() => setTab('timer')}
          >
            ⏳ Timer
          </button>
        </div>

        {/* Main card */}
        <div
          className="card-2d w-full p-8"
          style={{
            maxWidth: 480,
            background: '#FFFDF8',
            borderRadius: 28,
          }}
        >
          {tab === 'stopwatch' ? <Stopwatch /> : <Timer />}
        </div>

        {/* Footer */}
        <p style={{ marginTop: 32, fontWeight: 600, color: '#bbb', fontSize: '0.8rem' }}>
          Made with 🎨 pastel love
        </p>
      </div>
    </div>
  )
}
