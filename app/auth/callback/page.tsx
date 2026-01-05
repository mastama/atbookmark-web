"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (token) {
            localStorage.setItem("atbookmark_token", token);
            toast.success("Successfully logged in with Google! 🚀");
            setTimeout(() => {
                router.push("/dashboard");
            }, 500);
        } else if (error) {
            toast.error("Google Login failed. Please try again.");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } else {
            // No token, maybe direct access?
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <div className="animate-spin text-primary text-4xl">⏳</div>
                <h2 className="text-xl font-semibold">Completing your login...</h2>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
