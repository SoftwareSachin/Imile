import { useQuery } from '@tanstack/react-query';
import KPICard from '@/components/KPICard';
import DeliveryMap from '@/components/DeliveryMap';
import AlertCard from '@/components/AlertCard';
import DeliveryTable from '@/components/DeliveryTable';
import DelayHeatmap from '@/components/DelayHeatmap';
import { Package, TrendingUp, Users, Clock, Loader2, AlertCircle } from 'lucide-react';
import type { Courier, Anomaly, Delivery, Zone } from '@shared/schema';

export default function Dashboard() {
  const { data: couriers = [], isLoading: couriersLoading, error: couriersError } = useQuery<Courier[]>({
    queryKey: ['/api/couriers'],
  });

  const { data: anomalies = [], isLoading: anomaliesLoading, error: anomaliesError } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies/unresolved'],
  });

  const { data: deliveries = [], isLoading: deliveriesLoading, error: deliveriesError } = useQuery<Delivery[]>({
    queryKey: ['/api/deliveries'],
  });

  const { data: zones = [], isLoading: zonesLoading, error: zonesError } = useQuery<Zone[]>({
    queryKey: ['/api/zones'],
  });

  const isLoading = couriersLoading || anomaliesLoading || deliveriesLoading || zonesLoading;
  const error = couriersError || anomaliesError || deliveriesError || zonesError;

  const totalDeliveries = deliveries.length;
  const onTimeDeliveries = deliveries.filter(d => d.status === 'on-time' || d.status === 'delivered').length;
  const onTimeRate = totalDeliveries > 0 ? ((onTimeDeliveries / totalDeliveries) * 100).toFixed(1) : '0.0';
  const activeCouriers = couriers.filter(c => c.status === 'active').length;

  const tableDeliveries = deliveries.slice(0, 10).map(d => {
    const courier = couriers.find(c => c.id === d.courierId);
    return {
      id: d.id,
      orderId: d.orderId,
      customer: d.customerName,
      address: d.address,
      courier: courier?.name || 'Unknown',
      eta: d.eta,
      status: d.status as 'on-time' | 'delayed' | 'in-transit' | 'delivered'
    };
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Failed to load dashboard data</p>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="text-dashboard-title">Operations Dashboard</h1>
        <p className="text-muted-foreground">Real-time delivery monitoring and intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Deliveries"
          value={totalDeliveries.toString()}
          change={{ value: "Real-time data", isPositive: true }}
          icon={Package}
          iconColor="text-info"
        />
        <KPICard
          title="On-Time Rate"
          value={`${onTimeRate}%`}
          change={{ value: "Live updates", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <KPICard
          title="Active Couriers"
          value={activeCouriers.toString()}
          icon={Users}
          iconColor="text-primary"
        />
        <KPICard
          title="Active Alerts"
          value={anomalies.length.toString()}
          icon={Clock}
          iconColor="text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeliveryMap couriers={couriers} height="h-[500px]" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Live Alerts</h2>
          {anomalies.length > 0 ? (
            anomalies.slice(0, 5).map(anomaly => (
              <AlertCard
                key={anomaly.id}
                severity={anomaly.severity as 'critical' | 'warning' | 'info'}
                title={anomaly.title}
                description={anomaly.description}
                time={anomaly.detectedAt}
                orderId={anomaly.orderId || undefined}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground" data-testid="text-no-alerts">
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
          <DeliveryTable
            deliveries={tableDeliveries}
            onViewDetails={(id) => console.log('View details:', id)}
            onTrack={(id) => console.log('Track delivery:', id)}
          />
        </div>
        <div>
          <DelayHeatmap zones={zones.map(z => ({
            id: z.id,
            name: z.name,
            delayCount: z.deliveryCount,
            avgDelayMinutes: z.avgDelayMinutes,
            lat: z.centerLat,
            lng: z.centerLng
          }))} />
        </div>
      </div>
    </div>
  );
}
