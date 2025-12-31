"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useMockAuth() {
    const router = useRouter();

    const login = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Welcome back! Redirecting... 🌊");
        setTimeout(() => router.push("/dashboard"), 500);
    };

    const register = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Account created! Redirecting... ✨");
        setTimeout(() => router.push("/dashboard"), 500);
    };

    const logout = () => {
        toast.success("You've been logged out safely 👋");
        router.push("/login");
    };

    const sendResetLink = async (email: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true; // Mock success
    };

    return { login, register, logout, sendResetLink };
}
