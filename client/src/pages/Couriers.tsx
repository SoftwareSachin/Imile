import CourierCard from '@/components/CourierCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Couriers() {
  const [searchQuery, setSearchQuery] = useState('');

  const mockCouriers = [
    { id: 'C1', name: 'John Doe', status: 'active' as const, activeDeliveries: 5, performanceScore: 96, location: 'Downtown SF' },
    { id: 'C2', name: 'Jane Smith', status: 'active' as const, activeDeliveries: 3, performanceScore: 94, location: 'Mission District' },
    { id: 'C3', name: 'Mike Johnson', status: 'idle' as const, activeDeliveries: 0, performanceScore: 89, location: 'SOMA' },
    { id: 'C4', name: 'Lisa Brown', status: 'active' as const, activeDeliveries: 4, performanceScore: 97, location: 'Nob Hill' },
    { id: 'C5', name: 'David Wilson', status: 'active' as const, activeDeliveries: 6, performanceScore: 91, location: 'Castro' },
    { id: 'C6', name: 'Sarah Martinez', status: 'idle' as const, activeDeliveries: 0, performanceScore: 93, location: 'Fisherman\'s Wharf' },
    { id: 'C7', name: 'Chris Taylor', status: 'active' as const, activeDeliveries: 2, performanceScore: 95, location: 'Hayes Valley' },
    { id: 'C8', name: 'Amy Anderson', status: 'active' as const, activeDeliveries: 5, performanceScore: 98, location: 'Marina District' },
  ];

  const filteredCouriers = mockCouriers.filter(courier =>
    courier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Courier Management</h1>
        <p className="text-muted-foreground">Monitor and manage your delivery team</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search couriers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-couriers"
          />
        </div>
        <Button variant="outline" data-testid="button-filter">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCouriers.map(courier => (
          <CourierCard key={courier.id} {...courier} />
        ))}
      </div>

      {filteredCouriers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No couriers found matching your search</p>
        </div>
      )}
    </div>
  );
}
