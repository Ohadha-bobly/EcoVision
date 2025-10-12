import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Project } from "@shared/schema";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

// Fix default marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom green marker icon
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface InteractiveMapProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  center?: [number, number];
  zoom?: number;
}

function LayerControls() {
  const map = useMap();
  const [layers, setLayers] = useState({
    satellite: false,
    weather: false,
  });

  useEffect(() => {
    let satelliteLayer: L.TileLayer | null = null;
    let weatherLayer: L.TileLayer | null = null;

    if (layers.satellite) {
      // NASA GIBS Satellite imagery (MODIS Terra)
      satelliteLayer = L.tileLayer(
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}/{z}/{y}/{x}.jpg",
        {
          attribution: "NASA EOSDIS GIBS",
          time: new Date().toISOString().split("T")[0],
          tilematrixset: "GoogleMapsCompatible_Level9",
          maxZoom: 9,
          opacity: 0.7,
        }
      ).addTo(map);
    }

    if (layers.weather) {
      // OpenWeatherMap weather layer
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (apiKey) {
        weatherLayer = L.tileLayer(
          `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
          {
            attribution: "OpenWeatherMap",
            maxZoom: 19,
            opacity: 0.6,
          }
        ).addTo(map);
      }
    }

    return () => {
      if (satelliteLayer) map.removeLayer(satelliteLayer);
      if (weatherLayer) map.removeLayer(weatherLayer);
    };
  }, [layers, map]);

  return (
    <Card className="absolute top-4 right-4 z-[1000] p-4 space-y-3 bg-background/95 backdrop-blur-sm">
      <div className="text-sm font-semibold mb-2">Map Layers</div>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="satellite-toggle" className="text-sm cursor-pointer">
          Satellite
        </Label>
        <Switch
          id="satellite-toggle"
          checked={layers.satellite}
          onCheckedChange={(checked) => setLayers({ ...layers, satellite: checked })}
          data-testid="switch-satellite"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="weather-toggle" className="text-sm cursor-pointer">
          Weather
        </Label>
        <Switch
          id="weather-toggle"
          checked={layers.weather}
          onCheckedChange={(checked) => setLayers({ ...layers, weather: checked })}
          data-testid="switch-weather"
        />
      </div>
    </Card>
  );
}

export function InteractiveMap({
  projects,
  onProjectClick,
  center = [20, 0],
  zoom = 2,
}: InteractiveMapProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full" data-testid="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayerControls />

        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[Number(project.latitude), Number(project.longitude)]}
            icon={greenIcon}
            eventHandlers={{
              click: () => onProjectClick(project),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{project.location}</p>
                <Button
                  size="sm"
                  onClick={() => onProjectClick(project)}
                  data-testid={`button-popup-details-${project.id}`}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
