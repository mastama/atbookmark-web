"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTA() {
    const router = useRouter();

    const handleInstallClick = () => {
        // cek login (sesuaikan key token dengan auth kamu)
        const token = localStorage.getItem("access_token");

        if (!token) {
            // belum login → arahkan ke login
            router.push("/login");
            return;
        }

        // sudah login → ke dashboard extension
        router.push("/dashboard/extension");
    };

    return (
        <section className="bg-gradient-to-br from-primary/10 via-accent-lavender/10 to-accent-mint/10 dark:from-primary/20 dark:via-accent-lavender/20 dark:to-accent-mint/20 py-20 px-4 border-y-2 border-border">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-3xl font-bold md:text-5xl mb-6 text-foreground">
                        Ready to clear your mind? 🧠
                    </h2>

                    <p className="text-lg text-foreground/70 mb-10 max-w-l mx-auto">
                        Stop the tab anxiety.
                        <br />
                        Turn scattered links into a calm and searchable knowledge library you can trust.
                    </p>

                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10"
                        onClick={handleInstallClick}
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Install Chrome Extension
                    </Button>

                    <p className="mt-6 text-sm text-foreground/60">
                        Free forever for up to unlimited bookmarks. No credit card required.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
