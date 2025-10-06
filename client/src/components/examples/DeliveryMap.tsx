import DeliveryMap from '../DeliveryMap';

export default function DeliveryMapExample() {
  const mockCouriers = [
    { id: 'C1', name: 'John Doe', lat: 37.7849, lng: -122.4094, status: 'active' as const },
    { id: 'C2', name: 'Jane Smith', lat: 37.7649, lng: -122.4294, status: 'active' as const },
    { id: 'C3', name: 'Mike Johnson', lat: 37.7749, lng: -122.4394, status: 'idle' as const },
  ];

  return (
    <div className="p-6">
      <DeliveryMap couriers={mockCouriers} height="h-[500px]" />
    </div>
  );
}
