"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMockAuth } from "@/hooks/useMockAuth";

export default function ForgotPasswordPage() {
    const { sendResetLink } = useMockAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        await sendResetLink(email);

        setIsLoading(false);
        setIsSuccess(true);
    };

    return (
        <AuthLayout
            title="Panic Mode? Off."
            subtitle="Enter your email and we'll send a magic link."
            footerText="Wait, I remembered!"
            footerLinkText="Back to Login"
            footerLinkHref="/login"
        >
            {isSuccess ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-mint border-2 border-border shadow-brutal-sm">
                        <CheckCircle className="h-8 w-8 text-green-800" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Check your inbox!</h3>
                    <p className="text-foreground/60 mb-6">
                        We sent a reset link to <br />
                        <span className="font-semibold text-foreground">{email}</span>
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            icon={<Mail className="h-5 w-5" />}
                            required
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link 📨"
                        )}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
