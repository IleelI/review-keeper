import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

const prisma = global.__prisma;
prisma.$connect();

export { prisma };
