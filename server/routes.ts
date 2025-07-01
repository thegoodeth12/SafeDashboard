import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transaction routes
  app.get("/api/transactions/:safeAddress", async (req, res) => {
    try {
      const { safeAddress } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getTransactions(safeAddress, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = await storage.saveTransaction(req.body);
      res.json(transaction);
    } catch (error) {
      console.error("Error saving transaction:", error);
      res.status(500).json({ error: "Failed to save transaction" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const alerts = await storage.getAlerts(limit);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alert = await storage.saveAlert(req.body);
      res.json(alert);
    } catch (error) {
      console.error("Error saving alert:", error);
      res.status(500).json({ error: "Failed to save alert" });
    }
  });

  // Wallet balance routes
  app.get("/api/balance/:safeAddress", async (req, res) => {
    try {
      const { safeAddress } = req.params;
      const balance = await storage.getLatestBalance(safeAddress);
      res.json(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.get("/api/balance/:safeAddress/history", async (req, res) => {
    try {
      const { safeAddress } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      const history = await storage.getBalanceHistory(safeAddress, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching balance history:", error);
      res.status(500).json({ error: "Failed to fetch balance history" });
    }
  });

  app.post("/api/balance", async (req, res) => {
    try {
      const balance = await storage.saveBalance(req.body);
      res.json(balance);
    } catch (error) {
      console.error("Error saving balance:", error);
      res.status(500).json({ error: "Failed to save balance" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
