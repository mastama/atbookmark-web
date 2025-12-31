"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { name: string; email: string; avatar: string } | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER = {
    name: "Alex Reader",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check localStorage for mock session
        const session = localStorage.getItem("atbookmark_session");
        setIsAuthenticated(session === "authenticated");
        setIsLoading(false);
    }, []);

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

    const login = () => {
        localStorage.setItem("atbookmark_session", "authenticated");
        setIsAuthenticated(true);
        toast.success("Welcome back! 🌊");
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("atbookmark_session");
        setIsAuthenticated(false);
        toast.success("You've been logged out safely 👋");
        router.push("/login");
    };

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
                user: isAuthenticated ? MOCK_USER : null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
