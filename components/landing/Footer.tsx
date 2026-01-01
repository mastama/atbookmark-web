import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t-2 border-border bg-background py-12">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    {/* Logo & Tagline */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="flex items-center justify-center gap-2 md:justify-start">
                            <span className="text-2xl">🔖</span>
                            <span className="font-display text-xl font-bold">atBookmark</span>
                        </Link>
                        <p className="mt-2 text-sm text-foreground/60">
                            Part of the Annotasi ecosystem.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
                        <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                    </nav>

                    {/* Social */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://instagram.com/s_mastama"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-foreground/60 hover:text-primary transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>

                        <a
                            href="https://linkedin.com/in/singgih-pratama"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-foreground/60 hover:text-primary transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-foreground/50">
                    © {new Date().getFullYear()} atBookmark by Singgih Pratama. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
