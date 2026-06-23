'use client'

import { createAuthClient } from "better-auth/react"
import { useState } from "react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;

export const useGoogleLogin = async () =>{
    const [ loading, setLoading ] = useState(false);
    
    try {
        setLoading(true);
        const result = await authClient.signIn.social({
            provider: "google"
        })
        console.log("result",result);
    } catch (error) {
        console.log("error",error)
    } finally {
        setLoading(false);
    }
}