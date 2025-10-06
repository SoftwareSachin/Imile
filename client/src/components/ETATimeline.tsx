import { Card } from "@/components/ui/card";
import { Clock, MapPin, CheckCircle, Circle } from "lucide-react";

interface TimelineEvent {
  id: string;
  label: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  location?: string;
}

interface ETATimelineProps {
  orderId: string;
  eta: string;
  confidence: number;
  events: TimelineEvent[];
}

export default function ETATimeline({ orderId, eta, confidence, events }: ETATimelineProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Order {orderId}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>ETA: {eta}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
            <div 
              className="h-full bg-success transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium text-success">{confidence}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          
          return (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {event.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                )}
                {event.status === 'current' && (
                  <div className="w-5 h-5 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-primary animate-pulse" />
                  </div>
                )}
                {event.status === 'upcoming' && (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
                
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-2 ${
                    event.status === 'completed' ? 'bg-success' : 'bg-border'
                  }`} style={{ minHeight: '2rem' }} />
                )}
              </div>
              
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    event.status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {event.label}
                  </h4>
                  <span className="text-sm text-muted-foreground">{event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
