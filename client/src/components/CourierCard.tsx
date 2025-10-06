import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "./StatusBadge";
import { MapPin, Package, TrendingUp } from "lucide-react";

interface CourierCardProps {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle';
  activeDeliveries: number;
  performanceScore: number;
  location: string;
}

export default function CourierCard({ id, name, avatar, status, activeDeliveries, performanceScore, location }: CourierCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <Card className="p-4 hover-elevate" data-testid={`card-courier-${id}`}>
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-foreground truncate">{name}</h4>
            <StatusBadge status={status} size="sm" />
          </div>
          
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4 flex-shrink-0" />
              <span>{activeDeliveries} active deliveries</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              <span>{performanceScore}% performance score</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
