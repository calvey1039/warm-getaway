// Geocoding utility for zip code to coordinates

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
  state?: string;
}

export async function geocodeZipCode(zipCode: string): Promise<GeocodingResult | null> {
  try {
    // Using Open-Meteo's geocoding API which is free
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(zipCode)}&count=1&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      // Try using a US zip code specific approach
      // Fallback to Nominatim for zip codes
      return await geocodeWithNominatim(zipCode);
    }

    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      state: result.admin1,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

async function geocodeWithNominatim(zipCode: string): Promise<GeocodingResult | null> {
  try {
    // Using Nominatim (OpenStreetMap) as fallback for US zip codes
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zipCode)}&country=US&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WarmRoad App'
      }
    });
    if (!response.ok) return null;

    const data = await response.json();

    if (!data || data.length === 0) return null;

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name?.split(',')[0] || zipCode,
      state: result.display_name?.split(',')[1]?.trim(),
    };
  } catch (error) {
    console.error("Nominatim geocoding error:", error);
    return null;
  }
}
