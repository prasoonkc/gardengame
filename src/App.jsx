import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'bloom-breaker-save-v1'
const CUSTOM_ACTIVITY_KEY = 'bloom-breaker-custom-activities-v1'
const TUTORIAL_KEY = 'bloom-breaker-tutorial-v1'
const USER_KEY = 'bloom-breaker-user-v1'
const UNLOCK_EVERY = 3

const baseChallenges = [
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

const flowerCatalog = [
  { id: 'daisy', label: 'Daisy', category: 'Outdoors', rarity: 'Common', color: '#f4cb6f', palette: ['#fff7d2', '#f8d170', '#9dd9bf'] },
  { id: 'lavender', label: 'Lavender', category: 'Friends', rarity: 'Rare', color: '#c3a0ff', palette: ['#d7c7ff', '#bda0ff', '#f4d5b5'] },
  { id: 'rose', label: 'Rose', category: 'Friends', rarity: 'Rare', color: '#ef7a7c', palette: ['#f7b0aa', '#f28f8f', '#f9d99b'] },
  { id: 'sunflower', label: 'Sunflower', category: 'Outdoors', rarity: 'Rare', color: '#f3be53', palette: ['#f7dd7b', '#f7bc4b', '#86d29d'] },
  { id: 'iris', label: 'Iris', category: 'Productivity', rarity: 'Rare', color: '#7ea9ff', palette: ['#dceaff', '#7ea9ff', '#f5d98b'] },
  { id: 'tulip', label: 'Tulip', category: 'Productivity', rarity: 'Epic', color: '#ee6f5e', palette: ['#f9a784', '#f36c5f', '#cfe78c'] },
  { id: 'bluebell', label: 'Bluebell', category: 'Creativity', rarity: 'Epic', color: '#6aa9ff', palette: ['#d9f0ff', '#6faeff', '#9fe39a'] },
  { id: 'marigold', label: 'Marigold', category: 'Exploration', rarity: 'Epic', color: '#fbb65a', palette: ['#ffd88b', '#f9b55e', '#f7e6a5'] },
  { id: 'poppy', label: 'Poppy', category: 'Exploration', rarity: 'Epic', color: '#f27466', palette: ['#ffbd70', '#f27466', '#89dca7'] },
]

const shopCatalog = [
  { id: 'default-pot', kind: 'pot', name: 'Default', cost: 0, asset: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180"><ellipse cx="110" cy="152" rx="62" ry="12" fill="#c69a6a" opacity="0.8"/><path d="M72 48h76l-10 78c-2 15-13 26-28 26s-26-11-28-26L72 48Z" fill="#8b5a2b" stroke="#5d3816" stroke-width="4"/><path d="M88 48h44l-6 10H94l-6-10Z" fill="#a86d39" stroke="#5d3816" stroke-width="4"/><path d="M76 74h68" stroke="#d3a166" stroke-width="5" stroke-linecap="round" opacity="0.5"/><path d="M78 86h64" stroke="#d3a166" stroke-width="5" stroke-linecap="round" opacity="0.45"/><ellipse cx="110" cy="46" rx="42" ry="12" fill="#5a2d14" opacity="0.75"/><path d="M86 52c8 8 18 12 24 12s16-4 24-12" stroke="#c88a59" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8"/><path d="M84 122c8-8 19-11 26-11s18 3 26 11" stroke="#d7b084" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.5"/></svg>') },
  { id: 'vase1', kind: 'pot', name: 'Vase 1', cost: 5, asset: '/vase1.png' },
  { id: 'vase2', kind: 'pot', name: 'Vase 2', cost: 5, asset: '/vase2.png' },
  { id: 'vase3', kind: 'pot', name: 'Vase 3', cost: 10, asset: '/vase3.png' },
  { id: 'vase4', kind: 'pot', name: 'Vase 4', cost: 10, asset: '/vase4.png' },
  { id: 'decor-lights', kind: 'decor', name: 'String Lights', cost: 2, asset: '/light-bulb.png' },
  { id: 'decor-shelf', kind: 'decor', name: 'Bookshelf', cost: 3, asset: '/bookshelf.png' },
  { id: 'decor-fence', kind: 'decor', name: 'Fence', cost: 4, asset: '/fence.png' },
  { id: 'bg-default', kind: 'background', name: 'Default', cost: 0, color: '#f7f0c5' },
  { id: 'bg-sage', kind: 'background', name: 'Sage Green', cost: 2, color: '#dfeecf' },
  { id: 'bg-peach', kind: 'background', name: 'Peach', cost: 2, color: '#f9e0d1' },
  { id: 'bg-sky', kind: 'background', name: 'Sky Blue', cost: 2, color: '#dfeaff' },
  { id: 'bg-lilac', kind: 'background', name: 'Lilac', cost: 2, color: '#e8def7' },
]

const DEFAULT_STATE = {
  completedChallenges: [],
  unlockedSeedlingIds: ['daisy'],
  selectedChallengeIds: ['walk'],
  currentChallengeId: 'walk',
  dailyEntries: [],
  lastSeedlingId: 'daisy',
  coinBalance: 0,
  lifetimeCoinsEarned: 0,
  purchasedShopItemIds: [],
  selectedPotId: 'default-pot',
  selectedBackgroundId: 'bg-default',
  selectedDecorIds: [],
}

function toDateKey(date = new Date()) {
  const localDate = new Date(date)
  const offset = localDate.getTimezoneOffset()
  const adjusted = new Date(localDate.getTime() - offset * 60 * 1000)
  return adjusted.toISOString().slice(0, 10)
}

function parseDurationMinutes(challenge) {
  const value = Number.parseInt(challenge?.duration ?? '15', 10)
  return challenge?.minutes ?? (Number.isFinite(value) ? value : 15)
}

function loadCustomChallenges() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(CUSTOM_ACTIVITY_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getTotalHarvestedFlowers(entries) {
  return normalizeDailyEntries(entries).reduce((total, entry) => total + (Array.isArray(entry.flowers) ? entry.flowers.length : (entry.plant ? 1 : 0)), 0)
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
    const selectedChallengeIds = normalizeSelectedChallengeIds(
      parsed.selectedChallengeIds,
      parsed.currentChallengeId || DEFAULT_STATE.currentChallengeId,
    )

    const purchasedShopItemIds = Array.isArray(parsed.purchasedShopItemIds)
      ? normalizeShopItemIds(parsed.purchasedShopItemIds)
      : []

    const selectedDecorIds = Array.isArray(parsed.selectedDecorIds)
      ? parsed.selectedDecorIds.filter((id) => shopCatalog.some((item) => item.id === id))
      : []

    const validPotIds = new Set(shopCatalog.filter((item) => item.kind === 'pot').map((item) => item.id))
    const validBackgroundIds = new Set(shopCatalog.filter((item) => item.kind === 'background').map((item) => item.id))
    const selectedPotId = validPotIds.has(parsed.selectedPotId) ? parsed.selectedPotId : DEFAULT_STATE.selectedPotId
    const selectedBackgroundId = validBackgroundIds.has(parsed.selectedBackgroundId) ? parsed.selectedBackgroundId : DEFAULT_STATE.selectedBackgroundId

    const computedCoinBalance = Number.isFinite(parsed.coinBalance)
      ? parsed.coinBalance
      : Math.max(0, Math.floor(getTotalHarvestedFlowers(parsed.dailyEntries) / 2) - purchasedShopItemIds.reduce((total, id) => total + (shopCatalog.find((item) => item.id === id)?.cost || 0), 0))
    const lifetimeCoinsEarned = Number.isFinite(parsed.lifetimeCoinsEarned)
      ? parsed.lifetimeCoinsEarned
      : Math.max(0, Math.floor(getTotalHarvestedFlowers(parsed.dailyEntries) / 2))

    return {
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      unlockedSeedlingIds: normalizeSeedlingIds(parsed.unlockedSeedlingIds).length > 0
        ? normalizeSeedlingIds(parsed.unlockedSeedlingIds)
        : DEFAULT_STATE.unlockedSeedlingIds,
      selectedChallengeIds,
      currentChallengeId: selectedChallengeIds[0] || DEFAULT_STATE.currentChallengeId,
      dailyEntries: normalizeDailyEntries(parsed.dailyEntries),
      lastSeedlingId: parsed.lastSeedlingId || DEFAULT_STATE.lastSeedlingId,
      coinBalance: computedCoinBalance,
      lifetimeCoinsEarned,
      purchasedShopItemIds,
      selectedPotId,
      selectedBackgroundId,
      selectedDecorIds,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function chooseNextChallenge(challenges, selectedIds = [], excludeIds = [], completedIds = []) {
  const pool = challenges.filter(
    (challenge) => selectedIds.includes(challenge.id) && !excludeIds.includes(challenge.id) && !completedIds.includes(challenge.id),
  )

  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const fallback = challenges.filter((challenge) => !excludeIds.includes(challenge.id) && !completedIds.includes(challenge.id))
  return fallback[0] || challenges[0]
}

function getNextSeedling(unlockedIds) {
  const validUnlocked = normalizeSeedlingIds(unlockedIds)
  const remaining = flowerCatalog.filter((seedling) => !validUnlocked.includes(seedling.id))
  return remaining[0] || null
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

function normalizeSeedlingIds(list) {
  const validIds = new Set(flowerCatalog.map((seedling) => seedling.id))

  return [...new Set((Array.isArray(list) ? list : []).filter((id) => typeof id === 'string' && validIds.has(id)))]
}

function normalizeSelectedChallengeIds(list, currentChallengeId = DEFAULT_STATE.currentChallengeId) {
  const candidates = (Array.isArray(list) ? list : []).filter((id) => typeof id === 'string' && id.trim().length > 0)

  if (candidates.length === 0) {
    return [currentChallengeId || DEFAULT_STATE.currentChallengeId]
  }

  return [candidates[candidates.length - 1]]
}

function normalizeShopItemIds(list) {
  const validIds = new Set(shopCatalog.map((item) => item.id))
  return [...new Set((Array.isArray(list) ? list : []).filter((id) => typeof id === 'string' && validIds.has(id)))]
}

function normalizeDailyEntries(list) {
  return (Array.isArray(list) ? list : []).map((entry) => {
    const plant = entry?.plant || {}
    const seedlingId = plant.seedlingId || plant.name?.toLowerCase() || 'daisy'
    const legacyFlowers = Array.isArray(entry?.flowers)
      ? entry.flowers
      : [{ ...plant, seedlingId, stage: Number.isFinite(plant.stage) ? plant.stage : 3 }]

    return {
      ...entry,
      date: entry?.date || toDateKey(),
      activities: Array.isArray(entry?.activities) ? entry.activities : [],
      flowers: legacyFlowers.map((flower, index) => ({
        id: flower.id || `${entry?.date || toDateKey()}-flower-${index}`,
        seedlingId: flower.seedlingId || seedlingId,
        minutes: Number(flower.minutes ?? plant.minutes ?? 15),
        stage: Number.isFinite(flower.stage) ? flower.stage : 3,
        palette: flower.palette || flowerCatalog.find((item) => item.id === (flower.seedlingId || seedlingId))?.palette || flowerCatalog[0].palette,
      })),
      plant: {
        ...plant,
        seedlingId,
        stage: Number.isFinite(plant.stage) ? plant.stage : 3,
      },
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

function buildPlantForSeedling(seedling, minutes, dayKey, growthStage = 3) {
  const safeMinutes = Number.isFinite(minutes) ? minutes : 15
  const petalCount = safeMinutes >= 30 ? 11 : safeMinutes >= 20 ? 8 : 6
  const normalizedStage = Math.min(3, Math.max(0, Number(growthStage) || 3))

  return {
    id: `plant-${seedling.id}-${safeMinutes}-${dayKey}`,
    seedlingId: seedling.id,
    name: seedling.label,
    minutes: safeMinutes,
    palette: seedling.palette,
    stemHeight: 70 + safeMinutes * 1.2,
    bloomSize: 18 + safeMinutes * 0.8,
    petalCount,
    leafCount: Math.min(6, 2 + Math.floor(safeMinutes / 10)),
    stage: normalizedStage,
  }
}

const flowerImageMap = {
  daisy: '/daisy.png',
  lavender: '/lavender.png',
  rose: '/rose.png',
  sunflower: '/sunflower.png',
  iris: '/iris.png',
  tulip: '/tulip.png',
  bluebell: '/bluebell.png',
  marigold: '/marigold.png',
  poppy: '/poppy.png',
}

function getFlowerAsset(seedlingId) {
  return flowerImageMap[seedlingId] || '/daisy.png'
}

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function renderFlowerSpread(flowers, options = {}) {
  const {
    width = 220,
    height = 220,
    className = 'flower-preview',
  } = options

  const flowerList = Array.isArray(flowers) ? flowers : [flowers].filter(Boolean)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label="Saved flower heads">
      <rect x="0" y="0" width={width} height={height} rx="28" className="detail-bg" />
      {flowerList.map((flower) => {
        const seed = Array.from((flower?.id || flower?.seedlingId || 'flower')).reduce((total, char) => total + char.charCodeAt(0), 0)
        const random = seededRandom(seed)
        const size = 26 + random() * 34
        const x = 26 + random() * (width - 52)
        const y = 30 + random() * (height - 62)
        const rotation = -26 + random() * 52

        return (
          <g key={flower?.id || `${flower?.seedlingId}-${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rotation})`}>
            <image
              href={getFlowerAsset(flower?.seedlingId || 'daisy')}
              x={-size / 2}
              y={-size / 2}
              width={size}
              height={size}
              preserveAspectRatio="xMidYMid meet"
              opacity={0.98}
            />
          </g>
        )
      })}
    </svg>
  )
}

function getGrowthStage(timerMinutes, secondsLeft, isRunning) {
  const totalSeconds = Math.max(1, (Number(timerMinutes) || 15) * 60)
  const remaining = Math.max(0, Number(secondsLeft) || 0)

  if (remaining === totalSeconds && !isRunning) {
    return 0
  }

  if (remaining <= 0) {
    return 3
  }

  const progress = 1 - remaining / totalSeconds
  if (progress >= 0.65) return 3
  if (progress >= 0.35) return 2
  if (progress >= 0.08) return 1
  return 0
}

function App() {
  const [customChallenges, setCustomChallenges] = useState(loadCustomChallenges)
  const [progress, setProgress] = useState(() => getSavedProgress())
  const [selectedSeedlingId, setSelectedSeedlingId] = useState(() => getSavedProgress().lastSeedlingId || 'daisy')
  const [showFlowerPicker, setShowFlowerPicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState(() => toDateKey())
  const [customName, setCustomName] = useState('')
  const [customMinutes, setCustomMinutes] = useState(20)
  const [notice, setNotice] = useState('')
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window === 'undefined') return 'Guest'
    const saved = localStorage.getItem(USER_KEY)
    return saved && saved.trim().length > 0 ? saved.trim() : 'Guest'
  })
  const [showSignIn, setShowSignIn] = useState(false)
  const [signInDraft, setSignInDraft] = useState(() => {
    if (typeof window === 'undefined') return ''
    const saved = localStorage.getItem(USER_KEY)
    return saved && saved.trim().length > 0 ? saved.trim() : ''
  })
  const [shopOpen, setShopOpen] = useState(false)
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem(TUTORIAL_KEY)
  })
  const [tutorialStep, setTutorialStep] = useState(0)
  const [timer, setTimer] = useState({ minutes: 15, secondsLeft: 15 * 60, isRunning: false })

  const allChallenges = useMemo(() => [...baseChallenges, ...customChallenges], [customChallenges])
  const selectedChallengeIds = progress.selectedChallengeIds
  const selectedChallenges = useMemo(
    () => allChallenges.filter((challenge) => selectedChallengeIds.includes(challenge.id)),
    [allChallenges, selectedChallengeIds],
  )

  const challengeIndex = useMemo(
    () => Object.fromEntries(allChallenges.map((challenge) => [challenge.id, challenge])),
    [allChallenges],
  )

  const activeChallenge = useMemo(() => {
    const match = challengeIndex[progress.currentChallengeId]
    if (match && selectedChallengeIds.includes(match.id)) {
      return match
    }
    return selectedChallenges[0] || allChallenges[0] || baseChallenges[0]
  }, [challengeIndex, progress.currentChallengeId, selectedChallengeIds, selectedChallenges, allChallenges])

  const purchasedShopItems = useMemo(
    () => shopCatalog.filter((item) => normalizeShopItemIds(progress.purchasedShopItemIds).includes(item.id)),
    [progress.purchasedShopItemIds],
  )
  const selectedPot = useMemo(
    () => shopCatalog.find((item) => item.kind === 'pot' && item.id === progress.selectedPotId) || shopCatalog.find((item) => item.kind === 'pot' && item.id === 'default-pot') || null,
    [progress.selectedPotId],
  )
  const selectedBackground = useMemo(
    () => shopCatalog.find((item) => item.kind === 'background' && item.id === progress.selectedBackgroundId) || shopCatalog.find((item) => item.kind === 'background' && item.id === 'bg-default') || null,
    [progress.selectedBackgroundId],
  )
  const selectedDecor = useMemo(
    () => shopCatalog.filter((item) => item.kind === 'decor' && progress.selectedDecorIds.includes(item.id) && typeof item.asset === 'string' && item.asset.trim().length > 0),
    [progress.selectedDecorIds],
  )

  const completedCount = normalizeCompletedChallenges(progress.completedChallenges).length
  const unlockedSeedlings = useMemo(
    () => flowerCatalog.filter((seedling) => normalizeSeedlingIds(progress.unlockedSeedlingIds).includes(seedling.id)),
    [progress.unlockedSeedlingIds],
  )

  const activeSeedling = useMemo(
    () => flowerCatalog.find((seedling) => seedling.id === selectedSeedlingId) || flowerCatalog.find((seedling) => seedling.id === 'daisy') || flowerCatalog[0],
    [selectedSeedlingId],
  )

  const activePlantChoice = selectedSeedlingId

  const totalHarvestedFlowers = getTotalHarvestedFlowers(progress.dailyEntries)
  const coinBalance = Number.isFinite(progress.coinBalance) ? progress.coinBalance : Math.max(0, Math.floor(totalHarvestedFlowers / 2))
  const nextUnlockFlower = useMemo(
    () => flowerCatalog.find((seedling) => !normalizeSeedlingIds(progress.unlockedSeedlingIds).includes(seedling.id)) || null,
    [progress.unlockedSeedlingIds],
  )
  const flowersUntilNextUnlock = completedCount === 0 ? UNLOCK_EVERY : ((UNLOCK_EVERY - (completedCount % UNLOCK_EVERY)) % UNLOCK_EVERY || UNLOCK_EVERY)

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
    () => normalizeDailyEntries(progress.dailyEntries).find((entry) => entry.date === selectedDay),
    [progress.dailyEntries, selectedDay],
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_ACTIVITY_KEY, JSON.stringify(customChallenges))
  }, [customChallenges])

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(USER_KEY, playerName)
  }, [playerName])

  const handleSelectChallenge = (challengeId) => {
    const challenge = challengeIndex[challengeId]
    if (!challenge) return

    setProgress((previous) => ({
      ...previous,
      selectedChallengeIds: [challengeId],
      currentChallengeId: challengeId,
    }))
    setShowFlowerPicker(true)

    setTimer({
      minutes: challenge.minutes,
      secondsLeft: challenge.minutes * 60,
      isRunning: false,
    })
  }

  const toggleChallengeSelection = (challengeId) => {
    setProgress((previous) => ({
      ...previous,
      selectedChallengeIds: [challengeId],
      currentChallengeId: challengeId,
    }))
    setShowFlowerPicker(true)
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

  const tutorialSteps = [
    {
      title: 'Welcome to Bloom Breaker',
      body: 'Pick an activity, set a timer, and keep your progress offline while your plant grows.',
    },
    {
      title: 'Choose an activity',
      body: 'Use the activity list to select the habit you want to focus on for the day and then tap the challenge to start.',
    },
    {
      title: 'Set your timer',
      body: 'Adjust the timer length, start the countdown, and complete the habit once the time is up.',
    },
    {
      title: 'Pick the flower',
      body: 'When you choose a new activity, select the bloom you want to grow before you finish the challenge.',
    },
    {
      title: 'Harvest and journal',
      body: 'Once the flower blooms, press it to save it in your keepsake book. Every 2 pressed flowers earns 1 coin.',
    },
    {
      title: 'Unlock new blooms',
      body: 'Every 3 completed activities unlocks a new flower type. Keep growing your archive to discover more blooms.',
    },
    {
      title: 'Customize your room',
      body: 'Open Customize to buy pots, colors, and decor using coins earned from harvested flowers.',
    },
  ]

  const finishTutorial = () => {
    setShowTutorial(false)
    setTutorialStep(0)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TUTORIAL_KEY, 'seen')
    }
  }

  const handleCompleteChallenge = () => {
    if (!activeChallenge) return

    const todayKey = toDateKey()
    const alreadyLogged = normalizeCompletedChallenges(progress.completedChallenges).some(
      (entry) => entry.id === activeChallenge.id && entry.date === todayKey,
    )

    if (alreadyLogged) {
      setNotice('This activity is already logged for today.')
      return
    }

    const confirmed = window.confirm(`Mark "${activeChallenge.title}" as complete?`)
    if (!confirmed) return

    const validUnlocked = normalizeSeedlingIds(progress.unlockedSeedlingIds)
    const shouldUnlock = (completedCount + 1) % UNLOCK_EVERY === 0 && flowerCatalog.some((seedling) => !validUnlocked.includes(seedling.id))
    const nextSeedling = shouldUnlock ? getNextSeedling(validUnlocked) : null

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

      const unlockedSeedlingIds = shouldUnlock && nextSeedling
        ? normalizeSeedlingIds([...previous.unlockedSeedlingIds, nextSeedling.id])
        : normalizeSeedlingIds(previous.unlockedSeedlingIds)

      const nextChallenge = chooseNextChallenge(
        allChallenges,
        previous.selectedChallengeIds,
        [activeChallenge.id],
        updatedList.map((item) => item.id),
      )

      return {
        ...previous,
        completedChallenges: updatedList,
        unlockedSeedlingIds,
        currentChallengeId: nextChallenge.id,
        lastSeedlingId: shouldUnlock && nextSeedling ? nextSeedling.id : previous.lastSeedlingId || selectedSeedlingId,
      }
    })

    setShowFlowerPicker(false)

    if (shouldUnlock && nextSeedling) {
      setNotice(`A new ${nextSeedling.label.toLowerCase()} has unlocked!`)
    } else {
      setNotice('Challenge logged for the day.')
    }

    setTimer((previous) => ({
      ...previous,
      secondsLeft: 0,
      isRunning: false,
    }))
  }

  const handleSaveFlower = () => {
    const todayKey = toDateKey()
    const chosenSeedling = flowerCatalog.find((seedling) => seedling.id === activePlantChoice) || activeSeedling || flowerCatalog[0]
    const growthStage = getGrowthStage(timer.minutes, timer.secondsLeft, timer.isRunning)
    const plant = buildPlantForSeedling(chosenSeedling, timer.minutes || activeChallenge.minutes, todayKey, growthStage)

    const activities = normalizeCompletedChallenges(progress.completedChallenges)
      .filter((entry) => entry.date === todayKey)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        category: entry.category,
        date: entry.date,
        minutes: entry.minutes,
      }))

    if (growthStage < 3) {
      setNotice('Let the flower bloom before you harvest it.')
      return
    }

    const savedFlower = {
      id: `saved-flower-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      seedlingId: chosenSeedling.id,
      minutes: timer.minutes || activeChallenge.minutes,
      stage: 3,
      palette: chosenSeedling.palette,
    }

    setProgress((previous) => {
      const normalizedEntries = normalizeDailyEntries(previous.dailyEntries)
      const existingEntry = normalizedEntries.find((entry) => entry.date === todayKey)
      const mergedActivities = Array.isArray(existingEntry?.activities) && existingEntry.activities.length > 0
        ? existingEntry.activities
        : (activities.length > 0 ? activities : [{
            id: activeChallenge.id,
            title: activeChallenge.title,
            category: activeChallenge.category,
            date: todayKey,
            minutes: activeChallenge.minutes,
          }])

      const previousFlowerCount = getTotalHarvestedFlowers(previous.dailyEntries)
      const nextFlowerCount = previousFlowerCount + 1
      const earnedCoins = Math.floor(nextFlowerCount / 2) - Math.floor(previousFlowerCount / 2)

      const nextEntry = {
        date: todayKey,
        activities: mergedActivities,
        flowers: [
          ...(existingEntry?.flowers || []),
          savedFlower,
        ],
        plant: {
          ...plant,
          seedlingId: chosenSeedling.id,
        },
      }

      return {
        ...previous,
        coinBalance: previous.coinBalance + earnedCoins,
        lifetimeCoinsEarned: previous.lifetimeCoinsEarned + earnedCoins,
        dailyEntries: [
          ...normalizedEntries.filter((entry) => entry.date !== todayKey),
          nextEntry,
        ],
      }
    })

    setSelectedDay(todayKey)
    setTimer((previous) => ({
      ...previous,
      secondsLeft: previous.minutes * 60,
      isRunning: false,
    }))
    setNotice('Pressed flower saved to your keepsake book.')
  }

  const handleDiscardFlower = () => {
    setTimer((previous) => ({
      ...previous,
      secondsLeft: previous.minutes * 60,
      isRunning: false,
    }))
    setShowFlowerPicker(false)
    setNotice('Current flower discarded.')
  }

  const handlePurchaseItem = (item) => {
    if (item.kind === 'pot' && item.id === 'default-pot') {
      setProgress((previous) => ({ ...previous, selectedPotId: item.id }))
      setNotice('Default vase selected.')
      return
    }

    if (item.kind === 'background' && item.id === 'bg-default') {
      setProgress((previous) => ({ ...previous, selectedBackgroundId: item.id }))
      setNotice('Default background selected.')
      return
    }

    const missingCoins = Math.max(0, item.cost - coinBalance)
    if (item.cost > coinBalance) {
      const message = `Not enough coins. You need ${missingCoins} more coin${missingCoins === 1 ? '' : 's'} to buy this.`
      setNotice(message)
      window.alert(message)
      return
    }

    const confirmed = window.confirm(`Buy ${item.name} for ${item.cost} coin${item.cost === 1 ? '' : 's'}?`)
    if (!confirmed) {
      setNotice('Purchase cancelled.')
      return
    }

    if (item.kind === 'pot') {
      setProgress((previous) => ({
        ...previous,
        coinBalance: previous.coinBalance - item.cost,
        purchasedShopItemIds: normalizeShopItemIds([...previous.purchasedShopItemIds, item.id]),
        selectedPotId: item.id,
      }))
      setNotice(`${item.name} bought and placed in your room.`)
      return
    }

    if (item.kind === 'background') {
      setProgress((previous) => ({
        ...previous,
        coinBalance: previous.coinBalance - item.cost,
        purchasedShopItemIds: normalizeShopItemIds([...previous.purchasedShopItemIds, item.id]),
        selectedBackgroundId: item.id,
      }))
      setNotice(`${item.name} is now your greenhouse backdrop.`)
      return
    }

    setProgress((previous) => ({
      ...previous,
      coinBalance: previous.coinBalance - item.cost,
      purchasedShopItemIds: normalizeShopItemIds([...previous.purchasedShopItemIds, item.id]),
      selectedDecorIds: previous.selectedDecorIds.includes(item.id)
        ? previous.selectedDecorIds.filter((id) => id !== item.id)
        : [...previous.selectedDecorIds, item.id],
    }))
    setNotice(`${item.name} toggled in your room.`)
  }

  const renderPlant = (plant, options = {}) => {
    const { x = 180, y = 290, scale = 1, stage = plant.stage || 3, onHarvest } = options
    const stemProgress = stage === 0 ? 0 : stage === 1 ? 0.3 : stage === 2 ? 0.68 : 1
    const stemHeight = ((plant.stemHeight || 120) * 1.24) * stemProgress
    const stemTop = y - stemHeight * scale
    const bloomSize = (plant.bloomSize || 26) * (stage >= 3 ? 1.42 : 0.72) * scale

    return (
      <g onClick={stage >= 3 && onHarvest ? onHarvest : undefined} style={{ cursor: stage >= 3 && onHarvest ? 'pointer' : 'default' }}>
        {stage === 0 && onHarvest && (
          <g transform={`translate(${x} ${y - 12})`}>
            <ellipse rx={10 * scale} ry={12 * scale} fill="#4f3b2f" />
            <circle cx={-2 * scale} cy={-2 * scale} r={3.5 * scale} fill="#7b5d44" />
          </g>
        )}

        {stage >= 1 && (
          <path
            d={`M ${x} ${y} C ${x - 9 * scale} ${y - stemHeight * 0.5}, ${x + 8 * scale} ${stemTop + stemHeight * 0.45}, ${x} ${stemTop}`}
            stroke="#3b8f59"
            strokeWidth={Math.max(4, 5.2 * scale)}
            fill="none"
            strokeLinecap="round"
          />
        )}

        {stage >= 3 && (
          <g transform={`translate(${x} ${stemTop})`}>
            <image
              href={getFlowerAsset(plant?.seedlingId || 'daisy')}
              x={-bloomSize * 0.82}
              y={-bloomSize * 0.82}
              width={bloomSize * 1.64}
              height={bloomSize * 1.64}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        )}
      </g>
    )
  }

  const timerSeconds = timer.secondsLeft % 60
  const timerDisplay = `${String(Math.floor(timer.secondsLeft / 60)).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`
  const growthStage = getGrowthStage(timer.minutes, timer.secondsLeft, timer.isRunning)
  const plantedSeed = buildPlantForSeedling(
    flowerCatalog.find((seedling) => seedling.id === activePlantChoice) || activeSeedling || flowerCatalog[0],
    timer.minutes || activeChallenge.minutes,
    toDateKey(),
    growthStage,
  )

  return (
    <div className="app-shell">
      {showTutorial && (
        <div className="tutorial-overlay" role="dialog" aria-modal="true">
          <div className="tutorial-card">
            <div className="tutorial-header">
              <p className="section-tag">First-time guide</p>
              <button type="button" className="ghost-button" onClick={finishTutorial}>Skip</button>
            </div>

            <h3>{tutorialSteps[tutorialStep].title}</h3>
            <p>{tutorialSteps[tutorialStep].body}</p>

            <div className="tutorial-pips" aria-label="Tutorial progress">
              {tutorialSteps.map((step, index) => (
                <span key={step.title} className={index === tutorialStep ? 'tutorial-pip active' : 'tutorial-pip'} />
              ))}
            </div>

            <div className="tutorial-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  if (tutorialStep === tutorialSteps.length - 1) {
                    finishTutorial()
                    return
                  }
                  setTutorialStep((previous) => previous + 1)
                }}
              >
                {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignIn && (
        <div className="tutorial-overlay" role="dialog" aria-modal="true">
          <div className="tutorial-card sign-in-card">
            <div className="tutorial-header">
              <p className="section-tag">Player profile</p>
              <button type="button" className="ghost-button" onClick={() => setShowSignIn(false)}>Close</button>
            </div>

            <h3>Add name</h3>
            <p>Save your name locally so your garden feels a little more personal on this device.</p>

            <div className="sign-in-field">
              <label htmlFor="player-name">Name</label>
              <input
                id="player-name"
                type="text"
                value={signInDraft}
                onChange={(event) => setSignInDraft(event.target.value)}
                placeholder="Your name"
                maxLength={24}
              />
            </div>

            <div className="tutorial-actions">
              <button type="button" className="secondary-button" onClick={() => setShowSignIn(false)}>Cancel</button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  const nextName = signInDraft.trim() || 'Guest'
                  setPlayerName(nextName)
                  setSignInDraft(nextName)
                  setShowSignIn(false)
                  setNotice(nextName === 'Guest' ? 'Signed in as Guest.' : `Welcome back, ${nextName}!`)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="topbar">
        <div>
          <h1>Pressed Petals</h1>
        </div>

        <div className="topbar-actions">
          <div className="stats-strip">
            <div className="stat-pill">
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
            <div className="stat-pill">
              <span>Unlocked</span>
              <strong>{unlockedSeedlings.length}</strong>
            </div>
            <div className="stat-pill">
              <span>Coins</span>
              <strong>{coinBalance}</strong>
            </div>
          </div>
          <div className="profile-stack">
            <div className="player-badge">{playerName === 'Guest' ? 'Guest mode' : `Player: ${playerName}`}</div>
            <button type="button" className="secondary-button" onClick={() => {
              setSignInDraft(playerName === 'Guest' ? '' : playerName)
              setShowSignIn(true)
            }}>
              {playerName === 'Guest' ? 'Add name' : 'Change name'}
            </button>
          </div>
          <button type="button" className="primary-button shop-button" onClick={() => setShopOpen(true)}>Customize</button>
        </div>
      </header>

      <main className="garden-layout">
        <div className="left-column">
          <section className="panel greenhouse-panel">
            <div className="panel-header">
              <div>
                <p className="section-tag">Your greenhouse</p>
                <h2>Growing plant</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => setNotice('The plant is still growing.')}>Refresh bloom</button>
            </div>

            <div className="plant-scene" style={{ background: selectedBackground?.color || '#f7f0c5' }}>
              <svg viewBox="0 0 360 360" className="plant-svg" role="img" aria-label="Current plant growth">
                <rect x="0" y="0" width="360" height="360" rx="36" fill={selectedBackground?.color || '#f7f0c5'} />
                {selectedDecor.map((item, index) => (
                  <image key={item.id} href={item.asset} x={index === 0 ? 50 : 210} y={index === 0 ? 90 : 110} width={85} height={85} preserveAspectRatio="xMidYMid meet" opacity={0.9} />
                ))}
                <g>
                  {renderPlant(plantedSeed, {
                    x: 180,
                    y: 290,
                    scale: 1,
                    stage: growthStage,
                    onHarvest: growthStage >= 3 ? handleSaveFlower : undefined,
                  })}
                </g>
                {selectedPot && typeof selectedPot.asset === 'string' && selectedPot.asset.trim().length > 0 && (
                  <image href={selectedPot.asset} x="95" y="210" width="170" height="120" preserveAspectRatio="xMidYMid meet" opacity={0.98} />
                )}
              </svg>
            </div>

            <div className="canvas-actions">
              <button type="button" className="primary-button" onClick={handleSaveFlower}>Press flower</button>
              <button type="button" className="secondary-button" onClick={handleDiscardFlower}>Discard</button>
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
                      renderFlowerSpread(entry.flowers || [entry.plant], {
                        width: 90,
                        height: 90,
                        className: 'mini-art',
                      })
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
                  {renderFlowerSpread(selectedEntry.flowers || [selectedEntry.plant], {
                    width: 220,
                    height: 220,
                    className: 'flower-preview',
                  })}

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
                <p className="empty-copy">Choose a day to see your pressed flower and what you logged.</p>
              )}
            </div>
          </section>
        </div>

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

              <div className="timer-settings" style={{ marginTop: '12px' }}>
                <label htmlFor="timer-minutes" style={{ display: 'block', marginBottom: '8px', color: '#58725d', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Timer length
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    id="timer-minutes"
                    type="number"
                    min="5"
                    max="120"
                    value={timer.minutes}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      const safeValue = Number.isFinite(nextValue) ? Math.min(120, Math.max(5, nextValue)) : 15
                      setTimer({ minutes: safeValue, secondsLeft: safeValue * 60, isRunning: false })
                    }}
                    style={{ width: '88px', padding: '0.6rem 0.7rem', borderRadius: '10px', border: '1px solid rgba(94, 118, 94, 0.22)', background: '#fff' }}
                  />
                  <span style={{ color: '#3f4d42', fontWeight: 600 }}>minutes</span>
                </div>
              </div>

              <div className="timer-actions">
                <button type="button" className="primary-button small-button" onClick={handleTimerToggle}>
                  {timer.isRunning ? 'Pause timer' : 'Start timer'}
                </button>
                <button type="button" className="secondary-button small-button" onClick={handleResetTimer}>Reset</button>
              </div>
            </div>

            <div className="unlock-prompt">
              <span className="unlock-label">Unlock progress</span>
              <strong>
                {nextUnlockFlower ? `${nextUnlockFlower.label} unlocks in ${flowersUntilNextUnlock} more ${flowersUntilNextUnlock === 1 ? 'activity' : 'activities'}.` : 'You have unlocked every flower in the archive.'}
              </strong>
              <div className="unlock-bar-track" aria-label="Progress to next flower unlock">
                <span className="unlock-bar-fill" style={{ width: `${Math.min(100, ((completedCount % UNLOCK_EVERY) / UNLOCK_EVERY) * 100)}%` }} />
              </div>
            </div>

            <div className="coin-guide-box">
              <span>Coin rule</span>
              <strong>2 pressed flowers = 1 coin</strong>
            </div>

            <button type="button" className="primary-button full-width" onClick={handleCompleteChallenge}>Complete challenge</button>
          </section>

          {notice && <div className="notice-bar">{notice}</div>}

          {showFlowerPicker && (
            <div className="flower-picker-overlay" onClick={() => setShowFlowerPicker(false)}>
              <div className="flower-picker-modal" onClick={(event) => event.stopPropagation()}>
                <div className="panel-header compact">
                  <div>
                    <p className="section-tag">Select bloom</p>
                    <h3>Choose your flower</h3>
                  </div>
                  <button type="button" className="ghost-button" onClick={() => setShowFlowerPicker(false)}>Close</button>
                </div>

                <div className="reward-list seed-gallery">
                  {unlockedSeedlings.map((seedling) => (
                    <button
                      key={seedling.id}
                      type="button"
                      className={`reward-chip ${selectedSeedlingId === seedling.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSeedlingId(seedling.id)
                        setProgress((previous) => ({
                          ...previous,
                          lastSeedlingId: seedling.id,
                        }))
                        setShowFlowerPicker(false)
                        setNotice(`${seedling.label} will bloom for this challenge.`)
                      }}
                      aria-pressed={selectedSeedlingId === seedling.id}
                    >
                      <span className="reward-swatch" style={{ background: seedling.palette[0] }} />
                      <span className="reward-text-wrap">
                        <span>{seedling.label}</span>
                        <small>{seedling.rarity}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <section className="panel reward-card">
            <div className="panel-header compact">
              <div>
                <p className="section-tag">Choose your path</p>
                <h3>Activity list</h3>
              </div>
            </div>

            <div className="challenge-picker-list">
              {allChallenges.map((challenge) => {
                const isSelected = selectedChallengeIds.includes(challenge.id)
                return (
                  <label key={challenge.id} className={`choice-row ${isSelected ? 'selected' : ''}`}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleChallengeSelection(challenge.id)} />
                    <button type="button" className="choice-title" onClick={() => handleSelectChallenge(challenge.id)}>
                      {challenge.title}
                    </button>
                  </label>
                )
              })}
            </div>

            <div className="custom-activity-form" style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
              <input
                type="text"
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="Add custom activity"
                style={{ padding: '0.7rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(94, 118, 94, 0.2)', background: '#fff' }}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(Number(event.target.value || 20))}
                  style={{ width: '88px', padding: '0.7rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(94, 118, 94, 0.2)', background: '#fff' }}
                />
                <span style={{ color: '#3f4d42', fontWeight: 600 }}>minutes</span>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  const cleaned = customName.trim()
                  if (!cleaned) {
                    setNotice('Give your custom activity a name first.')
                    return
                  }

                  const nextMinutes = Math.min(120, Math.max(5, Number(customMinutes) || 20))
                  const newChallenge = {
                    id: `custom-${Date.now()}`,
                    title: cleaned,
                    category: 'Custom',
                    duration: `${nextMinutes} min`,
                    minutes: nextMinutes,
                    description: 'A personal habit you decided to track yourself.',
                    defaultSelected: true,
                  }

                  setCustomChallenges((previous) => [...previous, newChallenge])
                  setProgress((previous) => ({
                    ...previous,
                    selectedChallengeIds: [newChallenge.id],
                    currentChallengeId: newChallenge.id,
                  }))
                  setShowFlowerPicker(true)
                  setCustomName('')
                  setCustomMinutes(20)
                  setNotice(`Custom activity added: ${newChallenge.title}`)
                }}
              >
                Add activity
              </button>
            </div>
          </section>

          <section className="panel reward-card">
            <div className="panel-header compact">
              <div>
                <p className="section-tag">Progress</p>
                <h3>Unlocked seedlings</h3>
              </div>
            </div>

            <div className="unlock-summary">
              <span className="unlock-summary-label">Next unlock</span>
              <strong>{nextUnlockFlower ? `${nextUnlockFlower.label} in ${flowersUntilNextUnlock} activities` : 'Archive complete'}</strong>
            </div>

            <div className="reward-list seed-gallery">
              {unlockedSeedlings.length === 0 ? (
                <p className="empty-copy">Finish your first activity to unlock a seedling.</p>
              ) : (
                unlockedSeedlings.map((seedling) => (
                  <div
                    key={seedling.id}
                    className={`reward-chip ${selectedSeedlingId === seedling.id ? 'selected' : ''}`}
                    aria-pressed={selectedSeedlingId === seedling.id}
                  >
                    <img src={getFlowerAsset(seedling.id)} alt={seedling.label} className="archive-flower-icon" />
                    <span className="reward-text-wrap">
                      <span>{seedling.label}</span>
                      <small>{seedling.rarity}</small>
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel history-card">
            <p className="section-tag">Recent wins</p>
            <h3>Completed challenge log</h3>

            {history.length === 0 ? (
              <p className="empty-copy">No completed activities yet. Your first pressed bloom starts here.</p>
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

      {shopOpen && (
        <div className="shop-overlay" onClick={() => setShopOpen(false)}>
          <div className="shop-modal" onClick={(event) => event.stopPropagation()}>
            <div className="shop-modal-header">
              <div>
                <p className="section-tag">Garden shop</p>
                <h3>Owned items & decor</h3>
              </div>
              <button type="button" className="ghost-button" onClick={() => setShopOpen(false)}>Close</button>
            </div>

            <div className="shop-balance-bar">
              <div className="shop-balance-box">
                <span>Current coins</span>
                <strong>{coinBalance}</strong>
              </div>
              <div className="shop-balance-box">
                <span>Lifetime earned</span>
                <strong>{progress.lifetimeCoinsEarned ?? 0}</strong>
              </div>
            </div>

            <div className="shop-modal-body">
              <div className="shop-section">
                <h4>Items owned</h4>
                <div className="shop-grid owned-grid">
                  {purchasedShopItems.length === 0 ? (
                    <p className="empty-copy">You have not bought anything yet. Harvest flowers to earn coins.</p>
                  ) : (
                    purchasedShopItems.map((item) => (
                      <div key={item.id} className="shop-item owned-preview">
                        {item.kind === 'background' ? (
                          <span className="swatch-preview" style={{ background: item.color || '#dfeecf' }} />
                        ) : (
                          <img src={item.asset} alt={item.name} />
                        )}
                        <span>{item.name}</span>
                        <small>{item.kind === 'pot' ? 'Pot' : item.kind === 'background' ? 'Background' : 'Decor'}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="shop-section">
                <h4>Unlocked flowers</h4>
                <div className="reward-list seed-gallery">
                  {unlockedSeedlings.map((seedling) => (
                    <div key={seedling.id} className={`reward-chip ${selectedSeedlingId === seedling.id ? 'selected' : ''}`}>
                      <span className="reward-swatch" style={{ background: seedling.palette[0] }} />
                      <span className="reward-text-wrap">
                        <span>{seedling.label}</span>
                        <small>{seedling.rarity}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shop-section">
                <h4>Buy more</h4>
                <div className="shop-grid">
                  {shopCatalog.filter((item) => item.kind === 'pot').map((item) => {
                    const owned = purchasedShopItems.some((ownedItem) => ownedItem.id === item.id)
                    const isSelected = progress.selectedPotId === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`shop-item ${owned ? 'owned' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (!owned) {
                            handlePurchaseItem(item)
                            return
                          }
                          setProgress((previous) => ({ ...previous, selectedPotId: item.id }))
                          setNotice(`${item.name} is now in your room.`)
                        }}
                      >
                        <img src={item.asset} alt={item.name} />
                        <span>{item.name}</span>
                        <small>{owned ? (isSelected ? 'Selected' : 'Owned') : `${item.cost} coin${item.cost === 1 ? '' : 's'}`}</small>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="shop-section">
                <h4>Greenhouse colors</h4>
                <div className="shop-grid">
                  {shopCatalog.filter((item) => item.kind === 'background').map((item) => {
                    const owned = purchasedShopItems.some((ownedItem) => ownedItem.id === item.id)
                    const isSelected = progress.selectedBackgroundId === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`shop-item ${owned ? 'owned' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (!owned) {
                            handlePurchaseItem(item)
                            return
                          }
                          setProgress((previous) => ({ ...previous, selectedBackgroundId: item.id }))
                          setNotice(`${item.name} is now your greenhouse color.`)
                        }}
                      >
                        <span className="swatch-preview" style={{ background: item.color }} />
                        <span>{item.name}</span>
                        <small>{owned ? (isSelected ? 'Selected' : 'Owned') : `${item.cost} coin${item.cost === 1 ? '' : 's'}`}</small>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="shop-section">
                <h4>Decor</h4>
                <div className="shop-grid">
                  {shopCatalog.filter((item) => item.kind === 'decor').map((item) => {
                    const owned = purchasedShopItems.some((ownedItem) => ownedItem.id === item.id)
                    const isSelected = progress.selectedDecorIds.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`shop-item ${owned ? 'owned' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (!owned) {
                            handlePurchaseItem(item)
                            return
                          }

                          setProgress((previous) => ({
                            ...previous,
                            selectedDecorIds: previous.selectedDecorIds.includes(item.id)
                              ? previous.selectedDecorIds.filter((id) => id !== item.id)
                              : [...previous.selectedDecorIds, item.id],
                          }))
                          setNotice(`${item.name} ${isSelected ? 'removed from' : 'added to'} your room.`)
                        }}
                      >
                        <img src={item.asset} alt={item.name} />
                        <span>{item.name}</span>
                        <small>{owned ? (isSelected ? 'On display' : 'Owned') : `${item.cost} coin${item.cost === 1 ? '' : 's'}`}</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
