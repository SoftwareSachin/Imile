import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin } from "lucide-react";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  courier: string;
  eta: string;
  status: 'on-time' | 'delayed' | 'failed' | 'in-transit' | 'delivered';
}

interface DeliveryTableProps {
  deliveries: Delivery[];
  onViewDetails?: (id: string) => void;
  onTrack?: (id: string) => void;
}

export default function DeliveryTable({ deliveries, onViewDetails, onTrack }: DeliveryTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Order ID</TableHead>
              <TableHead className="font-medium">Customer</TableHead>
              <TableHead className="font-medium">Address</TableHead>
              <TableHead className="font-medium">Courier</TableHead>
              <TableHead className="font-medium">ETA</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover-elevate" data-testid={`row-delivery-${delivery.id}`}>
                <TableCell className="font-mono text-sm" data-testid={`text-order-${delivery.orderId}`}>
                  {delivery.orderId}
                </TableCell>
                <TableCell>{delivery.customer}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {delivery.address}
                </TableCell>
                <TableCell>{delivery.courier}</TableCell>
                <TableCell className="text-sm">{delivery.eta}</TableCell>
                <TableCell>
                  <StatusBadge status={delivery.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onTrack?.(delivery.id)}
                      data-testid={`button-track-${delivery.id}`}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDetails?.(delivery.id)}
                      data-testid={`button-view-${delivery.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
