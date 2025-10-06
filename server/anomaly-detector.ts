import type { Delivery, Courier, InsertAnomaly } from "@shared/schema";

interface AnomalyResult {
  detected: boolean;
  anomaly?: InsertAnomaly;
}

export class AnomalyDetector {
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateExpectedTime(distance: number): number {
    const avgSpeed = 25;
    return (distance / avgSpeed) * 60;
  }

  detectDelayAnomaly(
    delivery: Delivery,
    courier: Courier,
    pickupLat: number,
    pickupLng: number
  ): AnomalyResult {
    const distance = this.calculateDistance(
      pickupLat,
      pickupLng,
      delivery.lat,
      delivery.lng
    );

    const expectedTime = this.calculateExpectedTime(distance);
    const etaTime = new Date(delivery.eta).getTime();
    const currentTime = Date.now();
    const actualTime = (currentTime - (etaTime - expectedTime * 60000)) / 60000;

    const delay = actualTime - expectedTime;

    if (delay > 15) {
      let severity: 'low' | 'medium' | 'high' | 'critical';
      let rootCause: string;

      if (delay > 45) {
        severity = 'critical';
        rootCause = 'Severe traffic congestion or route blockage detected';
      } else if (delay > 30) {
        severity = 'high';
        rootCause = 'Significant delays due to traffic or courier issues';
      } else if (delay > 20) {
        severity = 'medium';
        rootCause = 'Moderate delay, likely traffic related';
      } else {
        severity = 'low';
        rootCause = 'Minor delay within acceptable range';
      }

      return {
        detected: true,
        anomaly: {
          deliveryId: delivery.id,
          orderId: delivery.orderId,
          severity,
          type: 'delay',
          title: `Delivery Delay: ${Math.round(delay)} min`,
          description: `Expected delivery in ${Math.round(expectedTime)} min, but actual is ${Math.round(actualTime)} min`,
          rootCause,
          detectedAt: new Date().toISOString(),
          resolved: false,
          resolution: null
        }
      };
    }

    return { detected: false };
  }

  detectRouteDeviation(
    courier: Courier,
    expectedLat: number,
    expectedLng: number
  ): AnomalyResult {
    const deviation = this.calculateDistance(
      courier.lat,
      courier.lng,
      expectedLat,
      expectedLng
    );

    if (deviation > 2) {
      let severity: 'low' | 'medium' | 'high' | 'critical';
      let rootCause: string;

      if (deviation > 10) {
        severity = 'critical';
        rootCause = 'Courier significantly off route - possible wrong direction';
      } else if (deviation > 5) {
        severity = 'high';
        rootCause = 'Major route deviation detected';
      } else if (deviation > 3) {
        severity = 'medium';
        rootCause = 'Moderate deviation - possibly taking alternate route';
      } else {
        severity = 'low';
        rootCause = 'Minor deviation within acceptable range';
      }

      return {
        detected: true,
        anomaly: {
          deliveryId: null,
          orderId: null,
          severity,
          type: 'route_deviation',
          title: `Route Deviation: ${deviation.toFixed(1)} km`,
          description: `Courier ${courier.name} is ${deviation.toFixed(1)} km off expected route`,
          rootCause,
          detectedAt: new Date().toISOString(),
          resolved: false,
          resolution: null
        }
      };
    }

    return { detected: false };
  }

  detectStuckCourier(
    courier: Courier,
    lastLat: number,
    lastLng: number,
    minutesElapsed: number
  ): AnomalyResult {
    const distance = this.calculateDistance(
      courier.lat,
      courier.lng,
      lastLat,
      lastLng
    );

    if (distance < 0.1 && minutesElapsed > 15 && courier.activeDeliveries > 0) {
      let severity: 'low' | 'medium' | 'high' | 'critical';
      let rootCause: string;

      if (minutesElapsed > 45) {
        severity = 'critical';
        rootCause = 'Courier stuck for extended period - possible vehicle breakdown';
      } else if (minutesElapsed > 30) {
        severity = 'high';
        rootCause = 'Courier stationary - may need assistance';
      } else if (minutesElapsed > 20) {
        severity = 'medium';
        rootCause = 'Courier not moving - investigating';
      } else {
        severity = 'low';
        rootCause = 'Courier stationary - possibly at delivery location';
      }

      return {
        detected: true,
        anomaly: {
          deliveryId: null,
          orderId: null,
          severity,
          type: 'stuck_courier',
          title: `Courier Stationary: ${minutesElapsed} min`,
          description: `Courier ${courier.name} hasn't moved ${distance.toFixed(2)} km in ${minutesElapsed} minutes`,
          rootCause,
          detectedAt: new Date().toISOString(),
          resolved: false,
          resolution: null
        }
      };
    }

    return { detected: false };
  }

  detectPerformanceAnomaly(courier: Courier): AnomalyResult {
    if (courier.performanceScore < 70) {
      let severity: 'low' | 'medium' | 'high' | 'critical';
      let rootCause: string;

      if (courier.performanceScore < 50) {
        severity = 'critical';
        rootCause = 'Very poor performance - immediate intervention required';
      } else if (courier.performanceScore < 60) {
        severity = 'high';
        rootCause = 'Low performance score - requires training or support';
      } else {
        severity = 'medium';
        rootCause = 'Below average performance - monitoring needed';
      }

      return {
        detected: true,
        anomaly: {
          deliveryId: null,
          orderId: null,
          severity,
          type: 'performance',
          title: `Low Performance Score: ${courier.performanceScore}`,
          description: `Courier ${courier.name} has performance score of ${courier.performanceScore}`,
          rootCause,
          detectedAt: new Date().toISOString(),
          resolved: false,
          resolution: null
        }
      };
    }

    return { detected: false };
  }
}

export const anomalyDetector = new AnomalyDetector();
