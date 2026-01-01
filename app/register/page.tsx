"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock loading delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set mock session
        localStorage.setItem("atbookmark_session", "authenticated");

        toast.success("Account created! Redirecting... ✨");

        setTimeout(() => {
            router.push("/dashboard");
        }, 500);
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set mock session
        localStorage.setItem("atbookmark_session", "authenticated");

        toast.success("Connected with Google! Redirecting... ✨");

        setTimeout(() => {
            router.push("/dashboard");
        }, 500);
    };

    return (
        <AuthLayout
            title="Join the Anti-Chaos Club."
            subtitle="Your brain will thank you later."
            footerText="Already have an account?"
            footerLinkText="Login"
            footerLinkHref="/login"
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
                        placeholder="hello@future-organizer.com"
                        icon={<Mail className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                    />

                    <Input
                        type="password"
                        placeholder="Create a strong password"
                        icon={<Lock className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                    />

                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        icon={<Lock className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                    />
                </motion.div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isLoading || isGoogleLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Free Account ✨"
                    )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-center text-foreground/50 mt-4">
                    By signing up, you agree to our{" "}
                    <a href="/terms" className="underline hover:text-primary">Terms</a> and{" "}
                    <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
                </p>
            </form>
        </AuthLayout>
    );
}
