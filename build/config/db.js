"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDB = connectDB;
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
exports.prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log("🟢 Database connected successfully");
    }
    catch (error) {
        console.error("🔴 Failed to connect to the database");
        if (error instanceof Error) {
            console.error(error);
            throw new errors_1.DatabaseConnectionError(error.message);
        }
        throw new errors_1.DatabaseConnectionError("Cannot connect to PostgreSQL. Check DATABASE_URL or network.");
    }
}
