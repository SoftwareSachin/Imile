import CourierCard from '../CourierCard';

export default function CourierCardExample() {
  const mockCouriers = [
    { id: 'C1', name: 'John Doe', status: 'active' as const, activeDeliveries: 5, performanceScore: 96, location: 'Downtown SF' },
    { id: 'C2', name: 'Jane Smith', status: 'active' as const, activeDeliveries: 3, performanceScore: 94, location: 'Mission District' },
    { id: 'C3', name: 'Mike Johnson', status: 'idle' as const, activeDeliveries: 0, performanceScore: 89, location: 'SOMA' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {mockCouriers.map(courier => (
        <CourierCard key={courier.id} {...courier} />
      ))}
    </div>
  );
}
