import { 
  type User, type InsertUser,
  type Courier, type InsertCourier,
  type Delivery, type InsertDelivery,
  type Anomaly, type InsertAnomaly,
  type Zone, type InsertZone,
  type PerformanceMetric, type InsertPerformanceMetric,
  type EtaPrediction, type InsertEtaPrediction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Courier methods
  getCourier(id: string): Promise<Courier | undefined>;
  getAllCouriers(): Promise<Courier[]>;
  createCourier(courier: InsertCourier): Promise<Courier>;
  updateCourier(id: string, courier: Partial<InsertCourier>): Promise<Courier | undefined>;
  
  // Delivery methods
  getDelivery(id: string): Promise<Delivery | undefined>;
  getAllDeliveries(): Promise<Delivery[]>;
  getDeliveriesByCourier(courierId: string): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, delivery: Partial<InsertDelivery>): Promise<Delivery | undefined>;
  
  // Anomaly methods
  getAnomaly(id: string): Promise<Anomaly | undefined>;
  getAllAnomalies(): Promise<Anomaly[]>;
  getUnresolvedAnomalies(): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  updateAnomaly(id: string, anomaly: Partial<InsertAnomaly>): Promise<Anomaly | undefined>;
  
  // Zone methods
  getZone(id: string): Promise<Zone | undefined>;
  getAllZones(): Promise<Zone[]>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZone(id: string, zone: Partial<InsertZone>): Promise<Zone | undefined>;
  
  // Performance metrics methods
  getPerformanceMetric(id: string): Promise<PerformanceMetric | undefined>;
  getAllPerformanceMetrics(): Promise<PerformanceMetric[]>;
  getPerformanceMetricsByDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  
  // ETA prediction methods
  getEtaPrediction(id: string): Promise<EtaPrediction | undefined>;
  getEtaPredictionByDelivery(deliveryId: string): Promise<EtaPrediction | undefined>;
  createEtaPrediction(prediction: InsertEtaPrediction): Promise<EtaPrediction>;
  updateEtaPrediction(id: string, prediction: Partial<InsertEtaPrediction>): Promise<EtaPrediction | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private couriers: Map<string, Courier>;
  private deliveries: Map<string, Delivery>;
  private anomalies: Map<string, Anomaly>;
  private zones: Map<string, Zone>;
  private performanceMetrics: Map<string, PerformanceMetric>;
  private etaPredictions: Map<string, EtaPrediction>;

  constructor() {
    this.users = new Map();
    this.couriers = new Map();
    this.deliveries = new Map();
    this.anomalies = new Map();
    this.zones = new Map();
    this.performanceMetrics = new Map();
    this.etaPredictions = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed couriers
    const courierData: InsertCourier[] = [
      { name: 'John Doe', status: 'active', lat: 37.7849, lng: -122.4094, activeDeliveries: 5, performanceScore: 96, location: 'Downtown SF', vehicle: 'Bike', phone: '555-0101' },
      { name: 'Jane Smith', status: 'active', lat: 37.7649, lng: -122.4294, activeDeliveries: 3, performanceScore: 94, location: 'Mission District', vehicle: 'Van', phone: '555-0102' },
      { name: 'Mike Johnson', status: 'idle', lat: 37.7749, lng: -122.4394, activeDeliveries: 0, performanceScore: 89, location: 'SOMA', vehicle: 'Bike', phone: '555-0103' },
      { name: 'Lisa Brown', status: 'active', lat: 37.7949, lng: -122.4194, activeDeliveries: 4, performanceScore: 97, location: 'Nob Hill', vehicle: 'Car', phone: '555-0104' },
      { name: 'David Wilson', status: 'active', lat: 37.7550, lng: -122.4150, activeDeliveries: 6, performanceScore: 91, location: 'Castro', vehicle: 'Bike', phone: '555-0105' },
      { name: 'Sarah Martinez', status: 'idle', lat: 37.8080, lng: -122.4177, activeDeliveries: 0, performanceScore: 93, location: 'Fisherman\'s Wharf', vehicle: 'Van', phone: '555-0106' },
      { name: 'Chris Taylor', status: 'active', lat: 37.7750, lng: -122.4230, activeDeliveries: 2, performanceScore: 95, location: 'Hayes Valley', vehicle: 'Bike', phone: '555-0107' },
      { name: 'Amy Anderson', status: 'active', lat: 37.8020, lng: -122.4350, activeDeliveries: 5, performanceScore: 98, location: 'Marina District', vehicle: 'Car', phone: '555-0108' },
    ];
    
    courierData.forEach((courier, index) => {
      const id = `C${index + 1}`;
      this.couriers.set(id, { id, ...courier });
    });

    // Seed deliveries
    const deliveryData: InsertDelivery[] = [
      { orderId: 'ORD-8291', customerId: 'CUST-001', customerName: 'Sarah Chen', address: '742 Market St, San Francisco, CA', lat: 37.7875, lng: -122.4035, courierId: 'C1', status: 'in-transit', eta: '2:30 PM', pickupTime: '1:42 PM', priority: 'high', packageSize: 'medium' },
      { orderId: 'ORD-8284', customerId: 'CUST-002', customerName: 'Michael Park', address: '1234 Mission St, San Francisco, CA', lat: 37.7799, lng: -122.4190, courierId: 'C2', status: 'on-time', eta: '3:15 PM', pickupTime: '2:05 PM', priority: 'normal', packageSize: 'small' },
      { orderId: 'ORD-8276', customerId: 'CUST-003', customerName: 'Emily Rodriguez', address: '567 Valencia St, San Francisco, CA', lat: 37.7615, lng: -122.4213, courierId: 'C3', status: 'delayed', eta: '2:45 PM (delayed)', pickupTime: '1:30 PM', priority: 'normal', packageSize: 'large' },
      { orderId: 'ORD-8265', customerId: 'CUST-004', customerName: 'David Kim', address: '890 Folsom St, San Francisco, CA', lat: 37.7820, lng: -122.3964, courierId: 'C4', status: 'delivered', eta: '1:20 PM', actualDeliveryTime: '1:18 PM', pickupTime: '12:45 PM', priority: 'normal', packageSize: 'small' },
      { orderId: 'ORD-8253', customerId: 'CUST-005', customerName: 'Amanda Lee', address: '321 Howard St, San Francisco, CA', lat: 37.7886, lng: -122.3960, courierId: 'C1', status: 'on-time', eta: '4:00 PM', pickupTime: '3:15 PM', priority: 'low', packageSize: 'medium' },
    ];
    
    deliveryData.forEach((delivery, index) => {
      const id = `D${index + 1}`;
      this.deliveries.set(id, { id, ...delivery });
    });

    // Seed anomalies
    const anomalyData: InsertAnomaly[] = [
      { deliveryId: 'D1', orderId: 'ORD-8291', severity: 'critical', type: 'delay', title: 'Delivery Failure Risk', description: 'Courier #C-428 is running 15 minutes late, beyond recovery threshold', rootCause: 'Heavy traffic on Market St', detectedAt: '2 min ago', resolved: false },
      { deliveryId: 'D2', orderId: 'ORD-8284', severity: 'warning', type: 'route-deviation', title: 'GPS Route Deviation', description: 'Courier took alternative route, ETA updated to 3:45 PM', rootCause: 'Road construction on Mission St', detectedAt: '5 min ago', resolved: false },
      { severity: 'info', type: 'traffic', title: 'Congestion Zone Detected', description: 'High traffic in Downtown area, average delay of 8 minutes', rootCause: 'Rush hour traffic', detectedAt: '12 min ago', resolved: false },
      { deliveryId: 'D3', orderId: 'ORD-8276', severity: 'warning', type: 'delay', title: 'Package Delay Alert', description: 'Delivery running 20 minutes behind schedule', rootCause: 'Multiple stops delay', detectedAt: '18 min ago', resolved: false },
    ];
    
    anomalyData.forEach((anomaly, index) => {
      const id = `A${index + 1}`;
      this.anomalies.set(id, { id, ...anomaly });
    });

    // Seed zones
    const zoneData: InsertZone[] = [
      { name: 'Downtown SF', centerLat: 37.7875, centerLng: -122.4035, radius: 1.5, avgDelayMinutes: 12, deliveryCount: 145, alertLevel: 'high' },
      { name: 'Mission District', centerLat: 37.7599, centerLng: -122.4148, radius: 1.2, avgDelayMinutes: 8, deliveryCount: 98, alertLevel: 'medium' },
      { name: 'SOMA', centerLat: 37.7786, centerLng: -122.3893, radius: 1.0, avgDelayMinutes: 5, deliveryCount: 76, alertLevel: 'low' },
      { name: 'Marina District', centerLat: 37.8020, centerLng: -122.4380, radius: 1.3, avgDelayMinutes: 3, deliveryCount: 52, alertLevel: 'low' },
      { name: 'Castro', centerLat: 37.7609, centerLng: -122.4350, radius: 0.8, avgDelayMinutes: 6, deliveryCount: 64, alertLevel: 'medium' },
    ];
    
    zoneData.forEach((zone, index) => {
      const id = `Z${index + 1}`;
      this.zones.set(id, { id, ...zone });
    });

    // Seed performance metrics
    const today = new Date();
    const performanceData: InsertPerformanceMetric[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      performanceData.push({
        date: date.toISOString().split('T')[0],
        totalDeliveries: 150 + Math.floor(Math.random() * 50),
        onTimeDeliveries: 135 + Math.floor(Math.random() * 20),
        delayedDeliveries: 10 + Math.floor(Math.random() * 15),
        failedDeliveries: 2 + Math.floor(Math.random() * 5),
        avgDeliveryTime: 38 + Math.floor(Math.random() * 10),
        avgEtaAccuracy: 3.0 + Math.random() * 1.5,
        activeCouriers: 25 + Math.floor(Math.random() * 10),
      });
    }
    
    performanceData.forEach((metric, index) => {
      const id = `PM${index + 1}`;
      this.performanceMetrics.set(id, { id, ...metric });
    });

    // Seed ETA predictions
    const etaPredictionData: InsertEtaPrediction[] = [
      { deliveryId: 'D1', orderId: 'ORD-8291', predictedEta: '2:35 PM', confidence: 0.87, factors: ['traffic', 'weather', 'historical'], trafficImpact: 8, weatherImpact: 2, historicalAccuracy: 0.92 },
      { deliveryId: 'D2', orderId: 'ORD-8284', predictedEta: '3:15 PM', confidence: 0.94, factors: ['historical', 'courier'], trafficImpact: 3, weatherImpact: 0, historicalAccuracy: 0.95 },
      { deliveryId: 'D3', orderId: 'ORD-8276', predictedEta: '2:55 PM', confidence: 0.78, factors: ['traffic', 'delay'], trafficImpact: 15, weatherImpact: 1, historicalAccuracy: 0.88 },
    ];
    
    etaPredictionData.forEach((prediction, index) => {
      const id = `EP${index + 1}`;
      this.etaPredictions.set(id, { id, ...prediction });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Courier methods
  async getCourier(id: string): Promise<Courier | undefined> {
    return this.couriers.get(id);
  }

  async getAllCouriers(): Promise<Courier[]> {
    return Array.from(this.couriers.values());
  }

  async createCourier(insertCourier: InsertCourier): Promise<Courier> {
    const id = `C${this.couriers.size + 1}`;
    const courier: Courier = { ...insertCourier, id };
    this.couriers.set(id, courier);
    return courier;
  }

  async updateCourier(id: string, updates: Partial<InsertCourier>): Promise<Courier | undefined> {
    const courier = this.couriers.get(id);
    if (!courier) return undefined;
    const updated = { ...courier, ...updates };
    this.couriers.set(id, updated);
    return updated;
  }

  // Delivery methods
  async getDelivery(id: string): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return Array.from(this.deliveries.values());
  }

  async getDeliveriesByCourier(courierId: string): Promise<Delivery[]> {
    return Array.from(this.deliveries.values()).filter(d => d.courierId === courierId);
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = `D${this.deliveries.size + 1}`;
    const delivery: Delivery = { ...insertDelivery, id };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  async updateDelivery(id: string, updates: Partial<InsertDelivery>): Promise<Delivery | undefined> {
    const delivery = this.deliveries.get(id);
    if (!delivery) return undefined;
    const updated = { ...delivery, ...updates };
    this.deliveries.set(id, updated);
    return updated;
  }

  // Anomaly methods
  async getAnomaly(id: string): Promise<Anomaly | undefined> {
    return this.anomalies.get(id);
  }

  async getAllAnomalies(): Promise<Anomaly[]> {
    return Array.from(this.anomalies.values());
  }

  async getUnresolvedAnomalies(): Promise<Anomaly[]> {
    return Array.from(this.anomalies.values()).filter(a => !a.resolved);
  }

  async createAnomaly(insertAnomaly: InsertAnomaly): Promise<Anomaly> {
    const id = `A${this.anomalies.size + 1}`;
    const anomaly: Anomaly = { ...insertAnomaly, id };
    this.anomalies.set(id, anomaly);
    return anomaly;
  }

  async updateAnomaly(id: string, updates: Partial<InsertAnomaly>): Promise<Anomaly | undefined> {
    const anomaly = this.anomalies.get(id);
    if (!anomaly) return undefined;
    const updated = { ...anomaly, ...updates };
    this.anomalies.set(id, updated);
    return updated;
  }

  // Zone methods
  async getZone(id: string): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async getAllZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = `Z${this.zones.size + 1}`;
    const zone: Zone = { ...insertZone, id };
    this.zones.set(id, zone);
    return zone;
  }

  async updateZone(id: string, updates: Partial<InsertZone>): Promise<Zone | undefined> {
    const zone = this.zones.get(id);
    if (!zone) return undefined;
    const updated = { ...zone, ...updates };
    this.zones.set(id, updated);
    return updated;
  }

  // Performance metrics methods
  async getPerformanceMetric(id: string): Promise<PerformanceMetric | undefined> {
    return this.performanceMetrics.get(id);
  }

  async getAllPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return Array.from(this.performanceMetrics.values());
  }

  async getPerformanceMetricsByDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]> {
    return Array.from(this.performanceMetrics.values()).filter(
      m => m.date >= startDate && m.date <= endDate
    );
  }

  async createPerformanceMetric(insertMetric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = `PM${this.performanceMetrics.size + 1}`;
    const metric: PerformanceMetric = { ...insertMetric, id };
    this.performanceMetrics.set(id, metric);
    return metric;
  }

  // ETA prediction methods
  async getEtaPrediction(id: string): Promise<EtaPrediction | undefined> {
    return this.etaPredictions.get(id);
  }

  async getEtaPredictionByDelivery(deliveryId: string): Promise<EtaPrediction | undefined> {
    return Array.from(this.etaPredictions.values()).find(p => p.deliveryId === deliveryId);
  }

  async createEtaPrediction(insertPrediction: InsertEtaPrediction): Promise<EtaPrediction> {
    const id = `EP${this.etaPredictions.size + 1}`;
    const prediction: EtaPrediction = { ...insertPrediction, id };
    this.etaPredictions.set(id, prediction);
    return prediction;
  }

  async updateEtaPrediction(id: string, updates: Partial<InsertEtaPrediction>): Promise<EtaPrediction | undefined> {
    const prediction = this.etaPredictions.get(id);
    if (!prediction) return undefined;
    const updated = { ...prediction, ...updates };
    this.etaPredictions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
