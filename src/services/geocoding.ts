/**
 * Geocoding Service using Nominatim (OpenStreetMap)
 * Free service with rate limiting (1 request/second)
 */

interface GeocodingResult {
  lat: number
  lng: number
}

interface NominatimSearchResult {
  lat: string
  lon: string
  display_name: string
  place_id: number
}

interface NominatimReverseResult {
  display_name: string
  address: {
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    country?: string
  }
}

// Rate limiting: Track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests

/**
 * Wait for rate limit if needed
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }

  lastRequestTime = Date.now()
}

/**
 * Geocode an address to coordinates
 * @param address - The address to geocode
 * @returns Coordinates or null if not found
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim().length === 0) {
    return null
  }

  try {
    await waitForRateLimit()

    const encodedAddress = encodeURIComponent(address.trim())
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Reiseplaner-App/1.0',
        'Accept-Language': 'de,en',
      },
    })

    if (!response.ok) {
      console.error('Geocoding request failed:', response.status)
      return null
    }

    const results: NominatimSearchResult[] = await response.json()

    if (results.length === 0) {
      return null
    }

    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Reverse geocode coordinates to an address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Address string or null if not found
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    await waitForRateLimit()

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Reiseplaner-App/1.0',
        'Accept-Language': 'de,en',
      },
    })

    if (!response.ok) {
      console.error('Reverse geocoding request failed:', response.status)
      return null
    }

    const result: NominatimReverseResult = await response.json()

    if (!result.display_name) {
      return null
    }

    return result.display_name
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

/**
 * Geocode multiple addresses with rate limiting
 * @param addresses - Array of addresses to geocode
 * @returns Array of results (some may be null)
 */
export async function geocodeAddresses(
  addresses: string[]
): Promise<(GeocodingResult | null)[]> {
  const results: (GeocodingResult | null)[] = []

  for (const address of addresses) {
    const result = await geocodeAddress(address)
    results.push(result)
  }

  return results
}

/**
 * Search for a location by name and return multiple results
 * @param query - Search query
 * @param limit - Maximum number of results (default: 5)
 * @returns Array of search results
 */
export async function searchLocation(
  query: string,
  limit: number = 5
): Promise<Array<{ lat: number; lng: number; displayName: string }>> {
  if (!query || query.trim().length === 0) {
    return []
  }

  try {
    await waitForRateLimit()

    const encodedQuery = encodeURIComponent(query.trim())
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=${limit}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Reiseplaner-App/1.0',
        'Accept-Language': 'de,en',
      },
    })

    if (!response.ok) {
      console.error('Location search request failed:', response.status)
      return []
    }

    const results: NominatimSearchResult[] = await response.json()

    return results.map(result => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    }))
  } catch (error) {
    console.error('Location search error:', error)
    return []
  }
}
