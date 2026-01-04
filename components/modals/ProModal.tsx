"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Copy, MessageCircle, QrCode, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Quick select amounts
const quickAmounts = [
    { value: 15000, label: "Coffee", emoji: "☕" },
    { value: 50000, label: "Lunch", emoji: "🍜" },
    { value: 100000, label: "Big Help", emoji: "🚀" },
];

const BANK_ACCOUNT = {
    bank: "BCA",
    number: "1234567890",
    name: "SINGGIH PRATAMA",
};

const WHATSAPP_NUMBER = "62811194596";

// Format number as Rupiah
const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export function ProModal({ isOpen, onClose }: ProModalProps) {
    const [customAmount, setCustomAmount] = useState<number>(15000);
    const [inputValue, setInputValue] = useState<string>("15000");

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const value = e.target.value.replace(/[^0-9]/g, "");
        setInputValue(value);

        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setCustomAmount(numValue);
        }
    };

    const handleQuickSelect = (amount: number) => {
        setCustomAmount(amount);
        setInputValue(amount.toString());
    };

    const handleCopyAccount = async () => {
        try {
            await navigator.clipboard.writeText(BANK_ACCOUNT.number);
            toast.success("Account number copied! 📋");
        } catch {
            toast.error("Failed to copy account number");
        }
    };

    const handleWhatsAppConfirm = () => {
        const formattedAmount = formatRupiah(customAmount);
        const message = encodeURIComponent(
            `Hi! 👋\n\n` +
            `I'd like to support atBookmark with ${formattedAmount}.\n\n` +
            `Here's my transfer proof:`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    const isValidAmount = customAmount >= 5000;

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
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-gradient-to-br from-green-100 to-emerald-200 shadow-brutal-sm">
                                    <Coffee className="h-7 w-7 text-green-600" />
                                </div>
                                <h2 className="font-display text-2xl font-bold">
                                    Support the Developer ☕
                                </h2>
                                <p className="mt-2 text-sm text-foreground/60">
                                    Help keep atBookmark free and growing
                                </p>
                            </div>

                            {/* Message */}
                            <div className="mb-6 rounded-xl bg-accent-mint/10 p-4 text-sm text-foreground/80">
                                <p className="mb-2">
                                    <strong>atBookmark is completely free</strong> — no premium tiers, no locked features.
                                    This project is independently developed and maintained.
                                </p>
                                <p>
                                    Your support helps cover server costs and future development.
                                    Every contribution, big or small, makes a difference! 🙏
                                </p>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="mb-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                    Enter your amount
                                </p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-500 dark:text-gray-400">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={inputValue}
                                        onChange={handleAmountChange}
                                        className="w-full rounded-xl border-2 border-border bg-white dark:bg-gray-800 py-4 pl-12 pr-4 text-2xl font-bold text-center text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary focus:outline-none transition-colors"
                                        placeholder="15000"
                                    />
                                </div>
                                {customAmount > 0 && (
                                    <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {formatRupiah(customAmount)}
                                    </p>
                                )}
                                {!isValidAmount && inputValue.length > 0 && (
                                    <p className="text-center mt-2 text-xs text-red-500">
                                        Minimum amount is Rp 5.000
                                    </p>
                                )}
                            </div>

                            {/* Quick Select Buttons */}
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                    Or quick select
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.map((item) => {
                                        const isActive = customAmount === item.value;
                                        return (
                                            <button
                                                key={item.value}
                                                onClick={() => handleQuickSelect(item.value)}
                                                className={`rounded-xl border-2 p-3 text-center transition-all ${isActive
                                                    ? "border-primary bg-primary/10 shadow-brutal-sm"
                                                    : "border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    }`}
                                            >
                                                <div className="text-xl mb-1">{item.emoji}</div>
                                                <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{formatRupiah(item.value)}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-border" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-surface px-4 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                        Payment Method
                                    </span>
                                </div>
                            </div>

                            {/* QRIS Section */}
                            <div className="mb-4 rounded-xl border-2 border-border bg-white p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <QrCode className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-sm">Scan QRIS</span>
                                </div>
                                <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                    <div className="text-center text-gray-400">
                                        <QrCode className="h-12 w-12 mx-auto mb-2" />
                                        <p className="text-xs">QRIS Code</p>
                                        <p className="text-[10px]">(Coming soon)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Transfer Section */}
                            <div className="mb-6 rounded-xl border-2 border-border bg-white p-4 text-slate-900">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                    Or Bank Transfer
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-600">
                                            Bank {BANK_ACCOUNT.bank}
                                        </p>
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
                                        className="shrink-0 border-slate-200 text-slate-900 hover:bg-slate-100"
                                    >
                                        <Copy className="h-4 w-4 mr-1" />
                                        Copy
                                    </Button>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white disabled:opacity-50"
                                size="lg"
                                onClick={handleWhatsAppConfirm}
                                disabled={!isValidAmount}
                            >
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Send Confirmation via WhatsApp
                            </Button>

                            <p className="mt-3 text-center text-xs text-foreground/40">
                                Send your transfer proof ({formatRupiah(customAmount)}) via WhatsApp. Thank you! 💚
                            </p>

                            {/* Voluntary notice */}
                            <div className="mt-4 text-center">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    <Heart className="h-3 w-3" />
                                    All support is entirely voluntary
                                </span>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-4 w-full text-center text-sm text-foreground/50 hover:text-foreground"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
