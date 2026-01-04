"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    Settings,
    User,
    Palette,
    BarChart3,
    Download,
    Upload,
    Trash2,
    Check,
    Loader2,
    Camera,
    Pencil,
    Sun,
    Moon,
    Monitor,
    Folder,
    Tag,
    AlertTriangle,
    Bookmark,
    Archive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useSettings } from "@/hooks/useSettings";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

// Tab Types - Simplified (no Intelligence/Billing)
type SettingsTab = "general" | "appearance" | "usage";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "General", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "usage", label: "Usage", icon: BarChart3 },
];

// Icon options - all available now
const APP_ICONS = [
    { id: "default", color: "bg-primary", emoji: "🔖" },
    { id: "mint", color: "bg-accent-mint", emoji: "📗" },
    { id: "coral", color: "bg-accent-coral", emoji: "📕" },
    { id: "lavender", color: "bg-accent-lavender", emoji: "📘" },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const { folders, tags } = useOrganization();
    const { theme, density, appIcon, updateSettings } = useSettings();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [saving, setSaving] = useState(false);

    // Handle URL query param for tab selection
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['general', 'appearance', 'usage'].includes(tab)) {
            setActiveTab(tab as SettingsTab);
        }
    }, [searchParams]);

    // Profile State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [displayName, setDisplayName] = useState(user?.name || "");

    // Favicon helper for app icon
    const updateFavicon = (iconId: string) => {
        const faviconMap: Record<string, string> = {
            default: "🔖",
            mint: "📗",
            coral: "📕",
            lavender: "📘",
        };
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.font = "28px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(faviconMap[iconId] || "🔖", 16, 18);
            const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
            if (favicon) {
                favicon.href = canvas.toDataURL();
            }
        }
    };

    // Handlers
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            toast.success("Photo updated!");
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        toast.success("Profile saved successfully!");
    };

    const handleExport = () => {
        toast.success("Exporting data... Check your downloads.", { icon: "📦" });
    };

    const handleDeleteAccount = () => {
        toast.error("This feature requires confirmation via email.", { icon: "⚠️" });
    };

    // Usage calculations
    const { getActiveBookmarks, getArchivedCount } = useBookmarks();
    const activeBookmarks = getActiveBookmarks();
    const bookmarkCount = activeBookmarks.length;
    const archivedCount = getArchivedCount();
    const folderCount = folders.filter((f) => f.type === "custom").length;
    const tagCount = tags.length;

    return (
        <div className="mx-auto max-w-4xl pb-12">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border-2 border-border">
                        <Settings className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold">Settings</h1>
                        <p className="text-sm text-foreground/60">
                            Customize your atBookmark experience
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 border-b-2 border-border pb-3">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-brutal-sm"
                                        : "bg-surface border-2 border-border hover:bg-gray-50 dark:hover:bg-muted"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* GENERAL TAB */}
                {activeTab === "general" && (
                    <div className="space-y-8">
                        {/* Profile Section */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <h2 className="font-display text-lg font-bold mb-4">Profile</h2>
                            <div className="space-y-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                {/* Avatar */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleAvatarClick}
                                        className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-accent-lavender transition-all hover:border-primary"
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Camera className="h-8 w-8 text-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Pencil className="h-5 w-5 text-white" />
                                        </div>
                                    </button>
                                    <div>
                                        <p className="font-medium">Profile Photo</p>
                                        <p className="text-xs text-foreground/50">Click to upload</p>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Display Name</label>
                                    <Input
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Email</label>
                                    <Input
                                        value={user?.email || "user@example.com"}
                                        disabled
                                        className="bg-gray-50 dark:bg-muted"
                                    />
                                </div>

                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Profile"
                                    )}
                                </Button>
                            </div>
                        </section>

                        {/* Data Management */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <h2 className="font-display text-lg font-bold mb-4">Data Management</h2>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" onClick={handleExport}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Data (JSON)
                                </Button>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Bookmarks
                                </Button>
                            </div>
                        </section>

                        {/* Danger Zone */}
                        <section className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h2 className="font-display text-lg font-bold text-red-600">Danger Zone</h2>
                            </div>
                            <p className="text-sm text-red-600/70 mb-4">
                                These actions are permanent and cannot be undone.
                            </p>
                            <Button
                                variant="ghost"
                                className="border-2 border-red-300 text-red-600 hover:bg-red-100"
                                onClick={handleDeleteAccount}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </section>
                    </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === "appearance" && (
                    <div className="space-y-8">
                        {/* Theme */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <h2 className="font-display text-lg font-bold mb-4">Theme</h2>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { value: "light", label: "Light", icon: Sun },
                                    { value: "dark", label: "Dark", icon: Moon },
                                    { value: "system", label: "System", icon: Monitor },
                                ].map((opt) => {
                                    const Icon = opt.icon;
                                    const isActive = theme === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                updateSettings({ theme: opt.value as typeof theme });
                                                toast.success(`Theme set to ${opt.label}`);
                                            }}
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                                                isActive
                                                    ? "border-primary bg-primary/10 shadow-brutal-sm"
                                                    : "border-border hover:bg-gray-50 dark:hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {opt.label}
                                            {isActive && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Density */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <div className="mb-4">
                                <h2 className="font-display text-lg font-bold">Card Density</h2>
                                <p className="text-xs text-foreground/50 mt-1">Control how much content you see at once</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { value: "comfortable", label: "Comfortable", description: "Spacious layout" },
                                    { value: "compact", label: "Compact", description: "View more items" },
                                ].map((opt) => {
                                    const isActive = density === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                updateSettings({ density: opt.value as typeof density });
                                                toast.success(`Density set to ${opt.label}`);
                                            }}
                                            className={cn(
                                                "flex flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition-all",
                                                isActive
                                                    ? "border-primary bg-primary/10 shadow-brutal-sm"
                                                    : "border-border hover:bg-gray-50 dark:hover:bg-muted"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{opt.label}</span>
                                                {isActive && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                            <span className="text-xs text-foreground/50">{opt.description}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Custom App Icon */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <h2 className="font-display text-lg font-bold mb-4">Custom App Icon</h2>
                            <div className="flex flex-wrap gap-3">
                                {APP_ICONS.map((icon) => {
                                    const isActive = appIcon === icon.id;
                                    return (
                                        <button
                                            key={icon.id}
                                            onClick={() => {
                                                updateSettings({ appIcon: icon.id as typeof appIcon });
                                                updateFavicon(icon.id);
                                                toast.success(`Icon changed!`);
                                            }}
                                            className={cn(
                                                "relative flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl transition-all",
                                                isActive
                                                    ? "border-primary shadow-brutal-sm"
                                                    : "border-border hover:border-gray-300"
                                            )}
                                        >
                                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", icon.color)}>
                                                {icon.emoji}
                                            </div>
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}

                {/* USAGE TAB */}
                {activeTab === "usage" && (
                    <div className="space-y-8">
                        {/* Usage Statistics */}
                        <section className="rounded-2xl border-2 border-border bg-surface p-6">
                            <h2 className="font-display text-lg font-bold mb-6">Your Statistics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Bookmarks */}
                                <div className="rounded-xl border-2 border-border p-4 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Bookmark className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-2xl font-bold">{bookmarkCount}</p>
                                    <p className="text-xs text-foreground/60">Bookmarks</p>
                                </div>

                                {/* Folders */}
                                <div className="rounded-xl border-2 border-border p-4 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Folder className="h-6 w-6 text-accent-mint" />
                                    </div>
                                    <p className="text-2xl font-bold">{folderCount}</p>
                                    <p className="text-xs text-foreground/60">Folders</p>
                                </div>

                                {/* Tags */}
                                <div className="rounded-xl border-2 border-border p-4 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Tag className="h-6 w-6 text-accent-lavender" />
                                    </div>
                                    <p className="text-2xl font-bold">{tagCount}</p>
                                    <p className="text-xs text-foreground/60">Tags</p>
                                </div>

                                {/* Archived */}
                                <div className="rounded-xl border-2 border-border p-4 text-center">
                                    <div className="flex justify-center mb-2">
                                        <Archive className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <p className="text-2xl font-bold">{archivedCount}</p>
                                    <p className="text-xs text-foreground/60">Archived</p>
                                </div>
                            </div>
                        </section>

                        {/* Info Section */}
                        <section className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
                            <h2 className="font-display text-lg font-bold mb-2">No Limits, Just Focus 🚀</h2>
                            <p className="text-sm text-foreground/70">
                                All features are on the house! Feel free to organize your world with unlimited.
                                Built with passion as a portfolio showcase. Thank you for being part of the journey!
                            </p>
                        </section>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
