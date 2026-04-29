import { PrismaClient } from "@prisma/client";
import path from "path";

// In production with Railway, DATABASE_URL should point to the persistent volume
// e.g. DATABASE_URL="file:/app/data/prod.db"
// Locally, it defaults to "file:./dev.db" (relative to prisma/)
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "prisma");
  return `file:${path.join(dataDir, "dev.db")}`;
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    datasourceUrl: getDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
