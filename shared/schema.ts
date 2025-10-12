import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  projectType: text("project_type").notNull(), // reforestation, conservation, etc.
  area: decimal("area", { precision: 10, scale: 2 }), // in hectares
  treesPlanted: decimal("trees_planted", { precision: 12, scale: 0 }),
  co2Offset: decimal("co2_offset", { precision: 12, scale: 2 }), // in tons
  imageUrl: text("image_url"),
  startDate: timestamp("start_date"),
  status: text("status").default('active'), // active, completed, planned
  geometry: jsonb("geometry"), // GeoJSON for polygon drawing
  createdAt: timestamp("created_at").defaultNow(),
});

export const pledges = pgTable("pledges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  treesCount: decimal("trees_count", { precision: 10, scale: 0 }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertPledgeSchema = createInsertSchema(pledges).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertPledge = z.infer<typeof insertPledgeSchema>;
export type Pledge = typeof pledges.$inferSelect;
