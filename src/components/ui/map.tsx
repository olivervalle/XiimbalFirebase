import { useEffect, useRef } from "react";

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}

export function Map({ lat, lng, zoom = 15, className = "" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
      });
    };

    // If Google Maps API is already loaded
    if (window.google?.maps) {
      initializeMap();
    } else {
      // If not loaded, set up callback and load script
      window.initMap = initializeMap;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        // Clean up
        window.initMap = undefined;
        document.head.removeChild(script);
      };
    }
  }, [lat, lng, zoom]);

  // Update map center if lat/lng props change
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setCenter({ lat, lng });

      // Update marker position
      const markers = mapInstanceRef.current.markers || [];
      if (markers.length > 0) {
        markers[0].setPosition({ lat, lng });
      }
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className={`h-64 w-full rounded-md bg-muted ${className}`}
      aria-label="Map showing business location"
    />
  );
}
