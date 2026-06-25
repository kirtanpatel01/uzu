import 'dotenv/config';
import { createCorsair } from 'corsair';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
// import { db } from './db';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient(); // y

export const corsair = createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
    multiTenancy: true,
});