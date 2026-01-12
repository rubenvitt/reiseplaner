import { useMemo, useState, useEffect } from 'react'
import { useTripStore, useAccommodationStore, useTransportStore, useItineraryStore } from '@/stores'
import { geocodeAddress, getMapboxToken, type Coordinates } from '@/lib/geocoding'

export interface MapLocation {
  id: string
  type: 'destination' | 'accommodation' | 'transport_origin' | 'transport_destination' | 'activity'
  name: string
  address?: string
  coordinates?: Coordinates
  details?: Record<string, unknown>
}

interface UseMapLocationsOptions {
  tripId: string
  autoGeocode?: boolean
}

export function useMapLocations({ tripId, autoGeocode = false }: UseMapLocationsOptions) {
  // Use raw state and filter in useMemo to avoid selector issues
  const trips = useTripStore((state) => state.trips)
  const allAccommodations = useAccommodationStore((state) => state.accommodations)
  const allTransports = useTransportStore((state) => state.transports)
  const allDayPlans = useItineraryStore((state) => state.dayPlans)

  // Memoize filtered data
  const trip = useMemo(() => trips.find((t) => t.id === tripId), [trips, tripId])
  const accommodations = useMemo(
    () => allAccommodations.filter((a) => a.tripId === tripId),
    [allAccommodations, tripId]
  )
  const transports = useMemo(
    () => allTransports.filter((t) => t.tripId === tripId),
    [allTransports, tripId]
  )
  const dayPlans = useMemo(
    () => allDayPlans.filter((dp) => dp.tripId === tripId),
    [allDayPlans, tripId]
  )

  const [geocodedLocations, setGeocodedLocations] = useState<Map<string, Coordinates>>(new Map())
  const [isGeocoding, setIsGeocoding] = useState(false)

  // Collect all raw locations
  const rawLocations = useMemo<MapLocation[]>(() => {
    const locations: MapLocation[] = []

    // Add destinations
    if (trip) {
      trip.destinations.forEach((dest) => {
        locations.push({
          id: `dest-${dest.id}`,
          type: 'destination',
          name: dest.name,
          address: `${dest.name}, ${dest.country}`,
          details: {
            country: dest.country,
            arrivalDate: dest.arrivalDate,
            departureDate: dest.departureDate,
          },
        })
      })
    }

    // Add accommodations
    accommodations.forEach((acc) => {
      locations.push({
        id: `acc-${acc.id}`,
        type: 'accommodation',
        name: acc.name,
        address: acc.address,
        details: {
          type: acc.type,
          checkIn: acc.checkIn,
          checkOut: acc.checkOut,
        },
      })
    })

    // Add transport locations
    transports.forEach((t) => {
      if (t.origin.address || t.origin.name) {
        locations.push({
          id: `transport-origin-${t.id}`,
          type: 'transport_origin',
          name: `Start: ${t.origin.name}`,
          address: t.origin.address || t.origin.name,
          details: {
            mode: t.mode,
            departureDate: t.departureDate,
            departureTime: t.departureTime,
          },
        })
      }
      if (t.destination.address || t.destination.name) {
        locations.push({
          id: `transport-dest-${t.id}`,
          type: 'transport_destination',
          name: `Ziel: ${t.destination.name}`,
          address: t.destination.address || t.destination.name,
          details: {
            mode: t.mode,
            arrivalDate: t.arrivalDate,
            arrivalTime: t.arrivalTime,
          },
        })
      }
    })

    // Add activities with locations
    dayPlans.forEach((dp) => {
      dp.activities.forEach((activity) => {
        if (activity.location) {
          locations.push({
            id: `activity-${activity.id}`,
            type: 'activity',
            name: activity.title,
            address: activity.location,
            details: {
              category: activity.category,
              date: dp.date,
              startTime: activity.startTime,
              endTime: activity.endTime,
            },
          })
        }
      })
    })

    return locations
  }, [trip, accommodations, transports, dayPlans])

  // Geocode locations if autoGeocode is enabled
  useEffect(() => {
    if (!autoGeocode) return

    const token = getMapboxToken()
    if (!token) return

    setGeocodedLocations((currentGeocoded) => {
      const locationsToGeocode = rawLocations.filter(
        (loc) => loc.address && !currentGeocoded.has(loc.id)
      )

      if (locationsToGeocode.length === 0) return currentGeocoded

      setIsGeocoding(true)

      const geocodeAll = async () => {
        const newCoordinates = new Map(currentGeocoded)

        for (const location of locationsToGeocode) {
          if (location.address) {
            const result = await geocodeAddress(location.address, token)
            if (result) {
              newCoordinates.set(location.id, result.coordinates)
            }
            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        }

        setGeocodedLocations(newCoordinates)
        setIsGeocoding(false)
      }

      geocodeAll()
      return currentGeocoded
    })
  }, [rawLocations, autoGeocode])

  // Combine raw locations with geocoded coordinates
  const locations = useMemo<MapLocation[]>(() => {
    return rawLocations.map((loc) => ({
      ...loc,
      coordinates: geocodedLocations.get(loc.id) || loc.coordinates,
    }))
  }, [rawLocations, geocodedLocations])

  // Filter locations with valid coordinates
  const locationsWithCoordinates = useMemo(() => {
    return locations.filter((loc) => loc.coordinates)
  }, [locations])

  // Calculate map bounds
  const bounds = useMemo(() => {
    if (locationsWithCoordinates.length === 0) return null

    let minLat = 90
    let maxLat = -90
    let minLng = 180
    let maxLng = -180

    locationsWithCoordinates.forEach((loc) => {
      if (loc.coordinates) {
        minLat = Math.min(minLat, loc.coordinates.latitude)
        maxLat = Math.max(maxLat, loc.coordinates.latitude)
        minLng = Math.min(minLng, loc.coordinates.longitude)
        maxLng = Math.max(maxLng, loc.coordinates.longitude)
      }
    })

    return {
      sw: { latitude: minLat, longitude: minLng },
      ne: { latitude: maxLat, longitude: maxLng },
    }
  }, [locationsWithCoordinates])

  return {
    locations,
    locationsWithCoordinates,
    bounds,
    isGeocoding,
    setGeocodedLocation: (id: string, coords: Coordinates) => {
      setGeocodedLocations((prev) => new Map(prev).set(id, coords))
    },
  }
}
