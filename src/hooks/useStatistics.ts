import { useMemo } from 'react'
import { useTripStore, useBudgetStore, useItineraryStore, useAccommodationStore, useTransportStore } from '@/stores'
import type { ExpenseCategory } from '@/types'

export interface TripStatistics {
  totalTrips: number
  completedTrips: number
  upcomingTrips: number
  ongoingTrips: number
  planningTrips: number
  totalDays: number
  uniqueCountries: string[]
  uniqueDestinations: string[]
}

export interface BudgetStatistics {
  totalSpent: number
  totalBudget: number
  budgetUtilization: number
  averagePerTrip: number
  averagePerDay: number
  byCategory: Record<ExpenseCategory, number>
  byCurrency: Record<string, number>
}

export interface ActivityStatistics {
  totalActivities: number
  completedActivities: number
  byCategory: Record<string, number>
}

export interface AccommodationStatistics {
  totalAccommodations: number
  totalNights: number
  totalSpent: number
  averagePerNight: number
  byType: Record<string, number>
}

export interface TransportStatistics {
  totalTransports: number
  totalSpent: number
  byMode: Record<string, number>
}

export interface Statistics {
  trips: TripStatistics
  budget: BudgetStatistics
  activities: ActivityStatistics
  accommodations: AccommodationStatistics
  transports: TransportStatistics
}

function daysBetween(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export function useStatistics(): Statistics {
  const trips = useTripStore((state) => state.trips)
  const expenses = useBudgetStore((state) => state.expenses)
  const dayPlans = useItineraryStore((state) => state.dayPlans)
  const accommodations = useAccommodationStore((state) => state.accommodations)
  const transports = useTransportStore((state) => state.transports)

  return useMemo(() => {
    // Trip Statistics
    const tripStats: TripStatistics = {
      totalTrips: trips.length,
      completedTrips: trips.filter((t) => t.status === 'completed').length,
      upcomingTrips: trips.filter((t) => t.status === 'upcoming').length,
      ongoingTrips: trips.filter((t) => t.status === 'ongoing').length,
      planningTrips: trips.filter((t) => t.status === 'planning').length,
      totalDays: trips.reduce((acc, t) => acc + daysBetween(t.startDate, t.endDate), 0),
      uniqueCountries: [...new Set(trips.flatMap((t) => t.destinations.map((d) => d.country)))],
      uniqueDestinations: [...new Set(trips.flatMap((t) => t.destinations.map((d) => d.name)))],
    }

    // Budget Statistics
    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0)
    const totalBudget = trips.reduce((acc, t) => acc + t.totalBudget, 0)
    const byCategory = expenses.reduce(
      (acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
      },
      {} as Record<ExpenseCategory, number>
    )
    const byCurrency = expenses.reduce(
      (acc, e) => {
        acc[e.currency] = (acc[e.currency] || 0) + e.amount
        return acc
      },
      {} as Record<string, number>
    )

    const budgetStats: BudgetStatistics = {
      totalSpent,
      totalBudget,
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      averagePerTrip: trips.length > 0 ? totalSpent / trips.length : 0,
      averagePerDay: tripStats.totalDays > 0 ? totalSpent / tripStats.totalDays : 0,
      byCategory,
      byCurrency,
    }

    // Activity Statistics
    const allActivities = dayPlans.flatMap((dp) => dp.activities)
    const byActivityCategory = allActivities.reduce(
      (acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const activityStats: ActivityStatistics = {
      totalActivities: allActivities.length,
      completedActivities: allActivities.filter((a) => a.isCompleted).length,
      byCategory: byActivityCategory,
    }

    // Accommodation Statistics
    const totalAccommodationSpent = accommodations.reduce((acc, a) => acc + a.price, 0)
    const totalNights = accommodations.reduce((acc, a) => acc + daysBetween(a.checkIn, a.checkOut), 0)
    const byType = accommodations.reduce(
      (acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const accommodationStats: AccommodationStatistics = {
      totalAccommodations: accommodations.length,
      totalNights,
      totalSpent: totalAccommodationSpent,
      averagePerNight: totalNights > 0 ? totalAccommodationSpent / totalNights : 0,
      byType,
    }

    // Transport Statistics
    const totalTransportSpent = transports.reduce((acc, t) => acc + (t.price || 0), 0)
    const byMode = transports.reduce(
      (acc, t) => {
        acc[t.mode] = (acc[t.mode] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const transportStats: TransportStatistics = {
      totalTransports: transports.length,
      totalSpent: totalTransportSpent,
      byMode,
    }

    return {
      trips: tripStats,
      budget: budgetStats,
      activities: activityStats,
      accommodations: accommodationStats,
      transports: transportStats,
    }
  }, [trips, expenses, dayPlans, accommodations, transports])
}
