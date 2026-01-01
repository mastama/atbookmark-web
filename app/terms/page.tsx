import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Terms of Service | atBookmark",
    description: "Terms of Service for atBookmark - Your AI-powered bookmark manager",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background py-16 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <h1 className="font-display text-4xl font-bold mb-2">Terms of Service</h1>
                <p className="text-foreground/60 mb-12">Last updated: January 1, 2026</p>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            By accessing or using atBookmark (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            atBookmark is an AI-powered bookmark management platform that helps users save, organize, summarize, and rediscover web content. The Service includes features such as bookmark storage, AI-generated summaries, folder organization, tagging, and browser extensions.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">3. Account Registration</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">To use certain features, you must create an account. You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Be responsible for all activities under your account</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">4. User Responsibilities</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">You agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Use the Service for any illegal purpose or to save illegal content</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to the Service or its systems</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use automated means to access the Service without permission</li>
                            <li>Share your account credentials with others</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">5. Free and Pro Plans</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">
                            atBookmark offers both free and paid subscription plans:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Free Plan:</strong> Limited features with bookmark storage caps</li>
                            <li><strong>Pro Plan:</strong> Full access to all features including AI summaries, unlimited bookmarks, and priority support</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            Pro subscriptions are billed monthly or annually. We reserve the right to modify pricing with 30 days&apos; notice. Refunds are handled on a case-by-case basis within 14 days of purchase.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">6. Intellectual Property</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            The Service and its original content, features, and functionality are owned by atBookmark and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of your bookmark data and content you save.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">7. Termination</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">
                            We may terminate or suspend your account immediately, without prior notice, for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Violation of these Terms</li>
                            <li>Fraudulent or illegal activity</li>
                            <li>Non-payment for Pro subscriptions</li>
                            <li>Any conduct we deem harmful to the Service or other users</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            You may delete your account at any time through Account Settings. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not guarantee that the Service will be uninterrupted, secure, or error-free. AI-generated summaries are provided for convenience and may not be fully accurate.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, atBookmark shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, profits, or goodwill, arising from your use of the Service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">10. Governing Law</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Indonesia.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">11. Contact Us</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            If you have questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="text-foreground/80 mt-2">
                            <strong>Email:</strong> legal@atbookmark.app<br />
                            <strong>Website:</strong> https://atbookmark.app
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
