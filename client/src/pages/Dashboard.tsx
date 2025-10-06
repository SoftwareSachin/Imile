import { useQuery } from '@tanstack/react-query';
import KPICard from '@/components/KPICard';
import DeliveryMap from '@/components/DeliveryMap';
import AlertCard from '@/components/AlertCard';
import DeliveryTable from '@/components/DeliveryTable';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';
import type { Courier, Anomaly, Delivery } from '@shared/schema';

export default function Dashboard() {
  const { data: couriers = [] } = useQuery<Courier[]>({
    queryKey: ['/api/couriers'],
  });

  const { data: anomalies = [] } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies/unresolved'],
  });

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ['/api/deliveries'],
  });

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

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
        <DeliveryTable
          deliveries={tableDeliveries}
          onViewDetails={(id) => console.log('View details:', id)}
          onTrack={(id) => console.log('Track delivery:', id)}
        />
      </div>
    </div>
  );
}
