"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // Use the hook, not the context directly if outside provider 
// OR better: The Landing Page is likely OUTSIDE the Dashboard Layout where AuthProvider might be?
// Actually, AppShell wraps everything? Let's check layout.tsx.
// If AppLayout wraps everything, we can use useAuthContext.
// But earlier we saw `app/layout.tsx` imports AuthProvider.
// let's use `useAuthContext` from `@/context/AuthContext` if possible, 
// or `useAuth` hook which is a wrapper. 
// However, the `Navbar.tsx` previously used `localStorage`.
// `useAuth` in `hooks/useAuth.ts` is just API wrappers.
// `useAuthContext` is the state.
import { useAuthContext } from "@/context/AuthContext";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuthContext();

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
                        Support
                    </Link>
                    <Link href="#manifesto" className="text-sm font-medium hover:text-primary transition-colors">
                        Manifesto
                    </Link>
                </nav>

                {/* Right Actions - Smart Auth */}
                <div className="hidden items-center gap-4 md:flex">
                    {isAuthenticated ? (
                        <Link href="/dashboard">
                            <Button size="sm">
                                {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Dashboard'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
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
                            <Link href="#pricing" className="text-sm font-medium">Support</Link>
                            <Link href="#manifesto" className="text-sm font-medium">Manifesto</Link>
                            <hr className="border-border" />
                            {isAuthenticated ? (
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
