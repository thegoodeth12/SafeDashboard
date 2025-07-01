import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").unique().notNull(),
  safeAddress: text("safe_address").notNull(),
  value: text("value").notNull(),
  gasUsed: text("gas_used").notNull(),
  isError: boolean("is_error").notNull().default(false),
  timestamp: timestamp("timestamp").notNull(),
  blockNumber: text("block_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  status: text("status").notNull(), // 'sent', 'failed'
  webhookUrl: text("webhook_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  safeAddress: text("safe_address").notNull(),
  balance: text("balance").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  alerts: many(alerts),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  walletBalance: one(walletBalances, {
    fields: [transactions.safeAddress],
    references: [walletBalances.safeAddress],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertWalletBalanceSchema = createInsertSchema(walletBalances).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type WalletBalance = typeof walletBalances.$inferSelect;
export type InsertWalletBalance = z.infer<typeof insertWalletBalanceSchema>;
