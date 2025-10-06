import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCourierSchema, 
  insertDeliverySchema, 
  insertAnomalySchema, 
  insertZoneSchema,
  insertPerformanceMetricSchema,
  insertEtaPredictionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Courier routes
  app.get("/api/couriers", async (_req, res) => {
    try {
      const couriers = await storage.getAllCouriers();
      res.json(couriers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch couriers" });
    }
  });

  app.get("/api/couriers/:id", async (req, res) => {
    try {
      const courier = await storage.getCourier(req.params.id);
      if (!courier) {
        return res.status(404).json({ error: "Courier not found" });
      }
      res.json(courier);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courier" });
    }
  });

  app.post("/api/couriers", async (req, res) => {
    try {
      const validatedData = insertCourierSchema.parse(req.body);
      const courier = await storage.createCourier(validatedData);
      res.status(201).json(courier);
    } catch (error) {
      res.status(400).json({ error: "Invalid courier data" });
    }
  });

  app.patch("/api/couriers/:id", async (req, res) => {
    try {
      const validatedData = insertCourierSchema.partial().parse(req.body);
      const courier = await storage.updateCourier(req.params.id, validatedData);
      if (!courier) {
        return res.status(404).json({ error: "Courier not found" });
      }
      res.json(courier);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid courier data" });
      }
      res.status(500).json({ error: "Failed to update courier" });
    }
  });

  app.delete("/api/couriers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCourier(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Courier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete courier" });
    }
  });

  // Delivery routes
  app.get("/api/deliveries", async (_req, res) => {
    try {
      const deliveries = await storage.getAllDeliveries();
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliveries" });
    }
  });

  app.get("/api/deliveries/:id", async (req, res) => {
    try {
      const delivery = await storage.getDelivery(req.params.id);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delivery" });
    }
  });

  app.get("/api/deliveries/courier/:courierId", async (req, res) => {
    try {
      const deliveries = await storage.getDeliveriesByCourier(req.params.courierId);
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliveries" });
    }
  });

  app.post("/api/deliveries", async (req, res) => {
    try {
      const validatedData = insertDeliverySchema.parse(req.body);
      const delivery = await storage.createDelivery(validatedData);
      res.status(201).json(delivery);
    } catch (error) {
      res.status(400).json({ error: "Invalid delivery data" });
    }
  });

  app.patch("/api/deliveries/:id", async (req, res) => {
    try {
      const validatedData = insertDeliverySchema.partial().parse(req.body);
      const delivery = await storage.updateDelivery(req.params.id, validatedData);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid delivery data" });
      }
      res.status(500).json({ error: "Failed to update delivery" });
    }
  });

  app.delete("/api/deliveries/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDelivery(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete delivery" });
    }
  });

  // Anomaly routes
  app.get("/api/anomalies", async (_req, res) => {
    try {
      const anomalies = await storage.getAllAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anomalies" });
    }
  });

  app.get("/api/anomalies/unresolved", async (_req, res) => {
    try {
      const anomalies = await storage.getUnresolvedAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unresolved anomalies" });
    }
  });

  app.get("/api/anomalies/:id", async (req, res) => {
    try {
      const anomaly = await storage.getAnomaly(req.params.id);
      if (!anomaly) {
        return res.status(404).json({ error: "Anomaly not found" });
      }
      res.json(anomaly);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anomaly" });
    }
  });

  app.post("/api/anomalies", async (req, res) => {
    try {
      const validatedData = insertAnomalySchema.parse(req.body);
      const anomaly = await storage.createAnomaly(validatedData);
      res.status(201).json(anomaly);
    } catch (error) {
      res.status(400).json({ error: "Invalid anomaly data" });
    }
  });

  app.patch("/api/anomalies/:id", async (req, res) => {
    try {
      const validatedData = insertAnomalySchema.partial().parse(req.body);
      const anomaly = await storage.updateAnomaly(req.params.id, validatedData);
      if (!anomaly) {
        return res.status(404).json({ error: "Anomaly not found" });
      }
      res.json(anomaly);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid anomaly data" });
      }
      res.status(500).json({ error: "Failed to update anomaly" });
    }
  });

  app.delete("/api/anomalies/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnomaly(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Anomaly not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete anomaly" });
    }
  });

  // Zone routes
  app.get("/api/zones", async (_req, res) => {
    try {
      const zones = await storage.getAllZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch zones" });
    }
  });

  app.get("/api/zones/:id", async (req, res) => {
    try {
      const zone = await storage.getZone(req.params.id);
      if (!zone) {
        return res.status(404).json({ error: "Zone not found" });
      }
      res.json(zone);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch zone" });
    }
  });

  app.post("/api/zones", async (req, res) => {
    try {
      const validatedData = insertZoneSchema.parse(req.body);
      const zone = await storage.createZone(validatedData);
      res.status(201).json(zone);
    } catch (error) {
      res.status(400).json({ error: "Invalid zone data" });
    }
  });

  app.patch("/api/zones/:id", async (req, res) => {
    try {
      const validatedData = insertZoneSchema.partial().parse(req.body);
      const zone = await storage.updateZone(req.params.id, validatedData);
      if (!zone) {
        return res.status(404).json({ error: "Zone not found" });
      }
      res.json(zone);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid zone data" });
      }
      res.status(500).json({ error: "Failed to update zone" });
    }
  });

  app.delete("/api/zones/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteZone(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Zone not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete zone" });
    }
  });

  // Performance metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let metrics;
      
      if (startDate && endDate) {
        metrics = await storage.getPerformanceMetricsByDateRange(
          String(startDate),
          String(endDate)
        );
      } else {
        metrics = await storage.getAllPerformanceMetrics();
      }
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
  });

  app.get("/api/metrics/:id", async (req, res) => {
    try {
      const metric = await storage.getPerformanceMetric(req.params.id);
      if (!metric) {
        return res.status(404).json({ error: "Performance metric not found" });
      }
      res.json(metric);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metric" });
    }
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const validatedData = insertPerformanceMetricSchema.parse(req.body);
      const metric = await storage.createPerformanceMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid performance metric data" });
    }
  });

  // ETA prediction routes
  app.get("/api/eta-predictions/:id", async (req, res) => {
    try {
      const prediction = await storage.getEtaPrediction(req.params.id);
      if (!prediction) {
        return res.status(404).json({ error: "ETA prediction not found" });
      }
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ETA prediction" });
    }
  });

  app.get("/api/eta-predictions/delivery/:deliveryId", async (req, res) => {
    try {
      const prediction = await storage.getEtaPredictionByDelivery(req.params.deliveryId);
      if (!prediction) {
        return res.status(404).json({ error: "ETA prediction not found for delivery" });
      }
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ETA prediction" });
    }
  });

  app.post("/api/eta-predictions", async (req, res) => {
    try {
      const validatedData = insertEtaPredictionSchema.parse(req.body);
      const prediction = await storage.createEtaPrediction(validatedData);
      res.status(201).json(prediction);
    } catch (error) {
      res.status(400).json({ error: "Invalid ETA prediction data" });
    }
  });

  app.patch("/api/eta-predictions/:id", async (req, res) => {
    try {
      const validatedData = insertEtaPredictionSchema.partial().parse(req.body);
      const prediction = await storage.updateEtaPrediction(req.params.id, validatedData);
      if (!prediction) {
        return res.status(404).json({ error: "ETA prediction not found" });
      }
      res.json(prediction);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid ETA prediction data" });
      }
      res.status(500).json({ error: "Failed to update ETA prediction" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
