"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Destination {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  maxTemp?: number;
  meetsFilter?: boolean;
}

interface MapProps {
  userLocation: { lat: number; lon: number } | null;
  destinations: Destination[];
  selectedDestination: string | null;
  onSelectDestination: (id: string) => void;
  filterLabel: string;
  weatherCondition?: string;
  isVisible?: boolean;
}

export default function MapView({
  userLocation,
  destinations,
  selectedDestination,
  onSelectDestination,
  filterLabel,
  weatherCondition,
  isVisible = true,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<globalThis.Map<string, L.CircleMarker>>(new globalThis.Map());
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Invalidate map size when visibility changes (fixes mobile view toggle)
  useEffect(() => {
    if (isVisible && mapRef.current && isMapReady) {
      // Small delay to ensure the container is fully rendered
      const timer = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isMapReady]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current && isMapReady) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMapReady]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    // Minimal grayscale tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      }
    ).addTo(map);

    // Add attribution in corner
    L.control
      .attribution({
        position: "bottomright",
        prefix: false,
      })
      .addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation || !isMapReady) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lon]);
    } else {
      userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lon], {
        radius: 10,
        fillColor: "#0a0a0a",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      })
        .addTo(mapRef.current)
        .bindPopup("You are here");
    }

    mapRef.current.setView([userLocation.lat, userLocation.lon], 6);
  }, [userLocation, isMapReady]);

  // Update destination markers
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;
    const existingMarkers = markersRef.current;

    // Remove markers that are no longer in destinations
    const currentIds = new Set(destinations.map((d) => d.id));
    existingMarkers.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Add or update markers
    destinations.forEach((dest) => {
      const isSelected = dest.id === selectedDestination;
      const meetsFilter = dest.meetsFilter === true;

      const markerOptions: L.CircleMarkerOptions = {
        radius: isSelected ? 12 : 8,
        fillColor: meetsFilter ? "#f97316" : "#94a3b8",
        color: isSelected ? "#0a0a0a" : "#ffffff",
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillOpacity: 0.9,
      };

      if (existingMarkers.has(dest.id)) {
        const marker = existingMarkers.get(dest.id)!;
        marker.setLatLng([dest.lat, dest.lon]);
        marker.setStyle(markerOptions);
      } else {
        const marker = L.circleMarker([dest.lat, dest.lon], markerOptions)
          .addTo(map)
          .on("click", () => onSelectDestination(dest.id));

        const tempText = dest.maxTemp !== undefined ? `${dest.maxTemp}°F today` : "Loading...";
        const filterStatus = meetsFilter ? `${filterLabel} this week` : "Outside range";
        marker.bindTooltip(
          `<strong>${dest.name}, ${dest.state}</strong><br/>${tempText}<br/><em>${filterStatus}</em>`,
          { direction: "top", offset: [0, -10] }
        );

        existingMarkers.set(dest.id, marker);
      }
    });
  }, [destinations, selectedDestination, onSelectDestination, isMapReady, filterLabel]);

  // Pan to selected destination
  useEffect(() => {
    if (!mapRef.current || !selectedDestination || !isMapReady) return;

    const dest = destinations.find((d) => d.id === selectedDestination);
    if (dest) {
      mapRef.current.setView([dest.lat, dest.lon], 8, { animate: true });
    }
  }, [selectedDestination, destinations, isMapReady]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[400px] bg-zinc-100"
      style={{ zIndex: 0 }}
    />
  );
}
