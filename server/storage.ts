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
  updateCourier(id: string, courier: Partial<Courier>): Promise<Courier | undefined>;
  deleteCourier(id: string): Promise<boolean>;
  
  // Delivery methods
  getDelivery(id: string): Promise<Delivery | undefined>;
  getAllDeliveries(): Promise<Delivery[]>;
  getDeliveriesByCourier(courierId: string): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, delivery: Partial<Delivery>): Promise<Delivery | undefined>;
  deleteDelivery(id: string): Promise<boolean>;
  
  // Anomaly methods
  getAnomaly(id: string): Promise<Anomaly | undefined>;
  getAllAnomalies(): Promise<Anomaly[]>;
  getUnresolvedAnomalies(): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  updateAnomaly(id: string, anomaly: Partial<Anomaly>): Promise<Anomaly | undefined>;
  deleteAnomaly(id: string): Promise<boolean>;
  
  // Zone methods
  getZone(id: string): Promise<Zone | undefined>;
  getAllZones(): Promise<Zone[]>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZone(id: string, zone: Partial<Zone>): Promise<Zone | undefined>;
  deleteZone(id: string): Promise<boolean>;
  
  // Performance metrics methods
  getPerformanceMetric(id: string): Promise<PerformanceMetric | undefined>;
  getAllPerformanceMetrics(): Promise<PerformanceMetric[]>;
  getPerformanceMetricsByDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  
  // ETA prediction methods
  getEtaPrediction(id: string): Promise<EtaPrediction | undefined>;
  getEtaPredictionByDelivery(deliveryId: string): Promise<EtaPrediction | undefined>;
  createEtaPrediction(prediction: InsertEtaPrediction): Promise<EtaPrediction>;
  updateEtaPrediction(id: string, prediction: Partial<EtaPrediction>): Promise<EtaPrediction | undefined>;
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
    const id = randomUUID();
    const courier: Courier = { 
      id, 
      ...insertCourier,
      vehicle: insertCourier.vehicle ?? null,
      phone: insertCourier.phone ?? null
    };
    this.couriers.set(id, courier);
    return courier;
  }

  async updateCourier(id: string, updates: Partial<Courier>): Promise<Courier | undefined> {
    const courier = this.couriers.get(id);
    if (!courier) return undefined;
    const updated = { ...courier, ...updates };
    this.couriers.set(id, updated);
    return updated;
  }

  async deleteCourier(id: string): Promise<boolean> {
    return this.couriers.delete(id);
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
    const id = randomUUID();
    const delivery: Delivery = { 
      id, 
      ...insertDelivery,
      actualDeliveryTime: insertDelivery.actualDeliveryTime ?? null,
      pickupTime: insertDelivery.pickupTime ?? null,
      packageSize: insertDelivery.packageSize ?? null,
      specialInstructions: insertDelivery.specialInstructions ?? null
    };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  async updateDelivery(id: string, updates: Partial<Delivery>): Promise<Delivery | undefined> {
    const delivery = this.deliveries.get(id);
    if (!delivery) return undefined;
    const updated = { ...delivery, ...updates };
    this.deliveries.set(id, updated);
    return updated;
  }

  async deleteDelivery(id: string): Promise<boolean> {
    return this.deliveries.delete(id);
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
    const id = randomUUID();
    const anomaly: Anomaly = { 
      id, 
      ...insertAnomaly,
      deliveryId: insertAnomaly.deliveryId ?? null,
      orderId: insertAnomaly.orderId ?? null,
      rootCause: insertAnomaly.rootCause ?? null,
      resolution: insertAnomaly.resolution ?? null
    };
    this.anomalies.set(id, anomaly);
    return anomaly;
  }

  async updateAnomaly(id: string, updates: Partial<Anomaly>): Promise<Anomaly | undefined> {
    const anomaly = this.anomalies.get(id);
    if (!anomaly) return undefined;
    const updated = { ...anomaly, ...updates };
    this.anomalies.set(id, updated);
    return updated;
  }

  async deleteAnomaly(id: string): Promise<boolean> {
    return this.anomalies.delete(id);
  }

  // Zone methods
  async getZone(id: string): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async getAllZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = randomUUID();
    const zone: Zone = { id, ...insertZone };
    this.zones.set(id, zone);
    return zone;
  }

  async updateZone(id: string, updates: Partial<Zone>): Promise<Zone | undefined> {
    const zone = this.zones.get(id);
    if (!zone) return undefined;
    const updated = { ...zone, ...updates };
    this.zones.set(id, updated);
    return updated;
  }

  async deleteZone(id: string): Promise<boolean> {
    return this.zones.delete(id);
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
    const id = randomUUID();
    const metric: PerformanceMetric = { id, ...insertMetric };
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
    const id = randomUUID();
    const prediction: EtaPrediction = { 
      id, 
      ...insertPrediction,
      factors: insertPrediction.factors ?? null,
      trafficImpact: insertPrediction.trafficImpact ?? null,
      weatherImpact: insertPrediction.weatherImpact ?? null,
      historicalAccuracy: insertPrediction.historicalAccuracy ?? null
    };
    this.etaPredictions.set(id, prediction);
    return prediction;
  }

  async updateEtaPrediction(id: string, updates: Partial<EtaPrediction>): Promise<EtaPrediction | undefined> {
    const prediction = this.etaPredictions.get(id);
    if (!prediction) return undefined;
    const updated = { ...prediction, ...updates };
    this.etaPredictions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
