export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeocodingResult {
  coordinates: Coordinates
  placeName: string
}

const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places'

/**
 * Geocode an address to coordinates using Mapbox Geocoding API
 */
export async function geocodeAddress(
  address: string,
  accessToken: string
): Promise<GeocodingResult | null> {
  if (!address || !accessToken) {
    return null
  }

  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `${MAPBOX_API_URL}/${encodedAddress}.json?access_token=${accessToken}&limit=1`
    )

    if (!response.ok) {
      console.error('Geocoding request failed:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      return {
        coordinates: {
          longitude: feature.center[0],
          latitude: feature.center[1],
        },
        placeName: feature.place_name,
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Reverse geocode coordinates to an address
 */
export async function reverseGeocode(
  coordinates: Coordinates,
  accessToken: string
): Promise<string | null> {
  if (!accessToken) {
    return null
  }

  try {
    const response = await fetch(
      `${MAPBOX_API_URL}/${coordinates.longitude},${coordinates.latitude}.json?access_token=${accessToken}&limit=1`
    )

    if (!response.ok) {
      console.error('Reverse geocoding request failed:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name
    }

    return null
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

/**
 * Get Mapbox access token from environment
 */
export function getMapboxToken(): string {
  return import.meta.env.VITE_MAPBOX_TOKEN || ''
}
