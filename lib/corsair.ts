import 'dotenv/config';
import { createCorsair, managementHandler } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { Pool } from 'pg';
// import { db } from './db';

const db = new Pool({ connectionString: process.env.DATABASE_URL })

export const corsair = createCorsair({
    multiTenancy: true,
    plugins: [gmail({ authType: "oauth_2" }), googlecalendar({ authType: "oauth_2" })],
    kek: process.env.CORSAIR_KEK!,
    database: db,
    manual: {
        baseUrl: `${process.env.APP_URL}/connect`,
        redirectUri: `${process.env.APP_URL}/api/oauth/callback`
    }
});

export const toNextJsHandler = managementHandler(corsair, { basePath: "/api/corsair" });