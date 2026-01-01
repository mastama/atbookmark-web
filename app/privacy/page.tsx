import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | atBookmark",
    description: "Privacy Policy for atBookmark - Your AI-powered bookmark manager",
};

export default function PrivacyPage() {
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
                <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-foreground/60 mb-12">Last updated: January 1, 2026</p>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">1. Introduction</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Welcome to atBookmark (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our bookmark management service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">2. Information We Collect</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">We collect information that you provide directly to us:</p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Account Information:</strong> Email address, name, and password when you register.</li>
                            <li><strong>Bookmark Data:</strong> URLs, titles, descriptions, tags, and metadata of bookmarks you save.</li>
                            <li><strong>Usage Data:</strong> How you interact with our service, including features used and preferences.</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers for service optimization.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Provide, maintain, and improve our bookmark management service</li>
                            <li>Process your bookmarks and generate AI-powered summaries and recommendations</li>
                            <li>Send you service updates, security alerts, and support messages</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Protect against fraudulent or unauthorized activity</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS/TLS) and at rest. However, no method of transmission over the Internet is 100% secure. We strive to protect your personal information but cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">5. Data Sharing</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">
                            <strong>We do not sell your personal data to third parties.</strong> We may share information only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>With service providers who assist in operating our platform (hosting, analytics)</li>
                            <li>To comply with legal obligations or respond to lawful requests</li>
                            <li>To protect the rights, property, or safety of atBookmark, our users, or the public</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">6. Your Rights</h2>
                        <p className="text-foreground/80 leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Export:</strong> Download all your bookmarks and data at any time</li>
                            <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                            <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            To exercise these rights, visit your Account Settings or contact us at privacy@atbookmark.app.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">7. Cookies</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We use essential cookies to maintain your session and remember your preferences. We do not use tracking cookies for advertising purposes. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">8. Changes to This Policy</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after changes constitutes acceptance.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-2xl font-bold mb-4">9. Contact Us</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-foreground/80 mt-2">
                            <strong>Email:</strong> privacy@atbookmark.app<br />
                            <strong>Website:</strong> https://atbookmark.app
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
