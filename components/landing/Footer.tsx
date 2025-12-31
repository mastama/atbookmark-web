import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t-2 border-border bg-background py-12">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    {/* Logo & Tagline */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="flex items-center justify-center gap-2 md:justify-start">
                            <span className="text-2xl">🔖</span>
                            <span className="font-display text-xl font-bold">atbookmark</span>
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
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                            𝕏
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-foreground/50">
                    © {new Date().getFullYear()} atbookmark by Singgih Pratama. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
