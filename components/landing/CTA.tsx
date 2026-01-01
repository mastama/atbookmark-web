"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export function CTA() {
    return (
        <section className="bg-secondary py-20 px-4 border-y-2 border-border">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-3xl font-bold md:text-5xl mb-6 text-foreground">
                        Ready to clear your mind? 🧠
                    </h2>
                    <p className="text-lg text-foreground/80 mb-10 max-w-l mx-auto">
                        Stop the tab anxiety.
                        <br />
                        Turn scattered links into a calm and searchable knowledge library you can trust.
                    </p>

                    <Button
                        size="lg"
                        className="bg-foreground text-surface hover:bg-foreground/90 text-lg px-10"
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Install Chrome Extension
                    </Button>

                    <p className="mt-6 text-sm text-foreground/60">
                        Free forever for up to 500 bookmarks. No credit card required.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
