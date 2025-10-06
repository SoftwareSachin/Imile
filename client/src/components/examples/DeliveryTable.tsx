import DeliveryTable from '../DeliveryTable';

export default function DeliveryTableExample() {
  const mockDeliveries = [
    { id: '1', orderId: 'ORD-8291', customer: 'Sarah Chen', address: '742 Market St, San Francisco, CA', courier: 'John Doe', eta: '2:30 PM', status: 'in-transit' as const },
    { id: '2', orderId: 'ORD-8284', customer: 'Michael Park', address: '1234 Mission St, San Francisco, CA', courier: 'Jane Smith', eta: '3:15 PM', status: 'on-time' as const },
    { id: '3', orderId: 'ORD-8276', customer: 'Emily Rodriguez', address: '567 Valencia St, San Francisco, CA', courier: 'Mike Johnson', eta: '2:45 PM (delayed)', status: 'delayed' as const },
    { id: '4', orderId: 'ORD-8265', customer: 'David Kim', address: '890 Folsom St, San Francisco, CA', courier: 'Lisa Brown', eta: '1:20 PM', status: 'delivered' as const },
  ];

  return (
    <div className="p-6">
      <DeliveryTable
        deliveries={mockDeliveries}
        onViewDetails={(id) => console.log('View details:', id)}
        onTrack={(id) => console.log('Track delivery:', id)}
      />
    </div>
  );
}
