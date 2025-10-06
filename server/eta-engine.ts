import type { Delivery, Courier } from "@shared/schema";

interface ETAFactors {
  baseDistance: number;
  traffic: number;
  weather: number;
  courierPerformance: number;
  timeOfDay: number;
}

export class ETAEngine {
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

  private getTrafficFactor(hour: number): number {
    if (hour >= 7 && hour <= 9) return 1.5;
    if (hour >= 17 && hour <= 19) return 1.6;
    if (hour >= 12 && hour <= 14) return 1.3;
    return 1.0;
  }

  private getWeatherFactor(): number {
    const conditions = ['clear', 'cloudy', 'rainy', 'heavy_rain'];
    const factors = [1.0, 1.1, 1.3, 1.6];
    const randomIndex = Math.floor(Math.random() * conditions.length);
    return factors[randomIndex];
  }

  private getCourierPerformanceFactor(performanceScore: number): number {
    if (performanceScore >= 95) return 0.85;
    if (performanceScore >= 90) return 0.90;
    if (performanceScore >= 85) return 0.95;
    if (performanceScore >= 80) return 1.0;
    return 1.1;
  }

  calculateETA(
    delivery: Partial<Delivery>,
    courier: Courier,
    pickupLat: number,
    pickupLng: number
  ): {
    eta: string;
    confidence: number;
    factors: ETAFactors;
    trafficImpact: number;
    weatherImpact: number;
  } {
    const distance = this.calculateDistance(
      pickupLat,
      pickupLng,
      delivery.lat!,
      delivery.lng!
    );

    const currentHour = new Date().getHours();
    const trafficFactor = this.getTrafficFactor(currentHour);
    const weatherFactor = this.getWeatherFactor();
    const courierFactor = this.getCourierPerformanceFactor(courier.performanceScore);

    const avgSpeed = 25;
    const baseTime = (distance / avgSpeed) * 60;
    
    const totalTime = baseTime * trafficFactor * weatherFactor * courierFactor;
    
    const eta = new Date(Date.now() + totalTime * 60000);
    
    const confidence = Math.min(
      0.95,
      0.7 + (courier.performanceScore / 100) * 0.25
    );

    const factors: ETAFactors = {
      baseDistance: distance,
      traffic: trafficFactor,
      weather: weatherFactor,
      courierPerformance: courierFactor,
      timeOfDay: currentHour
    };

    return {
      eta: eta.toISOString(),
      confidence,
      factors,
      trafficImpact: Math.round((trafficFactor - 1) * 100),
      weatherImpact: Math.round((weatherFactor - 1) * 100)
    };
  }

  updateETAWithProgress(
    originalETA: string,
    currentLat: number,
    currentLng: number,
    destLat: number,
    destLng: number,
    courier: Courier
  ): {
    updatedETA: string;
    confidence: number;
  } {
    const remainingDistance = this.calculateDistance(
      currentLat,
      currentLng,
      destLat,
      destLng
    );

    const currentHour = new Date().getHours();
    const trafficFactor = this.getTrafficFactor(currentHour);
    const weatherFactor = this.getWeatherFactor();
    const courierFactor = this.getCourierPerformanceFactor(courier.performanceScore);

    const avgSpeed = 25;
    const remainingTime = (remainingDistance / avgSpeed) * 60 * trafficFactor * weatherFactor * courierFactor;
    
    const updatedETA = new Date(Date.now() + remainingTime * 60000);
    
    const confidence = Math.min(
      0.98,
      0.75 + (courier.performanceScore / 100) * 0.23
    );

    return {
      updatedETA: updatedETA.toISOString(),
      confidence
    };
  }
}

export const etaEngine = new ETAEngine();
