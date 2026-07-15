"use server";

import { corsair } from "@/lib/corsair";
import { db } from "@/lib/db";
import { getSessionTenantId } from "@/lib/auth/auth-server";

const PLUGIN_TO_INTEGRATION_NAMES = {
    gmail: ["gmail"],
    calendar: ["calendar", "googlecalendar"],
} as const;

export async function createConnectLink(plugin: string) {
    const tenantId = await getSessionTenantId();
    if (!tenantId) throw new Error("Unauthorized");

    if(plugin === "calendar") plugin = "googlecalendar";

    const { connectUrl } = await corsair.manage.connect.createLink({
        plugin,
        tenantId,
    });

    return connectUrl;
}

export async function getPluginConnectionStatus(
    plugin: "gmail" | "calendar"
): Promise<boolean> {
    const tenantId = await getSessionTenantId();
    if (!tenantId) return false;

    const count = await db.corsairAccount.count({
        where: {
            tenantId,
            integration: {
                name: {
                    in: [...PLUGIN_TO_INTEGRATION_NAMES[plugin]],
                },
            },
        },
    });

    return count > 0;
}