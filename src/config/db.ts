import { PrismaClient } from "@prisma/client";
import { DatabaseConnectionError } from "../errors";

export const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("🟢 Database connected successfully");
  } catch (error) {
    console.error("🔴 Failed to connect to the database");
      if (error instanceof Error) {
      console.error(error);
      throw new DatabaseConnectionError(error.message);
    }
    throw new DatabaseConnectionError(
       "Cannot connect to PostgreSQL. Check DATABASE_URL or network."
    );
  }
}
