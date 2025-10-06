import { useQuery } from '@tanstack/react-query';
import ETATimeline from '@/components/ETATimeline';
import DeliveryMap from '@/components/DeliveryMap';
import { Card } from '@/components/ui/card';
import { Package, User, MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import type { Delivery, Courier, EtaPrediction } from '@shared/schema';
import { useLocation } from 'wouter';
import { useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Tracking() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const deliveryId = searchParams.get('id');
  const { toast } = useToast();

  const { data: deliveries = [], isLoading: deliveriesLoading, error: deliveriesError } = useQuery<Delivery[]>({
    queryKey: ['/api/deliveries'],
  });

  const { data: couriers = [], isLoading: couriersLoading, error: couriersError } = useQuery<Courier[]>({
    queryKey: ['/api/couriers'],
  });

  const delivery = useMemo(() => {
    if (deliveryId) {
      return deliveries.find(d => d.id === deliveryId);
    }
    return deliveries[0];
  }, [deliveries, deliveryId]);

  const courier = useMemo(() => {
    if (!delivery) return undefined;
    return couriers.find(c => c.id === delivery.courierId);
  }, [couriers, delivery]);

  const { data: etaPrediction, isLoading: etaLoading, error: etaError } = useQuery<EtaPrediction>({
    queryKey: ['/api/eta-predictions/delivery', delivery?.id],
    queryFn: async () => {
      const response = await fetch(`/api/eta-predictions/delivery/${delivery?.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch ETA prediction');
      }
      return response.json();
    },
    enabled: !!delivery?.id,
    retry: false,
  });

  useEffect(() => {
    if (etaError) {
      toast({
        title: 'ETA Prediction Unavailable',
        description: 'Unable to load real-time ETA prediction. Showing fallback timeline.',
        variant: 'destructive',
      });
    }
  }, [etaError, toast]);

  const timelineEvents = useMemo(() => {
    if (!delivery) return [];
    
    return [
      { id: '1', label: 'Order Confirmed', time: new Date(Date.now() - 3600000).toLocaleTimeString(), status: 'completed' as const },
      { id: '2', label: 'Picked Up', time: delivery.pickupTime ? new Date(delivery.pickupTime).toLocaleTimeString() : 'Pending', status: delivery.pickupTime ? 'completed' as const : 'upcoming' as const },
      { id: '3', label: 'In Transit', time: 'In progress', status: delivery.status === 'in_transit' ? 'current' as const : delivery.status === 'delivered' ? 'completed' as const : 'upcoming' as const, location: courier?.location },
      { id: '4', label: 'Delivered', time: delivery.actualDeliveryTime ? new Date(delivery.actualDeliveryTime).toLocaleTimeString() : new Date(delivery.eta).toLocaleTimeString() + ' (Est)', status: delivery.status === 'delivered' ? 'completed' as const : 'upcoming' as const, location: delivery.address },
    ];
  }, [delivery, courier]);

  if (deliveriesError || couriersError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Failed to load delivery data</p>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (deliveriesLoading || couriersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No delivery found</p>
          <p className="text-sm text-muted-foreground mt-2">Please select a delivery to track</p>
        </div>
      </div>
    );
  }

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
                  <p className="font-medium font-mono" data-testid="text-order-id">{delivery.orderId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{delivery.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{delivery.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="font-medium">{etaPrediction?.predictedEta || delivery.eta}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          {etaLoading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </Card>
          ) : (
            <ETATimeline
              orderId={delivery.orderId}
              eta={etaPrediction?.predictedEta || delivery.eta}
              confidence={etaPrediction?.confidence ? Math.round(etaPrediction.confidence * 100) : 0}
              events={timelineEvents}
            />
          )}
        </div>
      </div>
    </div>
  );
}
