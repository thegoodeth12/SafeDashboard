import { users, transactions, alerts, walletBalances, type User, type InsertUser, type Transaction, type InsertTransaction, type Alert, type InsertAlert, type WalletBalance, type InsertWalletBalance } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactions(safeAddress: string, limit?: number): Promise<Transaction[]>;
  saveTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionByHash(hash: string): Promise<Transaction | undefined>;
  
  // Alert methods
  getAlerts(limit?: number): Promise<Alert[]>;
  saveAlert(alert: InsertAlert): Promise<Alert>;
  
  // Wallet balance methods
  getLatestBalance(safeAddress: string): Promise<WalletBalance | undefined>;
  saveBalance(balance: InsertWalletBalance): Promise<WalletBalance>;
  getBalanceHistory(safeAddress: string, limit?: number): Promise<WalletBalance[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Transaction methods
  async getTransactions(safeAddress: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.safeAddress, safeAddress))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async saveTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [savedTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .onConflictDoNothing({ target: transactions.hash })
      .returning();
    
    if (!savedTransaction) {
      // Transaction already exists, fetch it
      const [existing] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.hash, transaction.hash));
      return existing;
    }
    
    return savedTransaction;
  }

  async getTransactionByHash(hash: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.hash, hash));
    return transaction || undefined;
  }

  // Alert methods
  async getAlerts(limit = 50): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .orderBy(desc(alerts.createdAt))
      .limit(limit);
  }

  async saveAlert(alert: InsertAlert): Promise<Alert> {
    const [savedAlert] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return savedAlert;
  }

  // Wallet balance methods
  async getLatestBalance(safeAddress: string): Promise<WalletBalance | undefined> {
    const [balance] = await db
      .select()
      .from(walletBalances)
      .where(eq(walletBalances.safeAddress, safeAddress))
      .orderBy(desc(walletBalances.timestamp))
      .limit(1);
    return balance || undefined;
  }

  async saveBalance(balance: InsertWalletBalance): Promise<WalletBalance> {
    const [savedBalance] = await db
      .insert(walletBalances)
      .values(balance)
      .returning();
    return savedBalance;
  }

  async getBalanceHistory(safeAddress: string, limit = 100): Promise<WalletBalance[]> {
    return await db
      .select()
      .from(walletBalances)
      .where(eq(walletBalances.safeAddress, safeAddress))
      .orderBy(desc(walletBalances.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
