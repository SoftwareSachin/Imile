import { useQuery } from '@tanstack/react-query';
import ETATimeline from '@/components/ETATimeline';
import DeliveryMap from '@/components/DeliveryMap';
import { Card } from '@/components/ui/card';
import { Package, User, MapPin, Clock } from 'lucide-react';
import type { Delivery, Courier, EtaPrediction } from '@shared/schema';
import { useLocation } from 'wouter';

export default function Tracking() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const deliveryId = searchParams.get('id');

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ['/api/deliveries'],
  });

  const { data: couriers = [] } = useQuery<Courier[]>({
    queryKey: ['/api/couriers'],
  });

  const delivery = deliveryId ? deliveries.find(d => d.id === deliveryId) : deliveries[0];
  const courier = delivery ? couriers.find(c => c.id === delivery.courierId) : undefined;

  const mockEvents = [
    { id: '1', label: 'Order Confirmed', time: '1:15 PM', status: 'completed' as const },
    { id: '2', label: 'Picked Up', time: delivery?.pickupTime || '1:42 PM', status: 'completed' as const, location: 'Warehouse' },
    { id: '3', label: 'In Transit', time: '2:05 PM', status: delivery?.status === 'in-transit' ? 'current' as const : 'completed' as const, location: courier?.location },
    { id: '4', label: 'Out for Delivery', time: '2:30 PM', status: delivery?.status === 'delivered' ? 'completed' as const : 'upcoming' as const },
    { id: '5', label: 'Delivered', time: delivery?.eta || '3:15 PM (Est)', status: delivery?.status === 'delivered' ? 'completed' as const : 'upcoming' as const, location: delivery?.address },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="text-tracking-title">Delivery Tracking</h1>
        <p className="text-muted-foreground">Real-time delivery status and ETA prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DeliveryMap couriers={courier ? [courier] : []} height="h-[400px]" />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium font-mono" data-testid="text-order-id">{delivery?.orderId || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{delivery?.customerName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{delivery?.address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="font-medium">{delivery?.eta || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <ETATimeline
            orderId={delivery?.orderId || 'N/A'}
            eta={delivery?.eta || 'N/A'}
            confidence={87}
            events={mockEvents}
          />
        </div>
      </div>
    </div>
  );
}
