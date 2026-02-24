"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { destinations, type Destination } from "@/lib/destinations";
import {
  getWeatherForLocation,
  meetsAllCriteria,
  type WeatherData,
  type WeatherCondition,
  weatherConditionLabels,
} from "@/lib/weather";
import {
  calculateDistance,
  estimateDriveTime,
  CURRENT_GAS_PRICE,
  FUEL_EFFICIENCY_MPG,
} from "@/lib/distance";
import { geocodeZipCode } from "@/lib/geocoding";
import { fetchCurrentGasPrice } from "@/lib/gasPrice";
import { LODGING_SITES, FLIGHT_SITES, CAR_RENTAL_SITES } from "@/lib/bookingSites";
import DestinationCard from "@/components/DestinationCard";
import Logo from "@/components/Logo";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";

// Dynamic import for map to avoid SSR issues
const MapView = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-zinc-100 animate-pulse" />
  ),
});

interface DestinationWithData extends Destination {
  weather: WeatherData | null;
  driveTime: number;
  distance: number;
}

// LocalStorage key for favorites
const FAVORITES_STORAGE_KEY = "warmroad_favorites";
const PREFERENCES_STORAGE_KEY = "warmroad_preferences";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<
    Record<string, WeatherData | null>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [maxDriveHours, setMaxDriveHours] = useState<8 | 10 | 12 | 15>(8);
  const [zipCode, setZipCode] = useState("");
  const [isGeocodingZip, setIsGeocodingZip] = useState(false);

  // New state for enhanced filtering
  const [tempRange, setTempRange] = useState<[number, number]>([60, 90]);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>("any");
  const [showSettings, setShowSettings] = useState(false);

  // Custom MPG and gas price
  const [customMpg, setCustomMpg] = useState<number>(FUEL_EFFICIENCY_MPG);
  const [gasPrice, setGasPrice] = useState<number>(CURRENT_GAS_PRICE);
  const [gasPriceSource, setGasPriceSource] = useState<string>("default");

  // Mobile view toggle
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Favorites state
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // User preferences for booking sites
  const [preferredLodgingSite, setPreferredLodgingSite] = useState<string>("expedia");
  const [preferredFlightSite, setPreferredFlightSite] = useState<string>("google_flights");
  const [preferredCarRentalSite, setPreferredCarRentalSite] = useState<string>("kayak_cars");

  // Load favorites and preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(new Set(parsed));
        }
      }
      // Load preferences
      const prefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (prefs) {
        const parsedPrefs = JSON.parse(prefs);
        if (parsedPrefs.preferredLodgingSite) {
          setPreferredLodgingSite(parsedPrefs.preferredLodgingSite);
        }
        if (parsedPrefs.preferredFlightSite) {
          setPreferredFlightSite(parsedPrefs.preferredFlightSite);
        }
        if (parsedPrefs.preferredCarRentalSite) {
          setPreferredCarRentalSite(parsedPrefs.preferredCarRentalSite);
        }
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    }
  }, []);

  // Load favorites from URL on mount (for shared links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedFavorites = params.get("favorites");
    if (sharedFavorites) {
      const ids = sharedFavorites.split(",").filter(Boolean);
      if (ids.length > 0) {
        setFavorites(new Set(ids));
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
    } catch (e) {
      console.error("Failed to save favorites to localStorage:", e);
    }
  }, [favorites]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
        preferredLodgingSite,
        preferredFlightSite,
        preferredCarRentalSite,
      }));
    } catch (e) {
      console.error("Failed to save preferences to localStorage:", e);
    }
  }, [preferredLodgingSite, preferredFlightSite, preferredCarRentalSite]);

  // Toggle favorite handler
  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  // Export favorites as shareable link
  const handleExportFavorites = useCallback(() => {
    if (favorites.size === 0) {
      alert("No favorites to share!");
      return;
    }
    const favoriteIds = [...favorites].join(",");
    const shareUrl = `${window.location.origin}${window.location.pathname}?favorites=${encodeURIComponent(favoriteIds)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Share link copied to clipboard!");
      }).catch(() => {
        prompt("Copy this link to share your favorites:", shareUrl);
      });
    } else {
      prompt("Copy this link to share your favorites:", shareUrl);
    }
  }, [favorites]);

  // Fetch current gas price on mount
  useEffect(() => {
    fetchCurrentGasPrice().then((data) => {
      setGasPrice(data.price);
      setGasPriceSource(data.source);
    });
  }, []);

  // Request user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationName("Your location");
        setIsLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        // Default to center of US if location denied
        setUserLocation({ lat: 39.8283, lon: -98.5795 });
        setLocationName("Central US");
        setLocationError(
          "Location access denied. Enter a zip code or showing from central US."
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  }, []);

  // Handle zip code submission
  const handleZipCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length < 5) return;

    setIsGeocodingZip(true);
    setLocationError(null);

    const result = await geocodeZipCode(zipCode.trim());

    if (result) {
      setUserLocation({ lat: result.lat, lon: result.lon });
      setLocationName(`${result.name}${result.state ? `, ${result.state}` : ""}`);
      setWeatherData({}); // Clear existing weather data
      setLoadingWeather(true);
    } else {
      setLocationError("Could not find that zip code. Please try again.");
    }

    setIsGeocodingZip(false);
  };

  // Calculate destinations with drive times
  const destinationsWithDistance = useMemo(() => {
    if (!userLocation) return [];

    return destinations
      .map((dest) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          dest.lat,
          dest.lon
        );
        const driveTime = estimateDriveTime(distance);
        return {
          ...dest,
          distance,
          driveTime,
          weather: weatherData[dest.id] || null,
        };
      })
      .filter((dest) => dest.driveTime <= maxDriveHours)
      .sort((a, b) => a.driveTime - b.driveTime);
  }, [userLocation, weatherData, maxDriveHours]);

  // Get current filter config from slider values
  const currentFilter = useMemo(
    () => ({
      min: tempRange[0],
      max: tempRange[1],
      label: `${tempRange[0]}°F - ${tempRange[1]}°F`,
    }),
    [tempRange]
  );

  // Filter destinations based on temperature AND weather condition criteria
  // Filter destinations and sort with favorites at top
  const filteredDestinations = useMemo(() => {
    let filtered = destinationsWithDistance.filter((dest) =>
      meetsAllCriteria(dest.weather, currentFilter.min, currentFilter.max, weatherCondition)
    );

    if (showFavoritesOnly) {
      filtered = filtered.filter((dest) => favorites.has(dest.id));
    }

    return filtered.sort((a, b) => {
      const aIsFav = favorites.has(a.id);
      const bIsFav = favorites.has(b.id);
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      return a.driveTime - b.driveTime;
    });
  }, [destinationsWithDistance, currentFilter, weatherCondition, showFavoritesOnly, favorites]);

  // Fetch weather data for destinations within range
  useEffect(() => {
    if (!userLocation || destinationsWithDistance.length === 0) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      const newWeatherData: Record<string, WeatherData | null> = {};

      // Fetch in batches to avoid rate limiting
      const batchSize = 5;
      for (let i = 0; i < destinationsWithDistance.length; i += batchSize) {
        const batch = destinationsWithDistance.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map((dest) => getWeatherForLocation(dest.lat, dest.lon))
        );

        batch.forEach((dest, idx) => {
          newWeatherData[dest.id] = results[idx];
        });

        // Small delay between batches
        if (i + batchSize < destinationsWithDistance.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      setWeatherData((prev) => ({ ...prev, ...newWeatherData }));
      setLoadingWeather(false);
    };

    fetchWeather();
  }, [userLocation, destinationsWithDistance.length]);

  const handleSelectDestination = useCallback((id: string) => {
    setSelectedDestination((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-4 md:px-6 py-3 md:py-4 border-b border-zinc-100">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Top row - Logo and basic controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Logo className="w-10 h-10 md:w-12 md:h-12" />
              <div>
                <h1
                  className="text-lg md:text-xl font-semibold tracking-wide text-zinc-900"
                  style={{ fontFamily: "var(--font-jost), Futura, sans-serif" }}
                >
                  WARM ROAD
                </h1>
                <p className="text-[10px] md:text-xs text-zinc-500">
                  Find your ideal weather within driving distance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zip Code Input */}
              <form
                onSubmit={handleZipCodeSubmit}
                className="flex items-center gap-1 md:gap-2"
              >
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) =>
                    setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  placeholder="Zip"
                  className="w-16 md:w-24 px-2 py-1.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  maxLength={5}
                />
                <button
                  type="submit"
                  disabled={zipCode.length < 5 || isGeocodingZip}
                  className="px-2 md:px-3 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeocodingZip ? "..." : "Go"}
                </button>
              </form>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="px-2 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors"
                aria-label="Settings"
              >
                <span className="hidden md:inline">⚙️ Settings</span>
                <span className="md:hidden">⚙️</span>
              </button>
            </div>
          </div>

          {/* Second row - Temperature and Drive Time side by side */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Temperature Filter Slider */}
            <div className="flex items-center bg-zinc-100 rounded-full px-3 py-1.5">
              <span className="text-[10px] md:text-xs text-zinc-500 mr-2">Temp:</span>
              <Slider
                min={0}
                max={100}
                step={1}
                value={tempRange}
                onValueChange={(val: [number, number]) => setTempRange(val)}
                className="w-20 md:w-32"
              />
              <span className="ml-2 text-[10px] md:text-xs font-medium text-zinc-900 whitespace-nowrap">
                {currentFilter.label}
              </span>
            </div>

            {/* Drive Time Toggle */}
            <div className="flex items-center gap-0.5 bg-zinc-100 rounded-full px-3 py-0.5">
              <span className="text-[10px] md:text-xs text-zinc-500 mr-1">Drive Time:</span>
              {[8, 10, 12, 15].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setMaxDriveHours(hours as 8 | 10 | 12 | 15)}
                  className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all ${
                    maxDriveHours === hours
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {hours}hr
                </button>
              ))}
            </div>

            {/* Favorites Filter Toggle */}
            <button
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all ${
                showFavoritesOnly
                  ? "bg-red-100 text-red-600"
                  : "bg-zinc-100 text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <svg
                className="w-3 h-3"
                fill={showFavoritesOnly ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="hidden sm:inline">
                Favorites{favorites.size > 0 ? ` (${favorites.size})` : ""}
              </span>
              <span className="sm:hidden">
                {favorites.size > 0 ? favorites.size : ""}
              </span>
            </button>

            {/* Export/Share Favorites Button */}
            {favorites.size > 0 && (
              <button
                onClick={handleExportFavorites}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] md:text-xs font-medium bg-zinc-100 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 rounded-full transition-all"
                title="Share favorites"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            {locationName && (
              <div className="text-[10px] md:text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full hidden sm:block">
                From: {locationName}
              </div>
            )}

            {locationError && (
              <div className="text-[10px] md:text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {locationError}
              </div>
            )}
          </div>

          {/* Third row - Weather Condition Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] md:text-xs text-zinc-500">Weather:</span>
            <div className="flex items-center bg-zinc-100 rounded-full p-0.5 flex-wrap">
              {Object.entries(weatherConditionLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setWeatherCondition(key as WeatherCondition)}
                  className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                    weatherCondition === key
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-zinc-200 rounded-lg shadow-lg p-4 md:p-6 w-[300px] md:w-[340px]">
          <h2 className="text-base md:text-lg font-semibold mb-4">Trip Settings</h2>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-1">Fuel Efficiency (MPG):</label>
            <input
              type="number"
              min={10}
              max={60}
              step={1}
              value={customMpg}
              onChange={(e) => setCustomMpg(Number(e.target.value))}
              className="w-24 px-2 py-1 border border-zinc-200 rounded-lg text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-1">Gas Price ($/gal):</label>
            <input
              type="number"
              min={1}
              max={10}
              step={0.01}
              value={gasPrice}
              onChange={(e) => setGasPrice(Number(e.target.value))}
              className="w-24 px-2 py-1 border border-zinc-200 rounded-lg text-sm"
            />
            <div className="text-xs text-zinc-400 mt-1">
              {gasPriceSource === "default"
                ? "Default value"
                : `Source: ${gasPriceSource}`}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-1">Preferred Lodging Site:</label>
            <select
              value={preferredLodgingSite}
              onChange={(e) => setPreferredLodgingSite(e.target.value)}
              className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-sm"
            >
              {LODGING_SITES.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-1">Preferred Flight Site:</label>
            <select
              value={preferredFlightSite}
              onChange={(e) => setPreferredFlightSite(e.target.value)}
              className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-sm"
            >
              {FLIGHT_SITES.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-1">Preferred Car Rental:</label>
            <select
              value={preferredCarRentalSite}
              onChange={(e) => setPreferredCarRentalSite(e.target.value)}
              className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-sm"
            >
              {CAR_RENTAL_SITES.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-2 px-3 py-1.5 text-xs font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Mobile View Toggle */}
      <div className="md:hidden flex border-b border-zinc-100">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === "list"
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-500"
          }`}
        >
          List ({filteredDestinations.length})
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobileView === "map"
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-500"
          }`}
        >
          Map
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on mobile when map view is active */}
        <aside className={`${mobileView === "map" ? "hidden" : "flex"} md:flex w-full md:w-[380px] lg:w-[420px] shrink-0 border-r border-zinc-100 flex-col bg-white`}>
          {/* Destinations list */}
          <ScrollArea className="flex-1">
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 md:h-32 w-full rounded-lg" />
                ))
              ) : filteredDestinations.length === 0 && !loadingWeather ? (
                <div className="text-center py-8 md:py-12 px-4 md:px-6">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">{showFavoritesOnly ? "❤️" : "🌡️"}</div>
                  <h3 className="font-medium text-zinc-900 mb-2 text-sm md:text-base">
                    {showFavoritesOnly ? "No favorites yet" : "No matching destinations found"}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
                    {showFavoritesOnly
                      ? "Click the heart icon on destinations to add them to your favorites."
                      : `No destinations within ${maxDriveHours} hours match your filters. Try adjusting temperature or weather.`}
                  </p>
                </div>
              ) : (
                filteredDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    id={dest.id}
                    name={dest.name}
                    state={dest.state}
                    description={dest.description}
                    weather={dest.weather}
                    driveTime={dest.driveTime}
                    distance={dest.distance}
                    tempFilter={currentFilter}
                    weatherCondition={weatherCondition}
                    isSelected={selectedDestination === dest.id}
                    onSelect={() => handleSelectDestination(dest.id)}
                    mpg={customMpg}
                    gasPrice={gasPrice}
                    isFavorite={favorites.has(dest.id)}
                    onToggleFavorite={() => handleToggleFavorite(dest.id)}
                    preferredLodgingSite={preferredLodgingSite}
                    preferredFlightSite={preferredFlightSite}
                    preferredCarRentalSite={preferredCarRentalSite}
                  />
                ))
              )}

              {loadingWeather && !isLoading && (
                <div className="text-center py-6 md:py-8">
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm text-zinc-500">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    Loading weather data...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer with Privacy Link */}
          <div className="shrink-0 px-4 py-2 border-t border-zinc-100 bg-zinc-50/50">
            <Link
              href="/privacy"
              className="text-[10px] md:text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </aside>

        {/* Map - hidden on mobile when list view is active */}
        <main className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-1 relative`}>
          <MapView
            userLocation={userLocation}
            destinations={destinationsWithDistance.map((d) => ({
              id: d.id,
              name: d.name,
              state: d.state,
              lat: d.lat,
              lon: d.lon,
              maxTemp: d.weather?.maxTemp,
              meetsFilter: meetsAllCriteria(
                d.weather,
                currentFilter.min,
                currentFilter.max,
                weatherCondition
              ),
            }))}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            filterLabel={currentFilter.label}
            weatherCondition={weatherCondition}
            isVisible={mobileView === "map"}
          />

          {/* Map legend - smaller on mobile */}
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-3 text-[10px] md:text-xs">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500 ring-2 ring-white" />
                <span className="text-zinc-600">Matches</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-zinc-400 ring-2 ring-white" />
                <span className="text-zinc-600">Outside</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 hidden sm:flex">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-zinc-900 ring-2 ring-white" />
                <span className="text-zinc-600">You</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
