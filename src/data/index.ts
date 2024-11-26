import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

//aanmaken prisma client --> verbinding met databank
export const prisma = new PrismaClient();

//connectie maken + loggen dat connectie gelukt is
export async function initializeData(): Promise<void> {
  getLogger().info('Initializing connection to the database');

  await prisma.$connect();

  getLogger().info('Successfully connected to the database');
}

//connectie afsluiten + loggen dat connectie afgesloten is
export async function shutdownData(): Promise<void> {
  getLogger().info('Shutting down database connection');

  await prisma?.$disconnect();

  getLogger().info('Database connection closed');
}