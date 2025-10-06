import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import type { Courier } from '@shared/schema';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

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

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

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

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom]);

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
