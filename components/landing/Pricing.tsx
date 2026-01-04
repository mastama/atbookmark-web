"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, ChevronDown, Code, Server, Sparkles } from "lucide-react";
import { ProModal } from "@/components/modals/ProModal";

const supportReasons = [
    {
        icon: Server,
        title: "Server Costs",
        description: "Hosting and infrastructure",
    },
    {
        icon: Code,
        title: "Development",
        description: "New features & improvements",
    },
    {
        icon: Sparkles,
        title: "Maintenance",
        description: "Bug fixes & updates",
    },
];

const faqs = [
    {
        question: "Is atBookmark really free?",
        answer: "Yes! All features are completely free with no hidden costs or premium tiers. Every tool is available to everyone.",
    },
    {
        question: "Why ask for support then?",
        answer: "This project is independently developed and maintained. Your support helps cover server costs and allows me to keep improving atBookmark.",
    },
    {
        question: "How will my support be used?",
        answer: "100% goes directly to development costs: server hosting, domain fees, and my coffee supply to keep coding late nights! ☕",
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
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

    const handleGetStarted = () => {
        if (isLoggedIn) {
            router.push("/dashboard");
        } else {
            router.push("/register");
        }
    };

    return (
        <>
            <section id="pricing" className="bg-background py-20 px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-accent-mint/20 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                            <Heart className="h-4 w-4" />
                            Support the Developer
                        </div>
                        <h2 className="font-display text-3xl font-bold md:text-4xl mb-6">
                            Help Keep atBookmark{" "}
                            <span className="text-primary">Free Forever</span>
                        </h2>
                    </motion.div>

                    {/* Main Appeal Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <Card className="p-8 md:p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-2 border-green-200 dark:border-green-800">
                            <div className="max-w-2xl mx-auto text-center">
                                <div className="text-4xl mb-4">☕</div>

                                <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
                                    <strong>atBookmark is completely free to use</strong> — no premium tiers,
                                    no locked features. Every tool you see is available to everyone, forever.
                                </p>

                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    This project is independently developed and maintained by a solo developer.
                                    Your support helps cover server costs, ongoing development, and future improvements.
                                </p>

                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    If atBookmark has been useful to you, consider buying me a coffee!
                                    Even small contributions make a big difference and keep this project alive.
                                </p>

                                <Button
                                    size="lg"
                                    onClick={() => setIsSupportModalOpen(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-brutal-sm"
                                >
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Support with a Coffee ☕
                                </Button>

                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    All support is entirely voluntary
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* What Your Support Covers */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h3 className="font-display text-xl font-bold text-center mb-8">
                            What Your Support Covers
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            {supportReasons.map((reason, i) => {
                                const Icon = reason.icon;
                                return (
                                    <motion.div key={i} variants={itemVariants}>
                                        <Card className="p-6 text-center bg-background border-2 border-border h-full">
                                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent-mint/20 mb-4">
                                                <Icon className="h-6 w-6 text-green-600" />
                                            </div>
                                            <h4 className="font-bold mb-1">{reason.title}</h4>
                                            <p className="text-sm text-foreground/60">{reason.description}</p>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Free to Use Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <Card className="p-8 bg-background border-2 border-border text-center">
                            <h3 className="font-display text-2xl font-bold mb-2">
                                🎉 100% Free to Use
                            </h3>
                            <p className="text-foreground/70 mb-6 max-w-lg mx-auto">
                                Not ready to support? No problem! atBookmark is free forever.
                                Just using the app and spreading the word helps too!
                            </p>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleGetStarted}
                                className="border-2 border-border font-semibold"
                            >
                                {isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
                            </Button>
                        </Card>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16 text-sm text-foreground/70"
                    >
                        <div className="flex items-center gap-2">
                            <span>🔒</span>
                            <span>Secure Payment (QRIS / Transfer)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🇮🇩</span>
                            <span>Made with ❤️ in Indonesia</span>
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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

            {/* Support Modal */}
            <ProModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
        </>
    );
}
