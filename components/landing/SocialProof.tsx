"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Alex K.",
        handle: "@alex_dev",
        text: "I finally closed my 400 tabs. My laptop fan stopped spinning. Thank you atbookmark. 🙏",
        avatar: "bg-accent-lavender",
    },
    {
        name: "Sarah C.",
        handle: "@designer_sarah",
        text: "The AI summary feature saves me hours of reading. Game changer for research! ✨",
        avatar: "bg-accent-mint",
    },
    {
        name: "Mike T.",
        handle: "@dev_mike",
        text: "Finally a bookmark tool that's actually fun to use. The UI is *chef's kiss*. 🎨",
        avatar: "bg-accent-sky",
    },
    {
        name: "Jen L.",
        handle: "@jen_learns",
        text: "As a student, this is a lifesaver. All my research organized automatically. 📚",
        avatar: "bg-accent-coral",
    },
    {
        name: "David P.",
        handle: "@david_pm",
        text: "Our whole team uses this now. The shared collections feature is incredible. 🚀",
        avatar: "bg-accent-peach",
    },
];

// Duplicate for infinite scroll
const allTestimonials = [...testimonials, ...testimonials];

export function SocialProof() {
    return (
        <section className="bg-background py-20 overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-3xl font-bold md:text-4xl mb-4">
                        People are clearing their tabs 🧹
                    </h2>
                    <p className="text-lg text-foreground/70">
                        Join thousands who've reclaimed their browser.
                    </p>
                </motion.div>
            </div>

            {/* Marquee */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    animate={{ x: [0, -50 * testimonials.length] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-6"
                >
                    {allTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-80 rounded-2xl border-2 border-border bg-surface p-5 shadow-brutal-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`h-10 w-10 rounded-full border-2 border-border ${t.avatar}`} />
                                <div>
                                    <div className="font-display font-bold text-sm">{t.name}</div>
                                    <div className="text-xs text-foreground/50">{t.handle}</div>
                                </div>
                            </div>
                            <p className="text-foreground/80 text-sm">&ldquo;{t.text}&rdquo;</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
