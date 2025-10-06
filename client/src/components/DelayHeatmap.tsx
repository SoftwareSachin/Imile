import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface HeatmapZone {
  id: string;
  name: string;
  delayCount: number;
  avgDelayMinutes: number;
  lat: number;
  lng: number;
}

interface DelayHeatmapProps {
  zones: HeatmapZone[];
}

export default function DelayHeatmap({ zones }: DelayHeatmapProps) {
  const maxDelay = Math.max(...zones.map(z => z.delayCount));
  
  const getIntensityColor = (delayCount: number) => {
    const intensity = maxDelay > 0 ? delayCount / maxDelay : 0;
    if (intensity > 0.7) return 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400';
    if (intensity > 0.4) return 'bg-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-400';
    if (intensity > 0.2) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-400';
    return 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400';
  };

  const sortedZones = [...zones].sort((a, b) => b.delayCount - a.delayCount);

  return (
    <Card data-testid="delay-heatmap">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Delay Hotspots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedZones.length > 0 ? (
            sortedZones.map(zone => {
              const intensity = maxDelay > 0 ? zone.delayCount / maxDelay : 0;
              
              return (
                <div 
                  key={zone.id} 
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getIntensityColor(zone.delayCount)}`}
                  data-testid={`heatmap-zone-${zone.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{zone.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-mono">{zone.delayCount} delays</span>
                        <span>Avg: {zone.avgDelayMinutes} min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round(intensity * 100)}%</div>
                      <div className="text-xs text-muted-foreground">intensity</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-current transition-all" 
                      style={{ width: `${intensity * 100}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-zones">
              <p>No delay zones detected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
