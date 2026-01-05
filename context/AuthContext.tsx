"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    avatar?: string;
    isPro: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, user?: User) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get('/auth/profile');
            // Assuming response.data is the user object directly based on controller, or wrapped?
            // AuthController.getProfile returns req.user.
            // But interceptor might unwrap? Let's check api.ts or assume standard response.
            // If api.ts unwraps response.data, then we get the payload.
            // If backend returns object directly from req.user, it is the user object.

            // Standard NestJS response is usually just the return value. 
            // Controller: return req.user;
            // The backend uses a global TransformInterceptor which wraps the response in { data: ... }
            const payload = response.data;
            const data = payload.data || payload;

            // Map backend 'image' to 'avatar'
            const userData: User = {
                ...data,
                avatar: data.image || data.avatar,
            };
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Profile fetch failed", error);
            logout();
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("atbookmark_token");
            if (token) {
                await fetchProfile();
            }
            setIsLoading(false);
        };
        initAuth();
    }, [fetchProfile]);

    useEffect(() => {
        // Redirect logic for protected routes
        if (!isLoading) {
            const protectedRoutes = ["/dashboard"];
            const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

            if (isProtected && !isAuthenticated) {
                router.push("/login");
            }
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    const login = (token: string, userData?: User) => {
        localStorage.setItem("atbookmark_token", token);
        setIsAuthenticated(true);
        if (userData) {
            setUser(userData);
        } else {
            fetchProfile();
        }
        // Redirect handled by caller usually, but we can double check
        // router.push("/dashboard"); 
    };

    const logout = () => {
        localStorage.removeItem("atbookmark_token");
        localStorage.removeItem("atbookmark_session");
        setUser(null);
        setIsAuthenticated(false);
        toast.success("You've been logged out safely 👋");
        router.push("/login");
    };

    const refreshProfile = async () => {
        await fetchProfile();
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-2xl">🔖</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                refreshProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}
