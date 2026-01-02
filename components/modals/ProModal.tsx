"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Copy, MessageCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type BillingCycle = "monthly" | "yearly";

const pricing = {
    monthly: {
        price: 29000,
        label: "Bulanan",
        formatted: "Rp 29.000",
    },
    yearly: {
        price: 290000,
        label: "Tahunan",
        formatted: "Rp 290.000",
        savings: "Hemat 17%",
    },
};

const benefits = [
    "📚 Unlimited Bookmark & Folder",
    "🤖 AI Auto-Tagging & Ringkasan",
    "📁 Nested Folders",
    "🎨 Custom Colors",
    "🌙 Dark Mode",
    "💬 Priority Support via WhatsApp",
];

const BANK_ACCOUNT = {
    bank: "BCA",
    number: "1234567890",
    name: "SINGGIH PRATAMA",
};

const WHATSAPP_NUMBER = "62811194596"; // Replace with actual number

export function ProModal({ isOpen, onClose }: ProModalProps) {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

    const currentPlan = pricing[billingCycle];

    const handleCopyAccount = async () => {
        try {
            await navigator.clipboard.writeText(BANK_ACCOUNT.number);
            toast.success("Nomor rekening berhasil disalin! 📋");
        } catch {
            toast.error("Gagal menyalin nomor rekening");
        }
    };

    const handleWhatsAppConfirm = () => {
        const planName = billingCycle === "monthly" ? "Bulanan" : "Tahunan";
        const message = encodeURIComponent(
            `Halo Admin atBookmark! 👋\n\n` +
            `Saya ingin konfirmasi pembayaran Pro Plan (${planName}) - ${currentPlan.formatted}.\n\n` +
            `Berikut bukti transfer saya:`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-brutal-lg">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-gradient-to-br from-amber-100 to-yellow-200 shadow-brutal-sm">
                                    <Sparkles className="h-7 w-7 text-amber-600" />
                                </div>
                                <h2 className="font-display text-2xl font-bold">
                                    Upgrade ke Pro ⚡️
                                </h2>
                                <p className="mt-2 text-sm text-foreground/60">
                                    Akses penuh tanpa batas. Tanpa ribet.
                                </p>
                            </div>

                            {/* Billing Toggle */}
                            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-secondary/30 p-1">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${billingCycle === "monthly"
                                        ? "bg-surface border-2 border-border shadow-brutal-sm"
                                        : "text-foreground/60 hover:text-foreground"
                                        }`}
                                >
                                    Bulanan
                                </button>
                                <button
                                    onClick={() => setBillingCycle("yearly")}
                                    className={`relative flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${billingCycle === "yearly"
                                        ? "bg-surface border-2 border-border shadow-brutal-sm"
                                        : "text-foreground/60 hover:text-foreground"
                                        }`}
                                >
                                    Tahunan
                                    <span className="absolute -right-1 -top-2 rounded-full bg-accent-mint px-2 py-0.5 text-[10px] font-bold text-green-800">
                                        -17%
                                    </span>
                                </button>
                            </div>

                            {/* Pricing Display */}
                            <div className="mb-6 text-center">
                                <div className="text-4xl font-bold text-primary">
                                    {currentPlan.formatted}
                                </div>
                                <p className="text-sm text-foreground/60">
                                    per {billingCycle === "monthly" ? "bulan" : "tahun"}
                                    {billingCycle === "yearly" && (
                                        <span className="ml-2 text-green-600 font-medium">
                                            {pricing.yearly.savings}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Benefits */}
                            <ul className="mb-6 space-y-2">
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3 text-sm">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-mint">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-border" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-surface px-4 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                        Metode Pembayaran
                                    </span>
                                </div>
                            </div>

                            {/* QRIS Section */}
                            <div className="mb-4 rounded-xl border-2 border-border bg-white p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <QrCode className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-sm">Scan QRIS</span>
                                </div>
                                {/* Placeholder for QRIS */}
                                <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                    <div className="text-center text-gray-400">
                                        <QrCode className="h-12 w-12 mx-auto mb-2" />
                                        <p className="text-xs">QRIS Code</p>
                                        <p className="text-[10px]">(Akan ditampilkan di sini)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Transfer Section */}
                            <div className="mb-6 rounded-xl border-2 border-border bg-white p-4 text-slate-900">
                                {/* Menggunakan text-slate-500 (abu-abu statis) agar tetap terbaca di atas bg-white */}
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                    Atau Transfer Manual
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Bank {BANK_ACCOUNT.bank}
                                        </p>
                                        {/* Memaksa warna hitam/gelap statis */}
                                        <p className="font-mono text-lg font-bold text-slate-900">
                                            {BANK_ACCOUNT.number}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            a.n. {BANK_ACCOUNT.name}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyAccount}
                                        // Pastikan tombol juga memiliki warna teks yang kontras
                                        className="shrink-0 border-slate-200 text-slate-900 hover:bg-slate-100"
                                    >
                                        <Copy className="h-4 w-4 mr-1" />
                                        Salin
                                    </Button>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
                                size="lg"
                                onClick={handleWhatsAppConfirm}
                            >
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Konfirmasi via WhatsApp
                            </Button>

                            <p className="mt-3 text-center text-xs text-foreground/40">
                                Kirim bukti transfer ke WhatsApp. Aktivasi 1x24 jam.
                            </p>

                            <button
                                onClick={onClose}
                                className="mt-4 w-full text-center text-sm text-foreground/50 hover:text-foreground"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
