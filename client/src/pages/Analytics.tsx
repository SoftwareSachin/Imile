import PerformanceChart from '@/components/PerformanceChart';
import KPICard from '@/components/KPICard';
import { TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Analytics() {
  const onTimeData = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 94 },
    { name: 'Wed', value: 91 },
    { name: 'Thu', value: 95 },
    { name: 'Fri', value: 93 },
    { name: 'Sat', value: 89 },
    { name: 'Sun', value: 88 },
  ];

  const failureData = [
    { name: 'Traffic', value: 45 },
    { name: 'Address Issue', value: 28 },
    { name: 'Customer Unavailable', value: 18 },
    { name: 'Courier Delay', value: 9 },
  ];

  const statusData = [
    { name: 'Delivered', value: 876 },
    { name: 'In Transit', value: 234 },
    { name: 'Delayed', value: 87 },
    { name: 'Failed', value: 24 },
  ];

  const etaAccuracyData = [
    { name: 'Week 1', value: 3.8 },
    { name: 'Week 2', value: 3.5 },
    { name: 'Week 3', value: 3.3 },
    { name: 'Week 4', value: 3.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Performance Analytics</h1>
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
          value="92.1%"
          change={{ value: "1.5% from last month", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <KPICard
          title="Failed Deliveries"
          value="24"
          change={{ value: "8 fewer than last week", isPositive: true }}
          icon={AlertTriangle}
          iconColor="text-error"
        />
        <KPICard
          title="ETA Accuracy"
          value="±3.2 min"
          change={{ value: "0.6 min improvement", isPositive: true }}
          icon={Target}
          iconColor="text-info"
        />
        <KPICard
          title="Avg Delivery Time"
          value="42 min"
          change={{ value: "3 min faster", isPositive: true }}
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
          title="Failure Reasons (Last 7 Days)" 
          type="bar" 
          data={failureData} 
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
          data={etaAccuracyData} 
          dataKey="value" 
        />
      </div>
    </div>
  );
}
