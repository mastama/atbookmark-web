"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isLoading } = useAuth();
    const { login: contextLogin } = useAuthContext();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Get returnUrl from query params, default to /dashboard
    const returnUrl = searchParams.get("returnUrl") || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result && result.success) {
            contextLogin(result.token, result.user);
            toast.success("Welcome back! Redirecting... 🌊");
            router.push(returnUrl);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        // Redirect to Backend Google Auth Endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
        window.location.href = `${apiUrl}/auth/google`;
    };

    return (
        <AuthLayout
            title="Welcome back, Collector."
            subtitle="Ready to organize some chaos?"
            footerText="New here?"
            footerLinkText="Create an account"
            footerLinkHref="/register"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Google Button */}
                <GoogleButton
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                >
                    {isGoogleLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Connecting...
                        </>
                    ) : (
                        "Continue with Gmail"
                    )}
                </GoogleButton>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-foreground/50 font-medium">
                            or continue with email
                        </span>
                    </div>
                </div>

                {/* Form Fields */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <Input
                        type="email"
                        placeholder="hello@legendary-reader.com"
                        icon={<Mail className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Your secret password"
                        icon={<Lock className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </motion.div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-foreground/60 hover:text-primary hover:underline transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || isGoogleLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Opening...
                        </>
                    ) : (
                        "Open My Library 🚀"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
