import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  let database: "connected" | "disconnected" = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    // Keep 200 so Render marks the instance live; DB status is still visible.
  }

  res.json({
    status: "ok",
    service: "nordstrand-api",
    database
  });
});
