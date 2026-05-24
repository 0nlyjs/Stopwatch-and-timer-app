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
  const stars = [
    [30,30],[130,15],[230,45],[340,20],[450,55],[560,10],[670,40],[780,25],[890,50],[970,15],
    [60,120],[160,100],[270,140],[380,90],[490,130],[600,80],[710,120],[820,95],[930,135],[990,75],
    [20,210],[120,195],[240,230],[350,200],[460,245],[570,185],[680,215],[790,200],[900,240],[975,190],
    [50,310],[150,290],[260,325],[370,305],[480,340],[590,280],[700,315],[810,295],[920,335],[960,300],
    [80,410],[180,390],[290,425],[400,400],[510,445],[620,375],[730,415],[840,395],[950,430],[985,380],
    [10,510],[110,490],[220,530],[330,505],[440,545],[550,475],[660,510],[770,490],[880,535],[965,495],
    [40,610],[140,590],[250,625],[360,600],[470,645],[580,575],[690,615],[800,595],[910,630],[980,585],
    [70,710],[170,690],[280,730],[390,700],[500,740],[610,670],[720,715],[830,695],[940,725],[990,680],
    [25,810],[125,795],[235,830],[345,800],[455,845],[565,775],[675,810],[785,790],[895,835],[970,785],
    [55,920],[155,900],[265,940],[375,905],[485,945],[595,875],[705,915],[815,895],[925,935],[975,885],
    [85,975],[200,965],[320,985],[430,960],[545,980],[650,970],[760,990],[870,965],[955,985],[1000,975],
  ]

  const circles = [
    [80,80,18],[300,50,14],[540,70,20],[750,40,15],[940,90,17],
    [150,200,12],[420,180,22],[680,160,13],[900,195,19],[50,250,16],
    [260,350,20],[500,320,14],[740,370,18],[970,330,12],[120,400,22],
    [380,470,16],[620,450,20],[860,480,14],[40,520,18],[240,560,12],
    [480,530,22],[720,510,16],[950,545,20],[170,630,14],[410,600,18],
    [650,650,12],[890,610,22],[70,700,16],[310,720,20],[560,690,14],
    [800,740,18],[30,790,12],[280,810,22],[530,780,16],[770,820,20],
    [200,880,14],[450,860,18],[700,900,12],[920,870,22],[100,950,16],
    [350,960,20],[600,940,14],[840,970,18],[500,980,12],[990,960,16],
  ]

  const dots = [
    [200,80],[490,55],[760,100],[990,60],[110,175],[370,155],[630,190],[870,170],
    [30,290],[440,260],[700,310],[950,270],[180,390],[520,360],[780,405],[80,460],
    [330,490],[590,440],[840,480],[140,570],[410,545],[670,590],[910,550],[260,670],
    [500,640],[750,680],[30,730],[350,760],[600,720],[850,765],[120,840],[460,820],
    [710,850],[960,830],[220,910],[540,885],[790,930],[70,970],[400,960],[650,990],
  ]

  const crosses = [
    [180,140],[420,100],[660,160],[880,120],[60,340],[310,300],
    [570,360],[820,320],[140,530],[390,500],[640,560],[900,520],
    [250,740],[510,700],[760,760],[50,870],[290,840],[560,900],
    [810,860],[970,420],[730,240],[100,640],[440,780],[680,60],
  ]

  const diamonds = [
    [320,130],[580,90],[840,150],[200,430],[460,395],
    [720,435],[950,390],[350,630],[610,595],[870,650],
    [130,760],[480,730],[740,780],[270,960],[530,925],
  ]

  return (
    <div className="doodle-bg">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 1000"
      >
        {/* Stars — 11 rows × 10 cols covering full canvas */}
        {stars.map(([x, y], i) => (
          <g key={`star-${i}`} transform={`translate(${x},${y})`} opacity="0.16">
            <polygon
              points="0,-7 2,-2 7,-2 3,2 4,7 0,4 -4,7 -3,2 -7,-2 -2,-2"
              fill="none" stroke="#2D2D2D" strokeWidth="1.3"
            />
          </g>
        ))}

        {/* Dashed circles spread across full canvas */}
        {circles.map(([cx, cy, r], i) => (
          <circle
            key={`circ-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none" stroke="#2D2D2D"
            strokeWidth="1.8" opacity="0.1" strokeDasharray="4 3"
          />
        ))}

        {/* Solid dots */}
        {dots.map(([cx, cy], i) => (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r="3.5" fill="#2D2D2D" opacity="0.09" />
        ))}

        {/* Plus / cross marks */}
        {crosses.map(([x, y], i) => (
          <g key={`cross-${i}`} transform={`translate(${x},${y})`} opacity="0.12">
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ))}

        {/* Diamonds */}
        {diamonds.map(([x, y], i) => (
          <g key={`diamond-${i}`} transform={`translate(${x},${y})`} opacity="0.13">
            <polygon points="0,-8 5,0 0,8 -5,0" fill="none" stroke="#2D2D2D" strokeWidth="1.5" />
          </g>
        ))}

        {/* Zigzag lines spanning full width at 3 heights */}
        {[170, 450, 730].map((y, i) => {
          const pts = Array.from({ length: 26 }, (_, j) =>
            `${j * 40},${y + (j % 2 === 0 ? -8 : 8)}`
          ).join(' ')
          return (
            <polyline
              key={`zz-${i}`} points={pts}
              fill="none" stroke="#2D2D2D" strokeWidth="1.3" opacity="0.07"
            />
          )
        })}

        {/* Wavy horizontal lines */}
        {[310, 620, 880].map((y, i) => (
          <path
            key={`wave-${i}`}
            d={`M0,${y} Q50,${y-12} 100,${y} Q150,${y+12} 200,${y} Q250,${y-12} 300,${y} Q350,${y+12} 400,${y} Q450,${y-12} 500,${y} Q550,${y+12} 600,${y} Q650,${y-12} 700,${y} Q750,${y+12} 800,${y} Q850,${y-12} 900,${y} Q950,${y+12} 1000,${y}`}
            fill="none" stroke="#2D2D2D" strokeWidth="1.3" opacity="0.07"
          />
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
        className={`card-2d flex items-center justify-center rounded-full relative ${running ? 'pulse-running' : ''}`}
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
      <div className="flex gap-3 flex-wrap justify-center my-4">
        {!running ? (
          <button
            id="sw-start"
            className="btn-2d px-8 py-4 text-sm"
            style={{ background: '#B3F0D9', minWidth: 120, marginTop: 4, marginBottom: 4 }}
            onClick={start}
          >
            ▶ Start
          </button>
        ) : (
          <button
            id="sw-pause"
            className="btn-2d px-8 py-4 text-sm"
            style={{ background: '#FFF0B3', minWidth: 120, marginTop: 4, marginBottom: 4 }}
            onClick={pause}
          >
            ⏸ Pause
          </button>
        )}
        <button
          id="sw-lap"
          className="btn-2d px-8 py-4 text-sm"
          style={{ background: '#B3D9FF', minWidth: 120, marginTop: 4, marginBottom: 4 }}
          onClick={lap}
          disabled={!running}
        >
          🏁 Lap
        </button>
        <button
          id="sw-reset"
          className="btn-2d px-8 py-4 text-sm"
          style={{ background: '#FFD9B3', minWidth: 120, marginTop: 4, marginBottom: 4 }}
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
          <circle cx="120" cy="120" r="100"
            fill="none" stroke="#E8D5FF" strokeWidth="12"
            style={{ filter: 'none' }} />
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
        <div className="flex gap-2 flex-wrap justify-center my-3">
          {PRESETS.map(p => (
            <button
              key={p.label}
              id={`preset-${p.label}`}
              className="btn-2d px-6 py-3 text-xs"
              style={{ background: '#FFF0B3', marginTop: 4, marginBottom: 4 }}
              onClick={() => applyPreset(p.ms)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Custom Time Input */}
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
      <div className="flex gap-3 flex-wrap justify-center my-4">
        {!running ? (
          <button
            id="timer-start"
            className="btn-2d px-8 py-4 text-sm"
            style={{ background: '#B3F0D9', minWidth: 120, marginTop: 4, marginBottom: 4 }}
            onClick={startTimer}
            disabled={displayMs <= 0 && !done}
          >
            ▶ Start
          </button>
        ) : (
          <button
            id="timer-pause"
            className="btn-2d px-8 py-4 text-sm"
            style={{ background: '#FFF0B3', minWidth: 120, marginTop: 4, marginBottom: 4 }}
            onClick={pauseTimer}
          >
            ⏸ Pause
          </button>
        )}
        <button
          id="timer-reset"
          className="btn-2d px-8 py-4 text-sm"
          style={{ background: '#FFD9B3', minWidth: 120, marginTop: 4, marginBottom: 4 }}
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

       
      </div>
    </div>
  )
}
