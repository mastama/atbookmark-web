"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Sparkles, Shield, Flame } from "lucide-react";
import { ProModal } from "@/components/modals/ProModal";

const freePlanFeatures = [
    "Save up to 100 Bookmarks",
    "5 Custom Folders & Tags",
    "Sync Mobile & Desktop",
];

const proPlanFeatures = [
    "Everything in Free, plus:",
    "Unlimited Storage & Folders",
    "AI Auto-Tagging & Summaries",
    "Nested Folders",
    "Custom Colors",
    "Dark Mode",
];

const faqs = [
    {
        question: "Why should I upgrade to Pro?",
        answer: "The Free plan is great for starting, but Pro gives you unlimited space and AI superpowers to actually remember what you read.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept QRIS (GoPay, OVO, Dana) and Bank Transfer (BCA, Mandiri).",
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes! There are no contracts. You can cancel directly from your dashboard.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-2 border-border rounded-xl overflow-hidden bg-background">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
            >
                <span className="font-semibold text-foreground">{question}</span>
                <ChevronDown
                    className={`h-5 w-5 text-foreground/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-4 text-foreground/70">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface PricingProps {
    isLoggedIn?: boolean;
}

export function Pricing({ isLoggedIn = false }: PricingProps) {
    const router = useRouter();
    const [isAnnual, setIsAnnual] = useState(false);
    const [isProModalOpen, setIsProModalOpen] = useState(false);

    const monthlyPrice = "Rp 29rb";
    const annualPrice = "Rp 290rb";

    const handleFreeClick = () => {
        if (isLoggedIn) {
            router.push("/dashboard");
        } else {
            router.push("/register");
        }
    };

    const handleUpgradeClick = () => {
        if (isLoggedIn) {
            setIsProModalOpen(true);
        } else {
            router.push("/register?plan=pro");
        }
    };

    return (
        <>
            <section id="pricing" className="bg-background py-20 px-4">
                <div className="mx-auto max-w-5xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
                            Choose Your{" "}
                            <span className="text-primary">Perfect Plan</span>
                        </h2>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Start free, upgrade anytime. A small investment for maximum productivity.
                        </p>
                    </motion.div>

                    {/* Toggle Switch */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center gap-3 mb-12"
                    >
                        <div className="inline-flex items-center gap-3 p-1.5 bg-muted rounded-full border-2 border-border">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${!isAnnual
                                    ? "bg-foreground text-background shadow-brutal-sm"
                                    : "text-foreground/70 hover:text-foreground"
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${isAnnual
                                    ? "bg-foreground text-background shadow-brutal-sm"
                                    : "text-foreground/70 hover:text-foreground"
                                    }`}
                            >
                                Yearly
                            </button>
                        </div>
                        <AnimatePresence>
                            {isAnnual && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                    className="inline-flex items-center gap-1.5 bg-accent-mint px-3 py-1 rounded-full border-2 border-border text-sm font-bold"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Save 2 months (17% off)
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Pricing Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-6 md:gap-8 md:grid-cols-2 items-start"
                    >
                        {/* Free Plan Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full p-6 md:p-8 bg-background border-2 border-border">
                                <div className="mb-6">
                                    <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-bold mb-3">
                                        Starter
                                    </span>
                                    <h3 className="font-display text-2xl font-bold mb-1">
                                        Starter
                                    </h3>
                                    <p className="text-foreground/70 text-sm">
                                        Enough to organize your browser chaos.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-display text-4xl font-bold">
                                            Rp 0
                                        </span>
                                        <span className="text-foreground/70">/ forever</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-2 border-border bg-background hover:bg-muted mb-8 font-semibold"
                                    onClick={handleFreeClick}
                                >
                                    Start for Free
                                </Button>

                                <ul className="space-y-3">
                                    {freePlanFeatures.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 h-5 w-5 rounded-full bg-accent-mint border-2 border-border flex items-center justify-center flex-shrink-0">
                                                <Check className="h-3 w-3 text-foreground" strokeWidth={3} />
                                            </div>
                                            <span className="text-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>

                        {/* Pro Plan Card */}
                        <motion.div variants={itemVariants} className="relative">
                            {/* Popular Badge */}
                            <div className="absolute -top-3 -right-2 md:-top-4 md:-right-3 z-10">
                                <div className="inline-flex items-center gap-1.5 bg-accent-peach px-3 py-1.5 rounded-full border-2 border-border shadow-brutal-sm font-bold text-sm">
                                    <Flame className="h-4 w-4" />
                                    Most Popular
                                </div>
                            </div>

                            <Card className="h-full p-6 md:p-8 bg-[#FACC15] border-2 border-border shadow-[8px_8px_0px_#000] md:scale-[1.02]">
                                <div className="mb-6">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1 text-xs font-bold mb-3">
                                        <Sparkles className="h-3 w-3" />
                                        Pro
                                    </span>
                                    <h3 className="font-display text-2xl font-bold mb-1">
                                        Second Brain
                                    </h3>
                                    <p className="text-foreground/80 text-sm">
                                        Unlock your full potential with AI.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isAnnual ? "annual" : "monthly"}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-baseline gap-1"
                                        >
                                            <span className="font-display text-4xl font-bold">
                                                {isAnnual ? annualPrice : monthlyPrice}
                                            </span>
                                            <span className="text-foreground/70">
                                                / {isAnnual ? "year" : "month"}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full border-2 border-border bg-foreground text-background hover:bg-neutral-800 mb-8 font-semibold shadow-brutal-sm"
                                    onClick={handleUpgradeClick}
                                >
                                    Upgrade Now 🚀
                                </Button>

                                <ul className="space-y-3">
                                    {proPlanFeatures.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 h-5 w-5 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center flex-shrink-0">
                                                <Check className="h-3 w-3 text-foreground" strokeWidth={3} />
                                            </div>
                                            <span className={`text-foreground/90 ${i === 0 ? "font-semibold" : ""}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12 text-sm text-foreground/70"
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Secure Payment (Midtrans)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🇮🇩</span>
                            <span>Made in Indonesia</span>
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <h3 className="font-display text-2xl font-bold text-center mb-8">
                            Frequently Asked Questions
                        </h3>
                        <div className="max-w-2xl mx-auto space-y-3">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pro Modal */}
            <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
        </>
    );
}
