import { 
  type User, type InsertUser,
  type Courier, type InsertCourier,
  type Delivery, type InsertDelivery,
  type Anomaly, type InsertAnomaly,
  type Zone, type InsertZone,
  type PerformanceMetric, type InsertPerformanceMetric,
  type EtaPrediction, type InsertEtaPrediction,
  users, couriers, deliveries, anomalies, zones, performanceMetrics, etaPredictions
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCourier(id: string): Promise<Courier | undefined>;
  getAllCouriers(): Promise<Courier[]>;
  createCourier(courier: InsertCourier): Promise<Courier>;
  updateCourier(id: string, courier: Partial<Courier>): Promise<Courier | undefined>;
  deleteCourier(id: string): Promise<boolean>;
  
  getDelivery(id: string): Promise<Delivery | undefined>;
  getAllDeliveries(): Promise<Delivery[]>;
  getDeliveriesByCourier(courierId: string): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: string, delivery: Partial<Delivery>): Promise<Delivery | undefined>;
  deleteDelivery(id: string): Promise<boolean>;
  
  getAnomaly(id: string): Promise<Anomaly | undefined>;
  getAllAnomalies(): Promise<Anomaly[]>;
  getUnresolvedAnomalies(): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  updateAnomaly(id: string, anomaly: Partial<Anomaly>): Promise<Anomaly | undefined>;
  deleteAnomaly(id: string): Promise<boolean>;
  
  getZone(id: string): Promise<Zone | undefined>;
  getAllZones(): Promise<Zone[]>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZone(id: string, zone: Partial<Zone>): Promise<Zone | undefined>;
  deleteZone(id: string): Promise<boolean>;
  
  getPerformanceMetric(id: string): Promise<PerformanceMetric | undefined>;
  getAllPerformanceMetrics(): Promise<PerformanceMetric[]>;
  getPerformanceMetricsByDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  
  getEtaPrediction(id: string): Promise<EtaPrediction | undefined>;
  getEtaPredictionByDelivery(deliveryId: string): Promise<EtaPrediction | undefined>;
  createEtaPrediction(prediction: InsertEtaPrediction): Promise<EtaPrediction>;
  updateEtaPrediction(id: string, prediction: Partial<EtaPrediction>): Promise<EtaPrediction | undefined>;
}

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getCourier(id: string): Promise<Courier | undefined> {
    const result = await this.db.select().from(couriers).where(eq(couriers.id, id)).limit(1);
    return result[0];
  }

  async getAllCouriers(): Promise<Courier[]> {
    return await this.db.select().from(couriers);
  }

  async createCourier(insertCourier: InsertCourier): Promise<Courier> {
    const id = randomUUID();
    const result = await this.db.insert(couriers).values({ id, ...insertCourier }).returning();
    return result[0];
  }

  async updateCourier(id: string, updates: Partial<Courier>): Promise<Courier | undefined> {
    const result = await this.db.update(couriers).set(updates).where(eq(couriers.id, id)).returning();
    return result[0];
  }

  async deleteCourier(id: string): Promise<boolean> {
    const result = await this.db.delete(couriers).where(eq(couriers.id, id)).returning();
    return result.length > 0;
  }

  async getDelivery(id: string): Promise<Delivery | undefined> {
    const result = await this.db.select().from(deliveries).where(eq(deliveries.id, id)).limit(1);
    return result[0];
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return await this.db.select().from(deliveries);
  }

  async getDeliveriesByCourier(courierId: string): Promise<Delivery[]> {
    return await this.db.select().from(deliveries).where(eq(deliveries.courierId, courierId));
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = randomUUID();
    const result = await this.db.insert(deliveries).values({ id, ...insertDelivery }).returning();
    return result[0];
  }

  async updateDelivery(id: string, updates: Partial<Delivery>): Promise<Delivery | undefined> {
    const result = await this.db.update(deliveries).set(updates).where(eq(deliveries.id, id)).returning();
    return result[0];
  }

  async deleteDelivery(id: string): Promise<boolean> {
    const result = await this.db.delete(deliveries).where(eq(deliveries.id, id)).returning();
    return result.length > 0;
  }

  async getAnomaly(id: string): Promise<Anomaly | undefined> {
    const result = await this.db.select().from(anomalies).where(eq(anomalies.id, id)).limit(1);
    return result[0];
  }

  async getAllAnomalies(): Promise<Anomaly[]> {
    return await this.db.select().from(anomalies);
  }

  async getUnresolvedAnomalies(): Promise<Anomaly[]> {
    return await this.db.select().from(anomalies).where(eq(anomalies.resolved, false));
  }

  async createAnomaly(insertAnomaly: InsertAnomaly): Promise<Anomaly> {
    const id = randomUUID();
    const result = await this.db.insert(anomalies).values({ id, ...insertAnomaly }).returning();
    return result[0];
  }

  async updateAnomaly(id: string, updates: Partial<Anomaly>): Promise<Anomaly | undefined> {
    const result = await this.db.update(anomalies).set(updates).where(eq(anomalies.id, id)).returning();
    return result[0];
  }

  async deleteAnomaly(id: string): Promise<boolean> {
    const result = await this.db.delete(anomalies).where(eq(anomalies.id, id)).returning();
    return result.length > 0;
  }

  async getZone(id: string): Promise<Zone | undefined> {
    const result = await this.db.select().from(zones).where(eq(zones.id, id)).limit(1);
    return result[0];
  }

  async getAllZones(): Promise<Zone[]> {
    return await this.db.select().from(zones);
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = randomUUID();
    const result = await this.db.insert(zones).values({ id, ...insertZone }).returning();
    return result[0];
  }

  async updateZone(id: string, updates: Partial<Zone>): Promise<Zone | undefined> {
    const result = await this.db.update(zones).set(updates).where(eq(zones.id, id)).returning();
    return result[0];
  }

  async deleteZone(id: string): Promise<boolean> {
    const result = await this.db.delete(zones).where(eq(zones.id, id)).returning();
    return result.length > 0;
  }

  async getPerformanceMetric(id: string): Promise<PerformanceMetric | undefined> {
    const result = await this.db.select().from(performanceMetrics).where(eq(performanceMetrics.id, id)).limit(1);
    return result[0];
  }

  async getAllPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return await this.db.select().from(performanceMetrics);
  }

  async getPerformanceMetricsByDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]> {
    return await this.db.select().from(performanceMetrics)
      .where(and(
        gte(performanceMetrics.date, startDate),
        lte(performanceMetrics.date, endDate)
      ));
  }

  async createPerformanceMetric(insertMetric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = randomUUID();
    const result = await this.db.insert(performanceMetrics).values({ id, ...insertMetric }).returning();
    return result[0];
  }

  async getEtaPrediction(id: string): Promise<EtaPrediction | undefined> {
    const result = await this.db.select().from(etaPredictions).where(eq(etaPredictions.id, id)).limit(1);
    return result[0];
  }

  async getEtaPredictionByDelivery(deliveryId: string): Promise<EtaPrediction | undefined> {
    const result = await this.db.select().from(etaPredictions).where(eq(etaPredictions.deliveryId, deliveryId)).limit(1);
    return result[0];
  }

  async createEtaPrediction(insertPrediction: InsertEtaPrediction): Promise<EtaPrediction> {
    const id = randomUUID();
    const result = await this.db.insert(etaPredictions).values({ id, ...insertPrediction }).returning();
    return result[0];
  }

  async updateEtaPrediction(id: string, updates: Partial<EtaPrediction>): Promise<EtaPrediction | undefined> {
    const result = await this.db.update(etaPredictions).set(updates).where(eq(etaPredictions.id, id)).returning();
    return result[0];
  }
}

export const storage = new PostgresStorage();
