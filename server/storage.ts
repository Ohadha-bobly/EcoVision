import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Pledge,
  type InsertPledge,
  users,
  projects,
  pledges,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Pledges
  getAllPledges(): Promise<Pledge[]>;
  getPledgesByUser(userId: string): Promise<Pledge[]>;
  getPledgesByProject(projectId: string): Promise<Pledge[]>;
  createPledge(pledge: InsertPledge): Promise<Pledge>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Pledges
  async getAllPledges(): Promise<Pledge[]> {
    return await db.select().from(pledges);
  }

  async getPledgesByUser(userId: string): Promise<Pledge[]> {
    return await db.select().from(pledges).where(eq(pledges.userId, userId));
  }

  async getPledgesByProject(projectId: string): Promise<Pledge[]> {
    return await db.select().from(pledges).where(eq(pledges.projectId, projectId));
  }

  async createPledge(insertPledge: InsertPledge): Promise<Pledge> {
    const [pledge] = await db.insert(pledges).values(insertPledge).returning();
    return pledge;
  }
}

export const storage = new DbStorage();
