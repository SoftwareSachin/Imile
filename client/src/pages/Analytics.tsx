import { useQuery } from '@tanstack/react-query';
import PerformanceChart from '@/components/PerformanceChart';
import KPICard from '@/components/KPICard';
import { TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { PerformanceMetric, Delivery, Anomaly } from '@shared/schema';

export default function Analytics() {
  const { data: metrics = [] } = useQuery<PerformanceMetric[]>({
    queryKey: ['/api/metrics'],
  });

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ['/api/deliveries'],
  });

  const { data: anomalies = [] } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies'],
  });

  const totalDeliveries = deliveries.length;
  const onTimeDeliveries = deliveries.filter(d => d.status === 'on-time' || d.status === 'delivered').length;
  const delayedDeliveries = deliveries.filter(d => d.status === 'delayed').length;
  const failedDeliveries = deliveries.filter(d => d.status === 'failed').length;
  
  const onTimeRate = totalDeliveries > 0 ? ((onTimeDeliveries / totalDeliveries) * 100).toFixed(1) : '0.0';

  const onTimeData = metrics.slice(0, 7).map(m => ({
    name: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: m.totalDeliveries > 0 ? Math.round((m.onTimeDeliveries / m.totalDeliveries) * 100) : 0
  }));

  const anomalyTypes = anomalies.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const failureData = Object.entries(anomalyTypes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
    value
  }));

  const statusData = [
    { name: 'Delivered', value: deliveries.filter(d => d.status === 'delivered').length },
    { name: 'In Transit', value: deliveries.filter(d => d.status === 'in-transit').length },
    { name: 'Delayed', value: delayedDeliveries },
    { name: 'On Time', value: deliveries.filter(d => d.status === 'on-time').length },
  ];

  const etaAccuracyData = metrics.slice(0, 4).map((m, i) => ({
    name: `Week ${i + 1}`,
    value: m.avgEtaAccuracy || 0
  }));

  const avgDeliveryTime = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.avgDeliveryTime, 0) / metrics.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="text-analytics-title">Performance Analytics</h1>
          <p className="text-muted-foreground">Track delivery metrics and identify improvement opportunities</p>
        </div>
        <Button data-testid="button-export-data">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Avg On-Time Rate"
          value={`${onTimeRate}%`}
          change={{ value: "Real-time data", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <KPICard
          title="Failed Deliveries"
          value={failedDeliveries.toString()}
          change={{ value: "Live tracking", isPositive: true }}
          icon={AlertTriangle}
          iconColor="text-error"
        />
        <KPICard
          title="Total Anomalies"
          value={anomalies.length.toString()}
          change={{ value: "Active monitoring", isPositive: false }}
          icon={Target}
          iconColor="text-info"
        />
        <KPICard
          title="Avg Delivery Time"
          value={`${avgDeliveryTime} min`}
          change={{ value: "Calculated from metrics", isPositive: true }}
          icon={Clock}
          iconColor="text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart 
          title="On-Time Delivery Rate (%)" 
          type="line" 
          data={onTimeData} 
          dataKey="value" 
        />
        <PerformanceChart 
          title="Anomaly Types" 
          type="bar" 
          data={failureData.length > 0 ? failureData : [{ name: 'No data', value: 0 }]} 
          dataKey="value" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart 
          title="Delivery Status Breakdown" 
          type="pie" 
          data={statusData} 
          dataKey="value" 
        />
        <PerformanceChart 
          title="ETA Accuracy Trend (±Minutes)" 
          type="line" 
          data={etaAccuracyData.length > 0 ? etaAccuracyData : [{ name: 'No data', value: 0 }]} 
          dataKey="value" 
        />
      </div>
    </div>
  );
}
