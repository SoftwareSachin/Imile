import PerformanceChart from '../PerformanceChart';

export default function PerformanceChartExample() {
  const lineData = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 94 },
    { name: 'Wed', value: 91 },
    { name: 'Thu', value: 95 },
    { name: 'Fri', value: 93 },
    { name: 'Sat', value: 89 },
    { name: 'Sun', value: 88 },
  ];

  const barData = [
    { name: 'Traffic', value: 45 },
    { name: 'Address Issue', value: 28 },
    { name: 'Customer Unavailable', value: 18 },
    { name: 'Courier Delay', value: 9 },
  ];

  const pieData = [
    { name: 'Delivered', value: 876 },
    { name: 'In Transit', value: 234 },
    { name: 'Delayed', value: 87 },
    { name: 'Failed', value: 24 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <PerformanceChart title="On-Time Delivery Rate (%)" type="line" data={lineData} dataKey="value" />
      <PerformanceChart title="Failure Reasons" type="bar" data={barData} dataKey="value" />
      <div className="lg:col-span-2">
        <PerformanceChart title="Delivery Status Breakdown" type="pie" data={pieData} dataKey="value" />
      </div>
    </div>
  );
}
