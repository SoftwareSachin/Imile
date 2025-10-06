import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

interface CourierMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle';
}

interface DeliveryMapProps {
  couriers?: CourierMarker[];
  height?: string;
}

export default function DeliveryMap({ couriers = [], height = 'h-96' }: DeliveryMapProps) {
  return (
    <Card className="overflow-hidden relative">
      <div 
        className={`${height} bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative`}
        data-testid="delivery-map"
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">San Francisco, CA</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-sm border hover-elevate" data-testid="button-zoom-in">
            <span className="text-sm font-bold">+</span>
          </button>
          <button className="bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-sm border hover-elevate" data-testid="button-zoom-out">
            <span className="text-sm font-bold">−</span>
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5">
            {couriers.map((courier, index) => {
              const positions = [
                { top: '20%', left: '30%' },
                { top: '40%', left: '60%' },
                { top: '60%', left: '25%' },
                { top: '35%', left: '70%' },
                { top: '70%', left: '50%' },
              ];
              const position = positions[index % positions.length];
              
              return (
                <div
                  key={courier.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ top: position.top, left: position.left }}
                  data-testid={`marker-courier-${courier.id}`}
                >
                  <div className={`relative ${courier.status === 'active' ? 'animate-pulse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      courier.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    {courier.status === 'active' && (
                      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                    )}
                  </div>
                  
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-background border shadow-lg rounded-md px-3 py-2 whitespace-nowrap">
                      <p className="font-medium text-sm">{courier.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{courier.status}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-3 rounded-md shadow-sm border">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-xs text-muted-foreground">Idle</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
