export type AchievementCategory = 'trips' | 'budget' | 'planning' | 'exploration'
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface AchievementCondition {
  type: 'trips_created' | 'countries_visited' | 'days_advance' | 'packing_lists_complete' |
        'streak_days' | 'activities_planned' | 'expenses_tracked' | 'accommodations_booked' |
        'trips_under_budget'
  value: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  points: number
  rarity: AchievementRarity
  condition: AchievementCondition
}

export const achievements: Achievement[] = [
  // Trips Category
  {
    id: 'first_trip',
    title: 'Erste Schritte',
    description: 'Erstelle deine erste Reise',
    icon: 'Plane',
    category: 'trips',
    points: 100,
    rarity: 'common',
    condition: { type: 'trips_created', value: 1 }
  },
  {
    id: 'explorer',
    title: 'Entdecker',
    description: 'Erstelle 5 Reisen',
    icon: 'Map',
    category: 'trips',
    points: 200,
    rarity: 'common',
    condition: { type: 'trips_created', value: 5 }
  },
  {
    id: 'globetrotter',
    title: 'Globetrotter',
    description: 'Erstelle 20 Reisen',
    icon: 'Globe',
    category: 'trips',
    points: 750,
    rarity: 'rare',
    condition: { type: 'trips_created', value: 20 }
  },
  {
    id: 'world_traveler',
    title: 'Weltreisender',
    description: 'Besuche 10 verschiedene Länder',
    icon: 'Earth',
    category: 'exploration',
    points: 1000,
    rarity: 'epic',
    condition: { type: 'countries_visited', value: 10 }
  },

  // Budget Category
  {
    id: 'budget_tracker',
    title: 'Budget-Beobachter',
    description: 'Erfasse 20 Ausgaben',
    icon: 'Receipt',
    category: 'budget',
    points: 200,
    rarity: 'common',
    condition: { type: 'expenses_tracked', value: 20 }
  },
  {
    id: 'money_manager',
    title: 'Finanzprofi',
    description: 'Erfasse 50 Ausgaben',
    icon: 'PiggyBank',
    category: 'budget',
    points: 400,
    rarity: 'uncommon',
    condition: { type: 'expenses_tracked', value: 50 }
  },
  {
    id: 'budget_master',
    title: 'Budget-Meister',
    description: 'Beende 3 Reisen unter Budget',
    icon: 'TrendingDown',
    category: 'budget',
    points: 500,
    rarity: 'rare',
    condition: { type: 'trips_under_budget', value: 3 }
  },

  // Planning Category
  {
    id: 'early_planner',
    title: 'Vorausplaner',
    description: 'Plane eine Reise 30+ Tage im Voraus',
    icon: 'CalendarCheck',
    category: 'planning',
    points: 250,
    rarity: 'uncommon',
    condition: { type: 'days_advance', value: 30 }
  },
  {
    id: 'packing_pro',
    title: 'Pack-Profi',
    description: 'Vervollständige 5 Packlisten',
    icon: 'CheckSquare',
    category: 'planning',
    points: 300,
    rarity: 'uncommon',
    condition: { type: 'packing_lists_complete', value: 5 }
  },
  {
    id: 'activity_king',
    title: 'Aktivitäten-König',
    description: 'Plane 50 Aktivitäten',
    icon: 'ListTodo',
    category: 'planning',
    points: 300,
    rarity: 'uncommon',
    condition: { type: 'activities_planned', value: 50 }
  },
  {
    id: 'detail_oriented',
    title: 'Detailverliebt',
    description: 'Plane 100 Aktivitäten',
    icon: 'ClipboardList',
    category: 'planning',
    points: 600,
    rarity: 'rare',
    condition: { type: 'activities_planned', value: 100 }
  },

  // Streak & Exploration
  {
    id: 'streak_starter',
    title: 'Streak-Starter',
    description: 'Erreiche einen 3-Tage-Streak',
    icon: 'Flame',
    category: 'exploration',
    points: 150,
    rarity: 'common',
    condition: { type: 'streak_days', value: 3 }
  },
  {
    id: 'dedicated_planner',
    title: 'Engagierter Planer',
    description: 'Erreiche einen 7-Tage-Streak',
    icon: 'Zap',
    category: 'exploration',
    points: 400,
    rarity: 'uncommon',
    condition: { type: 'streak_days', value: 7 }
  },
  {
    id: 'first_accommodation',
    title: 'Erste Unterkunft',
    description: 'Buche deine erste Unterkunft',
    icon: 'Home',
    category: 'planning',
    points: 100,
    rarity: 'common',
    condition: { type: 'accommodations_booked', value: 1 }
  },
  {
    id: 'hotel_hopper',
    title: 'Hotel-Hopper',
    description: 'Buche 10 Unterkünfte',
    icon: 'Building2',
    category: 'planning',
    points: 350,
    rarity: 'uncommon',
    condition: { type: 'accommodations_booked', value: 10 }
  }
]

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id)
}

export const getAchievementsByCategory = (category: AchievementCategory): Achievement[] => {
  return achievements.filter(a => a.category === category)
}

export const getAchievementsByRarity = (rarity: AchievementRarity): Achievement[] => {
  return achievements.filter(a => a.rarity === rarity)
}

export const rarityColors: Record<AchievementRarity, string> = {
  common: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  uncommon: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  rare: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  epic: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  legendary: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30'
}

export const rarityLabels: Record<AchievementRarity, string> = {
  common: 'Gewöhnlich',
  uncommon: 'Ungewöhnlich',
  rare: 'Selten',
  epic: 'Episch',
  legendary: 'Legendär'
}
