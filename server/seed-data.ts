import { storage } from "./storage";
import { etaEngine } from "./eta-engine";
import { anomalyDetector } from "./anomaly-detector";

const SF_LOCATIONS = [
  { name: "Financial District", lat: 37.7949, lng: -122.3994 },
  { name: "Mission District", lat: 37.7599, lng: -122.4148 },
  { name: "SoMa", lat: 37.7749, lng: -122.4194 },
  { name: "Nob Hill", lat: 37.7919, lng: -122.4155 },
  { name: "Castro", lat: 37.7609, lng: -122.4350 },
  { name: "Haight-Ashbury", lat: 37.7692, lng: -122.4481 },
  { name: "North Beach", lat: 37.8067, lng: -122.4104 },
  { name: "Marina District", lat: 37.8021, lng: -122.4364 },
  { name: "Potrero Hill", lat: 37.7583, lng: -122.4006 },
  { name: "Sunset District", lat: 37.7599, lng: -122.4941 },
];

const PICKUP_HUBS = [
  { name: "Warehouse A", lat: 37.7849, lng: -122.3994 },
  { name: "Warehouse B", lat: 37.7649, lng: -122.4294 },
  { name: "Distribution Center", lat: 37.7749, lng: -122.4394 },
];

const COURIER_NAMES = [
  "Alex Chen", "Maria Rodriguez", "James Wilson", "Sophia Kim",
  "Michael Brown", "Emily Davis", "David Martinez", "Sarah Johnson",
  "Chris Anderson", "Jessica Lee", "Daniel Taylor", "Lisa Wang",
  "Kevin Patel", "Amanda Garcia", "Ryan Thompson"
];

const CUSTOMER_NAMES = [
  "John Smith", "Emma Thompson", "Oliver Martin", "Ava Williams",
  "Noah Davis", "Mia Garcia", "Liam Martinez", "Isabella Anderson",
  "William Taylor", "Sophia Moore", "James Jackson", "Charlotte White",
  "Benjamin Harris", "Amelia Clark", "Lucas Lewis"
];

const STREETS = [
  "Market St", "Mission St", "Valencia St", "Folsom St", "Howard St",
  "Bryant St", "Harrison St", "Van Ness Ave", "Geary Blvd", "Clement St"
];

const VEHICLE_TYPES = ["Bike", "Scooter", "Car", "Van"];
const PACKAGE_SIZES = ["Small", "Medium", "Large", "Extra Large"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addRandomOffset(lat: number, lng: number, maxOffset: number = 0.01): { lat: number; lng: number } {
  return {
    lat: lat + (Math.random() - 0.5) * maxOffset,
    lng: lng + (Math.random() - 0.5) * maxOffset
  };
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  const couriers = [];
  for (let i = 0; i < 15; i++) {
    const location = randomElement(SF_LOCATIONS);
    const position = addRandomOffset(location.lat, location.lng);
    const performanceScore = randomInt(75, 100);
    const activeDeliveries = randomInt(0, 5);
    const status = activeDeliveries > 0 ? 'active' : (Math.random() > 0.3 ? 'idle' : 'offline');

    const courier = await storage.createCourier({
      name: COURIER_NAMES[i],
      status,
      lat: position.lat,
      lng: position.lng,
      activeDeliveries,
      performanceScore,
      location: location.name,
      vehicle: randomElement(VEHICLE_TYPES),
      phone: `+1${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`
    });
    couriers.push(courier);
  }
  console.log(`✅ Created ${couriers.length} couriers`);

  const zones = [];
  for (const location of SF_LOCATIONS) {
    const zone = await storage.createZone({
      name: location.name,
      centerLat: location.lat,
      centerLng: location.lng,
      radius: randomInt(500, 2000) / 1000,
      avgDelayMinutes: randomInt(0, 30),
      deliveryCount: randomInt(50, 500),
      alertLevel: randomInt(0, 30) > 20 ? 'high' : (randomInt(0, 30) > 10 ? 'medium' : 'low')
    });
    zones.push(zone);
  }
  console.log(`✅ Created ${zones.length} zones`);

  const deliveries = [];
  for (let i = 0; i < 30; i++) {
    const courier = randomElement(couriers.filter(c => c.status !== 'offline'));
    const destination = randomElement(SF_LOCATIONS);
    const destPosition = addRandomOffset(destination.lat, destination.lng);
    const pickup = randomElement(PICKUP_HUBS);
    const priority = randomElement(PRIORITIES);
    const packageSize = randomElement(PACKAGE_SIZES);

    const etaResult = etaEngine.calculateETA(
      { lat: destPosition.lat, lng: destPosition.lng },
      courier,
      pickup.lat,
      pickup.lng
    );

    const statuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'failed'];
    const weights = [0.1, 0.2, 0.4, 0.2, 0.1];
    const rand = Math.random();
    let cumulative = 0;
    let status = statuses[0];
    for (let j = 0; j < statuses.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        status = statuses[j];
        break;
      }
    }

    const delivery = await storage.createDelivery({
      orderId: `ORD-${10000 + i}`,
      customerId: `CUST-${randomInt(1000, 9999)}`,
      customerName: randomElement(CUSTOMER_NAMES),
      address: `${randomInt(100, 9999)} ${randomElement(STREETS)}, San Francisco, CA ${randomInt(94102, 94199)}`,
      lat: destPosition.lat,
      lng: destPosition.lng,
      courierId: courier.id,
      status,
      eta: etaResult.eta,
      actualDeliveryTime: status === 'delivered' ? new Date(Date.now() - randomInt(0, 3600000)).toISOString() : null,
      pickupTime: ['picked_up', 'in_transit', 'delivered'].includes(status) 
        ? new Date(Date.now() - randomInt(600000, 3600000)).toISOString() 
        : null,
      priority,
      packageSize,
      specialInstructions: Math.random() > 0.7 ? "Leave at door" : null
    });
    deliveries.push(delivery);

    await storage.createEtaPrediction({
      deliveryId: delivery.id,
      orderId: delivery.orderId,
      predictedEta: etaResult.eta,
      confidence: etaResult.confidence,
      factors: [
        `Distance: ${etaResult.factors.baseDistance.toFixed(1)} km`,
        `Traffic: ${etaResult.factors.traffic.toFixed(2)}x`,
        `Weather: ${etaResult.factors.weather.toFixed(2)}x`,
        `Performance: ${etaResult.factors.courierPerformance.toFixed(2)}x`
      ],
      trafficImpact: etaResult.trafficImpact,
      weatherImpact: etaResult.weatherImpact,
      historicalAccuracy: 0.85 + Math.random() * 0.1
    });
  }
  console.log(`✅ Created ${deliveries.length} deliveries with ETA predictions`);

  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit');
  const anomalyCount = Math.min(5, activeDeliveries.length);
  
  for (let i = 0; i < anomalyCount; i++) {
    const delivery = activeDeliveries[i];
    const courier = couriers.find(c => c.id === delivery.courierId)!;
    const pickup = randomElement(PICKUP_HUBS);
    
    const anomalyResult = anomalyDetector.detectDelayAnomaly(
      delivery,
      courier,
      pickup.lat,
      pickup.lng
    );

    if (anomalyResult.detected && anomalyResult.anomaly) {
      await storage.createAnomaly(anomalyResult.anomaly);
    }
  }

  for (const courier of couriers.slice(0, 3)) {
    const perfAnomaly = anomalyDetector.detectPerformanceAnomaly(courier);
    if (perfAnomaly.detected && perfAnomaly.anomaly) {
      await storage.createAnomaly(perfAnomaly.anomaly);
    }
  }

  const anomalies = await storage.getAllAnomalies();
  console.log(`✅ Created ${anomalies.length} anomalies`);

  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const totalDeliveries = randomInt(100, 300);
    const onTimeDeliveries = Math.floor(totalDeliveries * (0.75 + Math.random() * 0.2));
    const delayedDeliveries = Math.floor(totalDeliveries * (0.05 + Math.random() * 0.15));
    const failedDeliveries = totalDeliveries - onTimeDeliveries - delayedDeliveries;
    
    await storage.createPerformanceMetric({
      date: date.toISOString().split('T')[0],
      totalDeliveries,
      onTimeDeliveries,
      delayedDeliveries,
      failedDeliveries,
      avgDeliveryTime: randomInt(25, 45),
      avgEtaAccuracy: 0.80 + Math.random() * 0.15,
      activeCouriers: randomInt(10, 15)
    });
  }
  console.log(`✅ Created 30 days of performance metrics`);

  console.log("🎉 Database seeding completed successfully!");
}
