export interface Level {
  level: number
  title: string
  minPoints: number
  icon: string
  color: string
}

export const levels: Level[] = [
  {
    level: 1,
    title: 'Anfaenger',
    minPoints: 0,
    icon: 'Sprout',
    color: 'text-green-500'
  },
  {
    level: 2,
    title: 'Entdecker',
    minPoints: 500,
    icon: 'Compass',
    color: 'text-blue-500'
  },
  {
    level: 3,
    title: 'Abenteurer',
    minPoints: 1500,
    icon: 'Mountain',
    color: 'text-orange-500'
  },
  {
    level: 4,
    title: 'Globetrotter',
    minPoints: 4000,
    icon: 'Globe',
    color: 'text-purple-500'
  },
  {
    level: 5,
    title: 'Reise-Meister',
    minPoints: 10000,
    icon: 'Crown',
    color: 'text-amber-500'
  }
]

export const getLevelByPoints = (points: number): Level => {
  // Find the highest level the user qualifies for
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].minPoints) {
      return levels[i]
    }
  }
  return levels[0]
}

export const getLevelByNumber = (levelNumber: number): Level | undefined => {
  return levels.find(l => l.level === levelNumber)
}

export const getNextLevel = (currentLevel: number): Level | null => {
  const nextLevelNumber = currentLevel + 1
  return levels.find(l => l.level === nextLevelNumber) || null
}

export const getProgressToNextLevel = (points: number): { current: number; required: number; percentage: number } => {
  const currentLevel = getLevelByPoints(points)
  const nextLevel = getNextLevel(currentLevel.level)

  if (!nextLevel) {
    // Max level reached
    return {
      current: points - currentLevel.minPoints,
      required: 0,
      percentage: 100
    }
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints
  const pointsRequiredForNextLevel = nextLevel.minPoints - currentLevel.minPoints
  const percentage = Math.min(100, Math.round((pointsInCurrentLevel / pointsRequiredForNextLevel) * 100))

  return {
    current: pointsInCurrentLevel,
    required: pointsRequiredForNextLevel,
    percentage
  }
}
