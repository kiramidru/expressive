import "./env.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

export default prisma;
