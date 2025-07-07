import { PrismaClient } from "@prisma/client";

// Avoid using `var`, use `let` or `const` in declaration merging
declare global {
  // eslint-disable-next-line no-var
  // `var` is needed here for declaration merging in global scope
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export const db = prisma;
