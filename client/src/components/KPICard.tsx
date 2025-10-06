import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
}

export default function KPICard({ title, value, change, icon: Icon, iconColor = "text-primary" }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change.isPositive ? 'text-success' : 'text-error'}`}>
              <span>{change.isPositive ? '↑' : '↓'}</span>
              <span>{change.value}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-md bg-secondary ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
