// import { PrismaClient } from "@prisma/client";

// // Define a function that returns a new PrismaClient instance
// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// // Extend the global object to hold the Prisma instance
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// // Use the existing global instance if it exists, otherwise create a new one
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// // In development, save the instance to the global object to prevent connection exhaustion
// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = prisma;
// }

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Define a function that returns a new PrismaClient instance
const prismaClientSingleton = () => {
  // Prisma 7 strictly requires a driver adapter to connect to the database
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({ adapter });
};

// Extend the global object to hold the Prisma instance
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use the existing global instance if it exists, otherwise create a new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// In development, save the instance to the global object to prevent connection exhaustion
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}