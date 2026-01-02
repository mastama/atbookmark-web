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
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                setIsLoading(false);
                return;
            }

            toast.success("Account created! Redirecting... ✨");
            router.push("/dashboard");
            router.refresh();
        } catch {
            toast.error("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                },
            });

            if (error) {
                toast.error(error.message);
                setIsGoogleLoading(false);
            }
        } catch {
            toast.error("Failed to connect with Google");
            setIsGoogleLoading(false);
        }
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Create a strong password"
                        icon={<Lock className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        icon={<Lock className="h-5 w-5" />}
                        required
                        disabled={isLoading || isGoogleLoading}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
