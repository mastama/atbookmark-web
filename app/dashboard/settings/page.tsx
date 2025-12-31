"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Pencil, Download, Upload, Camera } from "lucide-react";

import { SettingsSection } from "@/components/settings/SettingsSection";
import { ProBadge } from "@/components/settings/ProBadge";
import { Toggle } from "@/components/settings/Toggle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    // Avatar Upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

    // Profile State
    const [displayName, setDisplayName] = useState(user?.name || "");
    const [bio, setBio] = useState("");

    // Toggle States
    const [autoUnread, setAutoUnread] = useState(true);
    const [saveToLastFolder, setSaveToLastFolder] = useState(false);
    const [autoTag, setAutoTag] = useState(true);
    const [generateSummary, setGenerateSummary] = useState(true);
    const [readerMode, setReaderMode] = useState(false);

    // Theme Selection
    const [theme, setTheme] = useState<"light" | "cream" | "dark">("cream");
    const [density, setDensity] = useState<"cozy" | "compact">("cozy");

    const handleProFeature = () => {
        toast.info("This is a Pro feature! Upgrade to unlock.", { icon: "✨" });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            toast.success("Photo updated! Don't forget to save.");
        }
    };

    const handleProfileSave = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);
        toast.success("Profile updated ✨ Looking sharp!");
    };

    const handleExport = () => {
        toast.success("Backup started! Check your downloads.");
    };

    const handleDeleteAll = () => {
        toast.error("This would delete all bookmarks (mock).", { icon: "🗑️" });
    };

    return (
        <div className="mx-auto max-w-5xl pb-12">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="font-display text-3xl font-bold">Studio Settings</h1>
                <p className="mt-1 text-foreground/60">
                    Fine-tune how you capture, organize, and grow your knowledge.
                </p>
            </motion.div>

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {/* Profile */}
                <SettingsSection
                    title="Profile"
                    subtitle="How you appear inside your knowledge studio."
                >
                    <div className="space-y-6">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
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
                            </div>
                            <div>
                                <p className="font-medium">Profile Photo</p>
                                <p className="text-xs text-foreground/50">Click to upload (JPG, PNG)</p>
                            </div>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Display Name</label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">What are you collecting?</label>
                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Design patterns, recipes, and chaos..."
                            />
                        </div>

                        <Button onClick={handleProfileSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </Button>
                    </div>
                </SettingsSection>

                {/* Account (Read Only) */}
                <SettingsSection
                    title="Account"
                    subtitle="Managed via your sign-in provider."
                >
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-foreground/60">Email</span>
                            <span className="font-medium text-foreground/80">{user?.email || "user@example.com"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-foreground/60">User ID</span>
                            <span className="font-mono text-xs text-foreground/60">usr_a1b2c3d4e5f6</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/30">
                            <span className="text-foreground/60">Joined</span>
                            <span className="font-medium">December 31, 2025</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-foreground/60">Plan</span>
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold">Free</span>
                        </div>
                    </div>
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection
                    title="Appearance"
                    subtitle="Make your workspace feel like home."
                >
                    <div className="space-y-6">
                        {/* Theme */}
                        <div>
                            <label className="mb-3 block text-sm font-medium">Theme</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "light", label: "Light ☀️", pro: false },
                                    { value: "cream", label: "Cream 📖", pro: false },
                                    { value: "dark", label: "Dark 🌙", pro: true },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => opt.pro ? handleProFeature() : setTheme(opt.value as typeof theme)}
                                        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${theme === opt.value
                                                ? "border-primary bg-primary/10 shadow-brutal-sm"
                                                : "border-border hover:bg-gray-50"
                                            } ${opt.pro ? "opacity-50" : ""}`}
                                    >
                                        {opt.label}
                                        {opt.pro && <ProBadge />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Density */}
                        <div>
                            <label className="mb-3 block text-sm font-medium">Density</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setDensity("cozy")}
                                    className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ${density === "cozy"
                                            ? "border-primary bg-primary/10 shadow-brutal-sm"
                                            : "border-border hover:bg-gray-50"
                                        }`}
                                >
                                    Cozy
                                </button>
                                <button
                                    onClick={handleProFeature}
                                    className="flex items-center gap-2 rounded-xl border-2 border-border px-3 py-2 text-sm font-medium opacity-50"
                                >
                                    Compact <ProBadge />
                                </button>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* Saving Behavior */}
                <SettingsSection
                    title="Saving Behavior"
                    subtitle="Decide what happens the moment you save."
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Auto-mark as Unread</span>
                            <Toggle checked={autoUnread} onChange={setAutoUnread} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Save to Last Used Folder</span>
                            <Toggle checked={saveToLastFolder} onChange={setSaveToLastFolder} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                Auto-close tab after save <ProBadge />
                            </span>
                            <Toggle checked={false} disabled onChange={handleProFeature} />
                        </div>
                    </div>
                </SettingsSection>

                {/* AI Assistant */}
                <SettingsSection
                    title="AI Assistant"
                    subtitle="Let AI help, or stay fully manual."
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Auto-tag bookmarks</span>
                            <Toggle checked={autoTag} onChange={setAutoTag} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Generate short summaries</span>
                            <Toggle checked={generateSummary} onChange={setGenerateSummary} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                Weekly knowledge recap <ProBadge />
                            </span>
                            <Toggle checked={false} disabled onChange={handleProFeature} />
                        </div>
                    </div>
                </SettingsSection>

                {/* Reading Experience */}
                <SettingsSection
                    title="Reading Experience"
                    subtitle="Turn the internet into a quiet library."
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Default Reader Mode</span>
                            <Toggle checked={readerMode} onChange={setReaderMode} />
                        </div>
                    </div>
                </SettingsSection>

                {/* Data Management - Full Width */}
                <SettingsSection
                    title="Data Management"
                    subtitle="Your data is yours. Always."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Backup (JSON)
                        </Button>
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Import HTML
                        </Button>
                    </div>
                </SettingsSection>

                {/* Danger Zone - Full Width */}
                <SettingsSection
                    title="Danger Zone"
                    subtitle="Handle with care."
                    danger
                >
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="ghost"
                            className="border-2 border-accent-coral text-accent-coral hover:bg-accent-coral/10"
                            onClick={handleDeleteAll}
                        >
                            Delete All Bookmarks
                        </Button>
                        <Button variant="outline" className="text-accent-coral">
                            Sign Out All Devices
                        </Button>
                    </div>
                </SettingsSection>
            </div>
        </div>
    );
}
