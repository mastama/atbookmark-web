"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { AddBookmarkModal } from "@/components/modals/AddBookmarkModal";
import { ProModal } from "@/components/modals/ProModal";
import {
    Menu,
    Search,
    Plus,
    Bell,
    ChevronDown,
    User,
    CreditCard,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [proModalOpen, setProModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEditProfile = () => {
        setProfileOpen(false);
    };

    const handleBilling = () => {
        setProfileOpen(false);
        setProModalOpen(true);
    };

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b-2 border-border bg-background/95 px-4 backdrop-blur-sm lg:px-6">
                {/* Left: Menu + Breadcrumb */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="hidden text-sm text-foreground/50 lg:block">
                        <span className="font-medium text-foreground">Home</span>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden flex-1 justify-center md:flex">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search your second brain... (Cmd+K)"
                            className="h-10 w-full rounded-xl border-2 border-border bg-surface pl-10 pr-4 text-sm font-medium placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:shadow-brutal-sm"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Add New */}
                    <Button size="sm" className="hidden sm:flex" onClick={() => setAddModalOpen(true)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add New Bookmark
                    </Button>

                    {/* Mobile Add */}
                    <Button size="sm" className="sm:hidden" onClick={() => setAddModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <button className="relative rounded-lg p-2 hover:bg-gray-100">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-coral" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 rounded-xl border-2 border-border p-1.5 pr-3 hover:bg-gray-50 shadow-brutal-sm"
                        >
                            <div className="h-8 w-8 overflow-hidden rounded-lg border border-border bg-accent-lavender">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-full w-full p-1 text-foreground/50" />
                                )}
                            </div>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border-2 border-border bg-surface p-2 shadow-brutal-md"
                                >
                                    {/* User Info */}
                                    <div className="mb-2 border-b border-border/50 px-3 py-2">
                                        <p className="font-display font-bold">{user?.name}</p>
                                        <p className="text-xs text-foreground/50">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <ul className="space-y-1">
                                        <li>
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={handleEditProfile}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent-mint/30"
                                            >
                                                <User className="h-4 w-4" />
                                                Edit Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleBilling}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent-lavender/30"
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                Billing
                                                <span className="ml-auto rounded-full bg-secondary px-1.5 py-0.5 text-xs font-bold">
                                                    Pro
                                                </span>
                                            </button>
                                        </li>
                                        <li className="border-t border-border/50 pt-1">
                                            <button
                                                onClick={logout}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-accent-coral hover:bg-accent-coral/10"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Modals */}
            <AddBookmarkModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
        </>
    );
}
