import express, { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient({
  datasourceUrl:
    "postgresql://postgres:postgres@localhost:5434/express_example?schema=public&connection_limit=3",
});
export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.get("/prisma", async (req: Request, res: Response) => {
  await prisma.$executeRaw`SELECT pg_sleep(1)`;
  await prisma.$executeRaw`SELECT pg_sleep(1)`;
  res.sendStatus(200);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
