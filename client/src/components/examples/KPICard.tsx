import KPICard from '../KPICard';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
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
  );
}
