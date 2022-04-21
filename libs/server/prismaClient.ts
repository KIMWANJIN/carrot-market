import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined
}

const prismaClient = global.client || new PrismaClient()

if (process.env.NODE_ENV === "development") global.client = prismaClient 

export default prismaClient