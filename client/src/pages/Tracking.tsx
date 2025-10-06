import ETATimeline from '@/components/ETATimeline';
import DeliveryMap from '@/components/DeliveryMap';
import { Card } from '@/components/ui/card';
import { Package, User, MapPin, Clock } from 'lucide-react';

export default function Tracking() {
  const mockEvents = [
    { id: '1', label: 'Order Confirmed', time: '1:15 PM', status: 'completed' as const },
    { id: '2', label: 'Picked Up', time: '1:42 PM', status: 'completed' as const, location: 'Warehouse A' },
    { id: '3', label: 'In Transit', time: '2:05 PM', status: 'current' as const, location: 'Mission St' },
    { id: '4', label: 'Out for Delivery', time: '2:30 PM', status: 'upcoming' as const },
    { id: '5', label: 'Delivered', time: '3:15 PM (Est)', status: 'upcoming' as const, location: '742 Market St' },
  ];

  const mockCourier = { id: 'C1', name: 'John Doe', lat: 37.7749, lng: -122.4194, status: 'active' as const };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Delivery Tracking</h1>
        <p className="text-muted-foreground">Real-time delivery status and ETA prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DeliveryMap couriers={[mockCourier]} height="h-[400px]" />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium font-mono">ORD-8291</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">Sarah Chen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">742 Market St, San Francisco, CA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="font-medium">3:15 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <ETATimeline
            orderId="ORD-8291"
            eta="3:15 PM"
            confidence={87}
            events={mockEvents}
          />
        </div>
      </div>
    </div>
  );
}
