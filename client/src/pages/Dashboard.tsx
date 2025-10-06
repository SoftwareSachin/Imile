import KPICard from '@/components/KPICard';
import DeliveryMap from '@/components/DeliveryMap';
import AlertCard from '@/components/AlertCard';
import DeliveryTable from '@/components/DeliveryTable';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'critical' as const, title: 'Delivery Failure Risk', description: 'Courier #C-428 is running 15 minutes late, beyond recovery threshold', time: '2 min ago', orderId: 'ORD-8291' },
    { id: 2, severity: 'warning' as const, title: 'GPS Route Deviation', description: 'Courier took alternative route, ETA updated to 3:45 PM', time: '5 min ago', orderId: 'ORD-8284' },
    { id: 3, severity: 'info' as const, title: 'Congestion Zone Detected', description: 'High traffic in Downtown area, average delay of 8 minutes', time: '12 min ago' },
  ]);

  const mockCouriers = [
    { id: 'C1', name: 'John Doe', lat: 37.7849, lng: -122.4094, status: 'active' as const },
    { id: 'C2', name: 'Jane Smith', lat: 37.7649, lng: -122.4294, status: 'active' as const },
    { id: 'C3', name: 'Mike Johnson', lat: 37.7749, lng: -122.4394, status: 'active' as const },
    { id: 'C4', name: 'Lisa Brown', lat: 37.7949, lng: -122.4194, status: 'active' as const },
  ];

  const mockDeliveries = [
    { id: '1', orderId: 'ORD-8291', customer: 'Sarah Chen', address: '742 Market St, San Francisco, CA', courier: 'John Doe', eta: '2:30 PM', status: 'in-transit' as const },
    { id: '2', orderId: 'ORD-8284', customer: 'Michael Park', address: '1234 Mission St, San Francisco, CA', courier: 'Jane Smith', eta: '3:15 PM', status: 'on-time' as const },
    { id: '3', orderId: 'ORD-8276', customer: 'Emily Rodriguez', address: '567 Valencia St, San Francisco, CA', courier: 'Mike Johnson', eta: '2:45 PM (delayed)', status: 'delayed' as const },
    { id: '4', orderId: 'ORD-8265', customer: 'David Kim', address: '890 Folsom St, San Francisco, CA', courier: 'Lisa Brown', eta: '1:20 PM', status: 'delivered' as const },
    { id: '5', orderId: 'ORD-8253', customer: 'Amanda Lee', address: '321 Howard St, San Francisco, CA', courier: 'John Doe', eta: '4:00 PM', status: 'on-time' as const },
  ];

  const handleDismiss = (id: number) => {
    console.log('Alert dismissed:', id);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Operations Dashboard</h1>
        <p className="text-muted-foreground">Real-time delivery monitoring and intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Deliveries"
          value="1,247"
          change={{ value: "12% from last week", isPositive: true }}
          icon={Package}
          iconColor="text-info"
        />
        <KPICard
          title="On-Time Rate"
          value="94.2%"
          change={{ value: "2.1% from last week", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <KPICard
          title="Active Couriers"
          value="42"
          icon={Users}
          iconColor="text-primary"
        />
        <KPICard
          title="Avg ETA Accuracy"
          value="±3.2 min"
          change={{ value: "0.8 min improvement", isPositive: true }}
          icon={Clock}
          iconColor="text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeliveryMap couriers={mockCouriers} height="h-[500px]" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Live Alerts</h2>
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertCard
                key={alert.id}
                severity={alert.severity}
                title={alert.title}
                description={alert.description}
                time={alert.time}
                orderId={alert.orderId}
                onDismiss={() => handleDismiss(alert.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
        <DeliveryTable
          deliveries={mockDeliveries}
          onViewDetails={(id) => console.log('View details:', id)}
          onTrack={(id) => console.log('Track delivery:', id)}
        />
      </div>
    </div>
  );
}
