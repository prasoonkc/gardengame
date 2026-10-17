import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'bloom-breaker-save-v1'
const UNLOCK_EVERY = 3

const challenges = [
  {
    id: 'walk',
    title: 'Take a 15-minute walk without checking your phone.',
    category: 'Outdoors',
    duration: '15 min',
    minutes: 15,
    description: 'Leave the screen behind and move through the world with your attention open.',
    defaultSelected: true,
  },
  {
    id: 'book',
    title: 'Read a chapter of a book.',
    category: 'Creativity',
    duration: '20 min',
    minutes: 20,
    description: 'Let a story or idea take up your full attention for a while.',
    defaultSelected: true,
  },
  {
    id: 'outdoors',
    title: 'Spend 20 minutes outdoors.',
    category: 'Outdoors',
    duration: '20 min',
    minutes: 20,
    description: 'Take in the light, weather, or neighborhood around you without a screen.',
    defaultSelected: true,
  },
  {
    id: 'new-place',
    title: 'Visit a place you have never been to before.',
    category: 'Exploration',
    duration: '30 min',
    minutes: 30,
    description: 'Explore a corner of your town or city with fresh eyes.',
    defaultSelected: true,
  },
  {
    id: 'friend',
    title: 'Meet a friend in person.',
    category: 'Friends',
    duration: '30 min',
    minutes: 30,
    description: 'Share a real conversation without notifications or multitasking.',
    defaultSelected: true,
  },
  {
    id: 'draw',
    title: 'Draw something on paper.',
    category: 'Creativity',
    duration: '15 min',
    minutes: 15,
    description: 'Let your hands move before your thoughts have to be perfect.',
    defaultSelected: true,
  },
  {
    id: 'project',
    title: 'Spend 30 minutes working on a personal project without social media.',
    category: 'Productivity',
    duration: '30 min',
    minutes: 30,
    description: 'Focus on a goal that matters to you, free from the feed.',
    defaultSelected: true,
  },
  {
    id: 'street',
    title: 'Explore a new street or part of your neighborhood.',
    category: 'Exploration',
    duration: '20 min',
    minutes: 20,
    description: 'Notice details you usually miss and let curiosity lead the way.',
    defaultSelected: false,
  },
  {
    id: 'observe',
    title: 'Sit outside and observe your surroundings for 10 minutes.',
    category: 'Outdoors',
    duration: '10 min',
    minutes: 10,
    description: 'Slow down and pay attention to what is around you.',
    defaultSelected: false,
  },
  {
    id: 'cook',
    title: 'Cook something yourself.',
    category: 'Productivity',
    duration: '25 min',
    minutes: 25,
    description: 'Make a meal or snack with your own hands and your own attention.',
    defaultSelected: false,
  },
  {
    id: 'game',
    title: 'Play a physical game with friends.',
    category: 'Friends',
    duration: '20 min',
    minutes: 20,
    description: 'Move, laugh, and compete without checking your phone.',
    defaultSelected: false,
  },
  {
    id: 'screen-free',
    title: 'Spend 20 minutes doing an activity without using a screen.',
    category: 'Creativity',
    duration: '20 min',
    minutes: 20,
    description: 'Choose an analog task that feels satisfying, calm, or playful.',
    defaultSelected: false,
  },
]

const seedlingCatalog = [
  { id: 'sprout', label: 'Sprout', category: 'Outdoors', color: '#8acb68', palette: ['#f7c06b', '#87d38e', '#9bd6ff'] },
  { id: 'sunflower', label: 'Sunflower', category: 'Outdoors', color: '#f2be5c', palette: ['#f7d670', '#f4b75f', '#9fe3a7'] },
  { id: 'lavender', label: 'Lavender', category: 'Friends', color: '#b494ff', palette: ['#b494ff', '#d3b8ff', '#f7d2b8'] },
  { id: 'rose', label: 'Rose', category: 'Friends', color: '#f5918e', palette: ['#f5918e', '#f9b8b4', '#ffd884'] },
  { id: 'fern', label: 'Fern', category: 'Creativity', color: '#7dcf8d', palette: ['#87dc9f', '#7ec3ae', '#f7d984'] },
  { id: 'mint', label: 'Mint', category: 'Creativity', color: '#68c7b6', palette: ['#68c7b6', '#a4dfba', '#f4c971'] },
  { id: 'daisy', label: 'Daisy', category: 'Productivity', color: '#f4c87c', palette: ['#f4c87c', '#f1e7b7', '#8bd9c4'] },
  { id: 'iris', label: 'Iris', category: 'Productivity', color: '#7ca9ff', palette: ['#7ca9ff', '#a4d4ff', '#f5d58b'] },
  { id: 'wildflower', label: 'Wildflower', category: 'Exploration', color: '#ff8d74', palette: ['#ff8d74', '#ffc86f', '#9cc7ff'] },
  { id: 'poppy', label: 'Poppy', category: 'Exploration', color: '#f06d5b', palette: ['#f06d5b', '#ffbf69', '#8fe0b5'] },
]

const DEFAULT_STATE = {
  completedChallenges: [],
  unlockedSeedlingIds: [],
  selectedChallengeIds: challenges.filter((challenge) => challenge.defaultSelected).map((challenge) => challenge.id),
  currentChallengeId: 'walk',
  dailyEntries: [],
  lastSeedlingId: null,
}

function toDateKey(date = new Date()) {
  const localDate = new Date(date)
  const offset = localDate.getTimezoneOffset()
  const adjusted = new Date(localDate.getTime() - offset * 60 * 1000)
  return adjusted.toISOString().slice(0, 10)
}

function parseDurationMinutes(challenge) {
  const parsedMinutes = Number.parseInt(challenge?.duration ?? '15', 10)
  return challenge?.minutes ?? (Number.isFinite(parsedMinutes) ? parsedMinutes : 15)
}

function getSavedProgress() {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return DEFAULT_STATE
    }

    const parsed = JSON.parse(stored)
    return {
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      unlockedSeedlingIds: Array.isArray(parsed.unlockedSeedlingIds) ? parsed.unlockedSeedlingIds : [],
      selectedChallengeIds: Array.isArray(parsed.selectedChallengeIds) && parsed.selectedChallengeIds.length > 0
        ? parsed.selectedChallengeIds
        : DEFAULT_STATE.selectedChallengeIds,
      currentChallengeId: parsed.currentChallengeId || DEFAULT_STATE.currentChallengeId,
      dailyEntries: Array.isArray(parsed.dailyEntries) ? parsed.dailyEntries : [],
      lastSeedlingId: parsed.lastSeedlingId || null,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function chooseNextChallenge(selectedIds = [], excludeIds = [], completedChallengeIds = []) {
  const pool = challenges.filter(
    (challenge) => selectedIds.includes(challenge.id) && !excludeIds.includes(challenge.id) && !completedChallengeIds.includes(challenge.id),
  )

  if (pool.length === 0) {
    const fallback = challenges.filter((challenge) => !excludeIds.includes(challenge.id) && !completedChallengeIds.includes(challenge.id))
    return fallback[0] || challenges[0]
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

function getNextSeedling(category, unlockedSeedlingIds) {
  const relevant = seedlingCatalog.filter((seedling) => seedling.category === category)
  const available = relevant.filter((seedling) => !unlockedSeedlingIds.includes(seedling.id))

  if (available.length > 0) {
    return available[0]
  }

  const leftover = seedlingCatalog.filter((seedling) => !unlockedSeedlingIds.includes(seedling.id))
  return leftover[0] || relevant[0] || seedlingCatalog[0]
}

function normalizeCompletedChallenges(list) {
  return list.map((entry) => {
    if (typeof entry === 'string') {
      return { id: entry, date: toDateKey(), title: 'Challenge complete', minutes: 15 }
    }

    return {
      ...entry,
      minutes: entry.minutes ?? 15,
    }
  })
}

function createCalendarDays(days = 10) {
  const arr = []
  for (let step = days - 1; step >= 0; step -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - step)
    arr.push({
      key: toDateKey(date),
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      shortLabel: date.toLocaleDateString(undefined, { weekday: 'short' }),
    })
  }
  return arr
}

function buildPlantForSeedling(seedling, minutes, dayKey) {
  const safeMinutes = Number.isFinite(minutes) ? minutes : 15
  const petalCount = safeMinutes >= 30 ? 12 : safeMinutes >= 20 ? 9 : 6

  return {
    id: `plant-${seedling.id}-${safeMinutes}-${dayKey}`,
    seedlingId: seedling.id,
    name: seedling.label,
    minutes: safeMinutes,
    palette: seedling.palette,
    stemHeight: 70 + safeMinutes * 1.1,
    bloomSize: 16 + safeMinutes * 0.8,
    petalCount,
    leafCount: Math.min(6, 2 + Math.floor(safeMinutes / 10)),
  }
}

function App() {
  const [progress, setProgress] = useState(() => getSavedProgress())
  const [selectedSeedlingId, setSelectedSeedlingId] = useState(() => getSavedProgress().unlockedSeedlingIds[0] || null)
  const [selectedDay, setSelectedDay] = useState(() => toDateKey())
  const [notice, setNotice] = useState('')
  const [timer, setTimer] = useState(() => {
    const defaultChallenge = challenges[0]
    const minutes = parseDurationMinutes(defaultChallenge)
    return {
      minutes,
      secondsLeft: minutes * 60,
      isRunning: false,
    }
  })

  const selectedChallengeIds = progress.selectedChallengeIds
  const selectedChallenges = useMemo(
    () => challenges.filter((challenge) => selectedChallengeIds.includes(challenge.id)),
    [selectedChallengeIds],
  )

  const activeChallenge = useMemo(() => {
    const match = challenges.find((challenge) => challenge.id === progress.currentChallengeId)
    if (match && selectedChallengeIds.includes(match.id)) {
      return match
    }

    return selectedChallenges[0] || challenges[0]
  }, [progress.currentChallengeId, selectedChallengeIds, selectedChallenges])

  const completedCount = normalizeCompletedChallenges(progress.completedChallenges).length
  const unlockedSeedlings = useMemo(
    () => seedlingCatalog.filter((seedling) => progress.unlockedSeedlingIds.includes(seedling.id)),
    [progress.unlockedSeedlingIds],
  )

  const activeSeedling = useMemo(
    () => seedlingCatalog.find((seedling) => seedling.id === selectedSeedlingId) || unlockedSeedlings[0] || null,
    [selectedSeedlingId, unlockedSeedlings],
  )

  const nextUnlockCount = (() => {
    if (completedCount === 0) {
      return UNLOCK_EVERY
    }

    const remainder = completedCount % UNLOCK_EVERY
    return remainder === 0 ? UNLOCK_EVERY : UNLOCK_EVERY - remainder
  })()

  const history = useMemo(
    () => normalizeCompletedChallenges(progress.completedChallenges).slice().reverse().slice(0, 6),
    [progress.completedChallenges],
  )

  const galleryDays = useMemo(() => createCalendarDays(10), [])
  const selectedEntry = useMemo(
    () => progress.dailyEntries.find((entry) => entry.date === selectedDay),
    [progress.dailyEntries, selectedDay],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    if (!timer.isRunning) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setTimer((previous) => {
        if (previous.secondsLeft <= 1) {
          window.clearInterval(intervalId)
          return { ...previous, secondsLeft: 0, isRunning: false }
        }

        return { ...previous, secondsLeft: previous.secondsLeft - 1 }
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [timer.isRunning])

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const handleSelectChallenge = (challengeId) => {
    const challenge = challenges.find((entry) => entry.id === challengeId)
    const nextMinutes = parseDurationMinutes(challenge)

    setProgress((previous) => ({
      ...previous,
      currentChallengeId: challengeId,
    }))

    setTimer({
      minutes: nextMinutes,
      secondsLeft: nextMinutes * 60,
      isRunning: false,
    })
  }

  const toggleChallengeSelection = (challengeId) => {
    setProgress((previous) => {
      const selection = previous.selectedChallengeIds.includes(challengeId)
        ? previous.selectedChallengeIds.filter((id) => id !== challengeId)
        : [...previous.selectedChallengeIds, challengeId]

      if (selection.length === 0) {
        return {
          ...previous,
          selectedChallengeIds: [challengeId],
        }
      }

      const nextCurrent = previous.currentChallengeId && selection.includes(previous.currentChallengeId)
        ? previous.currentChallengeId
        : selection[0]

      return {
        ...previous,
        selectedChallengeIds: selection,
        currentChallengeId: nextCurrent,
      }
    })
  }

  const handleTimerToggle = () => {
    setTimer((previous) => ({
      ...previous,
      isRunning: !previous.isRunning,
    }))
  }

  const handleResetTimer = () => {
    setTimer((previous) => ({
      ...previous,
      secondsLeft: previous.minutes * 60,
      isRunning: false,
    }))
  }

  const handleCompleteChallenge = () => {
    if (!activeChallenge) {
      return
    }

    const todayKey = toDateKey()
    const alreadyCompleted = normalizeCompletedChallenges(progress.completedChallenges).some(
      (entry) => entry.id === activeChallenge.id && entry.date === todayKey,
    )

    if (alreadyCompleted) {
      setNotice('This activity is already logged for today.')
      return
    }

    const confirmed = window.confirm(
      `Mark "${activeChallenge.title}" as complete? This grows your plant and unlocks a new seedling.`,
    )

    if (!confirmed) {
      return
    }

    const nextSeedling = getNextSeedling(activeChallenge.category, progress.unlockedSeedlingIds)

    setProgress((previous) => {
      const normalized = normalizeCompletedChallenges(previous.completedChallenges)
      const updatedList = [
        ...normalized,
        {
          id: activeChallenge.id,
          title: activeChallenge.title,
          category: activeChallenge.category,
          date: todayKey,
          minutes: activeChallenge.minutes,
        },
      ]

      const unlockedSeedlingIds = previous.unlockedSeedlingIds.includes(nextSeedling.id)
        ? previous.unlockedSeedlingIds
        : [...previous.unlockedSeedlingIds, nextSeedling.id]

      const nextChallenge = chooseNextChallenge(
        previous.selectedChallengeIds,
        [activeChallenge.id],
        updatedList.map((item) => item.id),
      )

      return {
        ...previous,
        completedChallenges: updatedList,
        unlockedSeedlingIds,
        currentChallengeId: nextChallenge.id,
        lastSeedlingId: nextSeedling.id,
      }
    })

    setSelectedSeedlingId(nextSeedling.id)
    setNotice(`A ${nextSeedling.label.toLowerCase()} has unlocked!`)
    handleResetTimer()
  }

  const handleSaveFlower = () => {
    const todayKey = toDateKey()
    const chosenSeedling = activeSeedling || seedlingCatalog[0]
    const plant = buildPlantForSeedling(chosenSeedling, timer.minutes || activeChallenge.minutes, todayKey)
    const todayActivities = normalizeCompletedChallenges(progress.completedChallenges)
      .filter((entry) => entry.date === todayKey)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        category: entry.category,
        date: entry.date,
        minutes: entry.minutes,
      }))

    setProgress((previous) => ({
      ...previous,
      dailyEntries: [
        ...previous.dailyEntries.filter((entry) => entry.date !== todayKey),
        {
          date: todayKey,
          plant,
          activities: todayActivities.length > 0 ? todayActivities : [
            {
              id: activeChallenge.id,
              title: activeChallenge.title,
              category: activeChallenge.category,
              date: todayKey,
              minutes: activeChallenge.minutes,
            },
          ],
        },
      ],
    }))

    setSelectedDay(todayKey)
    setNotice('Flower pressed into the calendar.')
  }

  const handleReset = () => {
    const confirmed = window.confirm('Reset your whole garden? This cannot be undone.')
    if (!confirmed) {
      return
    }

    setProgress({
      ...DEFAULT_STATE,
      currentChallengeId: DEFAULT_STATE.selectedChallengeIds[0],
    })
    setSelectedSeedlingId(null)
    setSelectedDay(toDateKey())
    setNotice('Garden reset.')
    setTimer({ minutes: 15, secondsLeft: 15 * 60, isRunning: false })
  }

  const renderPlant = (plant, options = {}) => {
    const { x = 180, y = 290, scale = 1 } = options
    const stemHeight = (plant.stemHeight || 110) * scale
    const bloomSize = (plant.bloomSize || 28) * scale
    const petalCount = plant.petalCount || 6
    const palette = plant.palette || ['#ffb703', '#f4d35e', '#8ecae6']
    const stemTop = y - stemHeight

    return (
      <g>
        <path
          d={`M ${x} ${y} C ${x - 8 * scale} ${y - stemHeight * 0.45}, ${x + 6 * scale} ${stemTop + stemHeight * 0.2}, ${x} ${stemTop}`}
          stroke="#4f7a52"
          strokeWidth={Math.max(4, 6 * scale)}
          fill="none"
          strokeLinecap="round"
        />
        {Array.from({ length: plant.leafCount || 3 }).map((_, index) => {
          const leafY = y - 20 * scale - index * ((stemHeight * 0.5) / Math.max(1, plant.leafCount || 3))
          const rotation = index % 2 === 0 ? -18 : 18
          return (
            <g key={`${plant.id}-leaf-${index}`} transform={`translate(${x} ${leafY}) rotate(${rotation})`}>
              <path d={`M 0 0 C ${-12 * scale} ${-18 * scale}, ${-25 * scale} ${-35 * scale}, ${-20 * scale} ${-50 * scale}`} stroke="#72b874" strokeWidth={Math.max(2, 3 * scale)} fill="none" strokeLinecap="round" />
            </g>
          )
        })}
        <g transform={`translate(${x} ${stemTop})`}>
          {Array.from({ length: petalCount }).map((_, petalIndex) => (
            <ellipse
              key={`${plant.id}-petal-${petalIndex}`}
              cx={0}
              cy={-(bloomSize * 0.9)}
              rx={bloomSize * 0.26}
              ry={bloomSize * 0.52}
              fill={palette[petalIndex % palette.length]}
              transform={`rotate(${(360 / petalCount) * petalIndex})`}
              opacity={0.92}
            />
          ))}
          <circle cx={0} cy={0} r={Math.max(8, bloomSize * 0.26)} fill="#fef4c7" stroke="#f7c768" strokeWidth={Math.max(2, 3 * scale)} />
        </g>
      </g>
    )
  }

  const timerSeconds = timer.secondsLeft % 60
  const timerDisplay = `${String(Math.floor(timer.secondsLeft / 60)).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`
  const plantedSeed = buildPlantForSeedling(activeSeedling || seedlingCatalog[0], timer.minutes || activeChallenge.minutes, toDateKey())

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Offline habit game</p>
          <h1>Bloom Breaker</h1>
          <p className="tagline">Grow a small garden by taking life offline.</p>
        </div>

        <div className="stats-strip">
          <div className="stat-pill">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className="stat-pill">
            <span>Unlocked</span>
            <strong>{unlockedSeedlings.length}</strong>
          </div>
        </div>
      </header>

      <main className="garden-layout">
        <section className="panel greenhouse-panel">
          <div className="panel-header">
            <div>
              <p className="section-tag">Your greenhouse</p>
              <h2>Growing plant</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => setNotice('The plant is still growing.')}>Refresh bloom</button>
          </div>

          <div className="plant-scene">
            <svg viewBox="0 0 360 360" className="plant-svg" role="img" aria-label="Current plant growth">
              <rect x="0" y="0" width="360" height="360" rx="36" className="plant-ground" />
              <g>
                {renderPlant(plantedSeed, { x: 180, y: 290, scale: 1 })}
              </g>
            </svg>
          </div>

          <div className="canvas-actions">
            <button type="button" className="primary-button" onClick={handleSaveFlower}>Press flower to save</button>
            <button type="button" className="secondary-button" onClick={handleReset}>Reset garden</button>
          </div>
        </section>

        <aside className="side-panel">
          <section className="panel challenge-card">
            <p className="section-tag">Current challenge</p>
            <h3>{activeChallenge.title}</h3>

            <div className="meta-row">
              <span className="meta-chip">{activeChallenge.category}</span>
              <span className="meta-chip">{activeChallenge.duration}</span>
            </div>

            <p className="challenge-copy">{activeChallenge.description}</p>

            <div className="timer-box">
              <span className="timer-label">Focus timer</span>
              <div className="timer-display">{timerDisplay}</div>
              <div className="timer-actions">
                <button type="button" className="primary-button small-button" onClick={handleTimerToggle}>
                  {timer.isRunning ? 'Pause timer' : 'Start timer'}
                </button>
                <button type="button" className="secondary-button small-button" onClick={handleResetTimer}>Reset</button>
              </div>
            </div>

            <div className="unlock-prompt">
              <span className="unlock-label">Next seedling</span>
              <strong>
                {nextUnlockCount} more {nextUnlockCount === 1 ? 'activity' : 'activities'} to unlock a new plant.
              </strong>
            </div>

            <button type="button" className="primary-button full-width" onClick={handleCompleteChallenge}>Complete challenge</button>
          </section>

          {notice && <div className="notice-bar">{notice}</div>}

          <section className="panel reward-card">
            <div className="panel-header compact">
              <div>
                <p className="section-tag">Choose your path</p>
                <h3>Activity list</h3>
              </div>
            </div>

            <div className="challenge-picker-list">
              {challenges.map((challenge) => {
                const isSelected = selectedChallengeIds.includes(challenge.id)
                return (
                  <label key={challenge.id} className={`choice-row ${isSelected ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleChallengeSelection(challenge.id)}
                    />
                    <button type="button" className="choice-title" onClick={() => handleSelectChallenge(challenge.id)}>
                      {challenge.title}
                    </button>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="panel reward-card">
            <div className="panel-header compact">
              <div>
                <p className="section-tag">Progress</p>
                <h3>Unlocked seedlings</h3>
              </div>
            </div>

            <div className="reward-list">
              {unlockedSeedlings.length === 0 ? (
                <p className="empty-copy">Finish your first activity to unlock a seedling.</p>
              ) : (
                unlockedSeedlings.map((seedling) => (
                  <button
                    key={seedling.id}
                    type="button"
                    className={`reward-chip ${selectedSeedlingId === seedling.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSeedlingId(seedling.id)}
                    aria-pressed={selectedSeedlingId === seedling.id}
                  >
                    <span className="reward-swatch" style={{ background: seedling.palette[0] }} />
                    {seedling.label}
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="panel history-card">
            <div className="panel-header compact">
              <div>
                <p className="section-tag">Garden journal</p>
                <h3>Flower calendar</h3>
              </div>
            </div>

            <div className="calendar-grid">
              {galleryDays.map((day) => {
                const entry = progress.dailyEntries.find((item) => item.date === day.key)
                return (
                  <button
                    key={day.key}
                    type="button"
                    className={`calendar-day ${entry ? 'filled' : ''} ${selectedDay === day.key ? 'selected' : ''}`}
                    onClick={() => setSelectedDay(day.key)}
                  >
                    <div className="calendar-labels">
                      <span>{day.shortLabel}</span>
                      <strong>{day.label}</strong>
                    </div>
                    {entry ? (
                      <svg viewBox="0 0 90 90" className="mini-art" aria-label={`Saved plant for ${day.label}`}>
                        <rect x="0" y="0" width="90" height="90" rx="18" className="mini-art-bg" />
                        <g transform="translate(0 6)">
                          {renderPlant(entry.plant, { x: 45, y: 62, scale: 0.38 })}
                        </g>
                      </svg>
                    ) : (
                      <div className="calendar-empty" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="day-detail">
              {selectedEntry ? (
                <>
                  <svg viewBox="0 0 220 220" className="flower-preview" role="img" aria-label={`Saved plant for ${selectedDay}`}>
                    <rect x="0" y="0" width="220" height="220" rx="28" className="detail-bg" />
                    <g>
                      {renderPlant(selectedEntry.plant, { x: 110, y: 160, scale: 0.54 })}
                    </g>
                  </svg>

                  <div className="detail-log">
                    <h4>{new Date(`${selectedEntry.date}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                    <ul className="activity-list">
                      {selectedEntry.activities && selectedEntry.activities.length > 0 ? (
                        selectedEntry.activities.map((activity) => (
                          <li key={`${selectedEntry.date}-${activity.id || activity.title}`}>
                            <span className="history-dot" />
                            <span>{activity.title}</span>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="history-dot" />
                          <span>Nothing logged yet for this day.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="empty-copy">Choose a day to see the flower and what you logged.</p>
              )}
            </div>
          </section>

          <section className="panel history-card">
            <p className="section-tag">Recent wins</p>
            <h3>Completed challenge log</h3>

            {history.length === 0 ? (
              <p className="empty-copy">No completed activities yet. Your first little bloom starts here.</p>
            ) : (
              <ul className="history-list">
                {history.map((entry) => (
                  <li key={`${entry.id}-${entry.date}`}>
                    <span className="history-dot" />
                    <span>{entry.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App
