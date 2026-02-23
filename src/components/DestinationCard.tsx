"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WeatherData, WeatherCondition } from "@/lib/weather";
import { getWeatherCategory } from "@/lib/weather";
import { formatDriveTime, calculateFuelCost, formatFuelCost } from "@/lib/distance";

interface TempFilterConfig {
  min: number | null;
  max: number | null;
  label: string;
}

interface DestinationCardProps {
  id: string;
  name: string;
  state: string;
  description: string;
  weather: WeatherData | null;
  driveTime: number;
  distance: number;
  tempFilter: TempFilterConfig;
  weatherCondition: WeatherCondition;
  isSelected: boolean;
  onSelect: () => void;
  mpg: number;
  gasPrice: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  preferredLodgingSite: string;
  preferredFlightSite: string;
  preferredCarRentalSite: string;
}

export default function DestinationCard({
  name,
  state,
  description,
  weather,
  driveTime,
  distance,
  tempFilter,
  weatherCondition,
  isSelected,
  onSelect,
  mpg,
  gasPrice,
  isFavorite,
  onToggleFavorite,
  preferredLodgingSite,
  preferredFlightSite,
  preferredCarRentalSite,
}: DestinationCardProps) {
  const [showForecast, setShowForecast] = useState(false);

  // Calculate round-trip fuel cost with custom MPG and gas price
  const fuelCost = calculateFuelCost(distance, gasPrice, mpg);

  // Find the warmest day for check-in date suggestion
  const warmestDay = weather?.forecast?.reduce((warmest, day) => {
    if (!warmest) return day;
    return day.maxTemp > warmest.maxTemp ? day : warmest;
  }, weather?.forecast?.[0]);

  // Generate check-in and check-out dates based on warmest day
  const getDateParams = () => {
    if (!warmestDay?.date) return { checkIn: "", checkOut: "" };
    const checkInDate = new Date(warmestDay.date);
    const checkOutDate = new Date(warmestDay.date);
    checkOutDate.setDate(checkOutDate.getDate() + 2); // 2 night stay
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    return { checkIn: formatDate(checkInDate), checkOut: formatDate(checkOutDate) };
  };
  const { checkIn, checkOut } = getDateParams();

  // Estimated price range based on city (mock data - would come from API in production)
  const getEstimatedPriceRange = () => {
    const cityLower = name.toLowerCase();
    if (cityLower.includes("vegas") || cityLower.includes("miami") || cityLower.includes("san francisco")) {
      return { min: 150, max: 350, label: "$150-350/night" };
    } else if (cityLower.includes("austin") || cityLower.includes("denver") || cityLower.includes("san diego")) {
      return { min: 120, max: 280, label: "$120-280/night" };
    } else if (cityLower.includes("tucson") || cityLower.includes("phoenix") || cityLower.includes("albuquerque")) {
      return { min: 90, max: 200, label: "$90-200/night" };
    }
    return { min: 80, max: 180, label: "$80-180/night" };
  };
  const priceRange = getEstimatedPriceRange();

  // Lodging booking site URLs with dates
  const cityQuery = encodeURIComponent(`${name}, ${state}`);
  const cityOnly = encodeURIComponent(name);
  const stateOnly = encodeURIComponent(state);
  const lodgingSites = [
    {
      id: "expedia",
      name: "Expedia",
      url: `https://www.expedia.com/Hotel-Search?destination=${cityQuery}&latLong=&regionId=&startDate=${checkIn || ""}&endDate=${checkOut || ""}&rooms=1&adults=2`,
      icon: "🏨",
    },
    {
      id: "hotels",
      name: "Hotels.com",
      url: `https://www.hotels.com/Hotel-Search?destination=${cityQuery}&startDate=${checkIn || ""}&endDate=${checkOut || ""}&rooms=1&adults=2`,
      icon: "🏢",
    },

    {
      id: "booking",
      name: "Booking.com",
      url: `https://www.booking.com/searchresults.html?ss=${cityQuery}&checkin=${checkIn || ""}&checkout=${checkOut || ""}&group_adults=2&no_rooms=1`,
      icon: "📘",
    },
    {
      id: "vrbo",
      name: "VRBO",
      url: `https://www.vrbo.com/search?destination=${cityQuery}&startDate=${checkIn || ""}&endDate=${checkOut || ""}&adults=2`,
      icon: "🏠",
    },
    {
      id: "airbnb",
      name: "Airbnb",
      url: `https://www.airbnb.com/s/${cityOnly}--${stateOnly}--United-States/homes?checkin=${checkIn || ""}&checkout=${checkOut || ""}&adults=2`,
      icon: "🏡",
    },
    {
      id: "kayak",
      name: "Kayak",
      url: `https://www.kayak.com/hotels/${name.replace(/\s+/g, "-")},${state.replace(/\s+/g, "-")},United-States/${checkIn || ""}/${checkOut || ""}/2guests`,
      icon: "🔍",
    },
    {
      id: "trivago",
      name: "Trivago",
      url: `https://www.trivago.com/en-US/srl/hotels-${cityOnly}-${stateOnly}?search=${cityQuery}`,
      icon: "🏷️",
    },
    {
      id: "google",
      name: "Google Hotels",
      url: `https://www.google.com/travel/search?q=hotels+in+${cityOnly}+${stateOnly}&ts=CAESCgoCCAMKAggDEAAaMAoSEg4KB${checkIn ? `&dates=${checkIn}+to+${checkOut}` : ""}`,
      icon: "🔵",
    },
  ];

  // Flight booking sites
  const flightSites = [
    {
      id: "google_flights",
      name: "Google Flights",
      url: `https://www.google.com/travel/flights?q=flights+to+${cityQuery}`,
      icon: "✈️",
    },
    {
      id: "kayak_flights",
      name: "Kayak",
      url: `https://www.kayak.com/flights?destination=${cityQuery}`,
      icon: "🔍",
    },
    {
      id: "expedia_flights",
      name: "Expedia",
      url: `https://www.expedia.com/Flights?destination=${cityQuery}`,
      icon: "🏨",
    },
    {
      id: "skyscanner",
      name: "Skyscanner",
      url: `https://www.skyscanner.com/transport/flights/anywhere/${cityQuery}`,
      icon: "🌐",
    },
    {
      id: "southwest",
      name: "Southwest",
      url: `https://www.southwest.com/air/booking/`,
      icon: "❤️",
    },
    {
      id: "united",
      name: "United",
      url: `https://www.united.com/en/us/fsr/choose-flights`,
      icon: "🌐",
    },
    {
      id: "delta",
      name: "Delta",
      url: `https://www.delta.com/flight-search/book-a-flight`,
      icon: "🔺",
    },
    {
      id: "american",
      name: "American",
      url: `https://www.aa.com/booking/find-flights`,
      icon: "🦅",
    },
  ];

  // Car rental sites
  const carRentalSites = [
    {
      id: "kayak_cars",
      name: "Kayak",
      url: "https://www.kayak.com/cars",
      icon: "🔍",
    },
    {
      id: "expedia_cars",
      name: "Expedia",
      url: "https://www.expedia.com/Cars",
      icon: "🏨",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      url: "https://www.enterprise.com/en/car-rental.html",
      icon: "🚗",
    },
    {
      id: "hertz",
      name: "Hertz",
      url: "https://www.hertz.com/rentacar/reservation/",
      icon: "⭐",
    },
    {
      id: "avis",
      name: "Avis",
      url: "https://www.avis.com/en/reserve",
      icon: "🔴",
    },
    {
      id: "budget",
      name: "Budget",
      url: "https://www.budget.com/en/reserve",
      icon: "🟠",
    },
    {
      id: "national",
      name: "National",
      url: "https://www.nationalcar.com/en/car-rental.html",
      icon: "🟢",
    },
    {
      id: "turo",
      name: "Turo",
      url: "https://turo.com/",
      icon: "🚙",
    },
    {
      id: "sixt",
      name: "Sixt",
      url: "https://www.sixt.com/",
      icon: "🟧",
    },
  ];

  // Sort sites to show preferred first
  const sortedLodgingSites = [...lodgingSites].sort((a, b) => {
    if (a.id === preferredLodgingSite) return -1;
    if (b.id === preferredLodgingSite) return 1;
    return 0;
  });

  const sortedFlightSites = [...flightSites].sort((a, b) => {
    if (a.id === preferredFlightSite) return -1;
    if (b.id === preferredFlightSite) return 1;
    return 0;
  });

  const sortedCarRentalSites = [...carRentalSites].sort((a, b) => {
    if (a.id === preferredCarRentalSite) return -1;
    if (b.id === preferredCarRentalSite) return 1;
    return 0;
  });

  const tripAdvisorUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(
    `${name}, ${state}`
  )}`;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${name}, ${state}`
  )}`;

  const handleToggleForecast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowForecast(!showForecast);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  // Check if a day meets the filter criteria (temp + weather condition)
  const dayMeetsFilter = (maxTemp: number, weatherCode: number) => {
    const meetsMin = tempFilter.min === null || maxTemp >= tempFilter.min;
    const meetsMax = tempFilter.max === null || maxTemp <= tempFilter.max;
    const meetsCondition = weatherCondition === "any" || getWeatherCategory(weatherCode) === weatherCondition;
    return meetsMin && meetsMax && meetsCondition;
  };

  // Find days that match the filter and count them
  const matchingDaysCount = weather?.forecast?.filter(d => dayMeetsFilter(d.maxTemp, d.weatherCode)).length || 0;

  return (
    <Card
      className={`group relative cursor-pointer overflow-hidden transition-all duration-300 border-0 bg-zinc-50 hover:bg-white hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-zinc-900 shadow-lg bg-white"
          : "hover:ring-1 hover:ring-zinc-300"
      }`}
      onClick={onSelect}
    >
      <div className="p-5">
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 z-10 ${
            isFavorite
              ? "bg-red-100 text-red-500 hover:bg-red-200"
              : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className="w-4 h-4"
            fill={isFavorite ? "currentColor" : "none"}
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
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-zinc-900 tracking-tight truncate pr-8">
              {name}
            </h3>
            <p className="text-sm text-zinc-500 font-medium">{state}</p>
          </div>

          {weather && warmestDay && (
            <div className="flex flex-col items-end shrink-0 mr-6">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-light text-zinc-900">
                  {warmestDay.maxTemp}°
                </span>
              </div>
              <span className="text-xs text-zinc-400 mt-0.5">
                Warmest: {warmestDay.dayName}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 leading-relaxed mb-3">
          {description}
        </p>

        {/* Matching days indicator */}
        {matchingDaysCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-xs">
              {matchingDaysCount} day{matchingDaysCount !== 1 ? "s" : ""} {tempFilter.label}
            </Badge>
          </div>
        )}

        {/* 7-Day Forecast Toggle */}
        {weather && weather.forecast && (
          <button
            onClick={handleToggleForecast}
            className="w-full mb-4 text-left"
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-700 transition-colors">
              <span className="font-medium">7-Day Forecast</span>
              <svg
                className={`w-4 h-4 transition-transform ${showForecast ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* 7-Day Forecast Display */}
        {showForecast && weather && weather.forecast && (
          <div className="mb-4 p-3 bg-zinc-100/80 rounded-lg">
            <div className="grid grid-cols-7 gap-1">
              {weather.forecast.map((day) => {
                const meetsFilter = dayMeetsFilter(day.maxTemp, day.weatherCode);
                const isWarmest = warmestDay && day.date === warmestDay.date;
                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center text-center p-1 rounded ${
                      meetsFilter ? "bg-orange-100" : ""
                    } ${isWarmest ? "ring-2 ring-orange-400" : ""}`}
                  >
                    <span className="text-[10px] font-medium text-zinc-500 mb-1">
                      {day.dayName}
                    </span>
                    <span className="text-sm">{day.icon}</span>
                    <span className={`text-xs font-semibold mt-1 ${
                      meetsFilter ? "text-orange-600" : "text-zinc-900"
                    }`}>
                      {day.maxTemp}°
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {day.minTemp}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 font-normal text-xs px-2.5 py-1"
            >
              {formatDriveTime(driveTime)} drive
            </Badge>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-normal text-xs px-2.5 py-1"
            >
              {formatFuelCost(fuelCost)} fuel
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-normal text-xs px-2.5 py-1"
            >
              {priceRange.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Directions
            </a>

            <a
              href={tripAdvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors"
            >
              Activities
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors outline-none"
              >
                Lodging
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-white border border-zinc-200 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {sortedLodgingSites.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 rounded-md cursor-pointer transition-colors ${
                        site.id === preferredLodgingSite ? "text-orange-600 bg-orange-50" : "text-zinc-700"
                      }`}
                    >
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredLodgingSite && (
                        <span className="text-orange-500 text-xs">★</span>
                      )}
                      <svg
                        className="w-3 h-3 ml-auto text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-orange-600 transition-colors outline-none"
              >
                Flights
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-white border border-zinc-200 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {sortedFlightSites.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 rounded-md cursor-pointer transition-colors ${
                        site.id === preferredFlightSite ? "text-orange-600 bg-orange-50" : "text-zinc-700"
                      }`}
                    >
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredFlightSite && (
                        <span className="text-orange-500 text-xs">★</span>
                      )}
                      <svg
                        className="w-3 h-3 ml-auto text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors outline-none"
              >
                Cars
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-white border border-zinc-200 shadow-lg rounded-lg p-1 max-h-64 overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {sortedCarRentalSites.map((site) => (
                  <DropdownMenuItem key={site.id} asChild>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 text-sm hover:text-orange-600 hover:bg-zinc-50 rounded-md cursor-pointer transition-colors ${
                        site.id === preferredCarRentalSite ? "text-orange-600 bg-orange-50" : "text-zinc-700"
                      }`}
                    >
                      <span className="text-base">{site.icon}</span>
                      {site.name}
                      {site.id === preferredCarRentalSite && (
                        <span className="text-orange-500 text-xs">★</span>
                      )}
                      <svg
                        className="w-3 h-3 ml-auto text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {matchingDaysCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500" />
      )}
    </Card>
  );
}
