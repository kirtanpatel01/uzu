'use server'

import { getSession } from "@/lib/auth-server"
import { User } from "better-auth";

export const getUser = async (): Promise<User | undefined> => {
    const session = await getSession();
    return session.data?.user;
}