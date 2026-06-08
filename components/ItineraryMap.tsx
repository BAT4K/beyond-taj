import React, { useEffect, useRef } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface ItineraryMapProps {
  destinations: Destination[];
}

const theme = {
  bg: "#0a0806",
  gold: "#c9a96e",
  cream: "#f5f0e8",
  darker: "#12100e",
  border: "#2a241e",
};

export default function ItineraryMap({ destinations }: ItineraryMapProps) {
  const mapRef = useRef<MapRef>(null);

  const fitMapToBounds = () => {
    if (destinations.length > 0 && mapRef.current) {
      const selectedCoords = destinations.filter(d => d.latitude && d.longitude);
      
      if (selectedCoords.length > 0) {
        let minLng = selectedCoords[0]!.longitude;
        let maxLng = selectedCoords[0]!.longitude;
        let minLat = selectedCoords[0]!.latitude;
        let maxLat = selectedCoords[0]!.latitude;

        for (const dest of selectedCoords) {
          if (dest.longitude < minLng) minLng = dest.longitude;
          if (dest.longitude > maxLng) maxLng = dest.longitude;
          if (dest.latitude < minLat) minLat = dest.latitude;
          if (dest.latitude > maxLat) maxLat = dest.latitude;
        }

        if (minLng !== maxLng || minLat !== maxLat) {
          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat]
            ],
            { padding: 100, duration: 1500 }
          );
        } else {
          // Single destination case
          mapRef.current.flyTo({
            center: [minLng, minLat],
            zoom: 10,
            duration: 1500
          });
        }
      }
    }
  };

  useEffect(() => {
    fitMapToBounds();
  }, [destinations]);

  return (
    <div className="w-full h-full">
      <Map
        ref={mapRef}
        onLoad={fitMapToBounds}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{ longitude: 78.9629, latitude: 20.5937, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {destinations.length > 1 && (
          <Source id="route" type="geojson" data={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: destinations.filter(d => d.longitude && d.latitude).map(dest => [dest.longitude, dest.latitude]) as number[][]
            }
          }}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#c9a96e',
                'line-width': 2,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}
        {destinations.map(dest => (
          dest.latitude && dest.longitude ? (
            <Marker key={dest.id} longitude={dest.longitude} latitude={dest.latitude}>
              <div className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(201,169,110,0.8)] border border-white/50" style={{ backgroundColor: theme.gold }} />
            </Marker>
          ) : null
        ))}
      </Map>
    </div>
  );
}
