"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status with Supabase
    useEffect(() => {
        const supabase = createClient();

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAuthenticated = !!user;

    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">🔖</span>
                    <span className="font-display text-xl font-bold">atBookmark</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                        Pricing
                    </Link>
                    <Link href="#manifesto" className="text-sm font-medium hover:text-primary transition-colors">
                        Manifesto
                    </Link>
                </nav>

                {/* Right Actions - Smart Auth */}
                <div className="hidden items-center gap-4 md:flex">
                    {isLoading ? (
                        <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button size="sm" variant="outline">
                                    <User className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button size="sm">
                                    Go to App
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t-2 border-border bg-background md:hidden"
                    >
                        <nav className="flex flex-col gap-4 p-4">
                            <Link href="#features" className="text-sm font-medium">Features</Link>
                            <Link href="#pricing" className="text-sm font-medium">Pricing</Link>
                            <Link href="#manifesto" className="text-sm font-medium">Manifesto</Link>
                            <hr className="border-border" />
                            {isLoading ? (
                                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                            ) : isAuthenticated ? (
                                <Link href="/dashboard">
                                    <Button size="sm" className="w-full">
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium">Login</Link>
                                    <Link href="/register">
                                        <Button size="sm" className="w-full">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
