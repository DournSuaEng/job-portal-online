// lib/db.ts

import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent TypeScript from throwing errors on global variable usage
  // `var` is used to avoid "Cannot redeclare block-scoped variable" errors in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

// Avoid creating a new client during hot reloads in development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export const db = prisma;
