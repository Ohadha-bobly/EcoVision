import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertPledgeSchema, insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Pledges endpoints
  app.get("/api/pledges", async (req, res) => {
    try {
      const { userId, projectId } = req.query;
      
      let pledges;
      if (userId) {
        pledges = await storage.getPledgesByUser(userId as string);
      } else if (projectId) {
        pledges = await storage.getPledgesByProject(projectId as string);
      } else {
        pledges = await storage.getAllPledges();
      }
      
      res.json(pledges);
    } catch (error) {
      console.error("Error fetching pledges:", error);
      res.status(500).json({ error: "Failed to fetch pledges" });
    }
  });

  app.post("/api/pledges", async (req, res) => {
    try {
      const validatedData = insertPledgeSchema.parse(req.body);
      const pledge = await storage.createPledge(validatedData);
      res.status(201).json(pledge);
    } catch (error) {
      console.error("Error creating pledge:", error);
      res.status(400).json({ error: "Invalid pledge data" });
    }
  });

  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Seed some initial projects for demo purposes
  app.post("/api/seed", async (req, res) => {
    try {
      const existingProjects = await storage.getAllProjects();
      if (existingProjects.length > 0) {
        return res.json({ message: "Database already seeded" });
      }

      const seedProjects = [
        {
          name: "Amazon Rainforest Restoration",
          description: "Restoring degraded rainforest areas in the Brazilian Amazon through native species reforestation and community engagement.",
          location: "Brazil, South America",
          latitude: "-3.4653",
          longitude: "-62.2159",
          projectType: "reforestation",
          area: "1200.50",
          treesPlanted: "450000",
          co2Offset: "9000.00",
          imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop",
          status: "active",
        },
        {
          name: "African Savanna Conservation",
          description: "Protecting and restoring savanna ecosystems in Kenya through sustainable land management and wildlife corridor preservation.",
          location: "Kenya, East Africa",
          latitude: "-1.2921",
          longitude: "36.8219",
          projectType: "conservation",
          area: "800.00",
          treesPlanted: "180000",
          co2Offset: "3600.00",
          imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
          status: "active",
        },
        {
          name: "Boreal Forest Protection",
          description: "Preserving ancient boreal forests in Canada and promoting sustainable forestry practices to combat climate change.",
          location: "Canada, North America",
          latitude: "56.1304",
          longitude: "-106.3468",
          projectType: "conservation",
          area: "2500.00",
          treesPlanted: "0",
          co2Offset: "15000.00",
          imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop",
          status: "active",
        },
        {
          name: "Mangrove Coastal Restoration",
          description: "Restoring vital mangrove ecosystems along the coast of Indonesia to protect against erosion and support marine biodiversity.",
          location: "Indonesia, Southeast Asia",
          latitude: "-0.7893",
          longitude: "113.9213",
          projectType: "restoration",
          area: "450.00",
          treesPlanted: "280000",
          co2Offset: "5600.00",
          imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
          status: "active",
        },
        {
          name: "Urban Green Corridor Initiative",
          description: "Creating interconnected green spaces and tree corridors in urban areas of India to improve air quality and biodiversity.",
          location: "India, South Asia",
          latitude: "20.5937",
          longitude: "78.9629",
          projectType: "afforestation",
          area: "150.00",
          treesPlanted: "95000",
          co2Offset: "1900.00",
          imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
          status: "active",
        },
        {
          name: "Mediterranean Forest Recovery",
          description: "Recovering fire-damaged Mediterranean forests in Spain through native oak and pine reforestation programs.",
          location: "Spain, Europe",
          latitude: "40.4637",
          longitude: "-3.7492",
          projectType: "restoration",
          area: "680.00",
          treesPlanted: "320000",
          co2Offset: "6400.00",
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
          status: "completed",
        },
      ];

      for (const project of seedProjects) {
        await storage.createProject(project);
      }

      res.json({ message: "Database seeded successfully", count: seedProjects.length });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
