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
import multer from "multer";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { randomUUID } from "crypto";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/csv',
      'text/x-csv',
      'application/x-csv'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Config route
  app.get("/api/config", async (_req, res) => {
    try {
      res.json({
        mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || ''
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

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

  // File upload route
  app.post("/api/upload-data", (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

      const { company } = req.body;
      if (!company) {
        return res.status(400).json({ error: "Company name is required" });
      }

      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;
      let data: any[] = [];

      // Parse Excel files
      if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } 
      // Parse CSV files
      else if (filename.endsWith('.csv')) {
        const csvString = fileBuffer.toString('utf-8');
        const parseResult = Papa.parse(csvString, { header: true, skipEmptyLines: true });
        data = parseResult.data;
      } 
      else {
        return res.status(400).json({ error: "Unsupported file format. Please upload CSV or Excel files." });
      }

      if (data.length === 0) {
        return res.status(400).json({ error: "File contains no data" });
      }

      let couriersCreated = 0;
      let deliveriesCreated = 0;
      const errors: string[] = [];

      // Process each row
      for (const row of data) {
        try {
          // Check if row is for courier or delivery based on available fields
          const isCourier = 'courierName' in row || 'courier_name' in row || 'name' in row;
          const isDelivery = 'orderId' in row || 'order_id' in row;

          if (isCourier && !isDelivery) {
            // Create courier
            const courierData = {
              id: row.id || row.courierId || row.courier_id || randomUUID(),
              name: row.name || row.courierName || row.courier_name || 'Unknown',
              status: row.status || 'available',
              lat: parseFloat(row.lat || row.latitude || '28.6139'),
              lng: parseFloat(row.lng || row.longitude || '77.2090'),
              activeDeliveries: parseInt(row.activeDeliveries || row.active_deliveries || '0'),
              performanceScore: parseInt(row.performanceScore || row.performance_score || '85'),
              location: row.location || row.area || 'Unknown',
              vehicle: row.vehicle || 'bike',
              phone: row.phone || row.phoneNumber || row.phone_number || null,
              company: company
            };
            
            const validated = insertCourierSchema.parse(courierData);
            await storage.createCourier(validated);
            couriersCreated++;
          } else if (isDelivery) {
            // Create delivery
            const deliveryData = {
              id: row.id || row.deliveryId || row.delivery_id || randomUUID(),
              orderId: row.orderId || row.order_id || randomUUID(),
              customerId: row.customerId || row.customer_id || randomUUID(),
              customerName: row.customerName || row.customer_name || 'Unknown Customer',
              address: row.address || row.deliveryAddress || row.delivery_address || 'Unknown Address',
              lat: parseFloat(row.lat || row.latitude || row.delivery_lat || '28.6139'),
              lng: parseFloat(row.lng || row.longitude || row.delivery_lng || '77.2090'),
              courierId: row.courierId || row.courier_id || randomUUID(),
              status: row.status || 'pending',
              eta: row.eta || new Date(Date.now() + 30 * 60000).toISOString(),
              actualDeliveryTime: row.actualDeliveryTime || row.actual_delivery_time || null,
              pickupTime: row.pickupTime || row.pickup_time || null,
              priority: row.priority || 'medium',
              packageSize: row.packageSize || row.package_size || 'medium',
              specialInstructions: row.specialInstructions || row.special_instructions || null,
              company: company
            };
            
            const validated = insertDeliverySchema.parse(deliveryData);
            await storage.createDelivery(validated);
            deliveriesCreated++;
          }
        } catch (error) {
          errors.push(`Row error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

        res.json({
          success: true,
          message: `Data imported successfully for ${company}`,
          stats: {
            couriersCreated,
            deliveriesCreated,
            errors: errors.length,
            errorDetails: errors.slice(0, 5)
          }
        });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: "Failed to process file" });
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
