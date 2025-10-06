import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const couriers = pgTable("couriers", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  activeDeliveries: integer("active_deliveries").notNull(),
  performanceScore: integer("performance_score").notNull(),
  location: text("location").notNull(),
  vehicle: text("vehicle"),
  phone: text("phone"),
  company: text("company").notNull().default('Other'),
});

export const insertCourierSchema = createInsertSchema(couriers).omit({ id: true });
export type InsertCourier = z.infer<typeof insertCourierSchema>;
export type Courier = typeof couriers.$inferSelect;

export const deliveries = pgTable("deliveries", {
  id: varchar("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  courierId: varchar("courier_id").notNull(),
  status: text("status").notNull(),
  eta: text("eta").notNull(),
  actualDeliveryTime: text("actual_delivery_time"),
  pickupTime: text("pickup_time"),
  priority: text("priority").notNull(),
  packageSize: text("package_size"),
  specialInstructions: text("special_instructions"),
  company: text("company").notNull().default('Other'),
});

export const insertDeliverySchema = createInsertSchema(deliveries).omit({ id: true });
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;

export const anomalies = pgTable("anomalies", {
  id: varchar("id").primaryKey(),
  deliveryId: varchar("delivery_id"),
  orderId: text("order_id"),
  severity: text("severity").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rootCause: text("root_cause"),
  detectedAt: text("detected_at").notNull(),
  resolved: boolean("resolved").notNull(),
  resolution: text("resolution"),
});

export const insertAnomalySchema = createInsertSchema(anomalies).omit({ id: true });
export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type Anomaly = typeof anomalies.$inferSelect;

export const zones = pgTable("zones", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  centerLat: real("center_lat").notNull(),
  centerLng: real("center_lng").notNull(),
  radius: real("radius").notNull(),
  avgDelayMinutes: integer("avg_delay_minutes").notNull(),
  deliveryCount: integer("delivery_count").notNull(),
  alertLevel: text("alert_level").notNull(),
});

export const insertZoneSchema = createInsertSchema(zones).omit({ id: true });
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Zone = typeof zones.$inferSelect;

export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey(),
  date: text("date").notNull(),
  totalDeliveries: integer("total_deliveries").notNull(),
  onTimeDeliveries: integer("on_time_deliveries").notNull(),
  delayedDeliveries: integer("delayed_deliveries").notNull(),
  failedDeliveries: integer("failed_deliveries").notNull(),
  avgDeliveryTime: integer("avg_delivery_time").notNull(),
  avgEtaAccuracy: real("avg_eta_accuracy").notNull(),
  activeCouriers: integer("active_couriers").notNull(),
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({ id: true });
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;

export const etaPredictions = pgTable("eta_predictions", {
  id: varchar("id").primaryKey(),
  deliveryId: varchar("delivery_id").notNull(),
  orderId: text("order_id").notNull(),
  predictedEta: text("predicted_eta").notNull(),
  confidence: real("confidence").notNull(),
  factors: text("factors").array(),
  trafficImpact: integer("traffic_impact"),
  weatherImpact: integer("weather_impact"),
  historicalAccuracy: real("historical_accuracy"),
});

export const insertEtaPredictionSchema = createInsertSchema(etaPredictions).omit({ id: true });
export type InsertEtaPrediction = z.infer<typeof insertEtaPredictionSchema>;
export type EtaPrediction = typeof etaPredictions.$inferSelect;
