import { storage } from "./storage";
import type { Courier } from "@shared/schema";
import { etaEngine } from "./eta-engine";

const MOVE_INTERVAL = 5000;
const MOVE_DISTANCE = 0.002;

/**
 * TrackingSimulator - Demo/Testing GPS Simulation
 * 
 * This simulator generates realistic courier movement for demonstration and testing purposes.
 * It interpolates positions between courier current location and delivery destination.
 * 
 * For production use with real courier tracking:
 * - Replace this with a webhook/API endpoint that receives actual GPS coordinates from courier devices
 * - Implement real-time GPS data ingestion from courier mobile apps or tracking devices
 * - Store actual location updates in the database with timestamps
 * - Use WebSocket or Server-Sent Events to push live updates to the frontend
 */
class TrackingSimulator {
  private interval: NodeJS.Timeout | null = null;
  private activeCouriers: Set<string> = new Set();

  private calculateNextPosition(
    currentLat: number,
    currentLng: number,
    destLat: number,
    destLng: number,
    speed: number = 0.002
  ): { lat: number; lng: number } {
    const latDiff = destLat - currentLat;
    const lngDiff = destLng - currentLng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    if (distance < speed) {
      return { lat: destLat, lng: destLng };
    }

    const ratio = speed / distance;
    return {
      lat: currentLat + latDiff * ratio,
      lng: currentLng + lngDiff * ratio
    };
  }

  private async updateCourierPositions() {
    try {
      const couriers = await storage.getAllCouriers();
      const deliveries = await storage.getAllDeliveries();

      for (const courier of couriers) {
        if (courier.status !== 'active') continue;

        const activeDeliveries = deliveries.filter(
          d => d.courierId === courier.id && d.status === 'in_transit'
        );

        if (activeDeliveries.length === 0) continue;

        const nextDelivery = activeDeliveries[0];
        const nextPosition = this.calculateNextPosition(
          courier.lat,
          courier.lng,
          nextDelivery.lat,
          nextDelivery.lng,
          MOVE_DISTANCE
        );

        const hasReached = 
          Math.abs(nextPosition.lat - nextDelivery.lat) < 0.0001 &&
          Math.abs(nextPosition.lng - nextDelivery.lng) < 0.0001;

        if (hasReached) {
          await storage.updateDelivery(nextDelivery.id, {
            status: 'delivered',
            actualDeliveryTime: new Date().toISOString()
          });

          await storage.updateCourier(courier.id, {
            activeDeliveries: Math.max(0, courier.activeDeliveries - 1),
            lat: nextPosition.lat,
            lng: nextPosition.lng
          });
        } else {
          await storage.updateCourier(courier.id, {
            lat: nextPosition.lat,
            lng: nextPosition.lng
          });
        }
      }
    } catch (error) {
      console.error('Error updating courier positions:', error);
    }
  }

  start() {
    if (this.interval) return;

    console.log('📍 Starting real-time tracking simulator...');
    this.interval = setInterval(() => {
      this.updateCourierPositions();
    }, MOVE_INTERVAL);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('📍 Tracking simulator stopped');
    }
  }
}

export const trackingSimulator = new TrackingSimulator();
