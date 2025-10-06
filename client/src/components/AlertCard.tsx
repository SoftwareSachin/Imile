import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, XCircle, TrendingDown } from 'lucide-react';

interface AlertCardProps {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  orderId?: string;
  onDismiss?: () => void;
}

export default function AlertCard({ severity, title, description, time, orderId, onDismiss }: AlertCardProps) {
  const severityConfig = {
    critical: {
      borderColor: 'border-l-error',
      bgColor: 'bg-red-50/50 dark:bg-red-950/10',
      icon: XCircle,
      iconColor: 'text-error',
    },
    warning: {
      borderColor: 'border-l-warning',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/10',
      icon: AlertTriangle,
      iconColor: 'text-warning',
    },
    info: {
      borderColor: 'border-l-info',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/10',
      icon: Info,
      iconColor: 'text-info',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground">{time}</span>
                {orderId && <span className="text-xs font-mono text-muted-foreground">#{orderId}</span>}
              </div>
            </div>
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground p-1"
                data-testid="button-dismiss-alert"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
