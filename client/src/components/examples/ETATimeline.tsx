import ETATimeline from '../ETATimeline';

export default function ETATimelineExample() {
  const mockEvents = [
    { id: '1', label: 'Order Confirmed', time: '1:15 PM', status: 'completed' as const },
    { id: '2', label: 'Picked Up', time: '1:42 PM', status: 'completed' as const, location: 'Warehouse A' },
    { id: '3', label: 'In Transit', time: '2:05 PM', status: 'current' as const, location: 'Mission St' },
    { id: '4', label: 'Out for Delivery', time: '2:30 PM', status: 'upcoming' as const },
    { id: '5', label: 'Delivered', time: '3:15 PM (Est)', status: 'upcoming' as const, location: '742 Market St' },
  ];

  return (
    <div className="max-w-2xl p-6">
      <ETATimeline
        orderId="ORD-8291"
        eta="3:15 PM"
        confidence={87}
        events={mockEvents}
      />
    </div>
  );
}
