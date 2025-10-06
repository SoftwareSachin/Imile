import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import type { Courier } from '@shared/schema';

interface DeliveryMapProps {
  couriers?: Courier[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  onCourierClick?: (courier: Courier) => void;
}

export default function DeliveryMap({ 
  couriers = [], 
  height = 'h-96',
  center = [-122.4194, 37.7749],
  zoom = 12,
  onCourierClick
}: DeliveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(config => {
        if (config.mapboxToken) {
          mapboxgl.accessToken = config.mapboxToken;
          setTokenLoaded(true);
        } else {
          setMapError('Mapbox token not configured');
        }
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        setMapError('Failed to load map configuration');
      });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current || !tokenLoaded) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Map failed to load. Please check your connection or browser compatibility.');
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Interactive map unavailable. WebGL support required.');
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom, tokenLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const existingMarkerIds = new Set(markers.current.keys());
    const currentCourierIds = new Set(couriers.map(c => c.id));

    markers.current.forEach((marker, id) => {
      if (!currentCourierIds.has(id)) {
        marker.remove();
        markers.current.delete(id);
      }
    });

    couriers.forEach(courier => {
      const existingMarker = markers.current.get(courier.id);

      if (existingMarker) {
        existingMarker.setLngLat([courier.lng, courier.lat]);
        
        const element = existingMarker.getElement();
        element.className = courier.status === 'active' 
          ? 'courier-marker courier-marker-active'
          : 'courier-marker courier-marker-idle';
      } else {
        const el = document.createElement('div');
        el.className = courier.status === 'active' 
          ? 'courier-marker courier-marker-active'
          : 'courier-marker courier-marker-idle';
        
        el.innerHTML = `
          <div class="relative">
            <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
              courier.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
            }">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            ${courier.status === 'active' ? '<div class="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>' : ''}
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3">
            <p class="font-semibold text-sm mb-1">${courier.name}</p>
            <p class="text-xs text-gray-600 capitalize mb-1">${courier.status}</p>
            <p class="text-xs text-gray-500">${courier.location}</p>
            <div class="mt-2 pt-2 border-t border-gray-200">
              <p class="text-xs"><span class="font-medium">Active Deliveries:</span> ${courier.activeDeliveries}</p>
              <p class="text-xs"><span class="font-medium">Performance:</span> ${courier.performanceScore}%</p>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom'
        })
          .setLngLat([courier.lng, courier.lat])
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (onCourierClick) {
            onCourierClick(courier);
          }
        });

        el.addEventListener('mouseenter', () => {
          marker.togglePopup();
        });

        el.addEventListener('mouseleave', () => {
          marker.togglePopup();
        });

        markers.current.set(courier.id, marker);
      }
    });

    if (couriers.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      couriers.forEach(courier => {
        bounds.extend([courier.lng, courier.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [couriers, mapLoaded, onCourierClick]);

  if (mapError) {
    return (
      <Card className="overflow-hidden" data-testid="delivery-map">
        <div className={`${height} flex items-center justify-center bg-muted/50`}>
          <div className="text-center p-6 max-w-md">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-2">{mapError}</p>
            {couriers.length > 0 && (
              <div className="mt-4 text-left">
                <p className="text-xs text-muted-foreground mb-2">Active Couriers:</p>
                {couriers.slice(0, 3).map(courier => (
                  <div key={courier.id} className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs">
                      <p className="font-medium">{courier.name}</p>
                      <p className="text-muted-foreground">{courier.location}</p>
                    </div>
                  </div>
                ))}
                {couriers.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{couriers.length - 3} more couriers
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <style>{`
        .courier-marker {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .courier-marker:hover {
          transform: scale(1.1);
        }
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .mapboxgl-popup-tip {
          display: none;
        }
      `}</style>
      <Card className="overflow-hidden" data-testid="delivery-map">
        <div ref={mapContainer} className={height} />
      </Card>
    </>
  );
}
