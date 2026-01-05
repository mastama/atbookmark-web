"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useState } from "react";

interface AuthResponse {
    // The actual data payload inside the standard response
    access_token: string;
}

// Helper type for our Standard Response
interface StandardResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export function useAuth() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string, returnUrl = "/dashboard") => {
        setIsLoading(true);
        try {
            // Axios return type is StandardResponse<AuthResponse> in the body (response.data)
            const response = await api.post<StandardResponse<AuthResponse>>("/auth/login", { email, password });

            const payload = response.data.data; // Unwrap the standard envelope

            if (payload && payload.access_token) {
                // We're expecting `user` object in payload too if structured that way, 
                // but checking AuthService in backend:
                // return { access_token, user: { ... } }

                // Let's try to get user from payload if available, else just token
                const user = (payload as any).user;

                // We need to update the Global Auth Context
                // Note: We can't use `useAuthContext` inside `useAuth` if `useAuth` is used outside provider...
                // But `useAuth` is a hook.
                // However, `useAuth` in `hooks/useAuth.ts` is separate from `context/AuthContext`.
                // Let's rely on localStorage + reload or just assume the user will be fetched on dashboard mount.

                // But wait! If we just router.push, the Context might NOT re-fetch because it's already mounted.
                // We need to FORCE the context to update.
                // The Cleanest way -> Dispatch a window event or just refresh page? Refresh is ugly.
                // Better: Pass setAuth from component? No.

                // Solution: We will NOT modify this file to use Context directly (circular dep issues sometimes).
                // Instead, we just set Token.
                // AND we dispatch a custom event that AuthContext listens to?
                // OR simpler: `window.location.href = returnUrl` instead of router.push will force reload.
                // BUT that is slower.

                // Let's assume the AuthContext Logic in current file (useAuth.ts) is just for the API call.
                // The User is asking why they see "Alex". It's because AuthContext was MOCK_USER.
                // By fixing AuthContext to fetchProfile on mount, and since "Login Page" -> "Dashboard" 
                // involves a route change... does `app/layout` (AuthProvider) unmount? Likely NOT.

                // IF AuthProvider doesn't unmount, it won't run `useEffect` again.
                // So we MUST return `true` here, and let the Component (LoginPage) call the Context.
                // `LoginPage` is inside `AuthProvider`? Yes (in `app/layout`).

                localStorage.setItem("atbookmark_token", payload.access_token);

                // We'll return the whole payload so the component can pass it to context
                return { success: true, user, token: payload.access_token };
            } else {
                // Success response but no token? Treat as error.
                throw new Error("No access token received");
            }
        } catch (error: any) {
            console.warn("Login Check failed (Expected for invalid credentials):", error.message); // Warn instead of Error to avoid Dev Overlay
            // Error response from filter: { statusCode, message, error, timestamp, path }
            // If it comes from class-validator, message might be array
            let msg = error.response?.data?.message || error.message || "Login failed.";
            if (Array.isArray(msg)) msg = msg[0]; // Take first validation error
            toast.error(msg);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name?: string) => {
        setIsLoading(true);
        try {
            // Check if register logs us in automatically or just creates account
            // Based on backend implementation: AuthService.register returns same as login (token)
            const response = await api.post<StandardResponse<AuthResponse>>("/auth/register", { email, password, name });

            const payload = response.data.data;

            if (payload && payload.access_token) {
                localStorage.setItem("atbookmark_token", payload.access_token);
                const user = (payload as any).user;
                return { success: true, user, token: payload.access_token };
            }
        } catch (error: any) {
            let msg = error.response?.data?.message || "Registration failed.";
            if (Array.isArray(msg)) msg = msg[0];
            toast.error(msg);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("atbookmark_token");
        // Also clear invalid session if exists
        localStorage.removeItem("atbookmark_session");
        toast.success("You've been logged out safely 👋");
        router.push("/login");
    };

    return { login, register, logout, isLoading };
}
