import { PrismaClient } from "@prisma/client";
import { env } from "../env";

export const prisma = new PrismaClient({
  log: ["query"],
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === "test"
          ? env.TEST_DATABASE_URL
          : env.DATABASE_URL,
    },
  },
});
