import { useState } from 'react';
import AlertCard from '../AlertCard';

export default function AlertCardExample() {
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'critical' as const, title: 'Delivery Failure Risk', description: 'Courier #C-428 is running 15 minutes late, beyond recovery threshold', time: '2 min ago', orderId: 'ORD-8291' },
    { id: 2, severity: 'warning' as const, title: 'GPS Route Deviation', description: 'Courier took alternative route, ETA updated to 3:45 PM', time: '5 min ago', orderId: 'ORD-8284' },
    { id: 3, severity: 'info' as const, title: 'Congestion Zone Detected', description: 'High traffic in Downtown area, average delay of 8 minutes', time: '12 min ago' },
  ]);

  const handleDismiss = (id: number) => {
    console.log('Alert dismissed:', id);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4 p-6">
      {alerts.map(alert => (
        <AlertCard
          key={alert.id}
          severity={alert.severity}
          title={alert.title}
          description={alert.description}
          time={alert.time}
          orderId={alert.orderId}
          onDismiss={() => handleDismiss(alert.id)}
        />
      ))}
    </div>
  );
}
