import { useQuery, useMutation } from '@tanstack/react-query';
import CourierCard from '@/components/CourierCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Courier } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCourierSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { z } from 'zod';

type CourierFormData = z.infer<typeof insertCourierSchema>;

export default function Couriers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: couriers = [] } = useQuery<Courier[]>({
    queryKey: ['/api/couriers'],
  });

  const form = useForm<CourierFormData>({
    resolver: zodResolver(insertCourierSchema),
    defaultValues: {
      name: '',
      status: 'idle',
      lat: 37.7749,
      lng: -122.4194,
      activeDeliveries: 0,
      performanceScore: 100,
      location: 'San Francisco',
      vehicle: 'Bike',
      phone: '',
    },
  });

  const createCourierMutation = useMutation({
    mutationFn: async (data: CourierFormData) => {
      const response = await fetch('/api/couriers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create courier');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couriers'] });
      toast({
        title: 'Success',
        description: 'Courier created successfully',
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create courier',
        variant: 'destructive',
      });
    },
  });

  const filteredCouriers = couriers.filter(courier =>
    courier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: CourierFormData) => {
    createCourierMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="text-couriers-title">Courier Management</h1>
          <p className="text-muted-foreground">Monitor and manage your delivery team</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-courier">
              <Plus className="w-4 h-4 mr-2" />
              Add Courier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Courier</DialogTitle>
              <DialogDescription>
                Add a new courier to your delivery fleet
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-courier-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} data-testid="input-courier-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-courier-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.000001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-courier-lat" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.000001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} data-testid="input-courier-lng" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createCourierMutation.isPending} data-testid="button-submit-courier">
                  {createCourierMutation.isPending ? 'Creating...' : 'Create Courier'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
          <CourierCard 
            key={courier.id} 
            id={courier.id}
            name={courier.name}
            status={courier.status as 'active' | 'idle'}
            activeDeliveries={courier.activeDeliveries}
            performanceScore={courier.performanceScore}
            location={courier.location}
          />
        ))}
      </div>

      {filteredCouriers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-no-couriers">
          <p>No couriers found{searchQuery ? ' matching your search' : ''}</p>
        </div>
      )}
    </div>
  );
}
