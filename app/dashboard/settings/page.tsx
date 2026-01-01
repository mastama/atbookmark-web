"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    Settings,
    User,
    Palette,
    Sparkles,
    CreditCard,
    Download,
    Upload,
    Trash2,
    Lock,
    Check,
    Crown,
    Loader2,
    Camera,
    Pencil,
    Sun,
    Moon,
    Monitor,
    Folder,
    Tag,
    Infinity,
    AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useSettings } from "@/hooks/useSettings";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ProModal } from "@/components/modals/ProModal";
import { cn } from "@/lib/utils";

// Tab Types
type SettingsTab = "general" | "appearance" | "intelligence" | "billing";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "General", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "intelligence", label: "Intelligence", icon: Sparkles },
    { id: "billing", label: "Billing", icon: CreditCard },
];

// Icon options for Pro users
const APP_ICONS = [
    { id: "default", color: "bg-primary", emoji: "🔖" },
    { id: "mint", color: "bg-accent-mint", emoji: "📗" },
    { id: "coral", color: "bg-accent-coral", emoji: "📕" },
    { id: "lavender", color: "bg-accent-lavender", emoji: "📘" },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const { isPro, folders, tags } = useOrganization();
    const { theme, density, enableAutoTagging, enableAutoSummary, autoArchiveDays, updateSettings } = useSettings();

    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [saving, setSaving] = useState(false);
    const [proModalOpen, setLocalProModalOpen] = useState(false);

    // Profile State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [displayName, setDisplayName] = useState(user?.name || "");
    const [selectedIcon, setSelectedIcon] = useState("default");

    // Handlers
    const handleProFeature = () => {
        setLocalProModalOpen(true);
    };

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

    // Usage calculations for Free users
    const { bookmarks, getActiveBookmarks, getArchivedCount } = useBookmarks();
    const activeBookmarks = getActiveBookmarks();
    const bookmarkCount = activeBookmarks.length;
    const archivedCount = getArchivedCount();
    const folderCount = folders.filter((f) => f.type === "custom").length;
    const tagCount = tags.length;

    // Limits from spec - "Rule of 5"
    const FREE_BOOKMARK_LIMIT = 100;
    const FREE_FOLDER_LIMIT = 5;
    const FREE_TAG_LIMIT = 5;
    const FREE_ARCHIVE_LIMIT = 5;

    return (
        <>
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
                                            : "bg-surface border-2 border-border hover:bg-gray-50"
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
                                            className="bg-gray-50"
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
                                                        : "border-border hover:bg-gray-50"
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
                                <h2 className="font-display text-lg font-bold mb-4">Card Density</h2>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { value: "comfortable", label: "Comfortable" },
                                        { value: "compact", label: "Compact" },
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
                                                    "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                                                    isActive
                                                        ? "border-primary bg-primary/10 shadow-brutal-sm"
                                                        : "border-border hover:bg-gray-50"
                                                )}
                                            >
                                                {opt.label}
                                                {isActive && <Check className="ml-2 inline h-4 w-4 text-primary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Custom App Icon (Pro Only) */}
                            <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display text-lg font-bold">Custom App Icon</h2>
                                    {!isPro && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                            <Crown className="h-3 w-3" />
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {APP_ICONS.map((icon) => {
                                        const isActive = selectedIcon === icon.id;
                                        const isLocked = !isPro && icon.id !== "default";
                                        return (
                                            <button
                                                key={icon.id}
                                                onClick={() => {
                                                    if (isLocked) {
                                                        handleProFeature();
                                                    } else {
                                                        setSelectedIcon(icon.id);
                                                        toast.success(`Icon changed!`);
                                                    }
                                                }}
                                                className={cn(
                                                    "relative flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl transition-all",
                                                    isActive
                                                        ? "border-primary shadow-brutal-sm"
                                                        : "border-border",
                                                    isLocked && "opacity-40 cursor-not-allowed"
                                                )}
                                            >
                                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", icon.color)}>
                                                    {icon.emoji}
                                                </div>
                                                {isLocked && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                                                        <Lock className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                )}
                                                {isActive && !isLocked && (
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

                    {/* INTELLIGENCE TAB */}
                    {activeTab === "intelligence" && (
                        <div className="space-y-8">
                            {/* Pro Banner for Free Users */}
                            {!isPro && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 border-2 border-amber-200">
                                            <Sparkles className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-display font-bold text-amber-800">Unlock AI Intelligence</h3>
                                            <p className="text-sm text-amber-700">
                                                Auto-tagging, smart summaries, and archive rules are Pro features.
                                            </p>
                                        </div>
                                        <Button onClick={handleProFeature} className="bg-amber-500 hover:bg-amber-600">
                                            <Crown className="mr-2 h-4 w-4" />
                                            Upgrade
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Auto-Tagging */}
                            <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-display text-lg font-bold flex items-center gap-2">
                                            AI Auto-Tagging
                                            {!isPro && <Lock className="h-4 w-4 text-gray-400" />}
                                        </h2>
                                        <p className="text-sm text-foreground/60 mt-1">
                                            Automatically generate relevant tags when saving bookmarks.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isPro) {
                                                handleProFeature();
                                            } else {
                                                updateSettings({ enableAutoTagging: !enableAutoTagging });
                                                toast.success(enableAutoTagging ? "Auto-tagging disabled" : "Auto-tagging enabled");
                                            }
                                        }}
                                        className={cn(
                                            "relative h-7 w-12 rounded-full transition-colors",
                                            enableAutoTagging && isPro ? "bg-primary" : "bg-gray-200",
                                            !isPro && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
                                            enableAutoTagging && isPro ? "left-6" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </section>

                            {/* Auto Summary */}
                            <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-display text-lg font-bold flex items-center gap-2">
                                            AI Summaries
                                            {!isPro && <Lock className="h-4 w-4 text-gray-400" />}
                                        </h2>
                                        <p className="text-sm text-foreground/60 mt-1">
                                            Generate short summaries for saved articles.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isPro) {
                                                handleProFeature();
                                            } else {
                                                updateSettings({ enableAutoSummary: !enableAutoSummary });
                                                toast.success(enableAutoSummary ? "Summaries disabled" : "Summaries enabled");
                                            }
                                        }}
                                        className={cn(
                                            "relative h-7 w-12 rounded-full transition-colors",
                                            enableAutoSummary && isPro ? "bg-primary" : "bg-gray-200",
                                            !isPro && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
                                            enableAutoSummary && isPro ? "left-6" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </section>

                            {/* Auto-Archive Rules */}
                            <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-2">
                                    Auto-Archive Rules
                                    {!isPro && <Lock className="h-4 w-4 text-gray-400" />}
                                </h2>
                                <p className="text-sm text-foreground/60 mb-4">
                                    Automatically archive items older than a specified number of days.
                                </p>
                                <select
                                    value={autoArchiveDays}
                                    onChange={(e) => {
                                        if (!isPro) {
                                            handleProFeature();
                                        } else {
                                            updateSettings({ autoArchiveDays: Number(e.target.value) });
                                            toast.success(`Auto-archive set to ${e.target.value === "0" ? "disabled" : e.target.value + " days"}`);
                                        }
                                    }}
                                    disabled={!isPro}
                                    className={cn(
                                        "w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none",
                                        !isPro && "opacity-50 cursor-not-allowed bg-gray-50"
                                    )}
                                >
                                    <option value={0}>Disabled</option>
                                    <option value={30}>After 30 days</option>
                                    <option value={60}>After 60 days</option>
                                    <option value={90}>After 90 days</option>
                                </select>
                            </section>
                        </div>
                    )}

                    {/* BILLING TAB */}
                    {activeTab === "billing" && (
                        <div className="space-y-8">
                            {/* Current Plan */}
                            <section className={cn(
                                "rounded-2xl border-2 p-6",
                                isPro
                                    ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"
                                    : "border-border bg-surface"
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="font-display text-xl font-bold flex items-center gap-2">
                                            {isPro ? (
                                                <>
                                                    <Crown className="h-5 w-5 text-amber-500" />
                                                    Pro Plan
                                                </>
                                            ) : (
                                                "Free Plan"
                                            )}
                                        </h2>
                                        <p className="text-sm text-foreground/60 mt-1">
                                            {isPro
                                                ? "You have unlimited access to all features."
                                                : "Upgrade to Pro for unlimited folders, tags, and AI features."}
                                        </p>
                                    </div>
                                    {isPro && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1.5 rounded-full">
                                            <Check className="h-3 w-3" />
                                            ACTIVE
                                        </span>
                                    )}
                                </div>

                                {!isPro && (
                                    <Button onClick={handleProFeature} className="bg-primary">
                                        <Crown className="mr-2 h-4 w-4" />
                                        Upgrade to Pro — $9/month
                                    </Button>
                                )}
                            </section>

                            {/* Usage Limits */}
                            <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                <h2 className="font-display text-lg font-bold mb-6">Usage</h2>
                                <div className="space-y-6">
                                    {/* Folders */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <Folder className="h-4 w-4 text-gray-500" />
                                                Folders
                                            </span>
                                            <span className="text-sm text-foreground/60">
                                                {isPro ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <Infinity className="h-4 w-4" />
                                                        Unlimited
                                                    </span>
                                                ) : (
                                                    `${folderCount} / ${FREE_FOLDER_LIMIT}`
                                                )}
                                            </span>
                                        </div>
                                        {!isPro && (
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        folderCount >= FREE_FOLDER_LIMIT ? "bg-red-500" : "bg-primary"
                                                    )}
                                                    style={{ width: `${Math.min((folderCount / FREE_FOLDER_LIMIT) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <Tag className="h-4 w-4 text-gray-500" />
                                                Tags
                                            </span>
                                            <span className="text-sm text-foreground/60">
                                                {isPro ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <Infinity className="h-4 w-4" />
                                                        Unlimited
                                                    </span>
                                                ) : (
                                                    `${tagCount} / ${FREE_TAG_LIMIT}`
                                                )}
                                            </span>
                                        </div>
                                        {!isPro && (
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        tagCount >= FREE_TAG_LIMIT ? "bg-red-500" : "bg-accent-lavender"
                                                    )}
                                                    style={{ width: `${Math.min((tagCount / FREE_TAG_LIMIT) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bookmarks */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                🔖 Bookmarks
                                            </span>
                                            <span className="text-sm text-foreground/60">
                                                {isPro ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <Infinity className="h-4 w-4" />
                                                        Unlimited
                                                    </span>
                                                ) : (
                                                    `${bookmarkCount} / ${FREE_BOOKMARK_LIMIT}`
                                                )}
                                            </span>
                                        </div>
                                        {!isPro && (
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        bookmarkCount >= FREE_BOOKMARK_LIMIT ? "bg-red-500" : "bg-accent-coral"
                                                    )}
                                                    style={{ width: `${Math.min((bookmarkCount / FREE_BOOKMARK_LIMIT) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Archives */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                📦 Archived Items
                                            </span>
                                            <span className="text-sm text-foreground/60">
                                                {isPro ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <Infinity className="h-4 w-4" />
                                                        Unlimited
                                                    </span>
                                                ) : (
                                                    `${archivedCount} / ${FREE_ARCHIVE_LIMIT}`
                                                )}
                                            </span>
                                        </div>
                                        {!isPro && (
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        archivedCount >= FREE_ARCHIVE_LIMIT ? "bg-red-500" : "bg-gray-400"
                                                    )}
                                                    style={{ width: `${Math.min((archivedCount / FREE_ARCHIVE_LIMIT) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Manage Subscription (Pro Only) */}
                            {isPro && (
                                <section className="rounded-2xl border-2 border-border bg-surface p-6">
                                    <h2 className="font-display text-lg font-bold mb-4">Manage Subscription</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <Button variant="outline">
                                            Update Payment Method
                                        </Button>
                                        <Button variant="ghost" className="text-foreground/60">
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            <ProModal isOpen={proModalOpen} onClose={() => setLocalProModalOpen(false)} />
        </>
    );
}
